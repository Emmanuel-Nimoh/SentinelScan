// Shared enums and reference data used across the dashboard.
export const SCAN_TYPES = {
  API: 'api',
  DEPENDENCY: 'dependency',
};

export const SCAN_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'];

export const SCAN_DEPTH_OPTIONS = [
  { value: 'quick', label: 'Quick' },
  { value: 'full', label: 'Full' },
];

export const PACKAGE_TYPE_OPTIONS = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
];

export const POLL_INTERVAL_MS = 5000;

export const APP_NAME = process.env.REACT_APP_APP_NAME || 'SentinelScan';

// The five PCI-DSS requirements SentinelScan maps findings against.
export const PCI_DSS_REQUIREMENTS = [
  {
    id: '2.1',
    title: 'Default Credentials',
    description: 'Always change vendor-supplied defaults before installing a system on the network.',
  },
  {
    id: '4.1',
    title: 'Encryption in Transit',
    description: 'Use strong cryptography to safeguard cardholder data during transmission over open networks.',
  },
  {
    id: '6.5.1',
    title: 'Injection Flaws',
    description: 'Address injection flaws, particularly SQL injection, in application code.',
  },
  {
    id: '6.5.7',
    title: 'Cross-Site Scripting',
    description: 'Address cross-site scripting (XSS) vulnerabilities in application code.',
  },
  {
    id: '11.2',
    title: 'Automated Vulnerability Scanning',
    description: 'Run internal and external network vulnerability scans at least quarterly.',
  },
];
