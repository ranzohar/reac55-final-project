import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

const uid = process.argv[2];
const env = process.argv[3] || "prod";

if (!uid) {
  console.error("Please provide a UID as argument");
  console.error("Usage: node set_admin.js <UID> [test|prod]");
  process.exit(1);
}

const keyFile = env === "test" ? "./test-serviceAccountKey.json" : "./serviceAccountKey.json";

const serviceAccount = JSON.parse(
  readFileSync(keyFile, "utf-8"),
);

initializeApp({ credential: cert(serviceAccount) });

async function setAdmin(uid) {
  await getAuth().setCustomUserClaims(uid, { admin: true });
  console.log("Set claim done");
}

async function checkClaim(uid) {
  const userRecord = await getAuth().getUser(uid);
  console.log("Admin claim on server:", userRecord.customClaims);
}

(async () => {
  await setAdmin(uid);
  await checkClaim(uid);
})();
