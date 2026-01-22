export function mapObjectToArray(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).map(([id, item]) => ({ id, ...item }));
}

export default { mapObjectToArray };
