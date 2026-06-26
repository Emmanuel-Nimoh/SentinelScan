import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { SeverityBadge } from '../Common/Badge';

export default function ResultsDetail({ vulnerability }) {
  const [copied, setCopied] = useState(false);

  if (!vulnerability) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(vulnerability.remediation || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{vulnerability.title}</h3>
        <SeverityBadge severity={vulnerability.severity} />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</h4>
        <p className="text-sm text-slate-700">{vulnerability.description}</p>
      </div>

      {vulnerability.affectedComponent && (
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Affected Component
          </h4>
          <p className="text-sm text-slate-700">{vulnerability.affectedComponent}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {vulnerability.cvssScore != null && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">CVSS Score</h4>
            <p className="text-sm text-slate-700">{vulnerability.cvssScore}</p>
          </div>
        )}
        {vulnerability.cveId && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">CVE</h4>
            <p className="text-sm text-slate-700">{vulnerability.cveId}</p>
          </div>
        )}
      </div>

      {vulnerability.remediation && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Remediation</h4>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Remediation'}
            </button>
          </div>
          <pre className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap font-mono">
            {vulnerability.remediation}
          </pre>
        </div>
      )}

      {vulnerability.pciDssRefs?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Related PCI-DSS Requirements
          </h4>
          <div className="flex flex-wrap gap-2">
            {vulnerability.pciDssRefs.map((ref) => (
              <span
                key={ref}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
