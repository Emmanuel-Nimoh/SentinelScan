import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Loader2 } from 'lucide-react';
import { startWebAPIScan, startDependencyScan, getApiErrorMessage } from '../../services/api';
import { getURLError, getRepoURLError } from '../../utils/validators';
import { SCAN_DEPTH_OPTIONS, PACKAGE_TYPE_OPTIONS } from '../../services/constants';

const INITIAL_API_FORM = { url: '', scanDepth: 'quick', includeSubdomains: false };
const INITIAL_DEPENDENCY_FORM = { repoUrl: '', packageType: 'auto', includeTransitive: true };

// Render this with key={scanType} from the parent page so the form state
// resets cleanly when the user switches between Web API and Dependency scans.
export default function ScanForm({ scanType }) {
  const isDependency = scanType === 'dependency';
  const navigate = useNavigate();

  const [formData, setFormData] = useState(isDependency ? INITIAL_DEPENDENCY_FORM : INITIAL_API_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const validationError = isDependency
      ? getRepoURLError(formData.repoUrl)
      : getURLError(formData.url);

    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const response = isDependency
        ? await startDependencyScan(formData.repoUrl, formData.packageType, formData.includeTransitive)
        : await startWebAPIScan(formData.url, formData.scanDepth, formData.includeSubdomains);

      const scanId = response.data?.scan_id ?? response.data?.scanId ?? response.data?.id;
      if (!scanId) throw new Error('The server did not return a scan ID.');

      navigate(`/results/${scanId}`);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      {isDependency ? (
        <div>
          <label htmlFor="repoUrl" className="block text-sm font-medium text-slate-700 mb-1.5">
            GitHub Repository URL <span className="text-red-500">*</span>
          </label>
          <input
            id="repoUrl"
            type="text"
            value={formData.repoUrl}
            onChange={handleChange('repoUrl')}
            placeholder="https://github.com/owner/repo"
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ) : (
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1.5">
            Target URL <span className="text-red-500">*</span>
          </label>
          <input
            id="url"
            type="text"
            value={formData.url}
            onChange={handleChange('url')}
            placeholder="https://api.example.com"
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}

      {isDependency ? (
        <div>
          <label htmlFor="packageType" className="block text-sm font-medium text-slate-700 mb-1.5">
            Package Type
          </label>
          <select
            id="packageType"
            value={formData.packageType}
            onChange={handleChange('packageType')}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {PACKAGE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label htmlFor="scanDepth" className="block text-sm font-medium text-slate-700 mb-1.5">
            Scan Depth
          </label>
          <select
            id="scanDepth"
            value={formData.scanDepth}
            onChange={handleChange('scanDepth')}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {SCAN_DEPTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={isDependency ? formData.includeTransitive : formData.includeSubdomains}
          onChange={handleChange(isDependency ? 'includeTransitive' : 'includeSubdomains')}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        {isDependency ? 'Include Transitive Dependencies' : 'Include Subdomains'}
      </label>

      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg p-3.5 text-sm text-blue-800">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          {isDependency
            ? 'Analyzes all dependencies for known vulnerabilities (CVEs).'
            : 'Scans typically complete in 5-15 minutes.'}
        </p>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3.5 text-sm">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Starting Scan...' : 'Start Scan'}
      </button>
    </form>
  );
}
