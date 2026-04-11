import { useState, useEffect } from "react";

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(darkModeQuery.matches);

  useEffect(() => {
    const handler = (e) => setIsDark(e.matches);
    darkModeQuery.addEventListener("change", handler);
    return () => darkModeQuery.removeEventListener("change", handler);
  }, []);

  return isDark;
};

export default useDarkMode;
