describe("Admin Add Multiple Products E2E", () => {
  const PRICE = "10";

  beforeEach(() => {
    cy.resetApp();

    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();

    cy.containsCI("Hello, Admin", { timeout: 10000 }).should("be.visible");
    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");
  });

  it("adds 3 products and verifies order is preserved after each save", () => {
    cy.containsCI("No products").should("be.visible");

    // Add 3 products
    cy.containsCI("Add New").click();
    cy.containsCI("Add New").click();
    cy.containsCI("Add New").click();
    cy.get(".card-product").should("have.length", 3);

    // Capture the default titles in their initial order
    const titles = [];
    cy.get(".card-product [name='title']").each(($input) => {
      titles.push($input.val());
    });

    // Save the first product and verify order is unchanged
    cy.get(".card-product").eq(0).find("[name='price']").type(PRICE);
    cy.get(".card-product").eq(0).find("button[type='submit']").click();
    cy.get(".card-product [name='title']").then(($inputs) => {
      titles.forEach((title, i) => {
        expect($inputs.eq(i).val()).to.equal(title);
      });
    });

    // Save the second product and verify order is unchanged
    cy.get(".card-product").eq(1).find("[name='price']").type(PRICE);
    cy.get(".card-product").eq(1).find("button[type='submit']").click();
    cy.get(".card-product [name='title']").then(($inputs) => {
      titles.forEach((title, i) => {
        expect($inputs.eq(i).val()).to.equal(title);
      });
    });

    // Save the third product and verify order is unchanged
    cy.get(".card-product").eq(2).find("[name='price']").type(PRICE);
    cy.get(".card-product").eq(2).find("button[type='submit']").click();
    cy.get(".card-product [name='title']").then(($inputs) => {
      titles.forEach((title, i) => {
        expect($inputs.eq(i).val()).to.equal(title);
      });
    });

    cy.get(".card-product").should("have.length", 3);
  });
});
