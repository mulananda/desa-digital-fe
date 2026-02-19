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

const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;

export const logger = {
  info: (msg, ...args) => {
    if (isDev) console.log(`ℹ️ ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    if (isDev) console.log(`✅ ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    if (isDev) console.warn(`⚠️ ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    if (isDev) console.error(`❌ ${msg}`, ...args);
  },
  table: (msg, ...args) => {
    if (isDev) console.table(`ℹ️ ${msg}`, ...args);
  },
};
