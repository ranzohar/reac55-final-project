const CurrencyOverlay = ({ children, symbol = "$" }) => (
  <>
    <div className="currency-badge" aria-label="currency symbol">
      {symbol}
    </div>
    {children}
  </>
);

export default CurrencyOverlay;
