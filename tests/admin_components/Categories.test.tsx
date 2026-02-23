import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import Categories from "@/pages/admin/Categories.jsx";

// filepath: /c:/Ran/Code/Fullstack_Course/React/react55-final-project/tests/admin_components/Category.test.tsx

// Mock the useCategories hook
vi.mock("@/hooks", () => ({
  useCategories: () => ({
    categories: [],
    addNewCategory: vi.fn(),
    updateExistingCategory: vi.fn(),
    removeExistingCategory: vi.fn(),
  }),
}));

// Mock the Category component
vi.mock("@/admin_components", () => ({
  Category: () => <div data-testid="mock-category" />,
}));

describe("Admin Categories Page", () => {
  it("renders the add button", () => {
    render(<Categories />);
    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toBeInTheDocument();
  });
});
