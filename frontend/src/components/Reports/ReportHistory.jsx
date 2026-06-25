import { FileText } from 'lucide-react';
import { formatDate, formatScanType } from '../../utils/formatters';
import ReportGenerator from './ReportGenerator';

export default function ReportHistory({ scans = [] }) {
  const completedScans = scans.filter((scan) => scan.status === 'completed');

  if (completedScans.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
        No completed scans available for report generation yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
      {completedScans.map((scan) => (
        <div key={scan.scanId} className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{scan.target}</p>
              <p className="text-xs text-slate-500">
                {formatScanType(scan.scanType)} &middot; {formatDate(scan.timestamp)}
              </p>
            </div>
          </div>
          <ReportGenerator scanId={scan.scanId} label="PDF" />
        </div>
      ))}
    </div>
  );
}
