---
title: Agent 工程学习路线：从 ReAct 到 Multi-Agent
published: 2026-06-25
description: 系统梳理 Agent 工程的学习路线，从最基础的 ReAct 模式到复杂的 Multi-Agent 编排系统。
tags: [Agent, ReAct, Multi-Agent, LangGraph]
category: Agent
draft: false
pinned: true
comment: true
lang: zh-CN
---

# Agent 工程学习路线：从 ReAct 到 Multi-Agent

## 前言

2024-2025 年是 AI Agent 爆发式发展的两年。从简单的 ReAct 模式到复杂的 Multi-Agent 编排系统，Agent 工程已经成为 LLM 应用开发的核心范式。

## 第一阶段：基础认知

### ReAct 模式

ReAct（Reasoning + Acting）是 Agent 最基础的架构模式。核心思想是让 LLM 交替进行推理和行动：

```python
# ReAct 循环伪代码
def react_loop(llm, tools, question):
    thought = f"Question: {question}\n"
    while not finished:
        action = llm.generate(thought)
        observation = execute_action(action, tools)
        thought += f"Action: {action}\nObservation: {observation}\n"
    return thought
```

### 学习资源
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- LangChain / LangGraph 官方文档

## 第二阶段：工具使用与函数调用

Agent 的能力很大程度上取决于它能够使用的工具。关键点包括：

1. **Function Calling** - OpenAI/Tool 格式的标准化
2. **Tool Schema 设计** - 清晰、类型安全的工具定义
3. **错误处理** - 工具调用的重试与降级策略

## 第三阶段：Multi-Agent 编排

当单个 Agent 不足以完成任务时，需要引入多 Agent 协作：

- **Orchestrator-Worker 模式**：一个主 Agent 协调多个子 Agent
- **Debate 模式**：多个 Agent 相互辩论，提升决策质量
- **Pipeline 模式**：将任务拆分为流水线阶段

## 下一步学习方向

- SWE-bench 评测与 Agent 性能优化
- RL + Agent 的融合（如 RLEF）
- 生产级 Agent 部署与监控
