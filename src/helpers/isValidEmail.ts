const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  const normalized = email.trim();
  return normalized.length <= 254 && EMAIL_PATTERN.test(normalized);
}
