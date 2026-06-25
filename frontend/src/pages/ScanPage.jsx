import { useParams, Navigate } from 'react-router-dom';
import ScanTypeSelector from '../components/Scan/ScanTypeSelector';
import ScanForm from '../components/Scan/ScanForm';

export default function ScanPage() {
  const { type } = useParams();

  if (type !== 'api' && type !== 'dependency') {
    return <Navigate to="/scan/api" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Scan</h1>
        <p className="text-slate-500 mt-1">
          Configure and launch a {type === 'dependency' ? 'dependency' : 'web API'} scan.
        </p>
      </div>
      <ScanTypeSelector activeType={type} />
      <ScanForm key={type} scanType={type} />
    </div>
  );
}
