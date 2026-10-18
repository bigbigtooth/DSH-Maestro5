<div align="center">

<img src="https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/icon.svg" width="96" alt="DSH Maestro5" />

# DSH Maestro5

**一个主控 + L1–L5 五档难度子智能体，把「团队」变成 DeepSeek Harness 的默认工作方式。**

安装即获得「团队主控」模式与模型配置界面：主控负责拆任务、按难度与成本选档、并行分派、汇总复核；每个档位的模型都可以在设置页里独立配置。

[English](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/README.en.md) · [中文](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/LICENSE)
[![DSH](https://img.shields.io/badge/DSH-0.2.1--rc.2-informational)](https://github.com/deepseek-ai/deepseek-harness)
[![npm](https://img.shields.io/badge/npm-dsh--maestro5-cb3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/dsh-maestro5)
[![release](https://img.shields.io/github/v/release/bigbigtooth/DSH-Maestro5?label=release)](https://github.com/bigbigtooth/DSH-Maestro5/releases/latest)
[![validate](https://github.com/bigbigtooth/DSH-Maestro5/actions/workflows/validate.yml/badge.svg)](https://github.com/bigbigtooth/DSH-Maestro5/actions/workflows/validate.yml)
[![dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-2f6feb)](https://github.com/topics/dsh-plugin)
[![Platform](https://img.shields.io/badge/profile-web%20%7C%20desktop-lightgrey)](#兼容性)

> 社区插件，与 DeepSeek AI 无隶属关系，也不是官方项目。

![在「团队主控」模式下，主控并行派出 L1 / L2 两个子智能体，汇总后给出结果](https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/docs/screenshots/chat-delegation.png)

</div>

---

## 这是什么

**DSH Maestro5** 是一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）Web 插件。装上之后，新任务里会多出一个 **「团队主控」** 模式：

- 你说一句任务，**主控**先拆解，再决定「哪些自己做、哪些交给子智能体、交给哪一档」；
- 有 **L1–L5 五档难度**子智能体，越往上模型越强、越慢、越贵；
- 五档的工具集相同（文件、bash、联网、Office 技能），差异在**模型 / 思考强度 / 人设**，所以任何任务都能交给任何档；
- 每一档用哪个 Provider、哪个模型、什么思考强度，都能在 **设置 → 团队模式** 里单独配置，模型列表直接来自你当前 DSH 的模型目录；
- 安装插件即自动注册模式、五个档位 preset 和配置页——**不需要手动改任何配置文件**。

### 为什么值得装

| 痛点 | Maestro5 的做法 |
| --- | --- |
| 一个模型包办所有任务，简单任务浪费贵模型 | 简单任务派 L1/L2（便宜快），关键交付才上 L4/L5（强而贵） |
| 长任务一个上下文越滚越大，越跑越慢越贵 | 子任务在独立上下文里执行，主控只收结果，上下文更干净 |
| 多个独立子任务只能串行做 | 主控可以在同一轮并行派出多个子智能体 |
| 子智能体「用哪个模型」写死在代码里 | 设置页逐档配置，模型目录变化自动跟随 |
| 高风险交付没人复核 | 主控人设要求关键交付再派 L4/L5 独立复核 |

---

## 截图

| 新任务里的「团队主控」模式 | 设置 → 团队模式（逐档配模型） |
| --- | --- |
| ![模式选择器：团队主控 + L1–L5 档位](https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/docs/screenshots/mode-picker.png) | ![设置页：五档的 Provider / 模型 / 思考强度](https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/docs/screenshots/settings-team-mode.png) |

| 安装后出现在插件列表 | 实际分派过程 |
| --- | --- |
| ![已安装插件里的 DSH Maestro5](https://raw.githubusercontent.com/bigbigtooth/DSH-Maestro5/main/docs/screenshots/plugins-installed.png) | 见页面顶部大图：主控并行派出 L1 / L2，6 秒汇总交付 |

---

## 快速开始

### 环境要求

- **DeepSeek Harness `0.2.1-rc.2` 或同系列 `0.2.x`**（插件声明了 `engines.dsh: >=0.2.1-rc.2 <0.3.0`）
- **Web / Desktop profile**：本插件依赖 agent preset 注册表与 Web 设置界面，因此仅在 `web` / `desktop` profile 生效；headless / TUI profile 不适用
- 至少配置一个可用的模型 provider（**设置 → 模型**），否则子智能体没有可用的模型路由

### 安装

四种方式任选一种，装完都得到同一个 bundle。

#### 方式 A：Web 界面（最直观）

1. 侧栏 **插件（Plugins）** → 右上角 **添加插件 ▾** → **安装第三方插件**；
2. 输入 npm 包名（`dsh-maestro5`）或本地目录绝对路径，确认安装；
3. **刷新页面**（`Cmd+R` / `Ctrl+R`）加载浏览器端配置页；
4. 新建任务，模式选择器里应出现 **「团队主控」**。

#### 方式 B：npm（推荐，发布后可用）

```sh
# 桌面版（DSH Desktop 的 profile 名字是 desktop）
dsh plugin --profile desktop add dsh-maestro5

# 独立 Web 版（dsh web）
dsh plugin --profile web add dsh-maestro5
```

> 桌面版如果提示找不到 `dsh` 命令，可在菜单栏用 **Manage dsh command** 把它装进 PATH（不同版本入口可能略有差异）。
> 安装完成后**重启 DSH**（bundle 层在启动时组装）；至少刷新页面以加载客户端半。

#### 方式 C：直接从 GitHub 安装

```sh
# 源码安装（跟随 main 分支）
dsh plugin --profile desktop add github:bigbigtooth/DSH-Maestro5

# 或从 Releases 的打包文件安装（固定版本、可离线分发）
dsh plugin --profile desktop add https://github.com/bigbigtooth/DSH-Maestro5/releases/latest/download/dsh-maestro5-1.0.0.tgz
```

#### 方式 D：本地目录（开发态）

```sh
dsh plugin --profile desktop add /path/to/DSH-Maestro5
```

本地目录是 `link:` 安装：源目录就是安装物，**改代码 / 改配置后重启 DSH 即生效，无需重装**。

### 安装后验证清单

- [ ] 新任务 → 模式选择器出现 **「团队主控」**（旁边还有 `团队·L1` … `团队·L5` 五个档位卡，它们只供子智能体使用，不建议直接选作会话模式）
- [ ] **设置 → 团队模式** 能打开，五个档位的 Provider / 模型 / 思考强度都能下拉选择
- [ ] **插件 → 已安装插件** 里出现 **DSH Maestro5**，点开后能看到 `maestro-levels` 行与 6 个 preset 行
- [ ] 发一句「用 delegate_l1 计算 1+1」，能看到主控派出子智能体并汇总结果

### 设为默认模式（推荐）

**设置 → Agent 预设 → 团队主控 → 设为新任务默认**。

> ⚠️ 不要通过编辑 profile 的 `cordis.patch.yml` 去改 `agent-preset-registry` 的默认值：那会让 preset 注册表重启，运行中的会话会丢失 preset 工具。请只用设置界面。

---

## 使用

选中「团队主控」后，直接描述任务即可。主控会自己判断要不要派、派给谁、派几个。也可以直接指定档位：

```text
用 L1 把这份 CSV 转成 xlsx，保持表头不变。

先让 L2 整理这些素材，再让 L5 写终稿并做一次事实核查。

这件事拆成三份并行：L2 查资料、L3 做表、L4 写结论；最后你汇总并给我一页摘要。
```

### 主控怎么工作

1. **拆解**：把任务拆成独立、边界清晰的子任务；简单问答 / 单步操作自己做；
2. **选档**：机械可复核 → L1/L2；推理链长、错误代价高 → L4/L5；默认从最低可行档开始；
3. **分派**：每个子智能体拿到一份**自包含**的任务说明（背景、输入路径、方法、输出格式、落盘路径、验收标准）——它们看不到你的对话；
4. **并行**：互相独立的子任务在同一轮同时派出，而不是串行等待；
5. **复核**：结果回来后对照验收标准检查；关键交付再派 L4/L5 独立复核；
6. **交付**：汇总成结论 + 可直接使用的产物，并说明用了哪几档、产出在哪个文件。

### 五档难度

| 档位 | 定位 | 默认模型 / 思考强度 | 适合任务 |
| --- | --- | --- | --- |
| **L1 极简执行** | 最便宜最快 | `deepseek-flash` / off | 格式转换、字段提取、简单改写、单步操作 |
| **L2 常规执行** | 便宜且快 | `deepseek-flash` / low | 资料整理、摘要、日常写作、模板产出 |
| **L3 复杂执行** | 性价比高 | `deepseek-flash` / max | 长文写作、多步脚本、表格分析、多来源整理 |
| **L4 难题解决** | 较贵 | `deepseek-v4-pro` / high | 严谨分析、代码实现与调试、关键结论、方案设计 |
| **L5 关键任务** | 最贵最慢 | `deepseek-v4-pro` / max | 疑难推理、终审复核、关键决策支持、最高质量交付 |

> 表格是**出厂默认值**。你可以在设置页把任意一档换上你配置的任何 provider / 模型（例如 MiniMax、9router 里的模型）。

### 成本控制建议

- 默认让主控「能用 L2 就不上 L4」；
- 大批量同类任务用 L1/L2 并行，比单个高价模型串行更划算；
- 只有**错误代价高**的交付才用 L4/L5，并且只让 L5 做终审而不是全程主力。

---

## 配置每档模型

**入口：设置（Settings）→ 团队模式**（与插件页 **插件 → DSH Maestro5 → 行 `maestro-levels` → Configure** 是同一份配置）。

每一档一行，三个字段：

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| **Provider** | 当前 DSH 可路由的 provider 列表 | 如 `deepseek-official`、`deepseek-account`、`minimaxcode`、`myrouter` —— 名称取自模型目录，悬停可看路由 id |
| **模型** | 所选 provider 下实际配置的模型 | 如 `deepseek-flash` / `deepseek-v4-pro` / `MiniMax-M3.1-Flash-Preview` / `TopCoder`…；另有「自定义模型 ID…」兜底 |
| **思考强度** | **所选模型自带的 efforts** | DeepSeek：默认 / off / low / high / max；MiniMax：默认 / off / low / medium / high；无思考档的模型只有「默认」 |

交互细节：

- 切换 Provider 会自动选中该 provider 的第一个模型并清空思考强度；
- 切换模型会重置思考强度（不同模型支持的档位不同）；
- 「默认」表示不显式指定，由模型自己的默认思考强度决定。

### 生效方式（重要）

- 点 **保存** → 配置写入当前 profile 的 `cordis.patch.yml`（`- id: maestro-levels` 的 override），重启后保留；
- **保存后需要重启 DSH Desktop**，且只对**新建**的会话生效——DSH 的 preset 在会话创建时固定，已运行的会话保持原配置；
- 想恢复出厂默认：把五档改回上表的值保存 + 重启即可。

---

## 工作原理

```
┌──────────────────────────── dsh-maestro5（bundle） ───────────────────────────┐
│ cordis.patch.yml                                                             │
│   ├── 根层设置行 maestro-levels（Config.levels 是 volatile，设置页可写）        │
│   ├── preset team        主控 Lead（人设 + 全部工具 + 5 个 delegate 工具）      │
│   └── preset team-l1…l5  五个档位（人设 + 全套执行工具）                       │
│                                                                              │
│ index.js   Host 半：注册 maestroLevels 服务（读 volatile 配置）                │
│ client.js  Client 半：注册「设置 → 团队模式」页 + 插件行配置页                 │
└──────────────────────────────────────────────────────────────────────────────┘
          │ 安装时自动注册
          ▼
   新会话可选「团队主控」
          │
          ▼
   主控 Lead ──选档──► delegate_l1 … delegate_l5
          │                    │ agentOptions = !!js maestroLevels.agentOptionsFor('lN')
          │                    ▼
          │            team-lN preset 子智能体（独立上下文）
          │                    │ 完成通知（不轮询）
          ▼                    ▼
        汇总 / 复核 / 交付 ◄────┘
```

关键机制：

- **安装即注册**：DSH 安装 bundle 时读取 `dsh.bundle.patch`，把设置行与 6 个 preset 插入 profile 层栈；
- **配置可持久化**：`maestro-levels` 行的 `levels` 字段标了 `.volatile()`，因此能被设置表单编辑、由 config-editor 写回 profile 的 patch 层；
- **模型注入 preset**：主控的 5 个 `delegate-*` 委派工具通过 `!!js ctx.get('maestroLevels').agentOptionsFor('l1')` 在挂载时读取当前配置，把模型写进子智能体；
- **浏览器半手写**：`client.js` 是 `window.__ModuleLoader__` 工厂包，注册到 `settings.section` 与 `plugins.row.config` 两个槽位，**不需要打包器**。

---

## 自定义与开发

### 目录结构

```
DSH-Maestro5/
├── package.json          # bundle 清单：dsh.bundle.patch + dsh.client（浏览器半）+ engines.dsh
├── cordis.patch.yml      # 设置行 maestro-levels + 主控 preset + 5 个档位 preset
├── index.js              # Host 半：maestroLevels 服务
├── client.js             # Client 半：设置页 / 插件行配置页
├── locale/{zh,en}.json   # 插件显示名与描述
├── icon.svg              # 插件图标
├── docs/screenshots/     # README 截图
├── README.md / README.en.md
└── LICENSE
```

### 本地开发

```sh
# 把本地目录装进 profile（link，改完重启即生效）
dsh plugin --profile desktop add /path/to/DSH-Maestro5
dsh --profile desktop --dump-config   # 可选：只看组装结果，不启动服务
```

- 没有构建步骤：Host/Client 两半都是手写 JS，DSH 直接加载源目录；
- 改 `index.js` / `client.js` / `cordis.patch.yml` 后**重启 DSH**（Host 半）并刷新页面（Client 半）；
- 校验：

```sh
node --input-type=module --check < index.js
node --check client.js
node -e "require('js-yaml').load(require('fs').readFileSync('cordis.patch.yml','utf8'))"  # 若本机有 js-yaml
```

### 修改说明

| 想改什么 | 改哪里 | 生效 |
| --- | --- | --- |
| 每档模型 | **设置 → 团队模式**（推荐） | 重启后新会话 |
| 每档人设 / 工具集 | `cordis.patch.yml` → `preset-team-l1 … l5` 的 `plugins` | 重启 |
| 主控的选档 / 分派策略 | `cordis.patch.yml` → `preset-team` 的 `persona.prefix` | 重启 |
| 档位名称 / 描述 | `cordis.patch.yml` 对应 preset 的 `name` / `description`，以及 `index.js` 的 `DEFAULT_LEVELS` | 重启 |
| 新增档位 L6 | 复制 `preset-team-l5` 改 id/name/order；复制 `delegate-l5` 改 `toolName`/`agentPreset`/`agentOptionsFor('l6')`；在 `maestro-levels.levels` 与 `DEFAULT_LEVELS` 各加一行 | 重启 |
| 插件显示名 / 图标 | `locale/*.json` 的 `meta`、`icon.svg` | 重启 |

---

## 兼容性

| 项目 | 说明 |
| --- | --- |
| DSH 版本 | `>=0.2.1-rc.2 <0.3.0`（`engines.dsh`）；0.2.1-rc.2 实测通过 |
| profile | `web` / `desktop`（需要 agent preset 注册表 + Web 设置界面） |
| 依赖 | `@deepseek-ai/schemastery`（peerDependency，由 DSH 安装解析，无需你安装） |
| 构建 | 无（纯 JS bundle，安装即用） |
| 网络与权限 | 插件本身不联网、不监听端口、不写 DSH 以外文件；配置只写当前 profile 的 patch 层 |

## 已知限制

- **保存配置后需要重启 DSH**，且只影响之后新建的会话（preset 在会话创建时固定）；
- 主控自身的模型不固定，跟随会话的模型选择器；
- 五个档位 preset 也会出现在模式选择器里（DSH 对所有健康 preset 一视同仁，没有隐藏开关），描述里已注明「不建议直接选作会话模式」；
- `delegate_*` 创建的子智能体**不是 Agent Team 成员**：不会出现在 `list_agents`，也不能用 `send_message` 追加指令，完成后以通知形式回到主控；
- 子智能体使用哪个模型取决于你的模型目录；本地 provider（如 9router）需要对应服务在运行。

## 故障排查

| 现象 | 处理 |
| --- | --- |
| 插件页看不到 DSH Maestro5 / 没有 Configure | 刷新页面；仍没有则重启 DSH |
| 模式选择器里没有「团队主控」 | 确认 profile 的 `dsh.profile.bundles` 含 `dsh-maestro5`；或在插件页把它打开 |
| 设置页保存后模型没变 | 保存后必须**重启 DSH**；且要**新建会话**（旧会话保持旧配置） |
| 子智能体报模型不可用 | 设置页把该档改回可用路由；检查「设置 → 模型」中的 provider / API Key；本地网关服务要在线 |
| 档位用错了模型 | 确认改的是**正在使用的 profile**（桌面版是 `desktop`）并已重启 |
| 想完全移除 | 见下方卸载；或删除 profile `cordis.patch.yml` 里的 `- id: maestro-levels` override |

## 卸载

```sh
dsh plugin --profile desktop remove dsh-maestro5   # 或 --profile web
```

Web 界面：**插件 → DSH Maestro5 → 卸载**。卸载会同时移除它注册的 6 个 preset 与设置行；重启后「团队主控」从模式选择器消失。

## 发布到 npm（维护者）

```sh
npm login
npm publish            # 包名 dsh-maestro5，公开
```

发布前检查：

- `package.json` 的 `files` 已包含 `index.js`、`client.js`、`cordis.patch.yml`、`locale/*.json`、`icon.svg`；
- `engines.dsh` 与目标 DSH 版本匹配；
- `npm pack --dry-run` 预览打包内容；
- 发布后在 README 顶部替换 npm 版本徽章的可用性，并提交到 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)。

## 社区与收录

- GitHub topic：[`dsh-plugin`](https://github.com/topics/dsh-plugin)（加在仓库 Settings → Topics，便于被发现）
- 欢迎提交到 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 与各类 DSH 插件市场
- 问题与建议：请开 [GitHub Issue](https://github.com/bigbigtooth/DSH-Maestro5/issues)
- 贡献指南：[CONTRIBUTING.md](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/CONTRIBUTING.md) · 变更记录：[CHANGELOG.md](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/CHANGELOG.md)

## License

[MIT](https://github.com/bigbigtooth/DSH-Maestro5/blob/main/LICENSE)
