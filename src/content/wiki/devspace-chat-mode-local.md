---
title: "DevSpace：把 ChatGPT 的 Chat 模式搬到本地"
updated: 2026-08-07
description: "用普通 ChatGPT Chat 对话 + DevSpace MCP 插件直接读写本地文件、跑 shell，不消耗 Codex/agentic 额度。含从安装、Quick Tunnel、OAuth 到聊天内激活的完整可运行配置。"
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

普通 ChatGPT 原本只有：聊天、推理、联网、少量系统工具。挂上 DevSpace 后，它多了一套 MCP 工具：

- `open_workspace` — 打开工作区（**首次必须调用**，返回 workspaceId）
- `read` / `write` / `edit` / `apply_patch` — 文件读写与补丁
- `bash` / `exec_command` — 执行 shell 命令
- （keepkeen fork 额外有）`read_files` / `inspect` / `write_stdin` / `read_process_output` 等批处理工具

`open_workspace` 之后，后续所有文件 / shell / edit 操作都复用返回的 `workspaceId`——这是官方工作流。

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

## 完整配置：从安装到使用（Quick Tunnel 版）

以下代码为实测可完整走通的流程。命令都在目标机器（如银河麒麟 VM）上执行。

**前置要求**：Node.js `>=22.19 <27`、npm、Git、Bash（Windows 用 Git Bash 或 WSL）；ChatGPT 账号/Workspace 允许开发者模式与自定义 MCP 连接；cloudflared（或 ngrok / Pinggy / Tailscale Funnel 等任意公网 HTTPS 隧道工具）。

### 1. 安装 DevSpace

```bash
npm install -g @waishnav/devspace
devspace --version
```

初始化（向导会询问 Project roots、本地端口、公网 HTTPS origin）：

```bash
devspace init
```

- **Project roots**：只批准窄范围目录（例如 `/home/Csurfing/kylin-memory/project`），不要批准 home 或磁盘根目录
- **本地端口**：默认 `7676`
- **公网 HTTPS origin**：Quick Tunnel 每次启动都会换新地址，这里先填占位，第 3 步用 `config set` 覆盖

**保存首次显示的 Owner 密码**：OAuth 批准页面需要它，DevSpace 只保存密码 verifier，无法恢复明文。它也存放在 `~/.devspace/auth.json`，注意保密。

### 2. 启动 Quick Tunnel，拿到新 URL

```bash
cloudflared tunnel --url http://127.0.0.1:7676
```

记录输出的 HTTPS origin，例如 `https://prospective-tsunami-visitor-gilbert.trycloudflare.com`。**每次重新启动 cloudflared，这个随机域名都会变。**

### 3. 把新 URL 写进 DevSpace 配置

```bash
devspace config set publicBaseUrl https://新URL.trycloudflare.com
```

注意：这里是 `https://新URL.trycloudflare.com`，**不带 `/mcp`**。

### 4. 启动 DevSpace（必须带 trust proxy）

```bash
DEVSPACE_TRUST_PROXY=1 devspace serve
```

**`DEVSPACE_TRUST_PROXY=1` 必须加**：走 Cloudflare Tunnel 时 Cloudflare 会带 `X-Forwarded-For` 头，而 DevSpace 默认 `DEVSPACE_TRUST_PROXY=0`，express-rate-limit 会报 `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` 警告。由于 DevSpace 只监听 `127.0.0.1:7676`、Tunnel 是本机反代进来，这样配置是安全的。

工具调用日志默认开启（`DEVSPACE_LOG_TOOL_CALLS=1`），ChatGPT 每次调用 `open_workspace` / `bash` 等工具都会打印到 serve 终端——这是判断链路是否真正跑通的关键信号。

### 5. 连接 / 更新 ChatGPT

**首次连接**：

1. ChatGPT → **Settings → Security and login**，启用 **Developer mode**
2. 打开 [ChatGPT Plugins](https://chatgpt.com/plugins)，新增一个 MCP connection
3. MCP URL 填：`https://新URL.trycloudflare.com/mcp`（**这里要带 `/mcp`**）
4. 使用 OAuth 连接，在 DevSpace 批准页输入 Owner 密码，并选择该 grant 可访问的 Project roots
5. 完成授权，确认 ChatGPT 发现的工具

**Tunnel 换域名后更新**：Plugins 里把该连接的 MCP URL 改成 `https://新URL.trycloudflare.com/mcp`，重新连接/授权即可。

两个 URL 别搞混：

| 位置 | 值 |
|---|---|
| DevSpace `publicBaseUrl` | `https://新URL.trycloudflare.com`（无 `/mcp`） |
| ChatGPT MCP URL | `https://新URL.trycloudflare.com/mcp`（有 `/mcp`） |

MCP 握手成功的日志长这样：`mcp_session_created`、`POST /mcp status=200/202`、`userAgent="openai-mcp/1.0.0"`；输入密码后出现 `POST / status=302` 说明 OAuth 授权页正常完成。

### 6. 在聊天中激活 DevSpace（最容易漏的一步）

**连接成功 ≠ 当前聊天自动加载工具。** OpenAI 官方要求：连接 Plugin/App 后，还需要在聊天里主动调用它。步骤：

1. **新建一个聊天**（不要在旧聊天里继续测试）
2. 点输入框左侧的 **+** → **More / 更多** → 选择 **DevSpace**（或你自定义 App 的名字）
3. 成功后输入框附近会出现 DevSpace 的 App/Plugin 标识

另一个方式是 **@ mention**：输入 `@` 后从 UI 自动补全列表里点选 DevSpace，让它变成真正的 mention/chip。**手打纯文本 `@devspace` 没有任何作用。**

### 7. 完成第一次任务

发送这个最可靠的测试（确保对话模式是 **Chat**，不是 Work/Codex）：

> 使用 DevSpace 的 open_workspace 打开：
>
> /home/Csurfing/kylin-memory/project
>
> 使用 checkout 模式，不创建 worktree。打开后执行 pwd 和 ls -la。必须调用 DevSpace 的 open_workspace 和 bash 工具，不要根据聊天上下文推测。

**判断是否真的调用了工具**：不要只看 ChatGPT 怎么说，盯着 `devspace serve` 的终端。出现 `open_workspace` 相关的 tool-call 日志，然后 `workspaceId → bash → pwd / ls -la`，才算真正跑通：

- **没有 `open_workspace` 日志** → ChatGPT UI 没有把 DevSpace App 注入当前聊天，回去检查第 6 步的激活
- **出现 `open_workspace` 但报错** → DevSpace workspace 层的问题，按具体错误排查

### 8. 一键启动脚本

Quick Tunnel 每次开机都要重新走"启动隧道 → 更新 config → 启动 serve"三步，写成脚本：

```bash
#!/usr/bin/env bash
# DevSpace 一键启动（Quick Tunnel 模式），每次开机运行：bash ~/start-devspace.sh

# ① 后台启动 Quick Tunnel，日志写入临时文件
cloudflared tunnel --url http://127.0.0.1:7676 > /tmp/devspace-tunnel.log 2>&1 &

# ② 轮询等待 tunnel 输出 HTTPS URL
URL=""
for i in $(seq 1 30); do
  URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/devspace-tunnel.log | head -1)
  [ -n "$URL" ] && break
  sleep 2
done

if [ -z "$URL" ]; then
  echo "❌ 未获取到 Tunnel URL，检查 /tmp/devspace-tunnel.log"
  exit 1
fi
echo "✅ Tunnel URL: $URL"

# ③ 更新 DevSpace publicBaseUrl
devspace config set publicBaseUrl "$URL"

# ④ 提示 ChatGPT 侧操作（这一步只能手动）
echo "👉 请到 ChatGPT Plugins 把 DevSpace 连接的 MCP URL 更新为："
echo "   ${URL}/mcp"
echo "   然后重新连接/授权。"

# ⑤ 前台启动 DevSpace（Trust Proxy 必须开）
DEVSPACE_TRUST_PROXY=1 devspace serve
```

`devspace serve` 保持前台运行，Ctrl+C 退出后记得一并关掉 cloudflared（`kill %1` 或单独终端 Ctrl+C）。

### 9. 长期方案：Named Tunnel + 固定域名

Quick Tunnel 每次重启换域名，需要更新 DevSpace config + 重启 serve + 改 ChatGPT MCP URL 三处。长期使用推荐升级为 **Cloudflare Named Tunnel + 固定域名**，例如 `https://devspace.yourdomain.com`，以后无论重启多少次都不变：

```
ChatGPT
   ↓
https://devspace.yourdomain.com/mcp
   ↓
Cloudflare Named Tunnel
   ↓
127.0.0.1:7676
   ↓
DevSpace
```

配置步骤：

1. Cloudflare Dashboard → **Zero Trust → Networks → Tunnels** → Create a tunnel（Named）
2. 添加 DNS 路由：`devspace.yourdomain.com` → `<tunnel-id>.cfargotunnel.com`
3. 本机安装 cloudflared 并登录运行该 tunnel（`cloudflared service install` 或做成服务）
4. 一次性配置并启动：

   ```bash
   devspace config set publicBaseUrl https://devspace.yourdomain.com
   DEVSPACE_TRUST_PROXY=1 devspace serve
   ```

5. ChatGPT MCP URL 固定为 `https://devspace.yourdomain.com/mcp`，设置一次以后不用再改

之后每次开机只需确保 **cloudflared** 和 **devspace serve** 两个服务起来（可做成 systemd 开机自启）：

```ini
# /etc/systemd/system/devspace.service
[Unit]
Description=DevSpace MCP server
After=network.target

[Service]
User=你的用户名
Environment=DEVSPACE_TRUST_PROXY=1
ExecStart=/path/to/devspace serve
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

> `ExecStart` 填 `which devspace` 的实际路径。cloudflared 可用 `cloudflared service install` 注册为系统服务。
>
> 建议节奏：先用 Quick Tunnel 把 DevSpace 工作流验证稳定，再升级到固定 Tunnel。

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

- **Quick Tunnel 每次重启换域名**：需要更新三处——`devspace config set publicBaseUrl 新URL` → 重启 serve（带 `DEVSPACE_TRUST_PROXY=1`）→ ChatGPT Plugins 里把 MCP URL 改为 `新URL/mcp` 并重新连接。运行中不要重启 cloudflared，否则当前连接立即失效。
- **`ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` 警告**：走 Cloudflare Tunnel 时 Cloudflare 会带 `X-Forwarded-For`，DevSpace 默认 `DEVSPACE_TRUST_PROXY=0` 导致 express-rate-limit 告警。启动时带 `DEVSPACE_TRUST_PROXY=1` 即可消除（DevSpace 只监听 127.0.0.1，Tunnel 是本机反代，安全）。
- **`publicBaseUrl` 和 ChatGPT MCP URL 不一样**：DevSpace 配置里不带 `/mcp`，ChatGPT 连接 URL 要带 `/mcp`。
- **ChatGPT Pro 模型/模式的工具路由问题**（issue #14）：Pro 模式会错误尝试 `multi_tool_use.parallel` 而不是 `open_workspace` / `read` / `bash` / `edit`，导致"没有 DevSpace 工具"。其他 ChatGPT 模型用同一个 DevSpace connector 正常。注意区分"ChatGPT Pro 套餐"和"模型选择器里的 Pro 模型/模式"。
- **Work ≠ 省额度**：Work 和 Codex 共用 agentic usage 池。
- **用了插件 ≠ 进入 Codex**：插件同时可用于 ChatGPT 和 Codex，关键在于对话模式选择。
- **MCP 握手成功但聊天里没有工具**：日志出现 `mcp_session_created`、`POST /mcp 200/202` 只代表 ChatGPT 连上了 MCP，不代表当前聊天加载了工具。必须新建聊天 → `+` → More → 选择 DevSpace（或 @ 自动补全点选，手打 `@devspace` 无效）。输入框附近出现 App 标识才算注入成功。
- **`stream ... canceled by remote with error code 0`**：客户端结束 HTTP stream 时 Cloudflare 的普通记录，只要 MCP session 已建立就不影响连接，不是核心问题。
- **ChatGPT 连接后没有新工具**：在 ChatGPT Plugins 打开该连接选 **Refresh**，确认工具元数据更新后再新建对话复测。
- **`doctor` 通过但连不上**：按顺序检查 服务终端输出 → 本地 `/readyz` → 公网 `/readyz` → OAuth 批准 → ChatGPT 连接元数据。
- **`better-sqlite3` ABI 错误**：确认运行时 Node 与安装时一致，执行 `npm rebuild better-sqlite3`。

## 参考

- [Waishnav/devspace](https://github.com/Waishnav/devspace) — 上游官方仓库（`npm install -g @waishnav/devspace`）；文档明确：DevSpace 只是工具服务，不是另一个隐藏编码模型
- [keepkeen/devspace](https://github.com/keepkeen/devspace) — 社区增强分支（批处理工具）；源码构建后需在仓库内 `npm link` 才能用全局 `devspace` 命令
- [cloudflared](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/) — 隧道工具
- [OpenAI MCP 开发者模式连接流程](https://developers.openai.com/plugins/deploy/connect-chatgpt) — 官方文档
- OpenAI Help Center — agentic usage 共享池与普通 Chat 模型使用限制的官方说明
