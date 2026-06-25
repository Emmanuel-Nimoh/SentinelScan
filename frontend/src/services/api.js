import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Normalizes axios errors into a single user-facing message.
export function getApiErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!error?.response) return 'Unable to reach the SentinelScan API. Is the backend running?';
  return error.message || 'Something went wrong. Please try again.';
}

// Scan endpoints
export const startWebAPIScan = (url, scanDepth, includeSubdomains) =>
  api.post('/scan/web-api', {
    url,
    scan_depth: scanDepth,
    include_subdomains: includeSubdomains,
  });

export const startDependencyScan = (repoUrl, packageType, includeTransitive) =>
  api.post('/scan/dependencies', {
    repo_url: repoUrl,
    package_type: packageType,
    include_transitive: includeTransitive,
  });

export const getScanResults = (scanId) => api.get(`/scan/${scanId}`);

export const getComplianceReport = (scanId) => api.get(`/compliance/report/${scanId}`);

export const downloadPDFReport = (scanId) =>
  api.get(`/reports/pdf/${scanId}`, { responseType: 'blob' });

export const getScanHistory = (limit = 10, offset = 0) =>
  api.get('/scans', { params: { limit, offset } });

export const deleteScan = (scanId) => api.delete(`/scan/${scanId}`);

export default api;
