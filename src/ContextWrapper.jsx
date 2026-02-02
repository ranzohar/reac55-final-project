import { createContext, useState } from "react";

const coinSign = createContext();

const ContextWrapper = ({ children }) => {
  const [currencies, setCurrencies] = useState({
    current: "$",
    options: { $: 1, "€": 0.85, "₪": 3.1 },
  });

  return (
    <coinSign.Provider value={[currencies, setCurrencies]}>
      {children}
    </coinSign.Provider>
  );
};

export { ContextWrapper, coinSign };
