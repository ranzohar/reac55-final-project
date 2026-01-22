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

export default { mapObjectToArray, parsePrice };
