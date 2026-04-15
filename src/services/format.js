/**
 * Convert a raw BigInt/string token amount to a decimal string.
 * e.g. formatUnits("1000000", 6) => "1.0"
 */
export function formatUnits(value, decimals = 18) {
  if (value === null || value === undefined || value === "") return "0";
  const raw = BigInt(String(value));
  const factor = BigInt(10) ** BigInt(decimals);
  const whole = raw / factor;
  const fraction = raw % factor;
  if (fraction === 0n) return String(whole);
  const fractionStr = String(fraction).padStart(decimals, "0").replace(/0+$/, "");
  return `${whole}.${fractionStr}`;
}

/**
 * Format a numeric string/number for display with thousands separator.
 */
export function formatNumber(value, maxDecimals = 4) {
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(num);
}

/**
 * Shorten a wallet address: 0x1234...abcd
 */
export function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

/**
 * Format a Unix timestamp (seconds) to "YYYY-MM-DD HH:mm"
 */
export function formatDate(timestamp) {
  if (!timestamp) return "—";
  const ts = Number(timestamp) * 1000;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
