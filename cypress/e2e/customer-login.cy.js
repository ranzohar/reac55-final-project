// Before running this test, ensure the E2E database is set up by running the setup script manually or as a pre-test step.

const TEST_USER = {
  fname: "TestFirst",
  lname: "TestLast",
  username: `customer_test_${Date.now()}`,
  password: "testpass123",
  newFname: "NewFirst",
  newLname: "NewLast",
  newPassword: "newpass456",
};

describe("Customer Login E2E", () => {
  it("signs up, logs in, edits, and verifies customer flow", () => {
    cy.resetApp();
    cy.containsCI("Register").click();

    // 1. Sign up a new customer
    cy.get("input#fname").type(TEST_USER.fname);
    cy.get("input#lname").type(TEST_USER.lname);
    cy.get("input#username").type(TEST_USER.username);
    cy.get("input#password").type(TEST_USER.password);
    cy.get('button[type="submit"]').click();

    // 2. Verify logged in and customer main page
    cy.containsCI(`Hello, ${TEST_USER.fname}`).should("be.visible");
    cy.urlShouldIncludeCI("/customer");
    cy.containsCI("Products").should("be.visible");
    cy.containsCI("My Orders").should("be.visible");
    cy.containsCI("My Account").should("be.visible");

    // 3. Go to My Account page
    cy.containsCI("My Account").click();
    cy.urlShouldIncludeCI("/account");

    // 4. Verify current details
    cy.get("input#fname").should("have.value", TEST_USER.fname);
    cy.get("input#lname").should("have.value", TEST_USER.lname);
    cy.get("input#username").should("have.value", TEST_USER.username);

    // 5. Edit details (fname, lname, password)
    cy.get("input#fname")
      .type("{selectall}{backspace}")
      .type(TEST_USER.newFname);
    cy.get("input#lname")
      .type("{selectall}{backspace}")
      .type(TEST_USER.newLname);
    cy.get("input#currentPassword").type(TEST_USER.password);
    cy.get("input#newPassword").type(TEST_USER.newPassword);
    cy.get('button[type="submit"]').click();
    cy.containsCI("Account updated successfully").should("be.visible");

    // 6. Logout
    cy.get(".sign-out").should("be.visible").click();
    cy.url().should("match", /\/login$|\/$/);
    cy.get("input#username").should("be.visible");

    // 7. Login with new password
    cy.get("input#username").type(TEST_USER.username);
    cy.get("input#password").type(TEST_USER.newPassword);
    cy.get('button[type="submit"]').click();
    cy.containsCI(`Hello, ${TEST_USER.newFname}`).should("be.visible");
    cy.urlShouldIncludeCI("/customer");
    cy.containsCI("My Account").click();
    cy.urlShouldIncludeCI("/account");
    cy.get("input#fname").should("have.value", TEST_USER.newFname);
    cy.get("input#lname").should("have.value", TEST_USER.newLname);
    cy.get("input#username").should("have.value", TEST_USER.username);

    // 8. Logout and login as admin
    cy.get(".sign-out").should("be.visible").click();
    cy.url().should("match", /\/login$|\//);
    cy.get("input#username").should("be.visible");
    cy.get("input#username").type("admin-test");
    cy.get("input#password").type("123123");
    cy.get('button[type="submit"]').click();
    cy.containsCI("Hello, Admin", { timeout: 10000 }).should("be.visible");
    cy.urlShouldIncludeCI("/admin");

    // 9. Navigate to Customers and verify the new user is listed with updated details
    cy.containsCI("Customers").click();
    cy.urlShouldIncludeCI("/customers");
    cy.containsCI(TEST_USER.newFname).should("be.visible");
    cy.containsCI(TEST_USER.newLname).should("be.visible");
    cy.get("table.background-2 tbody tr").should("have.length", 1);
  });
});
