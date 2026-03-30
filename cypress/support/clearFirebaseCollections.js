import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let db = null;

function getDb() {
  if (!db) {
    if (!getApps().length) {
      const serviceAccount = JSON.parse(
        readFileSync(resolve(__dirname, "../../firebase/test-serviceAccountKey.json"), "utf-8"),
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
  const collections = ["categories", "products", "users", "public-orders"];
  await Promise.all(collections.map(clearCollection));
  return null;
}
