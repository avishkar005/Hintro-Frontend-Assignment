import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './hooks/useUser';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CallHistory from './pages/CallHistory';
import Profile from './pages/Profile';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calls" element={<CallHistory />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
