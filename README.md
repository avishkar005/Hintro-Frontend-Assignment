# Hintro Dashboard

A responsive mock-dashboard for Hintro built using React + Vite, consuming the Hintro Mock API.

---

## Tech Stack

| Layer       | Choice                      |
|-------------|-----------------------------|
| Framework   | React 18                    |
| Build Tool  | Vite 5                      |
| Routing     | React Router v6             |
| Styling     | Plain CSS with CSS variables (no CSS-in-JS, no Tailwind) |
| Fonts       | Sora (display) · DM Sans (body) via Google Fonts |
| State       | React Context (user switcher), `useState` / `useEffect` |
| API         | Native `fetch` against `https://mock-backend-hintro.vercel.app` |

---

## Features

- **Dashboard** — call statistics, subscription info, usage progress bars
- **Call History** — paginated table with expandable row details, limit selector
- **Profile** — full user account detail view
- **User Switcher** — toggle between `u1` (empty/new user) and `u2` (active user with data) from the sidebar
- **Empty States** — all sections gracefully handle zero-data scenarios (u1)
- **Skeleton Loaders** — shimmer placeholders shown during every API fetch
- **Feedback Modal** — multi-step form (rating, category, message) stored in `localStorage`; feedback history view included
- **Collapsible Sidebar** — toggle to icon-only mode; collapses fully on mobile with overlay
- **Responsive Design** — tested down to 360px wide
- **CSS Design Tokens** — every color, spacing value, radius, shadow, and transition is defined as a CSS variable in `globals.css`; no hardcoded values anywhere

---

## Project Structure

```
hintro-dashboard/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Router + UserProvider
    ├── api/
    │   └── index.js          # Centralised API calls (fetch wrappers)
    ├── hooks/
    │   ├── useFetch.js       # Generic async data hook
    │   └── useUser.jsx       # User context (u1 / u2)
    ├── utils/
    │   └── format.js         # formatDuration, formatDate, formatRelativeTime, etc.
    ├── styles/
    │   └── globals.css       # Design tokens + reset + keyframes
    ├── components/
    │   ├── Layout/           # App shell (sidebar + main area)
    │   ├── Sidebar/          # Navigation, user switcher, feedback trigger
    │   ├── Feedback/         # Multi-step feedback modal (localStorage)
    │   └── Common/           # Skeleton, Badge, Tag
    └── pages/
        ├── Dashboard.jsx/.css
        ├── CallHistory.jsx/.css
        └── Profile.jsx/.css
```

---

## Getting Started

### Prerequisites

- Node.js **18+** (LTS recommended)
- npm **9+** (comes with Node 18)

### Installation

```bash
# 1. Clone or unzip the project
cd hintro-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Production Build

```bash
npm run build      # outputs to dist/
npm run preview    # serves the built dist/ locally
```

---

## API

Base URL: `https://mock-backend-hintro.vercel.app`

| Endpoint                        | Description             |
|---------------------------------|-------------------------|
| `GET /api/auth/profile`         | User profile            |
| `GET /api/auth/dashboard`       | Dashboard data (subscription + usage) |
| `GET /api/call-sessions/stats`  | Call statistics         |
| `GET /api/call-sessions?limit=N`| Paginated call history  |

All requests pass `x-user-id: u1` or `x-user-id: u2` as a header.

---

## User States

| User | Behaviour |
|------|-----------|
| `u1` | All API responses return zero/null data — empty states are shown throughout the UI |
| `u2` | API responses return randomised realistic data on every call |

Switch users using the **U1 / U2** toggle in the sidebar. Every page refetches automatically on switch.

---

## Assumptions & Notes

- The Figma link in the brief requires a Figma account to inspect; the design was interpreted from the assignment PDF description and standard dashboard conventions.
- `vocab_terms` and `notes` limits are assumed to be 500 and 100 respectively as they are not specified in the API response.
- Duration values from the API are in **seconds**; they are formatted as `Xh Ym` or `Xm Ys` throughout the UI.
- Feedback is stored in `localStorage` under the key `hintro_feedback_list` as a JSON array.
- No third-party UI libraries, icon packs, or component frameworks are used — all components are hand-built.
