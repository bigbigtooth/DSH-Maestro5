# Contributing to DSH Maestro5

Thanks for helping improve the plugin. This repository is a plain DSH bundle:
`index.js` (Host half), `client.js` (browser half) and `cordis.patch.yml` (presets
and the settings row). There is no build step.

## Development setup

- DeepSeek Harness `0.2.1-rc.2` (or another `0.2.x`) with the Web/Desktop profile
- Node.js 22+ (only for validation tooling; DSH loads the plugin itself)

```sh
# link the checkout into your profile
dsh plugin --profile desktop add "$(pwd)"

# inspect the composed profile without booting
dsh --profile desktop --dump-config

# restart DSH (and reload the page) to load code changes
```

After editing `index.js` or `cordis.patch.yml`, restart the DSH host. After editing
`client.js`, reload the Web page.

## Validate before opening a PR

```sh
npm install
npm run validate
```

The validator checks JSON manifests, the patch YAML (including DSH `!!js` tags),
the presence and shape of all six presets, delegation-tool wiring, and the host /
client entry points.

## Pull requests

- Keep changes focused; describe the user-visible effect and how you tested it.
- If you change UI text, add or update screenshots under `docs/screenshots/`
  (1280–1440 px wide, cropped to the relevant panel, no personal data).
- If you change configuration fields, update both READMEs and `CHANGELOG.md`.
- Do not edit `agent-preset-registry` or other preset-registry rows through the
  profile patch in docs/tests: it restarts the registry and breaks running
  sessions. Use the settings UI instead.

## Reporting issues

Use the issue forms (bug report / feature request). Include the DSH version, the
plugin version, install method and reproduction steps. Never paste API keys,
tokens or personal data.
