import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

export default function ComplianceCard({ requirementId, requirementTitle, status, findingCount, onClick }) {
  const isCompliant = status === 'compliant';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full flex items-center justify-between gap-4 p-4 rounded-lg border text-left transition-colors ${
        isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      } ${onClick ? 'hover:shadow-sm cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {isCompliant ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        )}
        <div>
          <p className="font-semibold text-slate-900">
            {requirementId} {requirementTitle}
          </p>
          <p className={`text-sm mt-0.5 ${isCompliant ? 'text-green-700' : 'text-red-700'}`}>
            {isCompliant ? 'Compliant' : `${findingCount} Finding${findingCount === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>
      {onClick && <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
    </button>
  );
}
