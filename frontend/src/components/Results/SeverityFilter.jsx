import { SEVERITY_LEVELS } from '../../services/constants';
import { getSeverityColor } from '../../utils/colors';

export default function SeverityFilter({ counts = {}, selected = [], onChange }) {
  const isAllSelected = selected.length === 0;

  const toggle = (severity) => {
    if (selected.includes(severity)) {
      onChange(selected.filter((item) => item !== severity));
    } else {
      onChange([...selected, severity]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange([])}
        className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
          isAllSelected
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
        }`}
      >
        All
      </button>
      {SEVERITY_LEVELS.map((severity) => {
        const color = getSeverityColor(severity);
        const active = selected.includes(severity);
        return (
          <button
            key={severity}
            type="button"
            onClick={() => toggle(severity)}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors capitalize ${
              active ? `${color.bg} text-white border-transparent` : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${active ? 'bg-white' : color.dot}`} />
            {severity}
            <span className="opacity-75">{counts[severity] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
