import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, Search, Trash2, ShieldAlert, Inbox } from 'lucide-react';
import { getScanHistory, deleteScan, getApiErrorMessage } from '../services/api';
import { extractList, normalizeScan } from '../utils/normalize';
import { formatDate, formatScanType, formatStatus, formatRiskScore } from '../utils/formatters';
import { getRiskColor } from '../utils/colors';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Modal from '../components/Common/Modal';

const PAGE_SIZE = 10;

const SORT_FIELDS = {
  target: (scan) => scan.target?.toLowerCase() || '',
  scanType: (scan) => scan.scanType || '',
  riskScore: (scan) => scan.riskScore || 0,
  timestamp: (scan) => new Date(scan.timestamp || 0).getTime(),
};

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const response = await getScanHistory(100, 0);
        const list = extractList(response.data).map(normalizeScan);
        if (isMounted) setScans(list);
      } catch (err) {
        if (isMounted) setError(getApiErrorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSorted = useMemo(() => {
    const accessor = SORT_FIELDS[sortField] || SORT_FIELDS.timestamp;
    const filtered = scans.filter((scan) =>
      scan.target?.toLowerCase().includes(search.toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) => {
      const diff = accessor(a) > accessor(b) ? 1 : accessor(a) < accessor(b) ? -1 : 0;
      return sortDir === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [scans, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const pageItems = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleteError(null);
    try {
      await deleteScan(pendingDelete.scanId);
      setScans((prev) => prev.filter((scan) => scan.scanId !== pendingDelete.scanId));
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    }
  };

  const columns = [
    { field: 'target', label: 'Target' },
    { field: 'scanType', label: 'Type' },
    { field: 'riskScore', label: 'Risk Score' },
    { field: 'timestamp', label: 'Date' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scan History</h1>
        <p className="text-slate-500 mt-1">Browse, search, and manage your past scans.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by target..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen label="Loading scan history..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : filteredSorted.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
          <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          No scans found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {columns.map(({ field, label }) => (
                    <th key={field} className="px-4 py-3 text-left font-semibold text-slate-600">
                      <button
                        type="button"
                        onClick={() => handleSort(field)}
                        className="inline-flex items-center gap-1 hover:text-slate-900"
                      >
                        {label}
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageItems.map((scan) => {
                  const riskColor = getRiskColor(scan.riskScore);
                  return (
                    <tr key={scan.scanId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 max-w-xs truncate text-slate-900" title={scan.target}>
                        {scan.target}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatScanType(scan.scanType)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${riskColor.bg} ${riskColor.text}`}
                        >
                          {formatRiskScore(scan.riskScore)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(scan.timestamp)}</td>
                      <td className="px-4 py-3 text-slate-600">{formatStatus(scan.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/results/${scan.scanId}`}
                            className="text-blue-600 font-medium hover:text-blue-700"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(scan)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                            aria-label="Delete scan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete Scan"
        footer={
          <>
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete the scan for{' '}
          <span className="font-semibold text-slate-900">{pendingDelete?.target}</span>? This action
          cannot be undone.
        </p>
        {deleteError && <p className="text-sm text-red-600 mt-2">{deleteError}</p>}
      </Modal>
    </div>
  );
}
