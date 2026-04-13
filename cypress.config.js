import {
  clearFirebaseCollections,
  deleteNonAdminFirebaseAuthUsers,
  waitForFirebaseDoc,
} from "./cypress/support/clearFirebaseCollections.js";

export default {
  allowCypressEnv: false,

  e2e: {
    env: {
      // Read from the shell environment only — never from .env.development,
      // which is a Vite file and may contain VITE_BACKEND=rest even when
      // running Cypress against the Firebase backend.
      BACKEND: process.env.VITE_BACKEND ?? "firebase",
    },
    setupNodeEvents(on, config) {
      // Expose BACKEND as a config property so browser-side test code can read
      // it via Cypress.config("backendType") without requiring allowCypressEnv.
      console.log(`[DEBUG] Setting backendType to: ${config.env.BACKEND}`);
      config.backendType = config.env.BACKEND;

      on("task", {
        clearFirebaseCollections,
        deleteNonAdminFirebaseAuthUsers,
        waitForFirebaseDoc,
      });

      return config;
    },
  },
};
