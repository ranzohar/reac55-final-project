# Steps

1. Set up a test user with admin claim (if not already done in previous steps).
2. Simulate login with admin credentials in the test.
3. Wait for authentication and routing to complete.
4. Assert that the admin main page is displayed (e.g., by checking for a unique element or text).

# Ask many questions

- What method should be used to simulate login?
  - UI interaction: Fill login form fields and submit (recommended, tests full flow)
  - Direct API/auth call: Authenticate programmatically (faster, but skips UI)
  - Suggested: UI interaction, as it best simulates real user behavior.
- How should we verify the admin main page is loaded?
  - Check for a unique heading or element (e.g., "Admin Dashboard")
  - Check for URL path (e.g., /admin/main)
  - Both element and URL check
  - Suggested: Both element and URL check for robustness.
- Should the test clean up (sign out) after running?
  - Yes: Ensures no side effects for other tests (recommended)
  - No: Simpler, but may affect other tests
  - Suggested: Yes, sign out after test. -> later we will have a cleanup that runs before each test
