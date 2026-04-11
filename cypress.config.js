import { readFileSync } from "fs";
import {
  clearFirebaseCollections,
  deleteNonAdminFirebaseAuthUsers,
} from "./cypress/support/clearFirebaseCollections.js";

function readEnvFile(path) {
  try {
    return Object.fromEntries(
      readFileSync(path, "utf-8")
        .split("\n")
        .filter((line) => /^[A-Z_]+=/.test(line.trim()))
        .map((line) => {
          const [key, ...rest] = line.split("=");
          return [key.trim(), rest.join("=").trim()];
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
      on("task", { clearFirebaseCollections, deleteNonAdminFirebaseAuthUsers });
    },
  },
};
