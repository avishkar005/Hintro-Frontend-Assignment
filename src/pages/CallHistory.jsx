import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useUser } from '../hooks/useUser';
import { api } from '../api';
import { formatDuration, formatDate, formatDateTime, truncate, titleCase } from '../utils/format';
import { Skeleton } from '../components/Common/Skeleton';
import { StatusBadge, Tag } from '../components/Common/Badge';
import './CallHistory.css';

const LIMITS = [5, 10, 20, 50];

function TableSkeleton({ rows = 5 }) {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="table-skeleton__row" style={{ animationDelay: `${i * 60}ms` }}>
          <Skeleton width="120px" height="13px" />
          <Skeleton width="90px" height="13px" />
          <Skeleton width="150px" height="13px" />
          <Skeleton width="70px" height="13px" />
          <Skeleton width="60px" height="22px" borderRadius="var(--radius-full)" />
        </div>
      ))}
    </div>
  );
}

function SessionRow({ session }) {
  const [expanded, setExpanded] = useState(false);
  const duration = formatDuration(session.total_duration_seconds);
  const participants = session.participants?.filter((p) => !p.isUser) || [];

  return (
    <>
      <tr
        className={`calls-table__row${expanded ? ' calls-table__row--expanded' : ''}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <td className="calls-table__td calls-table__td--client">
          <span className="client-name">{session.client || '—'}</span>
        </td>
        <td className="calls-table__td">
          <span className="desc-text">{truncate(session.description || '—', 32)}</span>
        </td>
        <td className="calls-table__td calls-table__td--date">
          {formatDate(session.started_at)}
        </td>
        <td className="calls-table__td calls-table__td--duration">
          <span className="duration-pill">{duration}</span>
        </td>
        <td className="calls-table__td">
          <StatusBadge status={session.status}>{titleCase(session.status)}</StatusBadge>
        </td>
        <td className="calls-table__td calls-table__td--ai">
          {session.ai_interactions ?? 0}
        </td>
        <td className="calls-table__td calls-table__td--expand">
          <span className={`expand-icon${expanded ? ' expand-icon--open' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="calls-table__detail-row">
          <td colSpan={7}>
            <div className="session-detail">
              <div className="session-detail__grid">
                <div className="session-detail__item">
                  <span className="session-detail__label">Session ID</span>
                  <span className="session-detail__val session-detail__val--mono">{session._id}</span>
                </div>
                <div className="session-detail__item">
                  <span className="session-detail__label">Started</span>
                  <span className="session-detail__val">{formatDateTime(session.started_at)}</span>
                </div>
                <div className="session-detail__item">
                  <span className="session-detail__label">Ended</span>
                  <span className="session-detail__val">{formatDateTime(session.ended_at)}</span>
                </div>
                <div className="session-detail__item">
                  <span className="session-detail__label">Duration</span>
                  <span className="session-detail__val">{formatDuration(session.total_duration_seconds)}</span>
                </div>
                <div className="session-detail__item">
                  <span className="session-detail__label">End Reason</span>
                  <span className="session-detail__val">{titleCase(session.ended_reason) || '—'}</span>
                </div>
                <div className="session-detail__item">
                  <span className="session-detail__label">Language</span>
                  <span className="session-detail__val">
                    {session.language?.map((l) => l.toUpperCase()).join(', ') || '—'}
                  </span>
                </div>
                <div className="session-detail__item">
                  <span className="session-detail__label">Transcript Saved</span>
                  <span className="session-detail__val">{session.save_transcript ? 'Yes' : 'No'}</span>
                </div>
                <div className="session-detail__item">
                  <span className="session-detail__label">Participants</span>
                  <div className="session-detail__participants">
                    {session.participants?.map((p, i) => (
                      <Tag key={i} variant={p.isUser ? 'brand' : 'default'}>{p.name}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CallHistory() {
  const { userId } = useUser();
  const [limit, setLimit] = useState(10);

  const { data, loading, error } = useFetch(
    () => api.getCallHistory(userId, limit),
    [userId, limit]
  );

  const sessions = data?.callSessions || [];
  const pagination = data?.pagination;

  return (
    <div className="call-history">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Call History</h1>
          <p className="page-subtitle">
            {loading
              ? 'Loading sessions...'
              : `${pagination?.totalCount ?? 0} total session${pagination?.totalCount !== 1 ? 's' : ''} recorded`}
          </p>
        </div>

        {/* Limit Selector */}
        <div className="calls-controls">
          <label className="calls-controls__label" htmlFor="limit-select">
            Show
          </label>
          <select
            id="limit-select"
            className="calls-controls__select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {LIMITS.map((l) => (
              <option key={l} value={l}>{l} per page</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="error-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className="calls-table-wrapper">
        {loading ? (
          <TableSkeleton rows={limit > 10 ? 8 : limit} />
        ) : sessions.length === 0 ? (
          <div className="calls-empty">
            <div className="calls-empty__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.05 9.95 19.79 19.79 0 012 1.27h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.09a16 16 0 007.82 7.82l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17.92z"/>
              </svg>
            </div>
            <h3 className="calls-empty__title">No Call Sessions Found</h3>
            <p className="calls-empty__desc">
              Your call history will appear here once you've made some calls.
            </p>
          </div>
        ) : (
          <table className="calls-table">
            <thead>
              <tr>
                <th className="calls-table__th">Client</th>
                <th className="calls-table__th">Description</th>
                <th className="calls-table__th">Date</th>
                <th className="calls-table__th">Duration</th>
                <th className="calls-table__th">Status</th>
                <th className="calls-table__th calls-table__th--center">Interactions</th>
                <th className="calls-table__th" />
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <SessionRow key={session._id} session={session} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination Info ── */}
      {!loading && pagination && sessions.length > 0 && (
        <div className="calls-pagination">
          <span className="calls-pagination__info">
            Showing <strong>{sessions.length}</strong> of <strong>{pagination.totalCount}</strong> sessions
          </span>
          <div className="calls-pagination__pages">
            Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
