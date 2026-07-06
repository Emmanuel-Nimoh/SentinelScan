"""
AI-generated remediation guidance for vulnerabilities.

Given a scanner finding, ask Claude for contextual, plain-English fix
instructions. This augments the static `remediation` strings the scanners
emit with step-by-step guidance, a code/config example, references, and an
effort estimate — returned as structured JSON via the Messages API.

The Anthropic client is created lazily and cached per-process. The API key is
read from configuration (never hardcoded); when it is missing, callers get a
`RemediationUnavailable` error they can translate into a 503.
"""

import json
import logging

from flask import current_app

logger = logging.getLogger(__name__)

try:
    import anthropic
except ImportError:  # pragma: no cover - anthropic is a hard dependency
    anthropic = None


class RemediationError(RuntimeError):
    """Raised when AI remediation generation fails."""


class RemediationUnavailable(RemediationError):
    """Raised when the feature is not configured (missing SDK or API key)."""


# Cached Anthropic client, keyed by API key so a config change is picked up.
_client_cache = {}

SYSTEM_PROMPT = (
    "You are a senior application security engineer helping a financial "
    "institution remediate vulnerabilities found by an automated scanner. "
    "Give precise, actionable, vendor-neutral guidance. Prefer concrete "
    "configuration or code changes over generic advice. Keep it grounded in "
    "the specific finding provided; do not invent details that aren't given. "
    "When a PCI-DSS requirement is relevant, mention it briefly."
)

# Structured-output schema: guarantees the response shape the frontend consumes.
REMEDIATION_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {
            "type": "string",
            "description": "One or two sentences: what the risk is and why it matters.",
        },
        "steps": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Ordered, concrete remediation steps.",
        },
        "code_example": {
            "type": "string",
            "description": "A short code or config snippet illustrating the fix. Empty string if not applicable.",
        },
        "references": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Relevant standards, documentation, or CVE identifiers.",
        },
        "effort": {
            "type": "string",
            "enum": ["low", "medium", "high"],
            "description": "Rough remediation effort.",
        },
    },
    "required": ["summary", "steps", "code_example", "references", "effort"],
    "additionalProperties": False,
}


def _get_client():
    """Return a cached Anthropic client, or raise RemediationUnavailable."""
    if anthropic is None:
        raise RemediationUnavailable("The anthropic SDK is not installed.")

    api_key = current_app.config.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RemediationUnavailable("ANTHROPIC_API_KEY is not configured.")

    client = _client_cache.get(api_key)
    if client is None:
        client = anthropic.Anthropic(api_key=api_key)
        _client_cache[api_key] = client
    return client


def _build_prompt(vuln: dict, target: str, scan_type: str) -> str:
    """Render a compact, structured description of the finding for the model."""
    lines = ["A security scan produced this finding. Provide remediation guidance.\n"]
    if target:
        lines.append(f"Scan target: {target}")
    if scan_type:
        lines.append(f"Scan type: {scan_type}")

    fields = [
        ("Title", vuln.get("title")),
        ("Type", vuln.get("vuln_type")),
        ("Severity", vuln.get("severity")),
        ("Affected component", vuln.get("affected_component")),
        ("CVE", vuln.get("cve_id")),
        ("CVSS score", vuln.get("cvss_score")),
        ("Description", vuln.get("description")),
        ("Existing remediation note", vuln.get("remediation")),
    ]
    for label, value in fields:
        if value not in (None, ""):
            lines.append(f"{label}: {value}")

    return "\n".join(lines)


def generate_remediation(vuln: dict, target: str = "", scan_type: str = "") -> dict:
    """
    Generate structured remediation guidance for a single vulnerability.

    Parameters
    ----------
    vuln : dict
        A vulnerability record (as produced by ``Vulnerability.to_dict()``).
    target, scan_type : str
        Optional scan context that helps the model tailor its advice.

    Returns
    -------
    dict
        Keys: ``summary``, ``steps``, ``code_example``, ``references``, ``effort``.

    Raises
    ------
    RemediationUnavailable
        If the feature is not configured.
    RemediationError
        If the API call fails or returns an unparseable response.
    """
    client = _get_client()
    model = current_app.config.get("ANTHROPIC_MODEL", "claude-opus-4-8")
    max_tokens = current_app.config.get("ANTHROPIC_MAX_TOKENS", 2000)

    try:
        response = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_prompt(vuln, target, scan_type)}],
            output_config={"format": {"type": "json_schema", "schema": REMEDIATION_SCHEMA}},
        )
    except anthropic.APIError as exc:
        logger.exception("Anthropic API error generating remediation")
        raise RemediationError(f"AI request failed: {exc}") from exc

    if response.stop_reason == "refusal":
        raise RemediationError("The AI declined to answer this request.")

    text = next((block.text for block in response.content if block.type == "text"), None)
    if not text:
        raise RemediationError("The AI returned an empty response.")

    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        logger.error("Could not parse AI remediation JSON: %s", text[:500])
        raise RemediationError("The AI returned malformed output.") from exc
