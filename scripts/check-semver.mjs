/**
 * Module: Semantic version validator
 * Purpose: Ensure package.json uses a valid SemVer version for reproducible releases.
 * Used by: npm run version:check and GitHub Actions CI/release workflows.
 * Dependencies: Node.js standard library and package.json.
 * Public functions: None; executable script.
 * Side effects: Reads package.json and exits non-zero when the version is invalid.
 */
import { readFile } from 'node:fs/promises'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/

if (!semver.test(packageJson.version)) {
  console.error(`Invalid semantic version: ${packageJson.version}`)
  process.exit(1)
}

console.log(`SemVer OK: ${packageJson.version}`)
