# Plan: Admin Setup and First Login Test

## Steps

1. Use the Firebase Admin SDK to set the admin claim for the manually created admin user in the test Firestore project.
2. Create a script (e.g., firebase/set_test_admin_claim.js) that reads the test service account key and sets the admin claim for the test admin user (admin-test@admin.admin).
3. Run the script to ensure the admin claim is set for the test admin user.
4. Write a first system test that connects to the test Firebase project, logs in as the admin user (using credentials from the local file), and verifies routing to the admin main page.

## Ask many questions

1. **Admin UID Source**
   - How should the script obtain the UID for the test admin user?
     - Manual input (recommended for now)
     - Script fetches by email (requires additional code)
   - Suggested: Manual input for simplicity, or fetch by email for automation. -> TKIf7JIH15REnGfscFRnhGGwBQK2
2. **Script Location**
   - Where should the admin claim setup script be placed?
     - firebase/set_test_admin_claim.js (recommended)
     - Another location (please specify)
   - Suggested: firebase/set_test_admin_claim.js for clarity.
3. **Test Verification**
   - How should the test verify successful login and routing?
     - Check for presence of admin main page element (recommended)
     - Check URL path
     - Both
   - Suggested: Both, for robustness.
