// 仓库自检：校验 bundle 清单、补丁结构与关键注册，供本地与 GitHub Actions 使用。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import yaml from 'js-yaml'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const problems = []

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8')
}

function check(condition, message) {
  if (!condition) problems.push(message)
}

// 1) JSON 文件
for (const file of ['package.json', 'locale/zh.json', 'locale/en.json']) {
  try {
    JSON.parse(read(file))
  } catch (error) {
    problems.push(`${file} is not valid JSON: ${error.message}`)
  }
}

// 2) 补丁 YAML（允许 DSH 的 !!js 标签）
const jsType = new yaml.Type('tag:yaml.org,2002:js', {
  kind: 'scalar',
  construct: (data) => ({ __jsExpr: data }),
})
const schema = yaml.DEFAULT_SCHEMA.extend([jsType])

let patches = []
try {
  patches = yaml.load(read('cordis.patch.yml'), { schema })
  check(Array.isArray(patches), 'cordis.patch.yml must be a top-level array of patches')
} catch (error) {
  problems.push(`cordis.patch.yml is not valid YAML: ${error.message}`)
}

const rows = Array.isArray(patches) ? patches.flatMap((patch) => (Array.isArray(patch?.insert) ? patch.insert : [])) : []
const settingsRow = rows.find((row) => row?.id === 'maestro-levels')
check(settingsRow !== undefined, 'missing settings row maestro-levels')
check(settingsRow?.name === 'dsh-maestro5', 'settings row must mount the dsh-maestro5 package')
check(Array.isArray(settingsRow?.config?.levels) && settingsRow.config.levels.length === 5, 'maestro-levels must declare five levels')
check(
  (settingsRow?.config?.levels ?? []).every((level) => ['l1', 'l2', 'l3', 'l4', 'l5'].includes(level?.level)),
  'levels must be l1…l5',
)

const presets = rows.filter((row) => row?.name === '@deepseek-ai/dsh-agent-preset')
const presetIds = presets.map((row) => row?.config?.id)
for (const id of ['team', 'team-l1', 'team-l2', 'team-l3', 'team-l4', 'team-l5']) {
  check(presetIds.includes(id), `missing agent preset ${id}`)
}
check(new Set(presetIds).size === presetIds.length, 'duplicate agent preset ids')

const lead = presets.find((row) => row?.config?.id === 'team')
const delegates = (lead?.config?.plugins ?? []).filter((plugin) => plugin?.name === '@deepseek-ai/dsh-tool-subagent')
check(delegates.length === 5, 'team preset must mount five delegation tools')
for (const delegate of delegates) {
  const config = delegate?.config ?? {}
  check(typeof config.toolName === 'string' && config.toolName.startsWith('delegate_l'), 'delegation tool must be named delegate_lN')
  check(typeof config.agentPreset === 'string' && config.agentPreset.startsWith('team-l'), 'delegation tool must reference a tier preset')
  check(config.agentOptions?.__jsExpr?.includes('maestroLevels'), 'delegation agentOptions must read the maestroLevels service')
  check(Array.isArray(delegate?.inject) && delegate.inject.includes('maestroLevels'), 'delegation tool must inject maestroLevels')
}

// 3) Host / Client 入口
const host = read('index.js')
check(host.includes("ctx.provide('maestroLevels'"), 'index.js must provide the maestroLevels service')
check(host.includes('export const Config'), 'index.js must export Config')
check(host.includes('export function apply'), 'index.js must export apply')
const client = read('client.js')
check(client.includes("id: 'dsh-maestro5'"), 'client.js must register under the dsh-maestro5 module id')
check(client.includes('dsh-maestro5#maestro-levels'), 'client.js must register the maestro-levels row configuration')
check(client.includes("'settings.section'"), 'client.js must register the Team Mode settings page')

if (problems.length > 0) {
  console.error('validate: FAILED')
  for (const problem of problems) console.error(` - ${problem}`)
  process.exit(1)
}
console.log(`validate: OK (${presets.length} presets, ${delegates.length} delegation tools)`)
