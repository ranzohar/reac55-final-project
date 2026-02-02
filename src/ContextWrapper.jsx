import { createContext, useState } from "react";

const coinSign = createContext();

const ContextWrapper = ({ children }) => {
  const [coin, setCoin] = useState("$");

  return (
    <coinSign.Provider value={[coin, setCoin]}>{children}</coinSign.Provider>
  );
};

export { ContextWrapper, coinSign };
