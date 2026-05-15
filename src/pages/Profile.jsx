import { useFetch } from '../hooks/useFetch';
import { useUser } from '../hooks/useUser';
import { api } from '../api';
import { formatDate, getInitials, titleCase } from '../utils/format';
import { Skeleton } from '../components/Common/Skeleton';
import { StatusBadge } from '../components/Common/Badge';
import './Profile.css';

function ProfileRow({ label, value, loading }) {
  return (
    <div className="profile-row">
      <span className="profile-row__label">{label}</span>
      <span className="profile-row__value">
        {loading ? <Skeleton width="140px" height="13px" /> : (value || '—')}
      </span>
    </div>
  );
}

export default function Profile() {
  const { userId } = useUser();

  const { data: user, loading, error } = useFetch(
    () => api.getProfile(userId),
    [userId]
  );

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Your account information and details.</p>
        </div>
      </div>

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

      <div className="profile-layout">
        {/* ── Avatar Card ── */}
        <div className="profile-avatar-card">
          <div className="profile-avatar">
            {loading ? (
              <Skeleton width="80px" height="80px" borderRadius="var(--radius-full)" />
            ) : (
              getInitials(user?.firstName, user?.lastName)
            )}
          </div>
          <div className="profile-avatar-info">
            {loading ? (
              <>
                <Skeleton width="150px" height="22px" style={{ marginBottom: '8px' }} />
                <Skeleton width="200px" height="14px" />
              </>
            ) : (
              <>
                <h2 className="profile-fullname">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="profile-email">{user?.email}</p>
              </>
            )}
          </div>
          {!loading && user && (
            <StatusBadge status={user.status}>{titleCase(user.status)}</StatusBadge>
          )}
        </div>

        {/* ── Details Card ── */}
        <div className="profile-details-card">
          <h3 className="profile-card-title">Account Details</h3>

          <div className="profile-rows">
            <ProfileRow label="User ID" value={user?.id} loading={loading} />
            <ProfileRow label="First Name" value={user?.firstName} loading={loading} />
            <ProfileRow label="Last Name" value={user?.lastName} loading={loading} />
            <ProfileRow label="Email Address" value={user?.email} loading={loading} />
            <ProfileRow label="Login Method" value={titleCase(user?.login_method)} loading={loading} />
            <ProfileRow
              label="Status"
              value={
                !loading && user ? (
                  <StatusBadge status={user.status}>{titleCase(user.status)}</StatusBadge>
                ) : undefined
              }
              loading={loading}
            />
            <ProfileRow
              label="Admin Access"
              value={user?.is_hintro_admin ? 'Yes' : 'No'}
              loading={loading}
            />
            <ProfileRow label="Account Created" value={formatDate(user?.createdAt)} loading={loading} />
            <ProfileRow label="Last Updated" value={formatDate(user?.updatedAt)} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
