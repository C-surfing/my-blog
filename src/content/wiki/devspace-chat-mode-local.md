---
title: "DevSpace：把 ChatGPT 的 Chat 模式搬到本地"
updated: 2026-08-07
description: "用普通 ChatGPT Chat 对话 + DevSpace MCP 插件直接读写本地文件、跑 shell，不消耗 Codex/agentic 额度。含从安装、Cloudflare Tunnel 到首次任务的完整配置。"
tags: [DevSpace, ChatGPT, MCP, Codex, Agent]
category: Agent
type: tools
---

## 它是什么

DevSpace 是一个 MCP/OAuth 工具服务（自托管 MCP server），把本地能力（文件读写、shell、git、build）通过 MCP 协议暴露给 ChatGPT 网页版。**它不负责推理**——大脑仍然是 ChatGPT，DevSpace 只是"手和脚"：模型仍在云端，工具请求经公网 HTTPS 到达你的机器。

```
ChatGPT（消耗 ChatGPT 额度）
   ↓
DevSpace（MCP 工具，本机 127.0.0.1:7676）
   ↓
本地文件 / shell / git / build
```

完整链路：ChatGPT 云端 → 公网 HTTPS（Cloudflare Tunnel）→ DevSpace（本机回环 7676）→ 已批准的 Project 目录。连接时不会预先上传整个仓库，ChatGPT 只收到实际工具调用返回的内容。

## 为什么普通 ChatGPT 也能改本地代码

普通 ChatGPT 原本只有：聊天、推理、联网、少量系统工具。挂上 DevSpace 后，它多了一套 MCP 工具（keepkeen fork 版本）：

- `list_projects` / `project_control` / `save_progress` — 选择 Project、打开/恢复任务、保存进度
- `read_files` / `inspect` / `skills` — 读取文件、搜索/列目录、按需加载 Skill
- `apply_patch` / `show_changes` — 应用版本保护补丁、查看 Git diff
- `exec_command` / `write_stdin` / `read_process_output` — 启动命令、交互/中断、读取输出

`read_files` 和 `inspect` 支持每批 1–8 项、服务端并发处理——这就是社区说的"batch 批处理接口，更省调用次数"。上游（Waishnav/devspace）工具名略有不同：`open_workspace` / `read` / `edit` / `apply_patch` / `exec_command` / `bash`。

于是工作流变成：

```
ChatGPT: "我要看看 memory_store.cpp"
   ↓ MCP
DevSpace: 读取本地文件
   ↓
ChatGPT: 分析代码 → apply_patch
   ↓
DevSpace: 直接修改虚拟机里的文件
```

从能力结构上看：`Codex = 编码模型/Agent + 开发工具`，而 `普通 ChatGPT + DevSpace = 普通 ChatGPT 模型 + DevSpace 开发工具`——两者越来越像。

## "不占额度"到底是什么意思

ChatGPT 的用量分两个池：

| 池 | 包含 | 消耗 |
|---|---|---|
| agentic usage / credits | Codex、ChatGPT Work、Workspace Agents、ChatGPT for Excel | 大任务 agentic 用量 |
| 普通 Chat 模型用量 | 普通对话（Instant / Medium / High） | 聊天条数 / reasoning allowance |

群里说的"网页 chat 模式读本地文件不占额度"，准确含义是 **不占 Codex 的 agentic 额度**，而不是"模型算力免费"。普通 Chat 对话仍然消耗它自己的模型使用量（例如 Plus 的 Instant 约 160 条/3 小时，Medium/High 走 GPT-5.6 Sol 的 reasoning allowance）。DevSpace 只是把工具调用接进普通 Chat，路径 B（Chat + DevSpace）不走 Codex 的 agentic quota，但普通 Chat 本身的模型用量照常。

## 完整配置：从安装到跑通

以 keepkeen/devspace（社区增强分支，中文维护、含批处理工具）为例，约 10 分钟。命令都在目标机器（如银河麒麟 VM）上执行。

**前置要求**：Node.js `>=22.19 <27`、npm、Git、Bash（Windows 用 Git Bash 或 WSL）；ChatGPT 账号/Workspace 允许开发者模式与自定义 MCP 连接；cloudflared（或 ngrok / Pinggy / Tailscale Funnel 等任意公网 HTTPS 隧道工具）。

### 1. 安装

```bash
git clone https://github.com/keepkeen/devspace.git ~/tools/devspace
cd ~/tools/devspace
npm ci
npm run build
node dist/cli.js --version
```

安装、构建和长期运行应使用同一个 Node 安装（`better-sqlite3` 与 Node ABI 相关）。如需全局使用 `devspace` 命令，在仓库内执行 `npm link`。上游原版则是一行：`npm install -g @waishnav/devspace`。

### 2. 启动 HTTPS 隧道

另开一个终端：

```bash
cloudflared tunnel --url http://127.0.0.1:7676
```

记录输出的 HTTPS origin，例如 `https://random-name.trycloudflare.com`（临时域名会变，长期使用请配置稳定域名）。

### 3. 初始化并启动

```bash
cd ~/tools/devspace
node dist/cli.js init
node dist/cli.js serve
```

初始化向导会要求设置：

- **Project roots**：只批准窄范围目录（例如 `/home/Csurfing/kylin-memory/project`），不要批准 home 或磁盘根目录
- **本地端口**：默认 `7676`
- **公网 HTTPS origin**：填第 2 步的 origin，**不追加 `/mcp`**

**保存首次显示的 Owner 密码**：OAuth 批准页面需要它，DevSpace 只保存密码 verifier，无法恢复明文。它也存放在 `~/.devspace/auth.json`，注意保密。

默认启动只声明 `project:read` 和 `project:write`，不开放命令执行。需要让 ChatGPT 跑构建/测试时改为：

```bash
DEVSPACE_OAUTH_SCOPES=project:read,project:write,process:execute node dist/cli.js serve
```

只查看项目可用 `DEVSPACE_OAUTH_SCOPES=project:read`。修改 scopes 后必须重启服务、在 ChatGPT 里 Refresh 连接并重新授权。

### 4. 验证本地与公网服务

```bash
curl -fsS http://127.0.0.1:7676/healthz
curl -fsS http://127.0.0.1:7676/readyz
curl -fsS https://random-name.trycloudflare.com/readyz
node dist/cli.js doctor
```

成功标准：`healthz` 返回 `status:"alive"`；两个 `readyz` 均 HTTP 200 且返回 `ok:true`。`doctor` 只查本机配置，不能代替公网可达性测试。

### 5. 连接 ChatGPT

1. ChatGPT → **Settings → Security and login**，启用 **Developer mode**
2. 打开 [ChatGPT Plugins](https://chatgpt.com/plugins)，新增一个 MCP connection
3. MCP URL 填公网 origin 加 `/mcp`：`https://random-name.trycloudflare.com/mcp`
4. 使用 OAuth 连接，在 DevSpace 批准页输入 Owner 密码，并选择该 grant 可访问的 Project roots
5. 完成授权，确认 ChatGPT 发现的工具，然后**新建一个对话**，从工具菜单添加该连接

### 6. 完成第一次任务

先做一次只读验证（此时确保对话模式是 **Chat**，不是 Work/Codex）：

> 使用 DevSpace 查看已授权的 Project。打开我指定的项目，只读取 README.md 和 package.json，用三点说明它的用途和主要脚本；不要修改文件，也不要执行命令。

确认只读流程正确后，再试一个小修改："修改前先读取目标文件；只做我指定的改动，完成后展示变更，不要提交 Git"。

## 任务分级工作流

| 工作 | 推荐 |
|---|---|
| 看几个源码文件 | Chat + DevSpace |
| git status / ls / rg | Chat + DevSpace |
| 小修改 | Chat + DevSpace |
| 编译并修一个错误 | Chat + DevSpace |
| 分析某模块架构 | Medium/High + DevSpace |
| 大范围自主重构几十分钟 | Codex |
| 长时间无人值守 Agent task | Codex / Work |

## 混合架构（推荐）

大型工程里，让主 ChatGPT 只做 supervisor，体力活交给 DevSpace + subagent：

- ChatGPT 负责：架构决策、复杂分析、关键 review
- 本地/其他 subagent 负责：代码搜索、批量读取、跑测试、简单修复、重复工作

DevSpace 内置支持 `codex`、`claude`、`opencode`、`pi`、`cursor`、`copilot` 作为 subagent provider；任意自定义 provider 目前不是官方支持目标。本地小模型适合 grep、文件分类、简单重构、测试执行、日志摘要、格式修改；Memory 架构设计、跨模块一致性、并发/事务问题、复杂 bug 根因再交给强模型。

## 常见坑

- **ChatGPT Pro 模型/模式的工具路由问题**（issue #14）：Pro 模式会错误尝试 `multi_tool_use.parallel` 而不是 `open_workspace` / `read` / `bash` / `edit`，导致"没有 DevSpace 工具"。其他 ChatGPT 模型用同一个 DevSpace connector 正常。注意区分"ChatGPT Pro 套餐"和"模型选择器里的 Pro 模型/模式"。
- **Work ≠ 省额度**：Work 和 Codex 共用 agentic usage 池。
- **用了插件 ≠ 进入 Codex**：插件同时可用于 ChatGPT 和 Codex，关键在于对话模式选择。
- **临时隧道域名变化**：用 `DEVSPACE_PUBLIC_BASE_URL="https://new-tunnel.example.com" node dist/cli.js serve` 重启，并更新 ChatGPT 里的 MCP URL 后重新授权——只重启隧道不够，OAuth issuer 和 redirect URL 也依赖公网 origin。
- **ChatGPT 连接后没有新工具**：在 ChatGPT Plugins 打开该连接选 **Refresh**，确认工具元数据更新后再新建对话复测。
- **`doctor` 通过但连不上**：按顺序检查 服务终端输出 → 本地 `/readyz` → 公网 `/readyz` → OAuth 批准 → ChatGPT 连接元数据。
- **`better-sqlite3` ABI 错误**：确认运行时 Node 与安装时一致，执行 `npm rebuild better-sqlite3`。

## 参考

- [Waishnav/devspace](https://github.com/Waishnav/devspace) — 上游官方仓库（npm 安装：`@waishnav/devspace`）；文档明确：DevSpace 只是工具服务，不是另一个隐藏编码模型
- [keepkeen/devspace](https://github.com/keepkeen/devspace) — 社区增强分支（中文维护、源码构建、批处理工具）
- [cloudflared](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/) — 隧道工具
- [OpenAI MCP 开发者模式连接流程](https://developers.openai.com/plugins/deploy/connect-chatgpt) — 官方文档
- OpenAI Help Center — agentic usage 共享池与普通 Chat 模型使用限制的官方说明
