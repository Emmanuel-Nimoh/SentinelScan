import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { getComplianceReport, getApiErrorMessage } from '../services/api';
import { normalizeComplianceRequirement } from '../utils/normalize';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ComplianceDashboard from '../components/Compliance/ComplianceDashboard';

export default function CompliancePage() {
  const { scan_id: scanId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchReport() {
      setLoading(true);
      setError(null);
      try {
        const response = await getComplianceReport(scanId);
        const data = response.data || {};
        if (isMounted) {
          setReport({
            target: data.target ?? data.url ?? data.repo_url ?? '',
            overallCompliance: data.overall_compliance ?? data.overallCompliance ?? 0,
            requirements: (data.requirements || []).map(normalizeComplianceRequirement),
          });
        }
      } catch (err) {
        if (isMounted) setError(getApiErrorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [scanId]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading compliance report..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ComplianceDashboard
        scanId={scanId}
        target={report.target}
        overallCompliance={report.overallCompliance}
        requirements={report.requirements}
      />
    </div>
  );
}
