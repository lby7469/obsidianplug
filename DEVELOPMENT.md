# Development

This document covers client development and release verification. For installation and everyday use, see [README.md](README.md).

## Build and test

```sh
npm ci --ignore-scripts
npm run check
npm run lint
npm run build
npm test
npm run test:release
```

Edit the TypeScript source, not the generated `main.js`. The main areas are:

- `src/main.ts`: sync, account integration and settings.
- `src/plugin-types.ts`: network and saved-state validation.
- `src/vault-scope.ts`: sync-scope discovery and safeguards.
- `src/folder-scope-ui.ts`: folder-selection tree.
- `src/merge.ts`: three-way merge.
- `src/community.ts` and `src/renewal.ts`: announcements, feedback and renewal information.

Tests use isolated fixtures rather than production user vaults. Automated and simulated tests do not establish compatibility with every device or Obsidian version. Validate new behavior with a backed-up test vault before using real notes.

## File discovery

All-folder synchronization uses `vault.getFiles()` to obtain a whole-vault snapshot. Selected-folder synchronization resolves the selected folders through public Vault APIs and walks their cached children instead. Selecting root files includes only the root directory, not its descendants.

The folder picker inspects folder entries and excludes the Obsidian configuration and trash subtrees. Content is read only after path, scope, file-type and size checks. Missing selected folders cause sync to pause rather than being treated as empty folders. Narrower discovery reduces unnecessary enumeration; it is not an Obsidian permission sandbox.

## Release assets and provenance

Release assets are `main.js`, `manifest.json` and `styles.css`. Keep `versions.json` in the repository for version compatibility information. The release tag must exactly match the manifest version without a `v` prefix.

The maintainer-triggered GitHub Actions workflow builds and tests the source, generates artifact attestations, and creates a draft release for download verification. It must not replace prior releases or modify user configuration.

After downloading an attested release, verify its build provenance with the GitHub CLI:

```sh
gh attestation verify main.js --repo Yinds0270/NoteCloud
gh attestation verify manifest.json --repo Yinds0270/NoteCloud
gh attestation verify styles.css --repo Yinds0270/NoteCloud
```

Older manually published versions may not have attestations. Provenance verification establishes where an asset was built; it does not prove that the software is bug-free or has been tested on every platform.

Retain the original author's credit and all applicable license notices. See [MAINTAINERS.md](MAINTAINERS.md), [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
