/** Join conditional class names. Falsy values are dropped. */
export function cn(...inputs) {
  return inputs.flat(Infinity).filter(Boolean).join(" ");
}

/** 38200 -> "38.2K" — matches the CountUp formatting on the original site. */
export function formatCompact(n) {
  const value = Number(n) || 0;
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return String(value);
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
