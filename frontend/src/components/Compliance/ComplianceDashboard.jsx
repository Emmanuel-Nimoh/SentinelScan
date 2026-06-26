import ComplianceChart from './ComplianceChart';
import PCIDSSRequirements from './PCIDSSRequirements';
import ReportGenerator from '../Reports/ReportGenerator';

export default function ComplianceDashboard({ scanId, target, overallCompliance, requirements }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900">PCI-DSS Compliance Report</h2>
        <p className="text-sm text-slate-500 mt-1 truncate">Scan target: {target}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-6">
        <ComplianceChart percentage={overallCompliance} />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">Overall Compliance</h3>
          <p className="text-sm text-slate-500">
            Based on {requirements.length} mapped PCI-DSS requirement{requirements.length === 1 ? '' : 's'}{' '}
            for this scan.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Requirement Status</h3>
        <PCIDSSRequirements requirements={requirements} />
      </div>

      <div className="flex justify-end">
        <ReportGenerator scanId={scanId} />
      </div>
    </div>
  );
}
