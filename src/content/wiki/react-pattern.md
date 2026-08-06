---
title: "ReAct 模式"
updated: 2026-08-06
description: "ReAct（Reasoning + Acting）是 Agent 最基础的推理-行动循环范式，几乎所有现代 Agent 框架都在此基础上构建。"
tags: [Agent, ReAct, LangGraph]
category: Agent
type: notes
---

# ReAct 模式

ReAct（Reasoning + Acting）由 Yao et al. 提出：Agent 交替执行 **推理（Thought）→ 行动（Action）→ 观察（Observation）** 三步循环，直到得出最终答案。

## 循环结构

1. **Thought**：根据当前状态和观察，推理下一步该做什么。
2. **Action**：选择一个工具/动作并调用（如搜索、执行代码、读文件）。
3. **Observation**：接收工具返回结果，回到第 1 步。

这个循环天然解决了 LLM 的两大短板：纯推理（CoT）无法与环境交互获取新信息；纯行动（Act）缺少规划容易盲目执行。

## 实现差异

不同框架对 ReAct 的实现差异主要体现在：

- **状态管理**：LangGraph 用显式图节点 + 共享状态对象；LangChain 用隐式的 AgentExecutor 循环。
- **循环控制**：是否支持条件分支（如提前终止、人工介入、递归）。
- **工具协议**：工具描述格式、参数 schema 校验、错误重试策略。
- **可观测性**：每一步的 thought/action/observation 是否结构化记录（LangSmith 等监控）。

## 相关资源

- 博客文章：[Modern Agent 01：推理与规划综述](/posts/modern-agent-01-reasoning-planning/) · [LangChain vs LangGraph ReAct 实现差异](/posts/langchain-vs-langgraph-react/)
- 外部：[Easy-Langent](https://easy-langent.datawhale.cc/)（LangChain/LangGraph 实践教程）
