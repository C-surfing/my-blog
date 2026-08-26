---
title: "opencodex：把任意大模型接进 Codex"
updated: 2026-08-26
description: "opencodex（npm @bitkyc08/opencodex）是一个本地通用 provider 代理：把 Codex 的 Responses API 翻译成 DeepSeek/Kimi/GLM/Gemini/Grok/Ollama 等 40+ 供应商的协议，让 Codex、Claude Code、Claude Desktop、Grok Build 跑任何模型。含安装、dashboard 配置、账号池、与 gpt ↔ deepseek 切换的完整实测工作流及踩坑记录。"
tags: [opencodex, Codex, LLM, Proxy, DeepSeek, Agent]
category: Agent
type: tools
---

## 它是什么

opencodex（GitHub [lidge-jun/opencodex](https://github.com/lidge-jun/opencodex)，12.1k stars，npm 包 `@bitkyc08/opencodex`，CLI 命令 `ocx`）是一个轻量本地代理，口号是 **"make codex open!"**——把 Codex 的 Responses API 翻译成任意供应商的协议，流式、工具调用、推理 token、图像，双向转换。

**它不负责推理**——大脑是任何你指向的 LLM，opencodex 只是"路由器 + 翻译官"：模型仍在你选的服务商那里，Codex 的请求经本机代理转发过去，再把响应流翻译回 Codex 能懂的格式。

```
Codex CLI / App / SDK / Claude Code / Grok Build
        ↓ 各自的 wire format（Responses API / Claude Messages）
opencodex（127.0.0.1:10100，dashboard: http://localhost:10100）
        ↓ 翻译成目标 provider 协议
DeepSeek / Kimi / GLM / Gemini / Grok / Claude / Qwen / Ollama / OpenRouter / ... 40+
```

关键点：**零客户端补丁**（zero client patches）——不改 Codex 本体，通过注入配置 + 覆写模型目录让 Codex 原生 UI 认代理模型。一个端口同时服务 Codex 和 Claude Code（`ocx claude` 用同一端口启动 Claude Code，模型选择器里就能看到所有路由模型）。

## 为什么需要它

Codex 原生只认 OpenAI 模型（gpt-5.x 系列），要 ChatGPT 账号或 OpenAI API key。opencodex 解决的问题：

- **换模型自由**：在 Codex 里用 DeepSeek、Kimi、GLM、Gemini、Grok，甚至本地 Ollama——模型选择器里直接出现路由模型（带 reasoning effort 级别，和原生模型并列）
- **保留原生体验**：不用切工具，Codex 的 TUI/App/SDK 界面、sub-agent 体系全部照旧，只是"脑子"换了
- **账号池**：可以管理多个 ChatGPT/Codex 账号，配额耗尽自动切到下一个健康账号

和 DevSpace 的对照：DevSpace 是给普通 ChatGPT 加"手和脚"（MCP 工具接本地文件/shell），opencodex 是给 Codex 换"脑子"（模型路由到任意供应商）。两者都保留原 UI、都是本地小服务，互补不冲突。

## 核心能力

| 能力 | 说明 |
|---|---|
| 40+ 内置 provider | Claude、Gemini、Grok、GLM、DeepSeek、Kimi、Qwen、Ollama、OpenRouter、Azure、Groq 等；任意 OpenAI 兼容端点可自定义 |
| 五类 adapter | Anthropic Messages、Google Gemini、Azure、OpenAI Responses 直通、OpenAI 兼容 Chat Completions |
| ChatGPT 账号池 | 多账号、dashboard 刷新 5h/周/30d 配额、新会话路由到用量最低的健康账号、现有线程保持账号亲和（长 SSH/tmux 会话不跳号）、cooldown/fail-closed、401/403/429 自动恢复 |
| Combos | 一个虚拟 model id = 跨 provider failover 或加权轮询 |
| Sub-agents on any model | Codex `spawn_agent` 的 sub-agent picker 里 pin 最多 5 个路由/原生模型，v1/base/v2 surface 全局切换 + fallback 链 |
| OAuth 免 key | xAI、Anthropic、Kimi 直接账号登录（自动刷新）；或转发 `codex login`、贴 API key、`${ENV_VAR}` 引用 |
| Search & Vision sidecars | 非 OpenAI 模型通过 gpt-5.4-mini sidecar 获得真实网络搜索和图像理解 |
| Web dashboard | `http://localhost:10100`：providers、OAuth 状态、模型选择、实时请求日志（含 cache token 计数） |
| 干净退出 | `ocx stop` 把 Codex 恢复成原始配置（zero residue） |
| 有界内存 | 36 类进程保留状态全部有上限（256 MiB 内存预算、LRU cap、过期清扫），无无界缓存 |

## 安装与使用（实测可走通）

**前置**：Node.js 18+（Bun runtime 安装时自动捆绑，无需单独装），Windows 不需要 WSL（原生跑）。

### 1. 安装并启动代理

```bash
npm install -g @bitkyc08/opencodex
ocx start        # 启动代理 + dashboard
```

打开 <http://localhost:10100>，在 web dashboard 里：添加 provider（40+ 内置，DeepSeek 等直接选，填 API key）、选模型、需要时管理 ChatGPT 账号池。`ocx gui` 随时重新打开 dashboard。

### 2. 接线 Codex

```bash
ocx init         # 交互式：写 ~/.opencodex/config.json 并接线 Codex
```

`ocx start` / `ocx init` 对 Codex 做的事（了解后好排查）：

- `config.toml` 注入 `# Auto-injected by opencodex` 注释 + `openai_base_url = "http://127.0.0.1:10100/v1"`，`model_catalog_json` 指向 opencodex 管理的 catalog 文件（`~/.codex/opencodex-catalog.json`，旧版叫 `cc-switch-model-catalog.json`）
- `model` 切到代理模型，模型选择器里只剩代理模型（replace-not-merge，gpt 会暂时消失——正常现象）
- **shim**：`codex.cmd`/`codex.ps1`/`codex` 被替换成 wrapper（原文件备份为 `codex.opencodex-real.*`），启动 `codex` 自动拉起代理
- **journal 快照**：`~/.codex/opencodex-journal.json` 存注入前的完整配置（base64），`ocx stop` 时据此还原

### 3. 日常使用（gpt ↔ 第三方模型切换）

这是我实际用的工作流——gpt 是日常主力，第三方模型按需临时开：

| 场景 | 操作 |
|---|---|
| 用 gpt-5.x（日常） | 不开代理，Codex 原生直连 |
| 用 DeepSeek / mimo 等 | Windows PowerShell 里 `ocx start` → 重启 Codex → 模型选择器选代理模型 |
| 用完切回 gpt | `ocx stop`（干净还原）→ 重启 Codex |

注意：**从 WSL 里跑 `ocx` 是坏的**（报 `Module not found .../cli/index.ts` 路径解析错误），要在 Windows PowerShell/cmd 里跑。

### 4. 服务化与卸载

```bash
ocx service              # 常驻服务：崩溃自动重启（Windows=Task Scheduler 隐藏任务 / Linux=systemd user unit / macOS=launchd）
ocx service uninstall    # 移除服务
ocx codex-shim install   # 轻量按需启动（shim 模式，无后台常驻）
ocx codex-shim uninstall # 移除 shim，恢复原生 codex 命令
ocx uninstall            # 全量卸载（会清 ~/.opencodex/config.json 含你配的 providers，慎用）
```

### 5. 健康检查与远程访问

- `ocx status` / `ocx doctor` / `ocx health` / `ocx ready` 报告运行状态；HTTP 端点 `GET /healthz`（存活）、`GET /readyz`（同步完成就绪，200=ready / 503=pending/failed）
- 默认只绑 `127.0.0.1`，无需认证；绑 `0.0.0.0` 强制要求 `OPENCODEX_API_AUTH_TOKEN`，每个请求带 `x-opencodex-api-key` 头

## 常见坑（全部实测踩过）

- **代理死了没善后 → `os error 10061`（目标计算机积极拒绝）**：ocx 进程被杀/崩溃后，注入的 `openai_base_url` 还在 config.toml 里，所有 Codex 请求打向没人监听的 10100。诊断顺序：①10100 端口有没有监听（`Get-NetTCPConnection -State Listen | ? {$_.LocalPort -eq 10100}`）②`~/.codex/opencodex-journal.json` 是否还在（正常 `ocx stop` 会删掉它，在=非正常死亡）③config.toml 是否还有注入行。修法：备份后删注入行（model_catalog_json / `# Auto-injected by opencodex` / openai_base_url）→ journal 改名归档 → 重启 Codex。这不是网络问题，Clash 正常与否都无关。
- **journal 旧快照回滚**：代理被杀（没走 `ocx stop`）后，journal 里是**旧**的注入前快照。下次 `ocx start` 检测到死 pid 会"restore Codex state from journal"，静默把整个配置回滚到旧版本（旧 runtime 路径、可能丢后来新加的 MCP server）。修法：`mv opencodex-journal.json opencodex-journal.json.bak-<ts>`，下次干净启动会重建。
- **模型选择器里 gpt 不见了**：opencodex 的 catalog 是 replace-not-merge（覆盖而非合并），代理模型全量替换内置列表——这是设计行为，`ocx stop` 会还原。它还会覆写 `models_cache.json`（Codex 的内置 catalog 缓存），需要时用备份恢复。
- **`ocx stop` 报 `ACL hardening timed out (ETIMEDOUT)` ≠ 恢复失败**：Windows 上恢复 models_cache.json 时对临时文件跑 icacls 加固，暂态卡顿超过默认 5 秒预算（`OPENCODEX_ACL_TIMEOUT_MS`，上限 60000）就抛错并吞掉完成消息。先查文件证据再判断：config.toml 无 10100/PROXY_MANAGED、models_cache.json 是纯 gpt 且 mtime 为本次 stop 时刻、journal 已删 = 恢复实际完成。根治：设用户级环境变量 `OPENCODEX_ACL_TIMEOUT_MS=30000` 后新开终端。
- **WSL 里跑 ocx 报 Module not found**：官方装的 WSL shim 有路径解析 bug，`ocx` 一律在 Windows PowerShell/cmd 跑。
- **改配置后 Codex 不生效**：Codex Desktop 应用层缓存 catalog，改完要**完全重启 app**（不是新开会话）；而且运行中的 Codex 退出时会覆写 config.toml——改配置前先杀进程（`Get-Process ChatGPT | Stop-Process -Force`）。
- **长 SSE 流经代理有卡顿**：代理转发长流时有性能损耗，超长任务/大 rollout 建议直接用原生（gpt 或直连），把代理留给切换第三方模型这种场景。
- **账号池/代理路由的合规风险**：OpenAI、Anthropic 等 ToS 可能禁止第三方代理路由流量，账号有 suspend 风险。官方文档也声明"账号池仅用于路由和运维韧性，不保证规避限流/封号"，**使用前自查各 provider 条款（UAYOR）**。

## 参考

- [lidge-jun/opencodex](https://github.com/lidge-jun/opencodex) — 上游仓库（12.1k stars，MIT）
- [opencodex.me](https://opencodex.me/) — 官方文档（安装、providers、routing、combos、sub-agents、sidecars、CLI/config/API 参考）
- [npm: @bitkyc08/opencodex](https://www.npmjs.com/package/@bitkyc08/opencodex)
- 本地实测与排障记录：codex-model-catalog skill（注入了什么、journal 回滚、10061 死代理诊断、ACL 超时、干净退出配方）
