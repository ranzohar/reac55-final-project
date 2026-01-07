import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
    <div className="h-screen flex">
      {/* Sliding panel */}
      <div
        className={`h-full bg-gray-800 text-white p-4
          transition-all duration-300 ease-in-out
          relative
          ${isOpen ? "w-64" : "w-16"}
        `}
      >
        {showContent && <div className="mt-0">{component}</div>}

        <button
          className="
            absolute top-1/2 right-0 transform -translate-y-1/2
            p-3 bg-gray-900 hover:bg-gray-800 text-white
            rounded-full shadow-lg border border-gray-700
            flex items-center justify-center
          "
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronLeftIcon size={20} />
          ) : (
            <ChevronRightIcon size={20} />
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 h-full transition-all duration-300 ease-in-out">
        {children}
      </div>
    </div>
  );
}
