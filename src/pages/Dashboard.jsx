import { useFetch } from '../hooks/useFetch';
import { useUser } from '../hooks/useUser';
import { api } from '../api';
import { formatDuration, formatRelativeTime, formatPlan, getInitials, titleCase } from '../utils/format';
import { Skeleton } from '../components/Common/Skeleton';
import { StatusBadge } from '../components/Common/Badge';
import './Dashboard.css';

function StatCard({ icon, label, value, sub, accentColor, loading }) {
  if (loading) {
    return (
      <div className="stat-card">
        <Skeleton width="36px" height="36px" borderRadius="var(--radius-md)" style={{ marginBottom: '16px' }} />
        <Skeleton width="45%" height="12px" style={{ marginBottom: '8px' }} />
        <Skeleton width="55%" height="28px" style={{ marginBottom: '6px' }} />
        <Skeleton width="65%" height="11px" />
      </div>
    );
  }

  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ '--accent': accentColor }}>
        {icon}
      </div>
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
      {sub && <span className="stat-card__sub">{sub}</span>}
    </div>
  );
}

function UsageBar({ label, used, limit, percentage, loading }) {
  if (loading) {
    return (
      <div className="usage-bar">
        <Skeleton width="50%" height="12px" style={{ marginBottom: '8px' }} />
        <Skeleton width="100%" height="6px" borderRadius="var(--radius-full)" />
      </div>
    );
  }

  const pct = Math.min(percentage ?? Math.round((used / (limit || 1)) * 100), 100);
  let color = 'var(--color-brand-primary)';
  if (pct >= 90) color = 'var(--color-danger)';
  else if (pct >= 70) color = 'var(--color-warning)';

  return (
    <div className="usage-bar">
      <div className="usage-bar__header">
        <span className="usage-bar__label">{label}</span>
        <span className="usage-bar__count">
          {used} <span className="usage-bar__limit">/ {limit}</span>
        </span>
      </div>
      <div className="usage-bar__track">
        <div
          className="usage-bar__fill"
          style={{ '--fill-width': `${pct}%`, '--fill-color': color }}
        />
      </div>
      <span className="usage-bar__percent">{pct}% used</span>
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__desc">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const { userId } = useUser();

  const { data: dashboard, loading: dashLoading, error: dashError } = useFetch(
    () => api.getDashboard(userId),
    [userId]
  );

  const { data: stats, loading: statsLoading, error: statsError } = useFetch(
    () => api.getStats(userId),
    [userId]
  );

  const loading = dashLoading || statsLoading;
  const user = dashboard?.user;
  const subscription = dashboard?.subscription;
  const usage = dashboard?.usage;

  return (
    <div className="dashboard">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {loading ? (
              <Skeleton width="220px" height="30px" />
            ) : (
              <>Welcome back{user?.firstName ? `, ${user.firstName}` : ''}</>
            )}
          </h1>
          <p className="page-subtitle">
            {loading ? (
              <Skeleton width="180px" height="14px" style={{ marginTop: '6px' }} />
            ) : (
              "Here's an overview of your Hintro activity."
            )}
          </p>
        </div>

        {/* User Badge */}
        {!loading && user && (
          <div className="user-badge">
            <div className="user-badge__avatar">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="user-badge__info">
              <span className="user-badge__name">
                {user.firstName} {user.lastName}
              </span>
              <span className="user-badge__email">{user.email}</span>
            </div>
            <StatusBadge status={user.status}>{titleCase(user.status)}</StatusBadge>
          </div>
        )}
      </div>

      {/* ── Stats Row ── */}
      <section className="dashboard__section">
        <h2 className="section-title">Call Statistics</h2>
        <div className="stats-grid">
          <StatCard
            loading={loading}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.05 9.95 19.79 19.79 0 012 1.27h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.09a16 16 0 007.82 7.82l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17.92z"/>
              </svg>
            }
            label="Total Sessions"
            value={loading ? '—' : (stats?.totalSessions ?? 0).toLocaleString()}
            sub={stats?.totalSessions === 0 ? 'No sessions yet' : 'Total calls recorded'}
            accentColor="var(--color-brand-primary)"
          />
          <StatCard
            loading={loading}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            }
            label="Average Duration"
            value={loading ? '—' : formatDuration(stats?.averageDuration)}
            sub="Per call session"
            accentColor="var(--color-success)"
          />
          <StatCard
            loading={loading}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            }
            label="Total Interactions"
            value={loading ? '—' : (stats?.totalAIInteractions ?? 0).toLocaleString()}
            sub="Across all sessions"
            accentColor="var(--color-warning)"
          />
          <StatCard
            loading={loading}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            }
            label="Last Session"
            value={
              loading ? '—' :
              stats?.lastSession?.length
                ? formatRelativeTime(stats.lastSession[0])
                : 'No sessions'
            }
            sub={
              stats?.lastSession?.length > 1
                ? `Previous: ${formatRelativeTime(stats.lastSession[1])}`
                : undefined
            }
            accentColor="var(--color-info)"
          />
        </div>

        {/* Empty state for stats */}
        {!loading && stats?.totalSessions === 0 && (
          <div className="stats-empty-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            No call sessions recorded yet. Start your first call to see stats here.
          </div>
        )}
      </section>

      {/* ── Lower Grid ── */}
      <div className="dashboard__lower">
        {/* ── Subscription ── */}
        <section className="dashboard__section">
          <h2 className="section-title">Subscription</h2>
          <div className="subscription-card">
            {loading ? (
              <div className="subscription-card__loading">
                <Skeleton width="40%" height="20px" style={{ marginBottom: '10px' }} />
                <Skeleton width="60%" height="13px" style={{ marginBottom: '8px' }} />
                <Skeleton width="50%" height="13px" />
              </div>
            ) : subscription ? (
              <>
                <div className="subscription-card__header">
                  <div>
                    <span className="subscription-card__plan">{formatPlan(subscription.plan)}</span>
                    <span className="subscription-card__cycle"> · {titleCase(subscription.billing_cycle)}</span>
                  </div>
                  <StatusBadge status={subscription.status}>{titleCase(subscription.status)}</StatusBadge>
                </div>
                <div className="subscription-card__rows">
                  <div className="subscription-card__row">
                    <span className="subscription-card__key">Plan</span>
                    <span className="subscription-card__val">{formatPlan(subscription.plan)}</span>
                  </div>
                  <div className="subscription-card__row">
                    <span className="subscription-card__key">Billing</span>
                    <span className="subscription-card__val">{titleCase(subscription.billing_cycle)}</span>
                  </div>
                  <div className="subscription-card__row">
                    <span className="subscription-card__key">Status</span>
                    <span className="subscription-card__val">
                      <StatusBadge status={subscription.status}>{titleCase(subscription.status)}</StatusBadge>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon={
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                }
                title="No Active Subscription"
                description="You are currently on the free plan. Upgrade to unlock more features."
              />
            )}
          </div>
        </section>

        {/* ── Usage ── */}
        <section className="dashboard__section">
          <h2 className="section-title">Usage</h2>
          <div className="usage-card">
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[1, 2, 3].map((i) => (
                  <UsageBar key={i} loading />
                ))}
              </div>
            ) : usage ? (
              <div className="usage-list">
                <UsageBar
                  label="Knowledge Base Files"
                  used={usage.kb_files?.used ?? 0}
                  limit={usage.kb_files?.limit ?? 100}
                  percentage={usage.kb_files?.percentage}
                />
                <UsageBar
                  label="Vocabulary Terms"
                  used={usage.vocab_terms ?? 0}
                  limit={500}
                  percentage={Math.round(((usage.vocab_terms ?? 0) / 500) * 100)}
                />
                <UsageBar
                  label="Notes"
                  used={usage.notes ?? 0}
                  limit={100}
                  percentage={Math.round(((usage.notes ?? 0) / 100) * 100)}
                />
              </div>
            ) : (
              <EmptyState
                icon={
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                }
                title="No Usage Data"
                description="Usage metrics will appear as you start using Hintro."
              />
            )}
          </div>
        </section>
      </div>

      {/* ── Error Fallback ── */}
      {(dashError || statsError) && (
        <div className="error-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {dashError || statsError}
        </div>
      )}
    </div>
  );
}
