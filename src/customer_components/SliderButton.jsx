import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

/**
 * SliderButton toggles open/close state and shows the correct Chevron icon.
 * @param {boolean} slideIn - If true, shows ChevronLeftIcon (open). If false, shows ChevronRightIcon (closed).
 * @param {function} onClick - Callback for button click.
 * @param {string} className - Optional className for styling.
 */
export default function SliderButton({ slideIn, onClick, className = "" }) {
  return (
    <button
      className={`btn-grey btn-small card-sliding-toggle ${className}`}
      onClick={onClick}
      aria-label={slideIn ? "Close slider" : "Open slider"}
    >
      {slideIn ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );
}
