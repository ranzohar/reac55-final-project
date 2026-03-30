import { clearFirebaseCollections } from "./cypress/support/clearFirebaseCollections.js";

export default {
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      on("task", { clearFirebaseCollections });
    },
  },
};
