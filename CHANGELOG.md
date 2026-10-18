# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-18

First public release.

### Added

- **Team Lead session mode** (`team` preset): the Lead decomposes a task, picks a
  difficulty tier by cost and capability, dispatches subagents in parallel, reviews
  results and delivers.
- **Five difficulty tiers** (`team-l1` … `team-l5`) with dedicated personas and the
  full worker toolbox; tiers differ in model, reasoning effort and working style.
- **Per-tier model configuration page** under **Settings → Team Mode**: provider,
  model and reasoning effort are populated from the live DSH model catalog, with
  a custom model id fallback.
- **Plugin row configuration** (`plugins.row.config` for `dsh-maestro5#maestro-levels`)
  editing the same configuration as the settings page.
- **Host service** `maestroLevels` exposing the current tier routes; delegation
  tools read it through `!!js` at preset mount time.
- **Configurable five-tier defaults** persisted as a `maestro-levels` override in
  the profile's `cordis.patch.yml`.
- English and Chinese READMEs with real UI screenshots, install instructions for
  Web UI, npm, GitHub and local checkouts, a usage guide, architecture notes,
  compatibility limits and troubleshooting.
- Repository tooling: `npm run validate` bundle/patch checks, GitHub Actions
  workflow, issue forms and a pull-request template.

### Known limitations

- Changing tier models requires a DSH restart and applies to newly created
  sessions only.
- The Lead's own model follows the session model selector.
- Tier presets are listed in the session mode picker (DSH has no hidden flag).
- `delegate_*` subagents are not Agent Team members: they cannot be steered with
  `send_message` and report back through completion notices.
