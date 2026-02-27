// src/helpers/format.js
import numeral from "numeral";
import { DateTime } from "luxon";

/**
 * FORMAT RUPIAH
 */
export function formatRupiah(value, withPrefix = false) {
  if (value === null || value === undefined) return "";

  const formatted = numeral(value).format("0,0");
  return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * PARSE RUPIAH STRING KE NUMBER
 */
export function parseRupiah(value) {
  return numeral(value).value();
}

/**
 * FORMAT PERCENTAGE
 * Expect value: 0.25 → 25%
 */
export function formatPercentage(value) {
  if (value === null || value === undefined) return "";
  return numeral(value).format("0,0.00%");
}

/**
 * FORMAT DATE (ID)
 */
export function formatDate(date) {
  if (!date) return "";

  return DateTime.fromISO(date).setLocale("id").toFormat("dd LLLL yyyy");
}

/**
 * FORMAT DATE + TIME (ID)
 */
export function formatDateTime(date) {
  if (!date) return "";

  return DateTime.fromISO(date).setLocale("id").toFormat("dd LLLL yyyy, HH:mm");
}

/**
 * CONVERT UTC → CLIENT TIMEZONE
 */
export function formatToClientTimezone(date) {
  if (!date) return "";

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return DateTime.fromISO(date, { zone: "utc" })
    .setZone(timezone)
    .setLocale("id")
    .toFormat("dd LLLL yyyy, HH:mm");
}

/**
 * UPPERCASE FIRST LETTER
 */
export function ucfirst(str) {
  return typeof str === "string" && str.length
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : "";
}
