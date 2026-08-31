const RULES = [
  (v: string) => v.length >= 8,
  (v: string) => /[A-Z]/.test(v),
  (v: string) => /[a-z]/.test(v),
  (v: string) => /[0-9]/.test(v),
  (v: string) => /[^A-Za-z0-9]/.test(v),
];

export function isPasswordStrongEnough(value: string) {
  const score = RULES.filter((rule) => rule(value)).length;
  return score >= 3;
}
