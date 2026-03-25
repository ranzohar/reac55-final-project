import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "@/pages/Login.jsx";
import { BrowserRouter } from "react-router-dom";

describe("Login component", () => {
  it("renders the header", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    const header = screen.getByRole("heading");
    expect(header).toBeInTheDocument();
  });

  it("renders the form with username, password, and login button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    const usernameInput = screen.getByLabelText(/user ?name/i);
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    const loginButton = screen.getByRole("button", { name: /log ?in/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("renders a link to signup", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/signup");
  });
});
