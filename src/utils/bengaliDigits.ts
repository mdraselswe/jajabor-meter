const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/**
 * Converts any number or string with English digits to Bengali digits.
 * e.g., 64 -> "৬৪", "17 / 64" -> "১৭ / ৬৪", 26 -> "২৬"
 */
export function toBn(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "০";
  return String(value).replace(/\d/g, (digit) => BN_DIGITS[parseInt(digit, 10)]);
}
