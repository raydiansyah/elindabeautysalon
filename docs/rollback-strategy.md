<!--
Module: Deployment rollback strategy
Purpose: Document safe application and database rollback procedures for Elynd Beauty Salon.
Used by: Maintainers, release operators, and incident responders during Vercel deployments.
Dependencies: Vercel Git deployments, Drizzle migration history, Neon PostgreSQL, GitHub Actions CI.
Public functions: None; operational runbook only.
Side effects: Procedures may redirect production traffic or apply database migrations; execute only after validation and approval.
-->

# Rollback Strategy

## Application rollback

1. Stop the release promotion and confirm the failing deployment URL and commit SHA.
2. In Vercel, open the project deployment history and use **Instant Rollback** to route traffic to the last verified production deployment.
3. Confirm the health checks, public promotions page, Clerk sign-in, admin dashboard, and redemption endpoint against the rolled-back deployment.
4. Keep the failed deployment available for logs and incident analysis. Fix forward on a new branch and let GitHub Actions validate lint, type-check, and `next build --webpack` before promoting again.

Vercel rollback is application-only. It does not automatically revert database state.

## Database migration policy

- Production schema changes must be additive and generated through Drizzle migrations.
- Run migrations before enabling code that depends on new columns or tables; deploy compatibility code first when a change cannot be atomic.
- Do not use `drizzle-kit push` against production. Use the committed migration files with `npm run db:migrate` after CI validation.
- Every migration must have a tested recovery decision before release: revert the application deployment, run a forward corrective migration, or restore data using the Neon account's available recovery facility.
- Destructive changes require a separate approved change and an explicit data export/recovery plan. The current PRD skips automated backup/DR, so this repository does not add backup jobs or claim point-in-time recovery coverage.

Because Drizzle migrations are append-only in this repository, rollback normally means reverting application code and applying a new corrective migration. Do not manually delete rows or edit the migration journal during an incident.

## Feature rollout

The current application has no feature-flag provider configured. New risky behavior must therefore be released behind a small, reversible code/configuration change or held until the provider decision is approved. Do not introduce an unconfigured flag service as part of rollback handling.

## Release checklist

- CI passes: lint, TypeScript, and production build.
- Migration reviewed for additive compatibility and rollback/recovery decision.
- Vercel preview smoke-tested with Clerk and Neon environment variables.
- Rollback owner and last known-good deployment recorded in the release notes.
- Production smoke tests pass after promotion or instant rollback.

