// Severity-to-color mapping shared across vulnerability and compliance views.
export const SEVERITY_COLORS = {
  critical: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-600', ring: 'ring-red-600', dot: 'bg-red-600', hex: '#dc2626' },
  high: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-600', ring: 'ring-orange-600', dot: 'bg-orange-600', hex: '#ea580c' },
  medium: { bg: 'bg-yellow-500', text: 'text-white', border: 'border-yellow-500', ring: 'ring-yellow-500', dot: 'bg-yellow-500', hex: '#eab308' },
  low: { bg: 'bg-green-600', text: 'text-white', border: 'border-green-600', ring: 'ring-green-600', dot: 'bg-green-600', hex: '#16a34a' },
  unknown: { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500', ring: 'ring-gray-500', dot: 'bg-gray-500', hex: '#6b7280' },
};

export function getSeverityColor(severity) {
  return SEVERITY_COLORS[severity?.toLowerCase()] || SEVERITY_COLORS.unknown;
}

// Risk score (0-100) buckets reuse the severity palette for visual consistency.
export function getRiskColor(score) {
  if (score >= 75) return SEVERITY_COLORS.critical;
  if (score >= 50) return SEVERITY_COLORS.high;
  if (score >= 25) return SEVERITY_COLORS.medium;
  return SEVERITY_COLORS.low;
}

export function getComplianceColor(status) {
  return status === 'compliant'
    ? { bg: 'bg-green-600', text: 'text-white', soft: 'bg-green-50 text-green-700 border-green-200' }
    : { bg: 'bg-red-600', text: 'text-white', soft: 'bg-red-50 text-red-700 border-red-200' };
}
