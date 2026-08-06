---
title: "链接：Lilian Weng — LLM Powered Autonomous Agents"
updated: 2026-08-06
description: "Agent 综述经典开篇的摘录与评论：planning / memory / tool use 三件套框架至今仍是大多数 Agent 架构的骨架。"
tags: [Agent, 综述, Links]
category: Agent
type: links
---

# 链接：Lilian Weng — LLM Powered Autonomous Agents

> 原文：[LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)（Lilian Weng, 2023-06）

**摘录**：

> The core component of an LLM-powered autonomous agent system are:
> 1. **Planning** — subgoal and decomposition, reflection and refinement
> 2. **Memory** — short-term (context window) and long-term (external vector store)
> 3. **Tool use** — calling external APIs for extra information

**我的评论**：这篇是 Agent 领域绕不开的起点。2023 年提出"规划-记忆-工具"三件套时还很抽象，但现在回头看，几乎每个 Agent 框架（LangGraph、Claude Code、开源 Agent 全家桶）的架构都是这三件事的工程化变体。特别值得注意她强调的 **reflection**（反思循环）——这在当时被当作锦上添花，如今成了 Self-Improve / 自我纠错类 Agent 的核心机制。建议配合本博客《Modern Agent 01：推理与规划综述》一起读。
