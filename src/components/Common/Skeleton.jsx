import './Skeleton.css';

export function Skeleton({ width, height, borderRadius, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width: width || '100%',
        height: height || '16px',
        borderRadius: borderRadius || 'var(--radius-sm)',
        ...style,
      }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card">
      <Skeleton width="40%" height="14px" style={{ marginBottom: '8px' }} />
      <Skeleton width="60%" height="32px" style={{ marginBottom: '12px' }} />
      {Array.from({ length: lines - 2 }).map((_, i) => (
        <Skeleton key={i} width={`${75 - i * 10}%`} height="12px" style={{ marginBottom: '6px' }} />
      ))}
    </div>
  );
}
