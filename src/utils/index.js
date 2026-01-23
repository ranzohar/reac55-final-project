export function mapObjectToArray(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).map(([id, item]) => ({ id, ...item }));
}

export function parsePrice(raw) {
  const s = String(raw ?? "");
  const first = s[0] || "";
  const pricePrefix = /\D/.test(first) ? first : "";
  const numeric = Number(s.replace(/^[^\d.-]+/, "") || 0);
  return { pricePrefix, price: numeric };
}

export function safeAsync(fn, name) {
  return async function safeWrapper(...args) {
    try {
      return await fn.apply(this, args);
    } catch (err) {
      console.error(`[${name || fn.name}]`, err);
      throw err;
    }
  };
}

export default { mapObjectToArray, parsePrice, safeAsync };
