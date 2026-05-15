import './Badge.css';

/**
 * status: 'active' | 'inactive' | 'ended' | 'pending' | 'success' | 'warning'
 */
export function StatusBadge({ status, children }) {
  const normalized = (status || '').toLowerCase();
  let variant = 'default';

  if (['active', 'success', 'ended'].includes(normalized)) variant = 'success';
  else if (['pending', 'warning'].includes(normalized)) variant = 'warning';
  else if (['inactive', 'error', 'failed'].includes(normalized)) variant = 'danger';
  else if (['info'].includes(normalized)) variant = 'info';

  return (
    <span className={`badge badge--${variant}`}>
      <span className="badge__dot" />
      {children || status}
    </span>
  );
}

export function Tag({ children, variant = 'default' }) {
  return <span className={`tag tag--${variant}`}>{children}</span>;
}
