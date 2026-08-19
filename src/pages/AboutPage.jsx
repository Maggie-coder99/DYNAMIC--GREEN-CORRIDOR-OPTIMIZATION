import SiteChrome from '../components/SiteChrome.jsx';

export default function AboutPage() {
  return (
    <SiteChrome>
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h1 className="text-3xl font-semibold">About Pulse Corridor</h1>
        <p className="mt-4 text-slate-300">
          Pulse Corridor is a college and portfolio web application that demonstrates how software can reduce ambulance
          travel time by scoring routes under traffic and sequencing traffic-signal priority.
        </p>
        <h2 className="mt-8 text-xl font-semibold">What it is</h2>
        <p className="mt-2 text-slate-400">
          A working operations console: dispatch an ambulance, watch it move, see signals turn emergency-green only as
          the vehicle approaches, and switch routes when congestion appears.
        </p>
        <h2 className="mt-8 text-xl font-semibold">What it is not</h2>
        <p className="mt-2 text-slate-400">
          It does not control municipal traffic cabinets, CAD, or real ambulances. All traffic, GPS, and signals are
          labeled Simulation / Demo Data.
        </p>
      </section>
    </SiteChrome>
  );
}
