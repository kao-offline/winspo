export const BASE62_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const BASE = 62n;

export const CODE_PATTERN = /^[0-9A-Za-z]+$/;

export function isValidCode(text: string): boolean {
  return CODE_PATTERN.test(text);
}

export function encodeBase62(value: bigint): string {
  if (value < 0n) {
    throw new Error("Cannot encode a negative value");
  }
  if (value === 0n) {
    return "0";
  }
  let n = value;
  let out = "";
  while (n > 0n) {
    const digit = Number(n % BASE);
    out = BASE62_ALPHABET[digit] + out;
    n /= BASE;
  }
  return out;
}

export function decodeBase62(text: string): bigint {
  let n = 0n;
  for (const char of text) {
    const idx = BASE62_ALPHABET.indexOf(char);
    if (idx === -1) {
      throw new Error(`Invalid base62 character: ${char}`);
    }
    n = n * BASE + BigInt(idx);
  }
  return n;
}
