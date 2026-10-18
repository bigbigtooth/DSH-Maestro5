<div align="center">

<img src="https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/icon.svg" width="96" alt="DSH Maestro5" />

# DSH Maestro5

**One Lead + five difficulty tiers of subagents. Turn "a team" into the default way DeepSeek Harness works.**

Install it and you get a **Team Lead** session mode plus a settings page: the Lead decomposes work, picks the right difficulty tier by cost/capability, delegates in parallel, then reviews and delivers. Each tier's model is configurable independently.

[English](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/README.en.md) · [中文](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/LICENSE)
[![DSH](https://img.shields.io/badge/DSH-0.2.1--rc.2-informational)](https://github.com/deepseek-ai/deepseek-harness)
[![npm](https://img.shields.io/npm/v/dsh-maestro5?label=npm)](https://www.npmjs.com/package/dsh-maestro5)
[![validate](https://github.com/bigbigtooth/DSH-Maestro5/actions/workflows/validate.yml/badge.svg)](https://github.com/bigbigtooth/DSH-Maestro5/actions/workflows/validate.yml)
[![dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-2f6feb)](https://github.com/topics/dsh-plugin)
[![Platform](https://img.shields.io/badge/profile-web%20%7C%20desktop-lightgrey)](#compatibility)

> A community plugin. Not affiliated with or endorsed by DeepSeek AI.

![Lead delegating L1 and L2 subagents in the Maestro5 team mode](https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/docs/screenshots/chat-delegation.png)

</div>

---

## What it is

**DSH Maestro5** is a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) Web plugin. After install, a new **"Team Lead"** session mode appears:

- You describe a task; the **Lead** decomposes it, decides what to do itself, what to delegate, and to which tier;
- Five difficulty tiers **L1–L5** — higher tiers use stronger (slower, pricier) models;
- All tiers share the same worker toolbox (files, bash, web, Office skills); they differ in **model / reasoning effort / persona**, so any task can go to any tier;
- The provider, model and reasoning effort of **each tier** are configurable in **Settings → Team Mode**, populated from your live DSH model catalog;
- Installing the plugin registers the mode, the five tier presets and the settings page — **no manual config editing**.

### Why use it

| Problem | Maestro5 |
| --- | --- |
| One model for everything; cheap tasks burn an expensive model | Delegate routine work to L1/L2, keep L4/L5 for critical delivery |
| Long tasks accumulate one huge, slow, expensive context | Subtasks run in isolated contexts; the Lead only collects results |
| Independent subtasks run serially | The Lead dispatches several subagents in parallel in one turn |
| Subagent models are hard-coded | Configure per tier in settings; follows your model catalog |
| No independent check on critical output | Lead policy: critical deliverables get an L4/L5 review pass |

---

## Screenshots

| "Team Lead" in the new-session picker | Settings → Team Mode (per-tier model) |
| --- | --- |
| ![Mode picker: Team Lead + L1–L5 tiers](https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/docs/screenshots/mode-picker.png) | ![Settings page: provider / model / effort per tier](https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/docs/screenshots/settings-team-mode.png) |

| Listed after install | A real delegation run |
| --- | --- |
| ![DSH Maestro5 in installed plugins](https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/docs/screenshots/plugins-installed.png) | See the hero image above: two subagents in parallel, delivered in 6s |

---

## Quick start

### Requirements

- **DeepSeek Harness `0.2.1-rc.2` or another `0.2.x`** (declares `engines.dsh: >=0.2.1-rc.2 <0.3.0`)
- **Web / Desktop profile** — this plugin needs the agent preset registry and the Web settings UI; it does not apply to headless/TUI profiles
- At least one routable model provider (Settings → Models)

### Install

Pick one. All four install the same bundle.

**A. Web UI:** sidebar **Plugins → Add plugin ▾ → Install a third-party plugin** → enter `dsh-maestro5` or an absolute local path → install → **reload the page**.

**B. npm (once published):**

```sh
dsh plugin --profile desktop add dsh-maestro5   # DSH Desktop profile is "desktop"
dsh plugin --profile web add dsh-maestro5       # standalone dsh web profile
```

**C. GitHub:**

```sh
# from the repository
dsh plugin --profile desktop add github:bigbigtooth/DSH-Maestro5

# or from a release tarball (pinned, works offline)
dsh plugin --profile desktop add https://github.com/bigbigtooth/DSH-Maestro5/releases/latest/download/dsh-maestro5-1.0.0.tgz
```

**D. Local checkout (development):**

```sh
dsh plugin --profile desktop add /path/to/DSH-Maestro5
```

> Restart DSH after installing (bundle layers compose at boot); reload the page at minimum to load the client half.
> If the desktop app has no `dsh` command, use **Manage dsh command** in the menu bar to add it to PATH.

### Verify

- [ ] New session → mode picker shows **Team Lead** (the `Team·L1…L5` cards are subagent presets; do not select them as session modes)
- [ ] **Settings → Team Mode** opens with five rows of provider/model/effort dropdowns
- [ ] **Plugins → Installed plugins** lists **DSH Maestro5** with the `maestro-levels` row and six preset rows
- [ ] Ask "use delegate_l1 to compute 1+1" and watch the Lead delegate and summarize

### Make it the default mode

**Settings → Agent Presets → Team Lead → Set as new task default.**

> ⚠️ Do not edit `agent-preset-registry` in the profile's `cordis.patch.yml` to change the default: that restarts the preset registry and running sessions lose their preset tooling. Use the settings UI.

---

## Usage

Select **Team Lead** and describe the task. The Lead decides whether/how to delegate. You can also name tiers explicitly:

```text
Use L1 to convert this CSV to xlsx, keep the header row.

Have L2 organize the material first, then L5 writes the final draft and fact-checks it.

Split this into three parallel jobs: L2 research, L3 build the table, L4 write conclusions; then summarize.
```

### How the Lead works

1. **Decompose** — split into independent, well-scoped subtasks; trivial work it does itself;
2. **Pick a tier** — mechanical/reviewable → L1/L2; long reasoning chains, costly mistakes → L4/L5; start from the cheapest viable tier;
3. **Delegate** — every subagent gets a *self-contained* brief (goal, input paths, method, output format, output path, acceptance criteria) because it cannot see your conversation;
4. **Parallelize** — independent subtasks are dispatched in the same turn, not awaited serially;
5. **Review** — check results against acceptance criteria; critical deliverables get an independent L4/L5 review;
6. **Deliver** — summary + usable artifacts, stating which tiers were used and where outputs live.

### The five tiers

| Tier | Role | Default model / effort | Good for |
| --- | --- | --- | --- |
| **L1** | Minimal executor | `deepseek-flash` / off | format conversion, extraction, simple rewrites, one-step ops |
| **L2** | Routine executor | `deepseek-flash` / low | organization, summaries, everyday writing, templates |
| **L3** | Complex executor | `deepseek-flash` / max | long docs, multi-step scripts, spreadsheets, multi-source synthesis |
| **L4** | Hard problem solver | `deepseek-v4-pro` / high | rigorous analysis, coding/debugging, key conclusions, design |
| **L5** | Mission-critical | `deepseek-v4-pro` / max | difficult reasoning, final review, decision support, top quality |

> These are factory defaults. Any tier can be pointed at any provider/model you configured (MiniMax, 9router, …).

---

## Configure per-tier models

**Settings → Team Mode** (or **Plugins → DSH Maestro5 → row `maestro-levels` → Configure** — same configuration).

Each tier has three fields:

| Field | Source | Notes |
| --- | --- | --- |
| **Provider** | Currently routable providers | e.g. `deepseek-official`, `deepseek-account`, `minimaxcode`, `myrouter`; hover shows the route id |
| **Model** | Models configured under that provider | e.g. `deepseek-flash`, `deepseek-v4-pro`, `MiniMax-M3.1-Flash-Preview`, `TopCoder`…; plus a "custom model id" fallback |
| **Reasoning effort** | **Efforts advertised by the selected model** | DeepSeek: default/off/low/high/max; MiniMax: default/off/low/medium/high; models without reasoning only offer "default" |

- Switching provider selects that provider's first model and clears the effort;
- Switching model resets the effort (models support different levels).

**Save → restart DSH Desktop → new sessions use the new models.** The config is persisted as an override of `- id: maestro-levels` in the profile's `cordis.patch.yml`; running sessions keep their original configuration because DSH pins presets at session creation.

---

## How it works

```
┌──────────────────────── dsh-maestro5 (bundle) ────────────────────────┐
│ cordis.patch.yml                                                     │
│   ├── root row maestro-levels (volatile Config.levels — editable)     │
│   ├── preset team        Lead (persona + tools + 5 delegate tools)    │
│   └── preset team-l1…l5  five tiers (persona + full worker toolbox)  │
│ index.js   Host half: provides the maestroLevels service             │
│ client.js  Client half: Settings → Team Mode + row Configure UI      │
└──────────────────────────────────────────────────────────────────────┘
        │ installed → registered automatically
        ▼
  New session: "Team Lead"
        │
        ▼
  Lead ──pick tier──► delegate_l1 … delegate_l5
        │                  │ agentOptions = !!js maestroLevels.agentOptionsFor('lN')
        │                  ▼
        │           team-lN subagent (isolated context)
        │                  │ completion notice (no polling)
        ▼                  ▼
      review / deliver ◄───┘
```

- **Install registers everything**: DSH reads `dsh.bundle.patch` on install and inserts the settings row and six presets into the profile layer stack.
- **Persistent config**: `levels` on the `maestro-levels` row is `.volatile()`, so the settings form can edit it and config-editor writes it back to the profile patch.
- **Model injection**: each `delegate-*` row reads `ctx.get('maestroLevels').agentOptionsFor('l1')` at mount time via `!!js`.
- **Hand-written browser half**: `client.js` is a `window.__ModuleLoader__` factory registering into `settings.section` and `plugins.row.config` — no bundler needed.

---

## Development

```sh
dsh plugin --profile desktop add /path/to/DSH-Maestro5   # link install
dsh --profile desktop --dump-config                      # inspect composition without booting
```

No build step: both halves are hand-written JS loaded from the source directory. After editing `index.js` / `client.js` / `cordis.patch.yml`, restart DSH (host half) and reload the page (client half).

Layout:

```
DSH-Maestro5/
├── package.json          # bundle manifest: dsh.bundle.patch + dsh.client + engines.dsh
├── cordis.patch.yml      # settings row + Lead preset + five tier presets
├── index.js              # Host half: maestroLevels service
├── client.js             # Client half: settings page / row configuration
├── locale/{zh,en}.json   # display name & description
├── icon.svg
├── docs/screenshots/
├── README.md / README.en.md
└── LICENSE
```

See [中文 README](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/README.md#自定义与开发) for the customization table (change personas, tools, add an L6 tier, add a row, …).

---

## Compatibility

| Item | Notes |
| --- | --- |
| DSH version | `>=0.2.1-rc.2 <0.3.0` (`engines.dsh`); verified on 0.2.1-rc.2 |
| Profile | `web` / `desktop` (needs the agent preset registry and Web settings UI) |
| Dependencies | `@deepseek-ai/schemastery` (peer, resolved by DSH) |
| Build | None (plain JS bundle) |
| Network / permissions | The plugin itself makes no network calls, listens on no port, writes only the profile patch layer |

## Known limitations

- Changing tier models requires a **restart** and **new sessions**;
- The Lead's own model follows the session model selector;
- The five tier presets also show up in the session mode picker (DSH has no hidden flag); their descriptions say they are not meant as session modes;
- Subagents created by `delegate_*` are **not Agent Team members** (no `list_agents`, no `send_message` follow-ups); they report back via completion notices;
- Tier models depend on your model catalog; local providers (e.g. 9router) need their service running.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| DSH Maestro5 missing in Plugins / no Configure | Reload the page; restart DSH if still missing |
| No "Team Lead" in the mode picker | Ensure `dsh-maestro5` is in the profile's `dsh.profile.bundles`; enable it in Plugins |
| Models unchanged after saving | Restart DSH and **create a new session** |
| Subagent reports model unavailable | Pick a routable model for that tier; check Settings → Models / API keys; local gateways must be running |

## Uninstall

```sh
dsh plugin --profile desktop remove dsh-maestro5
```

Or **Plugins → DSH Maestro5 → Uninstall**. The six presets and the settings row are removed; restart and the mode disappears.

## Publishing (maintainers)

```sh
npm login
npm publish            # package name: dsh-maestro5
```

Before publishing: `npm pack --dry-run`, confirm `engines.dsh` matches the target DSH, and add the repo topic [`dsh-plugin`](https://github.com/topics/dsh-plugin).

## Community

- Topic: [`dsh-plugin`](https://github.com/topics/dsh-plugin)
- Suggestions and PRs: [issues](https://github.com/bigbigtooth/DSH-Maestro5/issues)
- Contributing: [CONTRIBUTING.md](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/CONTRIBUTING.md) · Changelog: [CHANGELOG.md](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/CHANGELOG.md)
- Consider listing it in [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)

## License

[MIT](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/LICENSE)
