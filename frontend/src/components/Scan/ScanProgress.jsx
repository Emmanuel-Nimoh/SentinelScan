import { Loader2, Clock } from 'lucide-react';
import { formatScanType } from '../../utils/formatters';

export default function ScanProgress({ target, scanType }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center gap-4">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-blue-900 truncate">
          {formatScanType(scanType)} in progress for {target}
        </p>
        <p className="text-sm text-blue-700 flex items-center gap-1.5 mt-1">
          <Clock className="w-4 h-4" />
          Refreshing automatically every 5 seconds. This can take 5-15 minutes.
        </p>
      </div>
    </div>
  );
}
