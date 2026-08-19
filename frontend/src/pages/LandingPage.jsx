import { Link } from 'react-router-dom';
import { Activity, ArrowRight, MapPinned, ShieldAlert, Siren, TimerReset, TrafficCone } from 'lucide-react';

const FEATURES = [
  { icon: MapPinned, title: 'Live corridor map', text: 'Track ambulance, hospitals, signals, and traffic bands on a professional operations map.' },
  { icon: Activity, title: 'Dynamic routing', text: 'Score routes on time, density, signal delay, and distance — not just shortest path.' },
  { icon: TrafficCone, title: 'Sequential green corridor', text: 'Signals turn emergency-green only as the ambulance approaches, then return to cycle.' },
  { icon: TimerReset, title: 'Recalculation', text: 'When congestion spikes, operators get an alternative route with ETA comparison.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pulse-red">
            <Siren className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Pulse Corridor</p>
            <p className="font-semibold">Dynamic Green Corridor Optimization</p>
          </div>
        </div>
        <Link to="/login" className="btn-ghost">
          Operator login
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-cyan-300">Academic emergency traffic simulation</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            Give the ambulance a moving corridor — not a static shortest path.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Pulse Corridor is a software prototype that scores competing routes under simulated traffic, then
            coordinates signal priority in sequence so an emergency vehicle can move through a city grid faster.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="btn-ghost">
              How it works
            </a>
          </div>
          <p className="mt-6 max-w-xl text-xs leading-relaxed text-slate-500">
            This project is an academic software simulation and does not directly control real-world traffic
            infrastructure. Traffic conditions, ambulance movement, and signal behavior are simulated.
          </p>
        </div>
        <div className="card relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(225,29,46,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.2),transparent_35%)]" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <span>AMB-001 · CRITICAL</span>
              <span className="text-emerald-400">Corridor ACTIVE</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['SIG-01 GREEN', 'SIG-02 GREEN', 'SIG-03 HOLD', 'SIG-04 QUEUE'].map((s, i) => (
                <div key={s} className={`rounded-lg border border-white/10 p-3 text-center text-xs ${i < 2 ? 'bg-emerald-500/15' : 'bg-white/5'}`}>
                  {s}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-dashed border-cyan-400/40 bg-cyan-400/5 p-4 text-sm">
              Route A 08:12 → congestion spike → Route B recommended 06:40 · save 01:32
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Simulation / Demo Data overlay on OpenStreetMap tiles
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold">Built for dispatch, not for a slide deck</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5">
              <Icon className="h-5 w-5 text-cyan-300" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-5">
          {[
            'Create emergency',
            'Score routes',
            'Activate corridor',
            'Move ambulance',
            'Recalculate if traffic shifts',
          ].map((step, i) => (
            <li key={step} className="card p-4">
              <p className="text-xs text-slate-500">0{i + 1}</p>
              <p className="mt-2 font-medium">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold">Technology</h2>
        <p className="mt-3 max-w-3xl text-slate-400">
          React + Vite client, Express API, rule-based optimizer, Leaflet map (Carto dark tiles by default; Mapbox
          optional via environment variables). PostgreSQL schema included; the demo runs on a seeded in-memory store
          so it presents cleanly on a laptop.
        </p>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        Pulse Corridor · Dynamic Green Corridor Optimization for Ambulance · College / portfolio prototype
      </footer>
    </div>
  );
}
