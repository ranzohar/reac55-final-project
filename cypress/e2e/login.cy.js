describe("Admin Login E2E", () => {
  it("logs in and routes to admin main page", () => {
    cy.clearCookies();
    cy.visit("http://localhost:5173/login"); // Change port if needed

    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();

    // Wait for navigation and check for greeting
    cy.contains("Hello,", { timeout: 10000 }).should("be.visible");
    // Optionally, check URL
    cy.url().should("include", "/admin");
  });
});
