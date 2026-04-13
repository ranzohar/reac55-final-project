// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Resets app state and navigates to the home page — use in beforeEach
// The app redirects unauthenticated users to /login automatically
Cypress.Commands.add("resetApp", () => {
  console.log(`[DEBUG] Resetting app state...${Cypress.config("backendType")}`);

  if (Cypress.config("backendType") === "rest") {
    cy.request("POST", "http://localhost:3000/api/test/reset");
  } else {
    console.log("[DEBUG] Clearing Firebase collections and auth users...");
    cy.task("clearFirebaseCollections");
    cy.task("deleteNonAdminFirebaseAuthUsers");
    cy.clearFirebaseAuth();
  }
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit("http://localhost:5173/");
});

// Clears Firebase auth session stored in IndexedDB (not affected by clearCookies/clearLocalStorage)
Cypress.Commands.add("clearFirebaseAuth", () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      const req = win.indexedDB.deleteDatabase("firebaseLocalStorageDb");
      req.onsuccess = resolve;
      req.onerror = resolve;
      req.onblocked = resolve;
    });
  });
});

// Custom command for case-insensitive contains
Cypress.Commands.add("containsCI", (text, options = {}) => {
  return cy.contains(text, { matchCase: false, ...options });
});

// Custom command for case-insensitive URL include
Cypress.Commands.add("urlShouldIncludeCI", (path) => {
  return cy
    .url()
    .then((url) => expect(url.toLowerCase()).to.include(path.toLowerCase()));
}); // test
