import { Link } from 'react-router-dom';
import { Globe, Package, ArrowRight } from 'lucide-react';
import { formatDate, formatScanType, formatStatus } from '../../utils/formatters';
import { getRiskColor } from '../../utils/colors';

const STATUS_STYLES = {
  pending: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function ScanCard({
  scanId,
  target,
  scanType,
  riskScore,
  vulnerabilityCount,
  timestamp,
  status,
}) {
  const Icon = scanType === 'dependency' ? Package : Globe;
  const riskColor = getRiskColor(riskScore ?? 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate" title={target}>
              {target}
            </p>
            <p className="text-xs text-slate-400">{formatScanType(scanType)}</p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
            STATUS_STYLES[status] || STATUS_STYLES.pending
          }`}
        >
          {formatStatus(status)}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-500">Risk Score</span>
          <span className="font-semibold text-slate-900">{riskScore ?? 0}/100</span>
        </div>
        <div className="risk-bar-track h-2">
          <div
            className="risk-bar-fill"
            style={{ width: `${riskScore ?? 0}%`, backgroundColor: riskColor.hex }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{vulnerabilityCount ?? 0} vulnerabilities</span>
        <span>{formatDate(timestamp)}</span>
      </div>

      <Link
        to={`/results/${scanId}`}
        className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg py-2 transition-colors"
      >
        View Results <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
