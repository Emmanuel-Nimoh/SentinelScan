// Formatting helpers for dates, severities, and scan metadata.
export function formatSeverity(severity) {
  const map = {
    critical: { label: 'CRITICAL', bg: 'bg-red-600' },
    high: { label: 'HIGH', bg: 'bg-orange-600' },
    medium: { label: 'MEDIUM', bg: 'bg-yellow-500' },
    low: { label: 'LOW', bg: 'bg-green-600' },
  };
  return map[severity?.toLowerCase()] || { label: 'UNKNOWN', bg: 'bg-gray-500' };
}

export function formatDate(isoString) {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatScanType(scanType) {
  return scanType === 'dependency' ? 'Dependency Scan' : 'Web API Scan';
}

export function formatStatus(status) {
  const map = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    failed: 'Failed',
  };
  return map[status] || 'Unknown';
}

export function truncateText(text, maxLength = 60) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export function formatRiskScore(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return 'N/A';
  return `${Math.round(score)}/100`;
}
