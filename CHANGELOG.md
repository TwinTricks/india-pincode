# Changelog

All notable changes to `@twin.techies/india-pincode` will be documented here.

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
