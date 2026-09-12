<!--
Module: Local engineering rules
Purpose: Define repository-specific implementation guardrails.
Used by: Contributors and automated coding workflows.
Dependencies: AGENTS.md and the active user specification.
Public functions: None.
Side effects: Guides code and verification decisions.
-->

# Local Engineering Rules

- Keep public landing visuals mobile-first, accessible, and compatible with dynamic salon settings.
- Preserve dark-mode contrast and avoid colour gradients unless explicitly approved.
- Keep visual interactions optional; core brand content must remain legible without hover, cursor, or motion.
- For frontend-only changes, run focused type, lint, and test checks before handoff.
