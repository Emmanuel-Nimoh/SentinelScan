import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Package, FileBarChart, ArrowRight } from 'lucide-react';
import { getScanHistory, getApiErrorMessage } from '../../services/api';
import { extractList, normalizeScan } from '../../utils/normalize';
import LoadingSpinner from '../Common/LoadingSpinner';
import ScanCard from './ScanCard';
import RiskSummary from './RiskSummary';

const FEATURES = [
  {
    icon: Globe,
    title: 'API Scanner',
    description:
      'Probe REST and GraphQL APIs for missing security headers, weak TLS, and OWASP API Top 10 issues.',
  },
  {
    icon: Package,
    title: 'Dependency Scanner',
    description:
      'Scan Node.js and Python repositories for known CVEs across direct and transitive dependencies.',
  },
  {
    icon: FileBarChart,
    title: 'Compliance Reporting',
    description:
      'Map every finding to PCI-DSS requirements and export audit-ready PDF reports.',
  },
];

export default function DashboardHome() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRecentScans() {
      try {
        const response = await getScanHistory(3, 0);
        if (isMounted) setScans(extractList(response.data).map(normalizeScan));
      } catch (err) {
        if (isMounted) setError(getApiErrorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRecentScans();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl text-white px-6 sm:px-10 py-12 sm:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            SentinelScan &mdash; Vulnerability Detection for Financial Orgs
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-8">
            Detect vulnerabilities faster than attackers. Scan web APIs and dependencies, then map
            every finding to PCI-DSS in minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/scan/api"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Web API Scan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/scan/dependency"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-500/30 border border-blue-300 text-white font-semibold rounded-lg hover:bg-blue-500/50 transition-colors"
            >
              Start Dependency Scan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {!loading && !error && scans.length > 0 && <RiskSummary scans={scans} />}

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">What SentinelScan Covers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Scans</h2>
          <Link
            to="/history"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading && <LoadingSpinner label="Loading recent scans..." />}

        {!loading && error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm">
            Unable to load recent scans: {error}
          </div>
        )}

        {!loading && !error && scans.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
            No scans yet. Start your first scan above.
          </div>
        )}

        {!loading && !error && scans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scans.slice(0, 3).map((scan) => (
              <ScanCard key={scan.scanId} {...scan} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-100 rounded-2xl p-8 sm:p-10 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to scan?</h2>
        <p className="text-slate-500 mb-6">
          Kick off a new scan and get findings mapped to PCI-DSS in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/scan/api"
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Web API Scan
          </Link>
          <Link
            to="/scan/dependency"
            className="px-5 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            New Dependency Scan
          </Link>
        </div>
      </section>
    </div>
  );
}
