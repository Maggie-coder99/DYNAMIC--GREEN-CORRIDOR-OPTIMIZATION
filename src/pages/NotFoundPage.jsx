import { Link } from 'react-router-dom';
import SiteChrome from '../components/SiteChrome.jsx';

export default function NotFoundPage() {
  return (
    <SiteChrome>
      <section className="mx-auto max-w-lg px-6 pb-20 text-center">
        <p className="text-sm text-slate-500">404</p>
        <h1 className="mt-2 text-3xl font-semibold">This page is not on the corridor</h1>
        <p className="mt-3 text-slate-400">The URL does not match a public page or dashboard route.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to home
        </Link>
      </section>
    </SiteChrome>
  );
}
