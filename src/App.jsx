import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { SimulationProvider } from './context/SimulationContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EmergencyPage from './pages/EmergencyPage.jsx';
import LiveMapPage from './pages/LiveMapPage.jsx';
import AmbulancesPage from './pages/AmbulancesPage.jsx';
import HospitalsPage from './pages/HospitalsPage.jsx';
import SignalsPage from './pages/SignalsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import InboxPage from './pages/InboxPage.jsx';

const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'));

function PageFallback() {
  return <div className="p-6 text-sm text-slate-400">Loading…</div>;
}

function Protected({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <SimulationProvider>{children}</SimulationProvider>;
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading…</div>}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/app"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="map" element={<LiveMapPage />} />
        <Route path="ambulances" element={<AmbulancesPage />} />
        <Route path="hospitals" element={<HospitalsPage />} />
        <Route path="signals" element={<SignalsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<PageFallback />}>
              <AnalyticsPage />
            </Suspense>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="inbox" element={<InboxPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </Suspense>
  );
}
