const BASE_URL = 'https://mock-backend-hintro.vercel.app';

async function request(endpoint, userId) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'x-user-id': userId },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getProfile: (userId) => request('/api/auth/profile', userId),
  getDashboard: (userId) => request('/api/auth/dashboard', userId),
  getStats: (userId) => request('/api/call-sessions/stats', userId),
  getCallHistory: (userId, limit = 10) =>
    request(`/api/call-sessions?limit=${limit}`, userId),
};
