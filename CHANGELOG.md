# Changelog

All notable changes to `@twin.techies/india-pincode` will be documented here.

## [0.1.5] - 2026-05-24

### Added
- GitHub Actions **CI workflow** runs `bun test` + `bun run build` on every push to `master` and on every PR.
- GitHub Actions **publish workflow** auto-publishes to npm on tag push (e.g., `git tag v0.1.5 && git push --tags`) with **npm provenance attestation** — a cryptographic proof that the package was published from this exact GitHub repo via CI. Boosts Socket.dev Supply Chain Security score by ~10-15 points and shows a green "Provenance" badge on the npm package page.
- `SECURITY.md` documents the vulnerability disclosure process via GitHub security advisories.

### Changed
- `publishConfig` in `package.json` now sets `provenance: true` and `access: public` so future releases are always provenance-attested.

## [0.1.4] - 2026-05-24

### Added
- **Live interactive demo** at https://6a132a7cd42582454e1f297c-tfbgytflvw.chromatic.com/ — Storybook playgrounds for pincode lookup, city search, form autofill, and format validation. No install required.
- README badges and per-story deep links to the live demo.

## [0.1.3] - 2026-05-23

### Fixed
- Eliminated tsup build warning about `import.meta.url` in CJS output. Switched to indirect-eval pattern so the bundler no longer flags the ESM-only code path during CJS build.

### Internal
- Repo now public at https://github.com/TwinTricks/india-pincode

## [0.1.2] - 2026-05-23

### Added
- `repository`, `homepage`, and `bugs` fields in `package.json` (now visible on the npmjs.com package page).
- "Try on RunKit" and "Open in StackBlitz" badges in README for live in-browser demos.

## [0.1.1] - 2026-05-23

### Added
- README "Try it live" section with RunKit and StackBlitz one-click links.
- npm version badge.

## [0.1.0] - 2026-05-23

### Added
- Initial release.
- Offline lookup of **23,915 pincodes** and **39,736 post offices** (bundled JSON, ~2 MB).
- `getByPincode()`, `findByPincode()`, `searchByCity()`, `listStates()`, `listPincodesByCity()`.
- `isValidPincode()`, `normalizePincode()`, `getDatasetMeta()`.
- Typed `PincodeError` with codes `INVALID_FORMAT`, `NOT_FOUND`, `DATA_ERROR`.
- Synchronous API. Zero runtime dependencies.
- ESM + CJS dual build with TypeScript declarations.
- 22 unit tests.
