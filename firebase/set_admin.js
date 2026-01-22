import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("./firebase/serviceAccountKey.json", "utf-8"),
);

initializeApp({ credential: cert(serviceAccount) });

const ADMIN_UID = "F8oNN0W6Cofu1d5MfeX4vYbiCuV2";

async function setAdmin(uid) {
  await getAuth().setCustomUserClaims(ADMIN_UID, { admin: true });
  console.log("Set claim done");
}

async function checkClaim(uid) {
  const userRecord = await getAuth().getUser(uid);
  console.log("Admin claim on server:", userRecord.customClaims);
}

checkClaim(ADMIN_UID);
