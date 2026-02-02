export function mapObjectToArray(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).map(([id, item]) => ({ id, ...item }));
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

export default { mapObjectToArray, safeAsync };
