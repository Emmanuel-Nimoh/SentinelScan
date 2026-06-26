import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useScan } from '../hooks/useScan';
import { usePolling } from '../hooks/usePolling';
import { normalizeScan } from '../utils/normalize';
import { formatDate, formatScanType, formatStatus, formatRiskScore } from '../utils/formatters';
import { getRiskColor } from '../utils/colors';
import { SEVERITY_LEVELS, POLL_INTERVAL_MS } from '../services/constants';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Modal from '../components/Common/Modal';
import ScanProgress from '../components/Scan/ScanProgress';
import VulnerabilityList from '../components/Results/VulnerabilityList';
import ResultsDetail from '../components/Results/ResultsDetail';
import ReportGenerator from '../components/Reports/ReportGenerator';

export default function ResultsPage() {
  const { scan_id: scanId } = useParams();
  const { scan: rawScan, loading, error, fetchScan } = useScan(scanId);
  const [selectedVuln, setSelectedVuln] = useState(null);

  const scan = useMemo(() => normalizeScan(rawScan), [rawScan]);

  usePolling(fetchScan, scan?.status === 'in_progress', POLL_INTERVAL_MS);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading scan results..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
        No scan data found for this ID.
      </div>
    );
  }

  const riskColor = getRiskColor(scan.riskScore);
  const severityCounts = scan.vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {formatScanType(scan.scanType)}
            </p>
            <h1 className="text-xl font-bold text-slate-900 truncate" title={scan.target}>
              {scan.target}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {formatStatus(scan.status)} &middot; {formatDate(scan.timestamp)}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg text-center ${riskColor.bg} ${riskColor.text}`}>
            <p className="text-xs uppercase tracking-wide opacity-90">Risk Score</p>
            <p className="text-lg font-bold">{formatRiskScore(scan.riskScore)}</p>
          </div>
        </div>
      </div>

      {scan.status === 'in_progress' && <ScanProgress target={scan.target} scanType={scan.scanType} />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SEVERITY_LEVELS.map((severity) => (
          <div key={severity} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{severityCounts[severity] || 0}</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{severity}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Vulnerabilities</h2>
        <VulnerabilityList vulnerabilities={scan.vulnerabilities} onSelect={setSelectedVuln} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl border border-slate-200 p-6">
        <Link
          to={`/compliance/${scanId}`}
          className="inline-flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-700"
        >
          View PCI-DSS Compliance Report
          <ArrowRight className="w-4 h-4" />
        </Link>
        <ReportGenerator scanId={scanId} label="Export PDF" />
      </div>

      <Modal isOpen={!!selectedVuln} onClose={() => setSelectedVuln(null)} title="Vulnerability Detail">
        <ResultsDetail vulnerability={selectedVuln} />
      </Modal>
    </div>
  );
}
