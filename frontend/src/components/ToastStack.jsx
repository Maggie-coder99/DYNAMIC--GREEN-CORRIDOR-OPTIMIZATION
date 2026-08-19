import { useSimulation } from '../context/SimulationContext.jsx';

export default function ToastStack() {
  const { toasts, dismissToast } = useSimulation();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[2000] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className="pointer-events-auto rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-left text-sm shadow-panel"
        >
          <p className="text-xs uppercase tracking-wide text-cyan-300">{t.type}</p>
          <p>{t.message}</p>
        </button>
      ))}
    </div>
  );
}
