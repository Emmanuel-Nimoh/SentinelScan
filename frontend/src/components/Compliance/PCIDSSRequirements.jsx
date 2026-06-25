import ComplianceCard from './ComplianceCard';

export default function PCIDSSRequirements({ requirements = [] }) {
  if (requirements.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
        No PCI-DSS requirement data available for this scan yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requirements.map((req) => (
        <div key={req.requirementId}>
          <ComplianceCard {...req} />
          {req.status !== 'compliant' && req.findings?.length > 0 && (
            <ul className="mt-2 ml-8 space-y-1 list-disc text-sm text-slate-600">
              {req.findings.map((finding, index) => (
                <li key={finding.id ?? index}>{finding.title ?? finding}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
