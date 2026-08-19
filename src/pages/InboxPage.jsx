import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function InboxPage() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'administrator') return;
    api('/api/messages', { token })
      .then((d) => setMessages(d.messages || []))
      .catch((e) => setError(e.message));
  }, [token, user]);

  if (user?.role !== 'administrator') {
    return <p className="text-slate-400">Inbox is available to administrators.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Contact inbox</h1>
      {error && <p className="text-red-300">{error}</p>}
      {!messages.length && <p className="text-slate-400">No messages yet. The public Contact form writes here.</p>}
      {messages.map((m) => (
        <article key={m.id} className="card p-4">
          <p className="font-medium">{m.name} · {m.email}</p>
          <p className="text-xs text-slate-500">{m.topic} · {new Date(m.at).toLocaleString()}</p>
          <p className="mt-2 text-sm text-slate-300">{m.message}</p>
        </article>
      ))}
    </div>
  );
}
