import { Link } from 'react-router-dom';

export default function HelpPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Operator help</h1>
      <div className="card space-y-3 p-5 text-sm text-slate-300">
        <p>1. Click Start Demo Emergency on the dashboard.</p>
        <p>2. Watch SIGNAL units switch to emergency green as AMB-001 approaches.</p>
        <p>3. After about 18 seconds a congestion spike may suggest an alternative route — use Switch Route.</p>
        <p>4. Traffic Control can override signals on the Traffic Signals page.</p>
        <p>5. Administrators can register ambulances and update hospital beds.</p>
      </div>
      <div className="flex gap-2">
        <Link to="/app/emergency" className="btn-primary">Go to dispatch</Link>
        <Link to="/faq" className="btn-ghost">Public FAQ</Link>
      </div>
    </div>
  );
}
