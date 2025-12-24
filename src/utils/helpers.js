// src/utils/helpers.js
export const sanitizeEmail = (email) => {
  return email?.trim().toLowerCase() || "";
};

export const isValidToken = (token) => {
  return token && typeof token === "string" && token.length >= 20;
};

// export const debounce = (fn, delay) => {
//   let timeoutId;
//   return (...args) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => fn(...args), delay);
//   };
// };

export const logger = {
  info: (msg, ...args) => console.log(`ℹ️ ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`⚠️ ${msg}`, ...args),
  error: (msg, ...args) => console.error(`❌ ${msg}`, ...args),
  table: (msg, ...args) => console.table(`ℹ️ ${msg}`, ...args),
};
