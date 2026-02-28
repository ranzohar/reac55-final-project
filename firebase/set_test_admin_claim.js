import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("./firebase/test-serviceAccountKey.json", "utf-8"),
);

initializeApp({ credential: cert(serviceAccount) });

async function setAdminClaim(uid) {
  await getAuth().setCustomUserClaims(uid, { admin: true });
  console.log(`Set admin claim for UID: ${uid}`);
}

async function getUidByEmail(email) {
  const user = await getAuth().getUserByEmail(email);
  return user.uid;
}

async function main() {
  const uid = "TKIf7JIH15REnGfscFRnhGGwBQK2";
  try {
    await setAdminClaim(uid);
  } catch (err) {
    console.error("Error:", err);
  }
}
