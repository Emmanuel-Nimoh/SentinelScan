import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <ShieldOff className="w-16 h-16 text-slate-300 mb-4" />
      <h1 className="text-3xl font-bold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 mb-6">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
