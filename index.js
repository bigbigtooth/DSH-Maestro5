/**
 * DSH Maestro5 — Host 半。
 *
 * 职责：提供一个可配置的「难度档位 → 子智能体模型」映射服务 `maestroLevels`。
 * - `Config.levels` 是 volatile 字段，因此会出现在 Web「设置 → 团队模式」与
 *   「插件 → DSH Maestro5 → 行 maestro-levels → Configure」配置页里
 *   （配置页由本包的 client.js 注册）。
 * - 保存后写入 profile 的 cordis.patch.yml，重启 DSH 后 preset 的委派工具
 *   通过 `!!js ctx.get('maestroLevels').agentOptionsFor('l1')` 读到新模型。
 */
import z from '@deepseek-ai/schemastery'

/** 默认五档：难度越高模型越强、越慢、越贵。 */
export const DEFAULT_LEVELS = [
  { level: 'l1', label: '团队·L1 极简执行', provider: 'deepseek-official', model: 'deepseek-flash', reasoningEffort: 'off' },
  { level: 'l2', label: '团队·L2 常规执行', provider: 'deepseek-official', model: 'deepseek-flash', reasoningEffort: 'low' },
  { level: 'l3', label: '团队·L3 复杂执行', provider: 'deepseek-official', model: 'deepseek-flash', reasoningEffort: 'max' },
  { level: 'l4', label: '团队·L4 难题解决', provider: 'deepseek-official', model: 'deepseek-v4-pro', reasoningEffort: 'high' },
  { level: 'l5', label: '团队·L5 关键任务', provider: 'deepseek-official', model: 'deepseek-v4-pro', reasoningEffort: 'max' },
]

/** 一个档位的配置：level 是稳定 id（l1…l5），其余是模型路由。 */
export const LevelSchema = z.object({
  level: z.string().required(),
  label: z.string().default(''),
  provider: z.string().default('deepseek-official'),
  model: z.string().required(),
  reasoningEffort: z.string().default(''),
})

export const Config = z.object({
  /** 五档难度 → 子智能体模型；volatile 使其可在设置页编辑并被 config-editor 持久化。 */
  levels: z.array(LevelSchema).default(DEFAULT_LEVELS).volatile(),
})

/**
 * 读取当前档位配置（兼容 volatile 引用与普通数组两种形态）。
 * @param {unknown} value
 * @returns {Array<object>}
 */
function currentLevels(value) {
  if (value && typeof value.get === 'function') return value.get() ?? []
  return Array.isArray(value) ? value : []
}

/**
 * Host 半入口：注册 maestroLevels 服务供 preset 的 `!!js` 表达式读取。
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {{ levels: unknown }} config
 */
export function apply(ctx, config) {
  const service = {
    /** 当前全部档位（实时读取）。 */
    levels: () => currentLevels(config.levels),
    /**
     * 某个档位的子智能体 AgentOptions。
     * @param {string} level - l1 … l5
     * @returns {{ provider: string, model: string, reasoningEffort?: string } | undefined}
     */
    agentOptionsFor(level) {
      const row = currentLevels(config.levels).find((item) => item.level === level)
      if (row === undefined) return undefined
      const options = { provider: row.provider, model: row.model }
      if (typeof row.reasoningEffort === 'string' && row.reasoningEffort.length > 0) {
        options.reasoningEffort = row.reasoningEffort
      }
      return options
    },
  }
  ctx.provide('maestroLevels', service)
}
