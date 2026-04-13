import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let db = null;

function getDb() {
  if (!db) {
    if (!getApps().length) {
      const serviceAccount = JSON.parse(
        readFileSync(
          resolve(__dirname, "../../firebase/test-serviceAccountKey.json"),
          "utf-8",
        ),
      );
      initializeApp({ credential: cert(serviceAccount) });
    }
    db = getFirestore();
  }
  return db;
}

async function clearCollection(collectionName) {
  const firestore = getDb();
  const snapshot = await firestore.collection(collectionName).get();
  if (snapshot.empty) return;
  const batch = firestore.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

export async function clearFirebaseCollections() {
  console.log("[DEBUG] Clearing Firebase collections...");
  const collections = ["categories", "products", "users", "public-orders"];
  await Promise.all(collections.map(clearCollection));
  return null;
}

export async function waitForFirebaseDoc({ collection, id, timeoutMs = 5000 }) {
  const firestore = getDb();
  const ref = firestore.collection(collection).doc(id);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const snap = await ref.get();
    if (snap.exists) return snap.data();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

export async function deleteNonAdminFirebaseAuthUsers() {
  getDb(); // ensure app is initialized
  const auth = getAuth();
  const uidsToDelete = [];
  let nextPageToken;

  do {
    const result = await auth.listUsers(1000, nextPageToken);
    for (const user of result.users) {
      if (!user.customClaims?.admin) {
        uidsToDelete.push(user.uid);
      }
    }
    nextPageToken = result.pageToken;
  } while (nextPageToken);

  if (uidsToDelete.length > 0) {
    await auth.deleteUsers(uidsToDelete);
  }

  return null;
}
