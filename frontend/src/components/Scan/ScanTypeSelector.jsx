import { Link } from 'react-router-dom';
import { Globe, Package } from 'lucide-react';

const TYPES = [
  { type: 'api', label: 'Web API Scan', icon: Globe, to: '/scan/api' },
  { type: 'dependency', label: 'Dependency Scan', icon: Package, to: '/scan/dependency' },
];

export default function ScanTypeSelector({ activeType }) {
  return (
    <div className="inline-flex bg-slate-100 rounded-lg p-1 gap-1">
      {TYPES.map(({ type, label, icon: Icon, to }) => (
        <Link
          key={type}
          to={to}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeType === type
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}
