import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function SlidingWindow({ component }) {
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

  const panelWidth = isOpen ? "ml-64" : "ml-16";

  return (
    <div className="h-screen">
      {/* Sliding panel */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4
          transition-all duration-300 ease-in-out z-40
          ${isOpen ? "w-64" : "w-16"}
        `}
      >
        {showContent && (
          <div className="mt-0">
            {component}
          </div>
        )}

        <button
          className="
            absolute top-1/2 right-0 transform -translate-y-1/2
            p-3 bg-gray-900 hover:bg-gray-800 text-white
            rounded-full shadow-lg border border-gray-700
            z-50 flex items-center justify-center
          "
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeftIcon size={20} /> : <ChevronRightIcon size={20} />}
        </button>
      </div>

      {/* Main content (Outlet) */}
      <main
        className={`h-full transition-all duration-300 ease-in-out ${panelWidth}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
