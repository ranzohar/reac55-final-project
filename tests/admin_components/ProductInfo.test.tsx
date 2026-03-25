import React from "react";
import { render, screen } from "@testing-library/react";
import ProductInfo from "@/admin_components/ProductInfo.jsx";
import { Provider } from "react-redux";
import { store } from "@/redux/store.js";
import { ContextWrapper } from "@/ContextWrapper.jsx";

describe("ProductInfo component", () => {
  const mockProduct = {
    title: "Test Product",
    price: 123.45,
    categoryId: "cat1",
    description: "A test product",
    boughtBy: [],
    pic: "http://example.com/pic.jpg",
  };

  it("renders the form with title, price, category, pic link, description, and save button", () => {
    render(
      <Provider store={store}>
        <ContextWrapper>
          <ProductInfo product={mockProduct} onUpdate={() => {}} />
        </ContextWrapper>
      </Provider>,
    );
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toBeInTheDocument();
    const priceInput = screen.getByLabelText(/price/i);
    expect(priceInput).toBeInTheDocument();
    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect).toBeInTheDocument();
    const picInput = screen.getByLabelText(/link to pic/i);
    expect(picInput).toBeInTheDocument();
    const descInput = screen.getByLabelText(/description/i);
    expect(descInput).toBeInTheDocument();
    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();
  });

  it("renders 'Bought By:' section and 'No sales yet' message when no sales", () => {
    render(
      <Provider store={store}>
        <ContextWrapper>
          <ProductInfo product={mockProduct} onUpdate={() => {}} />
        </ContextWrapper>
      </Provider>,
    );
    const boughtBySection = screen.getByText(/bought by/i);
    expect(boughtBySection).toBeInTheDocument();
    const noSales = screen.getByText(/no sales yet/i);
    expect(noSales).toBeInTheDocument();
  });

  it("renders a table when boughtBy is supplied", () => {
    const productWithSales = {
      ...mockProduct,
      boughtBy: [
        { name: "Apple", qty: 2, date: "2026-02-22" },
        { name: "Banana", qty: 1, date: "2026-02-21" },
      ],
    };
    render(
      <Provider store={store}>
        <ContextWrapper>
          <ProductInfo product={productWithSales} onUpdate={() => {}} />
        </ContextWrapper>
      </Provider>,
    );
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3); // 1 header row + 2 data rows
    expect(rows[1].textContent).toContain("Apple");
    expect(rows[1].textContent).toContain("2");
    expect(rows[1].textContent).toContain("2026-02-22");
    expect(rows[2].textContent).toContain("Banana");
    expect(rows[2].textContent).toContain("1");
    expect(rows[2].textContent).toContain("2026-02-21");
  });

  it("does not render a table when boughtBy is empty", () => {
    render(
      <Provider store={store}>
        <ContextWrapper>
          <ProductInfo product={mockProduct} onUpdate={() => {}} />
        </ContextWrapper>
      </Provider>,
    );
    expect(screen.queryByRole("table")).toBeNull();
  });
});
