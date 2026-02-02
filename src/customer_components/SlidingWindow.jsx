import { useState, useEffect } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
        <button
          className="btn-grey btn-small card-sliding-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
      </div>

      {/* Main content with dynamic margin */}
      <div className="sliding-window-main">
        {children}
      </div>
    </div>
  );
}
