import { Activity, ShieldAlert, FileWarning, Clock } from 'lucide-react';

export default function RiskSummary({ scans = [] }) {
  const totalScans = scans.length;
  const completed = scans.filter((scan) => scan.status === 'completed');
  const avgRisk = completed.length
    ? Math.round(completed.reduce((sum, scan) => sum + (scan.riskScore || 0), 0) / completed.length)
    : 0;
  const totalVulnerabilities = scans.reduce((sum, scan) => sum + (scan.vulnerabilityCount || 0), 0);
  const inProgress = scans.filter((scan) => scan.status === 'in_progress').length;

  const stats = [
    { label: 'Total Scans', value: totalScans, icon: Activity, color: 'text-blue-600 bg-blue-50' },
    {
      label: 'Avg Risk Score',
      value: `${avgRisk}/100`,
      icon: ShieldAlert,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'Vulnerabilities Found',
      value: totalVulnerabilities,
      icon: FileWarning,
      color: 'text-red-600 bg-red-50',
    },
    { label: 'Scans In Progress', value: inProgress, icon: Clock, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
        >
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
