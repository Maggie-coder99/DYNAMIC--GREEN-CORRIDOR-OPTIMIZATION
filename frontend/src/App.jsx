import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { SimulationProvider } from './context/SimulationContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EmergencyPage from './pages/EmergencyPage.jsx';
import LiveMapPage from './pages/LiveMapPage.jsx';
import AmbulancesPage from './pages/AmbulancesPage.jsx';
import HospitalsPage from './pages/HospitalsPage.jsx';
import SignalsPage from './pages/SignalsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function Protected({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <SimulationProvider>{children}</SimulationProvider>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
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
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
