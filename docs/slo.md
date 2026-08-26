<!--
Module: Service level objectives
Purpose: Define measurable reliability and performance targets for the production salon application.
Used by: Release owners, maintainers, and incident responders.
Dependencies: Structured request logs, internal business metrics, Clerk, Neon, and Vercel deployment history.
Public functions: None; operational policy only.
Side effects: None; this document defines measurement and escalation expectations without provisioning monitoring services.
-->

# Service Level Objectives

## Targets

- Availability: 99.5% per calendar month for the production application.
- API latency: p95 below 500 ms for authenticated and public API endpoints under normal load.
- Redemption completion: at least 99% of valid redemption attempts complete successfully after validation.
- Authentication dependency: Clerk availability and webhook delivery are tracked separately from application availability.
- Database dependency: Neon connection and query health are tracked separately from application availability.

## Measurement

- Use the `http.request` structured log event and its `correlation_id`, `duration_ms`, `path`, and `status` fields for endpoint latency and error-rate calculations.
- Exclude health checks, static assets, and intentionally rejected requests from successful-request latency calculations; keep rejected requests in error-rate analysis.
- Calculate p95 latency and error rate per endpoint over a rolling 5-minute window and summarize monthly availability.
- Use redemption records and audit events to calculate valid-attempt completion rate and investigate discrepancies.
- Review Clerk webhook failures and Neon connection errors in provider dashboards and correlate incidents using the request log fields.

## Incident response

1. Confirm the affected endpoint, time window, correlation ID, and deployment version.
2. If a release caused the regression, use the documented Vercel instant rollback procedure.
3. If the issue is schema-related, keep the application compatible and apply a reviewed corrective migration; do not edit migration history.
4. Record the incident window, impact, root cause, mitigation, and follow-up action in release notes.

No external uptime, tracing, or analytics provider is configured in this phase. Provider-based alerting remains a future change requiring a separate approved scope and credentials.

