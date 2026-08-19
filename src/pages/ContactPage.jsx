import { useState } from 'react';
import SiteChrome from '../components/SiteChrome.jsx';
import { api } from '../services/api.js';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'demo', message: '' });
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus('');
    try {
      const res = await api('/api/contact', { method: 'POST', body: form });
      setStatus(res.message);
      setForm({ name: '', email: '', topic: 'demo', message: '' });
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteChrome>
      <section className="mx-auto max-w-xl px-6 pb-16">
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-2 text-sm text-slate-400">Messages are stored in the demo inbox. This is not a live 112/911 service.</p>
        <form onSubmit={submit} className="card mt-6 space-y-3 p-5">
          <label className="block text-sm">
            Name
            <input className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" required value={form.name} onChange={(e) => set('name', e.target.value)} />
          </label>
          <label className="block text-sm">
            Email
            <input type="email" className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" required value={form.email} onChange={(e) => set('email', e.target.value)} />
          </label>
          <label className="block text-sm">
            Topic
            <select className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" value={form.topic} onChange={(e) => set('topic', e.target.value)}>
              <option value="demo">Request a demo walkthrough</option>
              <option value="bug">Report a bug</option>
              <option value="partnership">College / project question</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="block text-sm">
            Message
            <textarea className="mt-1 min-h-28 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" required minLength={10} value={form.message} onChange={(e) => set('message', e.target.value)} />
          </label>
          <button className="btn-primary w-full" disabled={busy} type="submit">
            {busy ? 'Sending…' : 'Send message'}
          </button>
          {status && <p className="text-sm text-cyan-200">{status}</p>}
        </form>
      </section>
    </SiteChrome>
  );
}
