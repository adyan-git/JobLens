function normalizeJobRoleTitle(roleValue) {
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

module.exports = { normalizeJobRoleTitle };
