import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, Package, History, ShieldCheck, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/scan/api', label: 'Web API Scan', icon: Globe },
  { to: '/scan/dependency', label: 'Dependency Scan', icon: Package },
  { to: '/history', label: 'Scan History', icon: History },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          role="presentation"
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-0 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 h-16 lg:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span className="font-bold">Menu</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
          PCI-DSS aware scanning for financial organizations
        </div>
      </aside>
    </>
  );
}
