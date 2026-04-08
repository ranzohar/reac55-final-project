describe("Admin Categories & Products E2E", () => {
  // Before running this test, ensure the E2E database is set up by running the setup script manually or as a pre-test step.

  const CATEGORY_NAME = "Test Electronics";
  const UPDATED_CATEGORY_NAME = "Test Electronics Updated";
  const PRODUCT_TITLE = "Test Product";
  const PRODUCT_PRICE = "99";
  const PRODUCT_DESCRIPTION = "Test product description";

  beforeEach(() => {
    cy.resetApp();

    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();

    cy.containsCI("Hello, Admin", { timeout: 10000 }).should("be.visible");
    cy.containsCI("Categories").click();
    cy.urlShouldIncludeCI("/categories");
  });

  it("adds a category, adds a product to it, updates the category name, then removes the category", () => {
    // 1. Add category
    cy.containsCI("No categories").should("be.visible");
    cy.get("input#newCategory").type(CATEGORY_NAME);
    cy.containsCI("Add").click();
    cy.containsCI("No categories").should("not.exist");
    cy.get(".card-category").containsCI(CATEGORY_NAME).should("be.visible");

    // 2. Navigate to Products and add a product with the new category
    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");
    cy.containsCI("No products").should("be.visible");
    cy.containsCI("Add New").click();
    cy.get(".card-product [name='title']")
      .type("{selectall}{backspace}")
      .type(PRODUCT_TITLE);
    cy.get(".card-product [name='price']").type(PRODUCT_PRICE);
    cy.get(".card-product [name='description']").type(PRODUCT_DESCRIPTION);
    cy.get(".card-product select[name='categoryId']").select(CATEGORY_NAME);
    cy.get(".card-product button[type='submit']").click();
    cy.containsCI(PRODUCT_TITLE).should("be.visible");
    cy.get(".card-product").should("have.length", 1);

    // 3. Navigate back to Categories and update the category name
    cy.containsCI("Categories").click();
    cy.urlShouldIncludeCI("/categories");
    cy.get(".card-category")
      .containsCI(CATEGORY_NAME)
      .closest(".card-category")
      .containsCI("Edit")
      .click();
    cy.get(".card-category")
      .find("input[type=text]")
      .type("{selectall}{backspace}")
      .type(UPDATED_CATEGORY_NAME);
    cy.get(".card-category").containsCI("Save").click();
    cy.get(".card-category")
      .containsCI(UPDATED_CATEGORY_NAME)
      .should("be.visible");
    cy.get(".card-category").should("have.length", 1);

    // 3b. Verify the product reflects the updated category name after navigating and refreshing
    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");
    cy.reload();
    cy.get(".card-product select[name='categoryId'] option:selected").should(
      "have.text",
      UPDATED_CATEGORY_NAME,
    );

    // 4. Remove the category
    cy.containsCI("Categories").click();
    cy.urlShouldIncludeCI("/categories");
    cy.get(".card-category")
      .containsCI(UPDATED_CATEGORY_NAME)
      .closest(".card-category")
      .containsCI("Remove")
      .click();
    cy.containsCI(UPDATED_CATEGORY_NAME).should("not.exist");
    cy.containsCI("No categories").should("be.visible");

    // 4b. Verify the product no longer has a category
    // Navigate via SPA (keeps Firebase connection alive so the write completes)
    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");
    cy.get(".card-product select[name='categoryId'] option:selected").should(
      "have.text",
      "No category",
    );
  });
});
