// The backend isn't finalized yet; these normalizers translate snake_case
// API payloads into the camelCase shapes the components expect, in one place.
export function extractList(data) {
  if (Array.isArray(data)) return data;
  return data?.scans ?? data?.results ?? data?.items ?? [];
}

export function normalizeScan(raw) {
  if (!raw) return null;
  return {
    scanId: raw.scan_id ?? raw.scanId ?? raw.id,
    target: raw.target ?? raw.url ?? raw.repo_url ?? raw.repoUrl ?? '',
    scanType: raw.scan_type ?? raw.scanType ?? 'api',
    riskScore: raw.risk_score ?? raw.riskScore ?? 0,
    vulnerabilityCount:
      raw.vulnerability_count ?? raw.vulnerabilityCount ?? raw.vulnerabilities?.length ?? 0,
    timestamp: raw.timestamp ?? raw.created_at ?? raw.createdAt,
    status: raw.status ?? 'pending',
    vulnerabilities: (raw.vulnerabilities || []).map(normalizeVulnerability),
  };
}

export function normalizeVulnerability(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? 'Untitled finding',
    severity: (raw.severity ?? 'low').toLowerCase(),
    description: raw.description ?? '',
    affectedComponent: raw.affected_component ?? raw.affectedComponent ?? '',
    cvssScore: raw.cvss_score ?? raw.cvssScore ?? null,
    cveId: raw.cve_id ?? raw.cveId ?? null,
    remediation: raw.remediation ?? '',
    pciDssRefs: raw.pci_dss_refs ?? raw.pciDssRefs ?? [],
    discoveredAt: raw.discovered_at ?? raw.discoveredAt ?? raw.created_at,
  };
}

export function normalizeComplianceRequirement(raw) {
  if (!raw) return null;
  return {
    requirementId: raw.requirement_id ?? raw.requirementId ?? raw.id,
    requirementTitle: raw.requirement_title ?? raw.requirementTitle ?? raw.title,
    status: raw.status ?? 'non_compliant',
    findingCount: raw.finding_count ?? raw.findingCount ?? raw.findings?.length ?? 0,
    findings: raw.findings ?? [],
  };
}
