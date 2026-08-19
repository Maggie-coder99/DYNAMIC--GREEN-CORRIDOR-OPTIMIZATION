import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Siren } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const DEMOS = [
  { email: 'operator@corridor.demo', password: 'demo123', role: 'emergency_operator', label: 'Emergency operator' },
  { email: 'traffic@corridor.demo', password: 'demo123', role: 'traffic_control', label: 'Traffic control' },
  { email: 'admin@corridor.demo', password: 'demo123', role: 'administrator', label: 'Administrator' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('operator@corridor.demo');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState('emergency_operator');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login({ email, password, role });
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <Siren className="h-4 w-4 text-pulse-red" /> Pulse Corridor
        </Link>
        <form onSubmit={submit} className="card p-6">
          <h1 className="text-2xl font-semibold">Operator sign-in</h1>
          <p className="mt-1 text-sm text-slate-400">Demo authentication — replace with SSO later.</p>
          {error && <p className="mt-3 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">{error}</p>}
          <label className="mt-4 block text-sm">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
          <label className="mt-3 block text-sm">
            Password
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>
          <label className="mt-3 block text-sm">
            Role
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="emergency_operator">Emergency operator</option>
              <option value="traffic_control">Traffic control</option>
              <option value="administrator">Administrator</option>
            </select>
          </label>
          <button className="btn-primary mt-5 w-full" disabled={busy} type="submit">
            {busy ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <div className="mt-4 card p-4 text-sm">
          <p className="font-medium">Demo login</p>
          <div className="mt-2 space-y-2">
            {DEMOS.map((d) => (
              <button
                key={d.role}
                type="button"
                className="btn-ghost w-full justify-between"
                onClick={async () => {
                  setEmail(d.email);
                  setPassword(d.password);
                  setRole(d.role);
                  setBusy(true);
                  setError('');
                  try {
                    await login({ email: d.email, password: d.password });
                    navigate('/app');
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <span>{d.label}</span>
                <span className="text-xs text-slate-400">{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
