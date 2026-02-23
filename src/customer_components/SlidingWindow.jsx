import { useState, useEffect } from "react";
import React from "react";

import SliderButton from "./SliderButton";

export default function SlidingWindow({ children, className = "", component }) {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = sessionStorage.getItem("cartOpen");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    sessionStorage.setItem("cartOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <div className="sliding-window">
      <div className={`card-sliding ${isOpen ? "" : "is-closed"} ${className}`}>
        <div className="card-sliding-content">{component}</div>
        <SliderButton slideIn={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Main content with dynamic margin */}
      <div className="sliding-window-main">{children}</div>
    </div>
  );
}
