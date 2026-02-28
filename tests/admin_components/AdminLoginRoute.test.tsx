import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "../../src/App.jsx";
import { store } from "../../src/redux/store.js";

// This test assumes a test admin user exists with credentials:
// username: admin@test.com, password: admin123
// and that logging in as this user routes to the admin main page.

describe("Admin login and route", () => {
  it("logs in as admin and routes to admin main page", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    // Find and fill username and password fields
    const usernameInput = screen.getByLabelText(/user ?name/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(usernameInput, "admin-test");
    await user.type(passwordInput, "123123");

    // Click login button
    const loginButton = screen.getByRole("button", { name: /log ?in/i });
    await user.click(loginButton);

    // Wait for navigation and rendering
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const customerGreeting = await screen.findByText(/Hello,/i);
    expect(customerGreeting).toBeInTheDocument();
  });
});
