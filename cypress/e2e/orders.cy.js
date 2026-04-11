const PRODUCT_1 = { title: "Widget Alpha", price: 25 };
const PRODUCT_2 = { title: "Widget Beta", price: 40 };

// Quantities per customer per order (p1 = PRODUCT_1, p2 = PRODUCT_2)
const A_O1 = { p1: 2, p2: 3 }; // Alice – Order 1
const A_O2 = { p1: 1, p2: 2 }; // Alice – Order 2
const B_O1 = { p1: 4, p2: 1 }; // Bob   – Order 1
const B_O2 = { p1: 2, p2: 2 }; // Bob   – Order 2

const orderTotal = ({ p1, p2 }) =>
  `$${(PRODUCT_1.price * p1 + PRODUCT_2.price * p2).toFixed(2)}`;

// Grand totals across all orders — expected in the pie chart
const PIE_P1 = A_O1.p1 + A_O2.p1 + B_O1.p1 + B_O2.p1; // 9
const PIE_P2 = A_O1.p2 + A_O2.p2 + B_O1.p2 + B_O2.p2; // 8

// Per-customer totals — expected in the bar chart
const BAR_A_P1 = A_O1.p1 + A_O2.p1; // 3
const BAR_A_P2 = A_O1.p2 + A_O2.p2; // 5
const BAR_B_P1 = B_O1.p1 + B_O2.p1; // 6
const BAR_B_P2 = B_O1.p2 + B_O2.p2; // 3

const ts = Date.now();
const CUSTOMER_A = {
  fname: "Alice",
  lname: "Tester",
  username: `alice_${ts}`,
  password: "alicepass123",
};
const CUSTOMER_B = {
  fname: "Bob",
  lname: "Tester",
  username: `bob_${ts}`,
  password: "bobpass123",
};

const addToCart = (title, times) => {
  for (let i = 0; i < times; i++) {
    cy.contains(".card-product-info", title)
      .find(".quantity-icon")
      .last()
      .click();
  }
};

// Add products to cart, verify slider total, place order, close slider.
// Assumes the Products page is already loaded.
const placeOrder = ({ p1, p2 }) => {
  addToCart(PRODUCT_1.title, p1);
  cy.contains(".card-product-info", PRODUCT_1.title)
    .find(".quantity-number")
    .should("have.text", String(p1));

  addToCart(PRODUCT_2.title, p2);
  cy.contains(".card-product-info", PRODUCT_2.title)
    .find(".quantity-number")
    .should("have.text", String(p2));

  cy.get('[aria-label="Open slider"]').click();
  cy.get(".card-sliding").should("not.have.class", "is-closed");
  cy.get(".card-sliding-content").should("contain.text", PRODUCT_1.title);
  cy.get(".card-sliding-content").should("contain.text", PRODUCT_2.title);
  cy.get(".card-sliding-content strong").should(
    "contain.text",
    orderTotal({ p1, p2 }),
  );

  cy.get(".btn-order").click();
  cy.get(".card-sliding-content").should("not.contain.text", PRODUCT_1.title);
  cy.get(".card-sliding-content").should("not.contain.text", PRODUCT_2.title);

  cy.get('[aria-label="Close slider"]').click();
  cy.get(".card-sliding").should("have.class", "is-closed");
};

const signUpCustomer = ({ fname, lname, username, password }) => {
  cy.containsCI("Register").click();
  cy.get("input#fname").type(fname);
  cy.get("input#lname").type(lname);
  cy.get("input#username").type(username);
  cy.get("input#password").type(password);
  cy.get('button[type="submit"]').click();
  cy.containsCI(`Hello, ${fname}`, { timeout: 10000 }).should("be.visible");
  cy.urlShouldIncludeCI("/customer");
};

const logout = () => {
  cy.get(".sign-out").click();
  cy.url().should("match", /\/login$|\//);
  cy.get("input#username").should("be.visible");
};

describe("Orders E2E", () => {
  it("admin adds products, 2 customers each place 2 orders, and all views reflect the orders", () => {
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
    cy.get(".card-product")
      .eq(0)
      .find("[name='title']")
      .clear()
      .type(PRODUCT_1.title);
    cy.get(".card-product").eq(0).find("[name='price']").type(PRODUCT_1.price);
    cy.get(".card-product").eq(0).find("button[type='submit']").click();

    // Add product 2
    cy.containsCI("Add New").click();
    cy.get(".card-product").should("have.length", 2);
    cy.get(".card-product")
      .eq(1)
      .find("[name='title']")
      .clear()
      .type(PRODUCT_2.title);
    cy.get(".card-product").eq(1).find("[name='price']").type(PRODUCT_2.price);
    cy.get(".card-product").eq(1).find("button[type='submit']").click();

    cy.task("waitForFirebaseDoc", { collection: "products", id: PRODUCT_1.title });
    cy.task("waitForFirebaseDoc", { collection: "products", id: PRODUCT_2.title });

    cy.reload();

    // Verify both products are saved
    cy.get(".card-product")
      .eq(0)
      .find("[name='title']")
      .should("have.value", PRODUCT_1.title);
    cy.get(".card-product")
      .eq(1)
      .find("[name='title']")
      .should("have.value", PRODUCT_2.title);

    logout();

    // === CUSTOMER A: Sign up and place 2 orders ===
    signUpCustomer(CUSTOMER_A);

    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");
    cy.contains(".card-product-info", PRODUCT_1.title, { timeout: 10000 });

    placeOrder(A_O1);
    placeOrder(A_O2);

    // Verify both products appear in My Orders
    cy.containsCI("My Orders").click();
    cy.urlShouldIncludeCI("/orders");
    cy.containsCI(PRODUCT_1.title).should("be.visible");
    cy.containsCI(PRODUCT_2.title).should("be.visible");

    logout();

    // === CUSTOMER B: Sign up and place 2 orders ===
    signUpCustomer(CUSTOMER_B);

    cy.containsCI("Products").click();
    cy.urlShouldIncludeCI("/products");
    cy.contains(".card-product-info", PRODUCT_1.title, { timeout: 10000 });

    placeOrder(B_O1);
    placeOrder(B_O2);

    // Verify both products appear in My Orders
    cy.containsCI("My Orders").click();
    cy.urlShouldIncludeCI("/orders");
    cy.containsCI(PRODUCT_1.title).should("be.visible");
    cy.containsCI(PRODUCT_2.title).should("be.visible");

    logout();

    // === ADMIN: Verify both customers' orders ===
    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();
    cy.containsCI("Hello, Admin", { timeout: 10000 }).should("be.visible");

    cy.containsCI("Customers").click();
    cy.urlShouldIncludeCI("/customers");

    const today = new Date();
    const expectedJoinDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    // --- Verify Customer A ---
    cy.contains("td", `${CUSTOMER_A.fname} ${CUSTOMER_A.lname}`).as(
      "customerACell",
    );

    cy.get("@customerACell")
      .parent("tr")
      .find("td")
      .eq(1)
      .should("have.text", expectedJoinDate);

    // Verify Products Bought nested table (3rd cell)
    // 2 orders × 2 products each = 4 rows total
    cy.get("@customerACell")
      .parent("tr")
      .find("td")
      .eq(2)
      .within(() => {
        cy.get("tbody tr").should("have.length", 4);
        cy.get("tbody").should("contain.text", PRODUCT_1.title);
        cy.get("tbody").should("contain.text", PRODUCT_2.title);
      });

    // --- Verify Customer B ---
    cy.contains("td", `${CUSTOMER_B.fname} ${CUSTOMER_B.lname}`).as(
      "customerBCell",
    );

    cy.get("@customerBCell")
      .parent("tr")
      .find("td")
      .eq(1)
      .should("have.text", expectedJoinDate);

    // Verify Products Bought nested table (3rd cell)
    // 2 orders × 2 products each = 4 rows total
    cy.get("@customerBCell")
      .parent("tr")
      .find("td")
      .eq(2)
      .within(() => {
        cy.get("tbody tr").should("have.length", 4);
        cy.get("tbody").should("contain.text", PRODUCT_1.title);
        cy.get("tbody").should("contain.text", PRODUCT_2.title);
      });

    // === ADMIN: Verify Statistics page ===
    cy.containsCI("Statistics").click();
    cy.urlShouldIncludeCI("/statistics");

    // --- Pie chart: Total Sold Products ---
    cy.contains("h4", "Total Sold Products")
      .closest(".chart-wrapper")
      .within(() => {
        // Exactly 2 pie sectors — one per product
        cy.get(".recharts-pie-sector").should("have.length", 2);

        // Both product names appear as labels
        cy.get("svg").should("contain.text", PRODUCT_1.title);
        cy.get("svg").should("contain.text", PRODUCT_2.title);

        // Correct quantity totals appear inside the slice labels
        cy.get("svg").should("contain.text", String(PIE_P1));
        cy.get("svg").should("contain.text", String(PIE_P2));
      });

    // --- Bar chart: Products Quantity Per Customer ---
    cy.contains("h4", "Products Quantity Per Customer")
      .closest(".chart-wrapper")
      .within(() => {
        // Select box lists both customers (sorted by join date: Alice first, Bob second)
        cy.get(".user-select option:not([disabled])").should("have.length", 2);
        cy.get(".user-select").should("contain", CUSTOMER_A.fname);
        cy.get(".user-select").should("contain", CUSTOMER_B.fname);

        // --- Alice's data ---
        cy.get(".user-select").select(CUSTOMER_A.fname);
        cy.get("svg").should("contain.text", PRODUCT_1.title);
        cy.get("svg").should("contain.text", PRODUCT_2.title);
        cy.get("svg").should("contain.text", String(BAR_A_P1));
        cy.get("svg").should("contain.text", String(BAR_A_P2));

        // --- Bob's data ---
        cy.get(".user-select").select(CUSTOMER_B.fname);
        cy.get("svg").should("contain.text", PRODUCT_1.title);
        cy.get("svg").should("contain.text", PRODUCT_2.title);
        cy.get("svg").should("contain.text", String(BAR_B_P1));
        cy.get("svg").should("contain.text", String(BAR_B_P2));
      });
  });
});
