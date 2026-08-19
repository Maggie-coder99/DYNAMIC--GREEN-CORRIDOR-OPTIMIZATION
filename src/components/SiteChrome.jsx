import { Link } from 'react-router-dom';
import { Siren } from 'lucide-react';

export default function SiteChrome({ children }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pulse-red">
            <Siren className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Pulse Corridor</p>
            <p className="font-semibold">Emergency traffic simulation</p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link to="/about" className="btn-ghost">About</Link>
          <Link to="/faq" className="btn-ghost">FAQ</Link>
          <Link to="/contact" className="btn-ghost">Contact</Link>
          <Link to="/login" className="btn-ghost">Login</Link>
        </nav>
      </header>
      {children}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        Pulse Corridor · academic simulation · does not control real traffic signals ·{' '}
        <Link className="text-cyan-300" to="/contact">Contact</Link>
      </footer>
    </div>
  );
}
