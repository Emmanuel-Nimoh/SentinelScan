// Input validation helpers for scan forms.
export function validateURL(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getURLError(urlString) {
  if (!urlString || !urlString.trim()) return 'URL is required';
  if (!validateURL(urlString)) return 'Enter a valid HTTPS URL (e.g. https://api.example.com)';
  return null;
}

export function validateRepoURL(urlString) {
  try {
    const url = new URL(urlString);
    if (url.hostname !== 'github.com') return false;
    return url.pathname.split('/').filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

export function getRepoURLError(urlString) {
  if (!urlString || !urlString.trim()) return 'GitHub repository URL is required';
  if (!validateRepoURL(urlString)) {
    return 'Enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)';
  }
  return null;
}
