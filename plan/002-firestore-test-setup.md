# Plan: Firestore Test DB Setup and First Test

## Steps

1. Create a new Firebase project in the Firebase console dedicated for system tests.
2. Set up Firestore in the new Firebase project.
3. Generate a new service account key for the test project and download the JSON credentials file.
4. Add the new service account key JSON to a local file (e.g., firebase/testServiceAccountKey.json) and ensure it is gitignored.
5. Manually create an initial admin user in the Firebase Authentication section of the test project, setting a known email and password.
6. Store the admin email and password in a local file (e.g., firebase/test-admin-credentials.json), also gitignored.
7. Update the test configuration to use the test Firestore credentials and admin credentials when running tests (not during normal dev runs).
8. Implement a first test that connects to the test Firebase project and logs in as the admin via user input.

## Ask many questions

1. **Service Account Key Location**
   - What should the exact path and filename be for the test service account key?
     - firebase/testServiceAccountKey.json (recommended)
     - Another location (please specify)
   - Suggested: firebase/testServiceAccountKey.json for clarity and separation.
2. **Admin Credentials File**
   - What should the exact path and filename be for the admin credentials?
     - firebase/test-admin-credentials.json (recommended)
     - Another location (please specify)
   - Suggested: firebase/test-admin-credentials.json for clarity and separation.
3. **Test/Dev Switching**
   - How should the code distinguish between test and dev environments?
     - Environment variable (recommended, e.g., NODE_ENV or custom)
     - Command line flag
     - Manual code change
   - Suggested: Use an environment variable for flexibility and automation. -> should be autamatically set in npm run test and npm run test:ui
4. **Test Framework**
   - Should the first test be implemented using the existing test framework (e.g., Vitest/Jest) or a new tool?
     - Existing framework (recommended)
     - New tool (please specify)
   - Suggested: Use the existing framework for consistency.
     -->
     // Import the functions you need from the SDKs you need
     import { initializeApp } from "firebase/app";
     import { getAnalytics } from "firebase/analytics";
     // TODO: Add SDKs for Firebase products that you want to use
     // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCjjdQbCi-9xTfWQBGpGrCwc3lgzPUngGA",
authDomain: "e-commerc-test.firebaseapp.com",
projectId: "e-commerc-test",
storageBucket: "e-commerc-test.firebasestorage.app",
messagingSenderId: "610204654058",
appId: "1:610204654058:web:cce0440c901ba3b57dba93",
measurementId: "G-WDMCZVFK3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

Admin user:
email: admin-test@admin.admin (username admin-test)
password: 123123
