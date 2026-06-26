import { formatSeverity } from '../../utils/formatters';

const COLOR_MAP = {
  red: 'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  gray: 'bg-gray-100 text-gray-700',
};

const SIZE_MAP = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export default function Badge({ children, color = 'gray', size = 'md', className = '' }) {
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${COLOR_MAP[color] || COLOR_MAP.gray} ${SIZE_MAP[size] || SIZE_MAP.md} ${className}`}
    >
      {children}
    </span>
  );
}

// Specialized badge for vulnerability severity, colored per the SentinelScan palette.
export function SeverityBadge({ severity, size = 'md' }) {
  const { label, bg } = formatSeverity(severity);
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full text-white ${bg} ${SIZE_MAP[size] || SIZE_MAP.md}`}
    >
      {label}
    </span>
  );
}
