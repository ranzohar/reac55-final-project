import { useCurrencies } from "@/hooks";

const Price = ({ amount, className = "", decimals = 2 }) => {
  const { currentCoinSign, rate } = useCurrencies();
  const numericAmount = Number(amount ?? 0);
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  const converted = (safeAmount * rate).toFixed(decimals);

  return (
    <span className={className}>
      {currentCoinSign}
      {converted}
    </span>
  );
};

export default Price;
