import React from "react";
import { render, screen } from "@testing-library/react";
import ProductImage from "@/customer_components/ProductImage";

describe("Customer product info component", () => {
  const src = "http://example.com/pic.jpg";
  it("Renders the pic", () => {
    render(<ProductImage src={src} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", src);
  });

  it("Does not render without pic", () => {
    const { container } = render(<ProductImage src={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
