# System Test Plan: Firestore Whitebox Testing

## Steps

1. Create a separate Firestore database instance dedicated to system tests.
2. For each test, delete all users except for a manually added initial admin user.
3. For each test, delete all data from the database to ensure a clean state.
4. Implement a test that checks all rendered components when the system is in an empty state.
5. Add categories, products, and orders incrementally, verifying that multiple user components re-render and statistics reflect correct numbers.
6. Test edge cases, such as removing a category that is used by another product, and verify system behavior.

## Ask many questions

1. **Firestore DB Setup**
   - Should the test database be in a separate Firebase project or a different collection within the same project?
     - Separate Firebase project (recommended: ensures full isolation) - V
     - Different collection in same project (easier setup, less isolation)
   - Suggested: Separate Firebase project for maximum isolation and safety.
2. **Admin User Handling**
   - Should the initial admin user be created via script or always exist manually?
     - Created via script (repeatable, but may require storing credentials)
     - Manually created (simpler, but less automated)
   - Suggested: Manually created for now, as per your instruction. - V
3. **Test Framework**
   - Which test framework should be used for system tests?
     - Existing framework (e.g., Vitest/Jest)
     - New framework or tool (e.g., Cypress, Playwright)
   - Suggested: Use existing framework for consistency unless E2E browser automation is required. - V
4. **Component Rendering Checks**
   - Should rendering checks be snapshot-based, DOM queries, or visual regression?
     - Snapshot-based (quick, but brittle)
     - DOM queries (robust, recommended)
     - Visual regression (most thorough, but complex)
   - Suggested: DOM queries for reliability and maintainability. - V
5. **Edge Case Coverage**
   - Should edge cases be prioritized by business impact or technical complexity?
     - Business impact (recommended: ensures critical flows are robust)
     - Technical complexity (may uncover hidden bugs)
   - Suggested: Prioritize by business impact first. Leave edge cases for future plan.
