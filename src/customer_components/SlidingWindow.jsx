import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Cart from "./Cart";

export default function SlidingWindow({ component, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const transitionDuration = 300;

  useEffect(() => {
    let timeout;
    if (isOpen) {
      timeout = setTimeout(() => setShowContent(true), transitionDuration);
    } else {
      setShowContent(false);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Fixed Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-300 dark:bg-gray-800 text-white
      transition-all duration-300 ease-in-out
      ${isOpen ? "w-64" : "w-16"} p-4 z-20`}
      >
        {showContent && <Cart />}
        <button
          className="absolute top-1/2 right-0 transform -translate-y-1/2 ..."
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
      </div>

      {/* Main content with dynamic margin */}
      <div
        className={`transition-all duration-300`}
        style={{ marginLeft: isOpen ? "16rem" : "4rem" }}
      >
        {children}
      </div>
    </div>
  );
}
