describe("Admin Categories E2E", () => {
  // Before running this test, ensure the E2E database is set up by running the setup script manually or as a pre-test step.

  const CATEGORY_NAME = "Test Electronics";

  beforeEach(() => {
    cy.resetApp();

    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();

    cy.containsCI("Hello, Admin", { timeout: 10000 }).should("be.visible");
    cy.containsCI("Categories").click();
    cy.urlShouldIncludeCI("/categories");
  });

  it("adds, updates, and removes a category", () => {
    const UPDATED_NAME = "Test Electronics Updated";

    // Add
    cy.containsCI("No categories").should("be.visible");
    cy.get("input#newCategory").type(CATEGORY_NAME);
    cy.containsCI("Add").click();
    cy.containsCI("No categories").should("not.exist");
    cy.get(".card-category").containsCI(CATEGORY_NAME).should("be.visible");

    // Update
    cy.get(".card-category")
      .containsCI(CATEGORY_NAME)
      .closest(".card-category")
      .containsCI("Edit")
      .click();
    cy.get(".card-category")
      .find("input[type=text]")
      .type("{selectall}{backspace}")
      .type(UPDATED_NAME);
    cy.get(".card-category").containsCI("Save").click();
    cy.get(".card-category").containsCI(UPDATED_NAME).should("be.visible");
    cy.get(".card-category").should("have.length", 1);

    // Remove
    cy.get(".card-category")
      .containsCI(UPDATED_NAME)
      .closest(".card-category")
      .containsCI("Remove")
      .click();
    cy.containsCI(UPDATED_NAME).should("not.exist");
    cy.containsCI("No categories").should("be.visible");
  });
});
