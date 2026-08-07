---
title: "DevSpace：把 ChatGPT 的 Chat 模式搬到本地"
updated: 2026-08-07
description: "用普通 ChatGPT Chat 对话 + DevSpace MCP 插件直接读写本地文件、跑 shell，不消耗 Codex/agentic 额度。完整配置、额度语义与任务分级。"
tags: [DevSpace, ChatGPT, MCP, Codex, Agent]
category: Agent
type: guides
---

## 它是什么

DevSpace 是一个 MCP 工具服务（Tool Server），把本地能力（文件读写、shell、git、build）通过 MCP 协议暴露给 ChatGPT。**它不负责推理**——大脑仍然是 ChatGPT，DevSpace 只是"手和脚"。

```
ChatGPT（消耗 ChatGPT 额度）
   ↓
DevSpace（MCP 工具）
   ↓
本地文件 / shell / git / build
```

## 为什么普通 ChatGPT 也能改本地代码

普通 ChatGPT 原本只有：聊天、推理、联网、少量系统工具。挂上 DevSpace 后，它多了一套 MCP 工具：

- `open_workspace` — 打开工作区
- `read` — 读取文件
- `edit` / `apply_patch` — 修改文件
- `exec_command` / `bash` — 执行 shell 命令
- （keepkeen fork 额外有）`batch_read` / `batch_inspect` / `write_stdin`

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

群里说的"网页 chat 模式读本地文件不占额度"，准确含义是 **不占 Codex 的 agentic 额度**，而不是"模型算力免费"。普通 Chat 对话仍然消耗它自己的模型使用量（例如 Plus 的 Instant 约 160 条/3 小时，Medium/High 走 GPT-5.6 Sol 的 reasoning allowance）。

### 两条真正零额度的路

1. **换 MCP Host**：不用 ChatGPT 当宿主，改用 Claude Code / Codex CLI / OpenCode / Cursor / Copilot / Pi 等。DevSpace 内置支持 `codex`、`claude`、`opencode`、`pi`、`cursor`、`copilot` 作为 subagent provider，账单转移到对应平台；**任意自定义 provider 目前不是官方支持目标**。
2. **本地模型**：Ollama / vLLM / llama.cpp / Qwen-Coder / DeepSeek-Coder 跑本地 GPU/CPU。额度 = 0，但代价是算力、显存、电费、推理速度和模型能力。

## 完整配置（Chat + DevSpace 路线）

前提：DevSpace 已安装并作为插件/App 接入 ChatGPT（可经 Cloudflare Tunnel 连到远程 VM，链路示例：普通网页 ChatGPT → Plugin → Cloudflare → DevSpace → 本地项目）。

1. **新建普通对话，确认模式选择器是 `Chat`**，不是 `Work` 也不是 `Codex`。Work 与 Codex 共用 agentic usage 结构，选了 Work 照样烧 agentic 池。
2. **在对话里挂载 DevSpace**（通过插件/App 调用）。
3. **打开工作区并验证链路**：让 ChatGPT 用 DevSpace 执行：

   ```
   open_workspace /home/Csurfing/kylin-memory/project
   pwd
   git status
   ```

   能返回本地结果即链路通了。
4. **按任务复杂度选择模型档位**：
   - Instant：ls / pwd / git status / rg 搜索 / 读单个文件 / 简单修改
   - Medium：普通修改
   - High：复杂架构分析 / bug 根因
5. **重活留给 Codex / Work**：大范围自主重构、长时间无人值守 agent 任务。

### 额度对照测试（验证配置是否正确）

1. 打开 Usage 页面，记录：agentic usage = A，Chat/model usage = B
2. 新建对话，明确选 Chat，挂载 DevSpace
3. 只执行一个最小任务：`open_workspace` + `pwd`
4. 刷新 Usage 页面：
   - A 不变、B 变化 → 配置正确，这就是"Chat 模式"
   - A 也下降 → 实际被路由到了 Work/Codex 类 agentic surface，需要检查是哪一步切错了

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

本地小模型适合 grep、文件分类、简单重构、测试执行、日志摘要、格式修改；Memory 架构设计、跨模块一致性、并发/事务问题、复杂 bug 根因再交给强模型。

## 常见坑

- **ChatGPT Pro 模型/模式的工具路由问题**（issue #14）：Pro 模式会错误尝试 `multi_tool_use.parallel` 而不是 `open_workspace` / `read` / `bash` / `edit`，导致"没有 DevSpace 工具"。其他 ChatGPT 模型用同一个 DevSpace connector 正常。注意区分"ChatGPT Pro 套餐"和"模型选择器里的 Pro 模型/模式"。
- **Work ≠ 省额度**：Work 和 Codex 共用 agentic usage 池。
- **用了插件 ≠ 进入 Codex**：插件同时可用于 ChatGPT 和 Codex，关键在于对话模式选择。

## 参考

- [Waishnav/devspace](https://github.com/Waishnav/devspace) — DevSpace 官方仓库；文档明确：普通工作流中 DevSpace 只是工具服务，不是另一个隐藏编码模型，由 ChatGPT 自己决定调用工具
- [keepkeen/devspace](https://github.com/keepkeen/devspace) — fork，强化 `batch_read` / `batch_inspect` / `apply_patch` / `exec_command` / `write_stdin`，固定成 Codex 风格工具协议；`batch_read` 一次读多个文件，减少 MCP 往返次数和大目录扫描
- OpenAI Help Center — agentic usage 共享池与普通 Chat 模型使用限制的官方说明
