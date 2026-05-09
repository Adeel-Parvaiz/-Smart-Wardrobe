export const LIMITS = {
  name: 120,
  category: 50,
  color: 40,
  brand: 60,
  imageUrl: 500,
  notes: 600,
  occasion: 60,
  password: 128,
  outfitItems: 30,
} as const;

export function toCleanString(value: unknown) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeRequiredText(value: unknown, maxLen: number) {
  const clean = toCleanString(value ?? "");
  if (!clean) return "";
  return clean.slice(0, maxLen);
}

export function sanitizeOptionalText(value: unknown, maxLen: number) {
  const clean = toCleanString(value ?? "");
  if (!clean) return null;
  return clean.slice(0, maxLen);
}

export function sanitizePassword(value: unknown, maxLen: number) {
  return (value ?? "").toString().slice(0, maxLen);
}

export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function isValidImageUrl(url: string) {
  if (!url) return false;
  if (url.startsWith("/")) return true;
  return /^https?:\/\/\S+$/i.test(url);
}
