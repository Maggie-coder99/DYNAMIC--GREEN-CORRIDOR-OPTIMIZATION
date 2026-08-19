import SiteChrome from '../components/SiteChrome.jsx';

const QA = [
  ['Do I need a Mapbox or Google Maps key?', 'No. The map uses OpenStreetMap / CARTO tiles so the demo runs on a laptop.'],
  ['Is this live city traffic?', 'No. Densities and queues are simulated and change during the demo trip.'],
  ['How do I start it?', 'In the project folder run npm install then npm run dev. Open http://localhost:5173.'],
  ['Who can log in?', 'Demo accounts: operator@corridor.demo, traffic@corridor.demo, admin@corridor.demo — password demo123.'],
  ['Can I dispatch any ambulance?', 'Available units can be dispatched. Maintenance units are blocked. The demo button always uses AMB-001.'],
];

export default function FaqPage() {
  return (
    <SiteChrome>
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h1 className="text-3xl font-semibold">FAQ</h1>
        <div className="mt-6 space-y-4">
          {QA.map(([q, a]) => (
            <article key={q} className="card p-5">
              <h2 className="font-semibold">{q}</h2>
              <p className="mt-2 text-sm text-slate-400">{a}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
