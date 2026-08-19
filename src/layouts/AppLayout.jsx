import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Activity,
  Ambulance,
  BarChart3,
  Bell,
  Building2,
  History,
  LayoutDashboard,
  Map,
  Radio,
  Settings,
  Siren,
  TrafficCone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSimulation } from '../context/SimulationContext.jsx';
import ToastStack from '../components/ToastStack.jsx';

const LINKS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/emergency', label: 'Emergency Control', icon: Siren },
  { to: '/app/map', label: 'Live Map', icon: Map },
  { to: '/app/ambulances', label: 'Ambulances', icon: Ambulance },
  { to: '/app/hospitals', label: 'Hospitals', icon: Building2 },
  { to: '/app/signals', label: 'Traffic Signals', icon: TrafficCone },
  { to: '/app/history', label: 'Trip History', icon: History },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { state, error } = useSimulation();
  const navigate = useNavigate();
  const live = Boolean(state?.simulation?.running && !state?.simulation?.paused);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-ink-900/90 p-4 md:flex md:flex-col">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pulse-red">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pulse Corridor</p>
            <p className="font-semibold">Green Corridor</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-4 px-2 text-[11px] leading-relaxed text-slate-500">
          Academic simulation. Does not control real traffic infrastructure.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <nav className="flex gap-2 overflow-x-auto border-b border-white/10 px-3 py-2 md:hidden">
          {LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1 text-xs ${isActive ? 'bg-pulse-red text-white' : 'bg-white/5 text-slate-300'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-ink-900/70 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Activity className={`h-4 w-4 ${live ? 'text-emerald-400' : 'text-slate-500'}`} />
            <div>
              <p className="text-sm font-medium">System {live ? 'LIVE' : 'STANDBY'}</p>
              <p className="text-xs text-slate-400">Simulation / Demo Data</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-slate-300 sm:inline-flex">
              <Bell className="h-4 w-4" />
              {state?.notifications?.length || 0}
            </span>
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs capitalize text-slate-400">{user?.role?.replaceAll('_', ' ')}</p>
            </div>
            <button
              className="btn-ghost"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sign out
            </button>
          </div>
        </header>
        {error && (
          <div className="border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</div>
        )}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <ToastStack />
    </div>
  );
}
