import { execSync } from "child_process";

export const setupE2EDatabase = () => {
  try {
    execSync("node ../../project-backend/utils/e2e-db-setup.js", {
      stdio: "inherit",
      cwd: __dirname,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to setup E2E DB:", err);
    throw err;
  }
};
