import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

type MockCategory = { id: string; name: string };
import Categories from "@/pages/admin/Categories.jsx";

const addNewCategoryMock = vi.fn();
let mockCategories: MockCategory[] = [];
vi.mock("@/hooks", () => ({
  useCategories: () => ({
    categories: mockCategories,
    addNewCategory: addNewCategoryMock,
    updateExistingCategory: vi.fn(),
    removeExistingCategory: vi.fn(),
  }),
}));

vi.mock("@/admin_components", () => ({
  Category: () => <div data-testid="mock-category" />,
}));

describe("Admin Categories Page", () => {
  it("renders the add button", () => {
    render(<Categories />);
    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toBeInTheDocument();
  });

  it("renders the same number of mocked Category components as categories in useCategories", () => {
    mockCategories = [
      { id: "1", name: "Cat 1" },
      { id: "2", name: "Cat 2" },
      { id: "3", name: "Cat 3" },
    ];
    render(<Categories />);
    const categoryDivs = screen.getAllByTestId("mock-category");
    expect(categoryDivs).toHaveLength(mockCategories.length);
    mockCategories = [];
  });

  it("calls addNewCategory when add button is pressed", async () => {
    render(<Categories />);
    const input = screen.getByPlaceholderText(/add new category/i);
    const addButton = screen.getByRole("button", { name: /add/i });
    await userEvent.type(input, "Test Category");
    await userEvent.click(addButton);
    expect(addNewCategoryMock).toHaveBeenCalledWith("Test Category");
  });
});
