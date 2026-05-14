/*Title-case a job role for display and storage (trim, split on whitespace, each word capitalized).
 */
export function normalizeJobRoleTitle(roleValue) {
  const s = (roleValue ?? '').toString().trim();
  if (!s) return '';

  return s
    .split(/\s+/)
    .map((word) => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(' ');
}

/* Lowercase key for duplicate-safe role matching (use with normalizeJobRoleTitle output).
 */
export function roleKeyForMatching(roleValue) {
  return normalizeJobRoleTitle(roleValue).toLowerCase();
}
