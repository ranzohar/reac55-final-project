const PRODUCT_1 = { title: "Widget Alpha", price: 25 };
const PRODUCT_2 = { title: "Widget Beta", price: 40 };
const QTY_1 = 2;
const QTY_2 = 3;
const EXPECTED_TOTAL = `$${(PRODUCT_1.price * QTY_1 + PRODUCT_2.price * QTY_2).toFixed(2)}`;

const CUSTOMER = {
  fname: "OrderTest",
  lname: "User",
  username: `order_test_${Date.now()}`,
  password: "orderpass123",
};

const addToCart = (title, times) => {
  for (let i = 0; i < times; i++) {
    cy.contains(".card-product-info", title)
      .find(".quantity-icon")
      .last()
      .click();
  }
};

describe("Orders E2E", () => {
  it("admin adds products, customer orders them, and both views reflect the order", () => {
    cy.resetApp();

    // === ADMIN: Add 2 products ===
    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();
    cy.containsCI("Hello, Admin", { timeout: 10000 }).should("be.visible");

    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");

    // Add product 1
    cy.containsCI("Add New").click();
    cy.get(".card-product").should("have.length", 1);
    cy.get(".card-product").eq(0).find("[name='title']").clear().type(PRODUCT_1.title);
    cy.get(".card-product").eq(0).find("[name='price']").type(PRODUCT_1.price);
    cy.get(".card-product").eq(0).find("button[type='submit']").click();

    // Add product 2
    cy.containsCI("Add New").click();
    cy.get(".card-product").should("have.length", 2);
    cy.get(".card-product").eq(1).find("[name='title']").clear().type(PRODUCT_2.title);
    cy.get(".card-product").eq(1).find("[name='price']").type(PRODUCT_2.price);
    cy.get(".card-product").eq(1).find("button[type='submit']").click();

    // Verify both products are saved (titles are in input fields, not text nodes)
    cy.get(".card-product").eq(0).find("[name='title']").should("have.value", PRODUCT_1.title);
    cy.get(".card-product").eq(1).find("[name='title']").should("have.value", PRODUCT_2.title);

    // Admin logs out
    cy.get(".sign-out").click();
    cy.url().should("match", /\/login$|\//);
    cy.get("input#username").should("be.visible");

    // === CUSTOMER: Sign up ===
    cy.containsCI("Register").click();
    cy.get("input#fname").type(CUSTOMER.fname);
    cy.get("input#lname").type(CUSTOMER.lname);
    cy.get("input#username").type(CUSTOMER.username);
    cy.get("input#password").type(CUSTOMER.password);
    cy.get('button[type="submit"]').click();

    cy.containsCI(`Hello, ${CUSTOMER.fname}`, { timeout: 10000 }).should("be.visible");
    cy.urlShouldIncludeCI("/customer");

    // Navigate to Products
    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");

    // Wait for products to load then add Product 1 (QTY_1 times)
    cy.contains(".card-product-info", PRODUCT_1.title, { timeout: 10000 });
    addToCart(PRODUCT_1.title, QTY_1);
    cy.contains(".card-product-info", PRODUCT_1.title)
      .find(".quantity-number")
      .should("have.text", String(QTY_1));

    // Open slider and verify Product 1 appears with correct quantity
    cy.get('[aria-label="Open slider"]').click();
    cy.get(".card-sliding").should("not.have.class", "is-closed");
    cy.get(".card-sliding-content").should("contain.text", PRODUCT_1.title);

    // Close slider
    cy.get('[aria-label="Close slider"]').click();
    cy.get(".card-sliding").should("have.class", "is-closed");

    // Add Product 2 (QTY_2 times)
    addToCart(PRODUCT_2.title, QTY_2);
    cy.contains(".card-product-info", PRODUCT_2.title)
      .find(".quantity-number")
      .should("have.text", String(QTY_2));

    // Open slider and verify both products appear with correct total
    cy.get('[aria-label="Open slider"]').click();
    cy.get(".card-sliding").should("not.have.class", "is-closed");
    cy.get(".card-sliding-content").should("contain.text", PRODUCT_1.title);
    cy.get(".card-sliding-content").should("contain.text", PRODUCT_2.title);
    cy.get(".card-sliding-content strong").should("contain.text", EXPECTED_TOTAL);

    // Place the order
    cy.get(".btn-order").click();

    // Cart should now be empty
    cy.get(".card-sliding-content").should("not.contain.text", PRODUCT_1.title);
    cy.get(".card-sliding-content").should("not.contain.text", PRODUCT_2.title);

    // Close slider and navigate to My Orders
    cy.get('[aria-label="Close slider"]').click();
    cy.containsCI("My Orders").click();
    cy.urlShouldIncludeCI("/orders");

    // Verify both ordered products appear
    cy.containsCI(PRODUCT_1.title).should("be.visible");
    cy.containsCI(PRODUCT_2.title).should("be.visible");

    // Customer logs out
    cy.get(".sign-out").click();
    cy.url().should("match", /\/login$|\//);
    cy.get("input#username").should("be.visible");

    // === ADMIN: Verify customer's order in admin view ===
    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();
    cy.containsCI("Hello, Admin", { timeout: 10000 }).should("be.visible");

    cy.containsCI("Customers").click();
    cy.urlShouldIncludeCI("/customers");

    // Compute expected join date in DD/M/YYYY format
    const today = new Date();
    const expectedJoinDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const expectedFullName = `${CUSTOMER.fname} ${CUSTOMER.lname}`;

    // Customer row: full name cell
    cy.contains("td", expectedFullName).as("customerNameCell");

    // Verify join date in the same row (2nd cell)
    cy.get("@customerNameCell")
      .parent("tr")
      .find("td")
      .eq(1)
      .should("have.text", expectedJoinDate);

    // Verify Products Bought nested table (3rd cell)
    cy.get("@customerNameCell")
      .parent("tr")
      .find("td")
      .eq(2)
      .within(() => {
        // Exactly 2 product rows (one per product in the order)
        cy.get("tbody tr").should("have.length", 2);

        // Products are ordered by create date: PRODUCT_1 (added first) before PRODUCT_2
        cy.get("tbody tr").eq(0).should("contain.text", PRODUCT_1.title);
        cy.get("tbody tr").eq(1).should("contain.text", PRODUCT_2.title);
      });
  });
});
