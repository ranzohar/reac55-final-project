
describe("Admin Login E2E", () => {
  // Before running this test, ensure the E2E database is set up by running the setup script manually or as a pre-test step.

  it("logs in and routes to admin main page", () => {
    cy.resetApp();

    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();

    // Wait for navigation and check for greeting
    cy.containsCI("Hello, Admin", { timeout: 10000 }).should("be.visible");
    cy.urlShouldIncludeCI("/admin");

    // Verify the 4 admin pages are accessible via links
    cy.containsCI("Categories").should("be.visible");
    cy.containsCI("Products").should("be.visible");
    cy.containsCI("Customers").should("be.visible");
    cy.containsCI("Statistics").should("be.visible");

    // Navigate to Categories and verify empty
    cy.containsCI("Categories").click();
    cy.urlShouldIncludeCI("/categories");
    cy.containsCI("No categories").should("be.visible");

    // Navigate to Products and verify empty
    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");
    cy.containsCI("no products").should("be.visible");
    cy.containsCI("ProductInfo").should("not.exist");

    // Navigate to Customers and verify empty
    cy.containsCI("Customers").click();
    cy.urlShouldIncludeCI("/customers");
    cy.contains(/no (customers|users)/i).should("be.visible");

    // Navigate to Statistics and verify empty
    cy.containsCI("Statistics").click();
    cy.urlShouldIncludeCI("/statistics");
    cy.get(".card-statistics").should("be.visible");
    cy.containsCI("no sales").should("be.visible");
    cy.containsCI("no data").should("be.visible");
    // Verify the scroll down selector has exactly 1 option including "no users" (case-insensitive)
    cy.get("select.user-select option").each(($option) =>
      cy.log("Option: " + $option.text()),
    );
    cy.get("select.user-select option").then(($options) => {
      expect($options.length).to.equal(1);
      const text = $options.text().toLowerCase();
      expect(text).to.include("no users");
    });

    // Logout test
    cy.get(".sign-out").should("be.visible").click();
    // Should redirect to login or home page after logout
    cy.url().should("match", /\/login$|\/$/);
    // Optionally, check that the login form is visible again
    cy.get("input#username").should("be.visible");
  });
});
