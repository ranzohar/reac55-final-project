import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Cart from "@/customer_components/Cart.jsx";
import { ContextWrapper } from "@/ContextWrapper.jsx";
import { Provider } from "react-redux";
import { store } from "@/redux/store.js";
import SlidingWindow from "@/customer_components/SlidingWindow.jsx";

describe("SlidingWindow Component", () => {
  it("toggles sliderButton slideIn attribute on click", async () => {
    const { container } = render(
      <Provider store={store}>
        <ContextWrapper>
          <SlidingWindow component={<Cart />}>
            <div role="CHILD"></div>
          </SlidingWindow>
        </ContextWrapper>
      </Provider>,
    );
    const sliderButton = screen.getByLabelText("Open slider");

    expect(sliderButton).toBeInTheDocument();
    expect(sliderButton).toHaveAttribute("aria-label", "Open slider");

    const user = userEvent.setup();
    await user.click(sliderButton);

    expect(sliderButton).toHaveAttribute("aria-label", "Close slider");
    expect(screen.getByRole("button", { name: /Order/i })).toBeVisible();
  });
});
