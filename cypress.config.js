import { readFileSync } from "fs";
import {
  clearFirebaseCollections,
  deleteNonAdminFirebaseAuthUsers,
  waitForFirebaseDoc,
} from "./cypress/support/clearFirebaseCollections.js";

function readEnvFile(path) {
  try {
    return Object.fromEntries(
      readFileSync(path, "utf-8")
        .split("\n")
        .filter((line) => /^[A-Z_]+=/.test(line.trim()))
        .map((line) => {
          const [key, ...rest] = line.split("=");
          const raw = rest.join("=").trim();
          const value = raw.split(/\s+#/)[0].trim(); // strip inline comments
          return [key.trim(), value];
        }),
    );
  } catch {
    return {};
  }
}

const localEnv = readEnvFile(".env.development");

export default {
  allowCypressEnv: true,

  e2e: {
    env: {
      BACKEND: process.env.VITE_BACKEND ?? localEnv.VITE_BACKEND ?? "firebase",
    },
    setupNodeEvents(on, config) {
      on("task", {
        clearFirebaseCollections,
        deleteNonAdminFirebaseAuthUsers,
        waitForFirebaseDoc,
      });
    },
  },
};
