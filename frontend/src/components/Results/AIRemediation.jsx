import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, AlertTriangle } from 'lucide-react';
import { getAIRemediation, getApiErrorMessage } from '../../services/api';

// Effort badge coloring, matching the app's severity palette conventions.
const EFFORT_STYLES = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-700',
};

// On-demand AI remediation guidance for one vulnerability. Calls
// POST /api/ai/remediation/<id> and renders the structured response
// (summary, steps, code example, references, effort). Degrades gracefully
// when the backend AI feature isn't configured (503) or the call fails (502).
export default function AIRemediation({ vulnerabilityId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAIRemediation(vulnerabilityId);
      setData(response.data.remediation);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(data?.code_example || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="border-t border-slate-200 pt-5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          AI Remediation
        </h4>
        <button
          type="button"
          onClick={generate}
          disabled={loading || !vulnerabilityId}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {loading ? 'Generating...' : data ? 'Regenerate' : 'Generate AI guidance'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!data && !error && !loading && (
        <p className="text-sm text-slate-500">
          Generate contextual, step-by-step remediation guidance for this finding using AI.
        </p>
      )}

      {data && (
        <div className="space-y-4">
          {data.summary && <p className="text-sm text-slate-700">{data.summary}</p>}

          {data.steps?.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Steps</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                {data.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {data.code_example && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Example</h5>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-sm bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono">
                {data.code_example}
              </pre>
            </div>
          )}

          {data.references?.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">References</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                {data.references.map((ref, index) => (
                  <li key={index}>{ref}</li>
                ))}
              </ul>
            </div>
          )}

          {data.effort && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Effort</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  EFFORT_STYLES[data.effort] || 'bg-slate-100 text-slate-600'
                }`}
              >
                {data.effort}
              </span>
            </div>
          )}

          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-generated guidance — review before applying.
          </p>
        </div>
      )}
    </div>
  );
}
