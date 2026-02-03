import { useContext } from "react";
import { coinSign } from "@/ContextWrapper";

const useCurrencies = () => {
  const [currencies, setCurrencies] = useContext(coinSign);
  const currentCoinSign = currencies?.current;
  const rate = currencies?.options?.[currentCoinSign] ?? 1;

  return { currentCoinSign, rate, currencies, setCurrencies };
};

export default useCurrencies;