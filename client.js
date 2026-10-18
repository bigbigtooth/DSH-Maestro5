/**
 * DSH Maestro5 — Client 半（浏览器）。
 *
 * 提供两个入口配置 L1–L5 每档子智能体的模型：
 * 1) 设置（Settings）→ 团队模式：一级设置页；
 * 2) 插件（Plugins）→ DSH Maestro5 → 行 maestro-levels → Configure：插件行配置页。
 *
 * Provider / 模型 / 思考强度全部来自当前 DSH 的模型目录
 * （remote.session.modelCatalog），因此这里列出的是本机实际可路由的
 * provider 与模型；思考强度按所选模型自带的 efforts 呈现。
 *
 * 保存走 Host settings → config-editor → 写入 profile cordis.patch.yml；
 * preset 的委派工具在启动时读取该配置，因此保存后需重启 DSH 生效。
 */
window.__ModuleLoader__.load({
  id: 'dsh-maestro5',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const CUSTOM = '__custom__'

    /** 每档的一张说明，帮助用户判断「什么任务交给这一档」。 */
    const LEVEL_HINTS = {
      l1: '机械 · 单步 · 可快速核对',
      l2: '常规任务 · 整理 · 日常写作',
      l3: '多步骤 · 长文 · 脚本 · 分析',
      l4: '难题 · 严谨推理 · 代码 · 关键结论',
      l5: '关键交付 · 终审 · 最高质量',
    }

    const S = {
      wrap: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '780px',
        color: 'var(--dsw-alias-label-primary)',
        fontSize: '13px',
        lineHeight: '1.5',
      },
      title: { margin: 0, fontSize: '17px', fontWeight: 600, lineHeight: '1.4' },
      hint: { margin: 0, color: 'var(--dsw-alias-label-secondary)', fontSize: '12px' },
      card: {
        border: '1px solid var(--dsw-alias-border-l1)',
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'var(--dsw-alias-bg-layer-1)',
      },
      levelRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px 18px',
        alignItems: 'flex-start',
        padding: '12px 14px',
        borderTop: '1px solid var(--dsw-alias-border-l1)',
      },
      meta: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minWidth: '150px',
        flex: '0 0 150px',
      },
      levelName: { fontWeight: 600, fontSize: '13px' },
      levelHint: { color: 'var(--dsw-alias-label-secondary)', fontSize: '11px', lineHeight: '1.4' },
      fields: {
        flex: '1 1 320px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
        gap: '10px',
        minWidth: 0,
      },
      field: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 },
      fieldLabel: { color: 'var(--dsw-alias-label-secondary)', fontSize: '11px' },
      input: {
        background: 'var(--dsw-alias-bg-base)',
        color: 'var(--dsw-alias-label-primary)',
        border: '1px solid var(--dsw-alias-border-l1)',
        borderRadius: '6px',
        padding: '5px 8px',
        font: 'inherit',
        width: '100%',
        boxSizing: 'border-box',
        minWidth: 0,
      },
      customInput: {
        background: 'var(--dsw-alias-bg-base)',
        color: 'var(--dsw-alias-label-primary)',
        border: '1px solid var(--dsw-alias-border-l1)',
        borderRadius: '6px',
        padding: '4px 8px',
        font: 'inherit',
        fontSize: '12px',
        width: '100%',
        boxSizing: 'border-box',
      },
      actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        paddingTop: '2px',
      },
      button: {
        background: 'transparent',
        color: 'var(--dsw-alias-label-primary)',
        border: '1px solid var(--dsw-alias-border-l2)',
        borderRadius: '6px',
        padding: '6px 18px',
        font: 'inherit',
        cursor: 'pointer',
      },
      ok: { color: 'var(--dsw-alias-state-success-primary)', fontSize: '12px' },
      error: { color: 'var(--dsw-alias-state-error-primary)', fontSize: '12px' },
    }

    /** 订阅 configForms 的 ConfigFormController（设置页用）。 */
    function useFormSnapshot(controller) {
      const [snapshot, setSnapshot] = React.useState(() => controller.getSnapshot())
      React.useEffect(() => {
        const off = controller.subscribe(() => setSnapshot(controller.getSnapshot()))
        setSnapshot(controller.getSnapshot())
        return off
      }, [controller])
      return snapshot
    }

    /**
     * 读取当前 Host 的模型目录：provider 分组 + 每个模型自带的思考强度。
     * @param {(() => Promise<any>) | undefined} loadCatalog
     */
    function useModelCatalog(loadCatalog) {
      const [catalog, setCatalog] = React.useState({ status: 'loading', groups: [], failures: [] })
      React.useEffect(() => {
        let alive = true
        if (typeof loadCatalog !== 'function') {
          setCatalog({ status: 'unavailable', groups: [], failures: [] })
          return () => {}
        }
        setCatalog({ status: 'loading', groups: [], failures: [] })
        loadCatalog()
          .then((response) => {
            if (!alive) return
            if (response && response.ok === true) {
              const value = response.value || {}
              setCatalog({ status: 'ready', groups: value.groups || [], failures: value.failures || [] })
            } else {
              setCatalog({ status: 'error', groups: [], failures: [] })
            }
          })
          .catch(() => {
            if (alive) setCatalog({ status: 'error', groups: [], failures: [] })
          })
        return () => {
          alive = false
        }
      }, [loadCatalog])
      return catalog
    }

    /** 统一的字段块：小标签 + 控件。 */
    function Field(props) {
      return h(
        'label',
        { style: S.field },
        h('span', { style: S.fieldLabel }, props.label),
        props.children,
      )
    }

    /**
     * 五档模型编辑器（row 配置页与设置页共用）。
     * @param {{ snapshot: object|undefined, mutate: Function, loadCatalog?: Function }} props
     */
    function LevelsEditor(props) {
      const snapshot = props.snapshot
      const mutate = props.mutate
      const catalog = useModelCatalog(props.loadCatalog)
      const [draft, setDraft] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [note, setNote] = React.useState('')
      const [failed, setFailed] = React.useState('')
      const [customModels, setCustomModels] = React.useState({})

      React.useEffect(() => {
        if (draft !== null) return
        const value = snapshot && snapshot.value
        if (value && Array.isArray(value.levels)) setDraft(value.levels.map((row) => ({ ...row })))
      }, [snapshot, draft])

      if (snapshot === undefined) {
        return h('p', { style: S.hint }, '该配置当前不可用（Host 未提供 maestro-levels 设置）。')
      }
      if (snapshot.status === 'loading') {
        return h('p', { style: S.hint }, '正在加载配置…')
      }
      if (snapshot.status === 'unavailable') {
        return h('p', { style: S.hint }, 'Host 暂未提供 maestro-levels 设置。')
      }
      if (draft === null) {
        return h('p', { style: S.hint }, '配置为空：请重启 DSH Desktop 后重试。')
      }

      const groups = catalog.status === 'ready' ? catalog.groups : []
      const writable = snapshot.writable !== false
      const setRows = (index, patch) => {
        setNote('')
        setFailed('')
        setDraft(draft.map((row, i) => (i === index ? { ...row, ...patch } : row)))
      }
      const markCustom = (index, on) => setCustomModels({ ...customModels, [index]: on })
      const save = async () => {
        setBusy(true)
        setNote('')
        setFailed('')
        try {
          const ok = await mutate([{ op: 'set', path: ['levels'], value: draft }], snapshot.revision)
          if (ok === false) {
            setFailed('保存失败：配置可能已被其他窗口修改，请刷新页面后重试。')
          } else {
            setNote('已保存。重启 DSH Desktop 后，新创建的会话会使用新模型。')
          }
        } catch (error) {
          setFailed(error instanceof Error ? error.message : String(error))
        } finally {
          setBusy(false)
        }
      }

      const catalogHint = (() => {
        if (catalog.status === 'loading') return '正在读取当前 DSH 模型目录…'
        if (catalog.status === 'unavailable') return '当前环境没有模型目录服务：Provider / 模型请手动填写。'
        if (catalog.status === 'error') return '模型目录读取失败：仍保留已保存的值，可重启 DSH 后重试。'
        if (catalog.failures.length > 0) {
          return '部分 provider 暂不可用：' + catalog.failures.map((item) => item.name || item.id).join('、')
        }
        return null
      })()

      return h(
        'div',
        { style: S.wrap },
        catalogHint ? h('p', { style: S.hint }, catalogHint) : null,
        h(
          'div',
          { style: S.card },
          draft.map((row, index) => {
            const group = groups.find((item) => item.id === row.provider)
            const providerOptions = groups.map((item) => ({
              value: item.id,
              label: item.name && item.name !== item.id ? item.name : item.id,
              title: item.id,
            }))
            if (!providerOptions.some((option) => option.value === row.provider)) {
              providerOptions.push({ value: row.provider, label: row.provider + '（未在目录）', title: row.provider })
            }
            const models = group === undefined ? [] : group.models || []
            const modelOptions = models.map((item) => ({
              value: item.id,
              label: item.id,
              title: item.name && item.name !== item.id ? item.id + ' · ' + item.name : item.id,
            }))
            const modelKnown = modelOptions.some((option) => option.value === row.model)
            if (!modelKnown && row.model) {
              modelOptions.push({ value: row.model, label: row.model + '（未在目录）', title: row.model })
            }
            const custom = customModels[index] === true
            const model = models.find((item) => item.id === row.model)
            const efforts = (model && model.reasoning && model.reasoning.efforts) || []
            const defaultEffort = model && model.reasoning && model.reasoning.defaultEffort
            const effortOptions = [
              { value: '', label: defaultEffort ? '默认（' + defaultEffort + '）' : '默认' },
            ].concat(
              efforts.map((item) => ({
                value: item.id,
                label: item.name && item.name !== item.id ? item.id + ' · ' + item.name : item.id,
              })),
            )
            if (row.reasoningEffort && !effortOptions.some((option) => option.value === row.reasoningEffort)) {
              effortOptions.push({ value: row.reasoningEffort, label: row.reasoningEffort + '（未在该模型目录）' })
            }
            return h(
              'div',
              { key: row.level, style: { ...S.levelRow, borderTop: index === 0 ? 'none' : S.levelRow.borderTop } },
              h(
                'div',
                { style: S.meta },
                h('div', { style: S.levelName }, row.label || String(row.level).toUpperCase()),
                h('div', { style: S.levelHint }, LEVEL_HINTS[row.level] || ''),
              ),
              h(
                'div',
                { style: S.fields },
                h(
                  Field,
                  { label: 'Provider' },
                  h(
                    'select',
                    {
                      style: S.input,
                      value: row.provider,
                      title: row.provider,
                      onChange: (event) => {
                        const provider = event.target.value
                        const nextGroup = groups.find((item) => item.id === provider)
                        const firstModel = nextGroup && nextGroup.models && nextGroup.models[0]
                        markCustom(index, false)
                        setRows(index, {
                          provider,
                          model: firstModel ? firstModel.id : row.model,
                          reasoningEffort: '',
                        })
                      },
                    },
                    providerOptions.map((option) =>
                      h('option', { key: option.value, value: option.value, title: option.title }, option.label),
                    ),
                  ),
                ),
                h(
                  Field,
                  { label: '模型' },
                  h(
                    'select',
                    {
                      style: S.input,
                      value: custom ? CUSTOM : row.model,
                      title: row.model,
                      onChange: (event) => {
                        const value = event.target.value
                        if (value === CUSTOM) {
                          markCustom(index, true)
                          return
                        }
                        markCustom(index, false)
                        setRows(index, { model: value, reasoningEffort: '' })
                      },
                    },
                    modelOptions.map((option) =>
                      h('option', { key: option.value, value: option.value, title: option.title }, option.label),
                    ),
                    h('option', { value: CUSTOM }, '自定义模型 ID…'),
                  ),
                  custom
                    ? h('input', {
                        style: S.customInput,
                        value: row.model,
                        placeholder: '输入模型 ID',
                        spellCheck: false,
                        onChange: (event) => setRows(index, { model: event.target.value, reasoningEffort: '' }),
                      })
                    : null,
                ),
                h(
                  Field,
                  { label: '思考强度' },
                  h(
                    'select',
                    {
                      style: S.input,
                      value: row.reasoningEffort || '',
                      title: row.reasoningEffort || '默认',
                      onChange: (event) => setRows(index, { reasoningEffort: event.target.value }),
                    },
                    effortOptions.map((option) =>
                      h('option', { key: option.value, value: option.value }, option.label),
                    ),
                  ),
                ),
              ),
            )
          }),
        ),
        h(
          'div',
          { style: S.actions },
          h(
            'button',
            {
              type: 'button',
              style: { ...S.button, opacity: busy || !writable ? 0.6 : 1 },
              disabled: busy || !writable,
              onClick: save,
            },
            busy ? '保存中…' : '保存',
          ),
          note ? h('span', { style: S.ok }, note) : null,
          failed ? h('span', { style: S.error }, failed) : null,
        ),
        writable ? null : h('p', { style: S.error }, '当前配置不可写（可能被更高优先级的配置层覆盖）。'),
      )
    }

    return {
      inject: ['slots', 'configForms', 'remote', 'remote.session'],
      apply(ctx) {
        const loadCatalog = () => ctx.remote.session.modelCatalog()

        // 入口 1：设置（Settings）→ 团队模式
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            {
              name: 'settings.section',
              id: 'team-mode',
              order: 25,
              label: '团队模式',
            },
            function TeamModeSection() {
              const controller = ctx.configForms.get('maestro-levels')
              const snapshot = useFormSnapshot(controller)
              return h(
                'section',
                { style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '2px 0 16px' } },
                h('h2', { style: S.title }, '团队模式'),
                h(
                  'p',
                  { style: S.hint },
                  '「团队主控」会按任务难度把工作分给 L1–L5 子智能体。下面为每一档选择 Provider、模型与思考强度；模型列表来自「设置 → 模型」里当前配置的路由，保存后重启 DSH Desktop 生效。',
                ),
                h(LevelsEditor, {
                  snapshot,
                  mutate: (ops, revision) => controller.mutate(ops, revision),
                  loadCatalog,
                }),
              )
            },
          ),
        )

        // 入口 2：插件（Plugins）→ DSH Maestro5 → 行 maestro-levels → Configure
        ctx.slots.inject('plugins.row.config', () =>
          ctx.slots.register(
            {
              name: 'plugins.row.config',
              key: 'dsh-maestro5#maestro-levels',
            },
            function RowConfigView(props) {
              if (props.view === 'summary') {
                return h('span', { style: S.hint }, 'L1–L5 五档子智能体的模型路由（保存后重启 DSH 生效）')
              }
              if (props.form === undefined) {
                return h('div', { style: S.wrap }, h('p', { style: S.hint }, '该行当前没有可编辑的配置字段。'))
              }
              return h(LevelsEditor, {
                snapshot: props.form.state,
                mutate: props.form.mutate,
                loadCatalog,
              })
            },
          ),
        )
      },
    }
  },
})
