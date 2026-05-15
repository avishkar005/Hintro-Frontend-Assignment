/**
 * Format seconds into a human-readable duration string.
 * e.g., 3871 → "1h 4m 31s"  |  120 → "2m 0s"  |  45 → "45s"
 */
export function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0s';
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

/**
 * Format a date string into a readable date.
 * e.g., "2026-04-29T03:38:35.444Z" → "Apr 29, 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date string into date + time.
 * e.g., "2026-04-29T03:38:35.444Z" → "Apr 29, 2026, 3:38 AM"
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a date as relative time.
 * e.g., "2 days ago", "5 min ago"
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

/**
 * Get initials from a full name.
 */
export function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Capitalize the first letter of each word.
 */
export function titleCase(str) {
  if (!str) return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Truncate a string to a given length.
 */
export function truncate(str, max = 40) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/**
 * Format plan name nicely.
 */
export function formatPlan(plan) {
  if (!plan) return 'Free';
  return titleCase(plan);
}
