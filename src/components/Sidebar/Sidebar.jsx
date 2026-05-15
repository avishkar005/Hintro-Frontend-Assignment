import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import FeedbackModal from '../Feedback/FeedbackModal';
import './Sidebar.css';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Call History',
    path: '/calls',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.05 9.95a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1.27h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.09A16 16 0 0013.91 17l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 17.92z"/>
      </svg>
    ),
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { userId, setUserId } = useUser();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
        {/* ── Logo ── */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-brand-primary)"/>
                <path d="M2 17l10 5 10-5" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="var(--color-brand-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
            </div>
            {!collapsed && <span className="sidebar__logo-text">Hintro</span>}
          </div>
          <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? (
                <path d="M9 18l6-6-6-6"/>
              ) : (
                <path d="M15 18l-6-6 6-6"/>
              )}
            </svg>
          </button>
        </div>

        {/* ── User Switcher ── */}
        <div className="sidebar__user-switch">
          {!collapsed && <span className="sidebar__section-label">Active User</span>}
          <div className={`user-switch${collapsed ? ' user-switch--compact' : ''}`}>
            <button
              className={`user-switch__btn${userId === 'u1' ? ' user-switch__btn--active' : ''}`}
              onClick={() => setUserId('u1')}
              title="User 1 — New User"
            >
              U1
            </button>
            <button
              className={`user-switch__btn${userId === 'u2' ? ' user-switch__btn--active' : ''}`}
              onClick={() => setUserId('u2')}
              title="User 2 — Active User"
            >
              U2
            </button>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="sidebar__nav">
          {!collapsed && <span className="sidebar__section-label">Navigation</span>}
          <ul className="sidebar__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar__nav-icon">{item.icon}</span>
                  {!collapsed && <span className="sidebar__nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Bottom Actions ── */}
        <div className="sidebar__footer">
          <button
            className="sidebar__feedback-btn"
            onClick={() => setFeedbackOpen(true)}
            title={collapsed ? 'Feedback' : undefined}
          >
            <span className="sidebar__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </span>
            {!collapsed && <span className="sidebar__nav-label">Feedback</span>}
          </button>
        </div>
      </aside>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
