import { priorityTone } from '../utils/format.js';

export default function StatusBadge({ children, tone }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${tone || priorityTone(children)}`}>
      {children}
    </span>
  );
}
