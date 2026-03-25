I (the user) am creating this first stage plan file so you can work with it when we continue to plan the e2e test after initial tests are working.

Initial test plan:
Use cypress commands to log in:

1. to Admin user:
   username: admin-test
   password: 123123
   Verify:

- all pages are empty
- We are logged in as admin:
  pages are: categories, products, customers, statistics
  there are no categories yet, no products no customers no stats available.

2. Logout
3. Create a new user.
   verify:
   - we are logged in as user:
     pages are: products (no products), orders (no orders), user details.
4. start verifyin e2e functionalities: users, categories, products, orders, statistics etc...
