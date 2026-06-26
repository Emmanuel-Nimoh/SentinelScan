import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, Plus } from 'lucide-react';
import { APP_NAME } from '../../services/constants';

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            <span className="text-lg font-bold text-slate-900">{APP_NAME}</span>
          </Link>
        </div>

        <Link
          to="/scan/api"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Scan</span>
        </Link>
      </div>
    </header>
  );
}
