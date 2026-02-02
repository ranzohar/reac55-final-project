import { useContext } from "react";
import { coinSign } from "@/ContextWrapper";

const CurrencyOverlay = ({ children }) => {
  const [currencies, setCurrencies] = useContext(coinSign);
  const current = currencies.current;

  function changeCurrency(nextSymbol) {
    setCurrencies((prevCurrencies) => ({
      ...prevCurrencies,
      current: nextSymbol,
    }));
  }

  return (
    <>
      <select
        className="currency-badge"
        aria-label="currency symbol"
        value={current}
        onChange={(event) => changeCurrency(event.target.value)}
      >
        {Object.keys(currencies.options).map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
      {children}
    </>
  );
};

export default CurrencyOverlay;
