---
title: "多智能体系统"
updated: 2026-08-06
description: "多 Agent 协作的模式：编排者-工作者、辩论/评审、流水线；从单 Agent 到能力系统协作的演进路径。"
tags: [Agent, Multi-Agent]
category: Agent
type: notes
---

# 多智能体系统

单个 Agent 能力有限，多 Agent 通过角色分工与协作完成复杂任务，是 Agent 工程化的核心方向之一。

## 常见协作模式

- **编排者-工作者（Orchestrator-Worker）**：主 Agent 负责任务分解与调度，多个 Worker 并行执行子任务并汇报。
- **流水线（Pipeline）**：任务按阶段串行传递，如「规划 → 编码 → 测试 → 评审」，每阶段一个专用 Agent。
- **辩论/评审（Debate/Review）**：多个 Agent 从不同视角评审同一产出（如对抗性审稿、红队攻击），提高质量与一致性。
- **市场/黑板（Marketplace/Blackboard）**：Agent 竞争或共享中间状态，适合搜索类、组合优化类任务。

## 从单 Agent 到多 Agent 的演进

工程上通常不是一步到位，而是：

1. **单 Agent + 工具**：一个模型、一套工具，解决单域任务。
2. **单 Agent + 子 Agent**：主 Agent 按需 spawn 子 Agent（受限深度）。
3. **多 Agent 系统**：固定角色拓扑 + 显式通信协议 + 共享状态。
4. **能力系统协作**：以技能/工具/记忆为模块，Agent 按需组合——从"一个模型干活"到"能力系统协作"。

## 工程难点

- 通信成本与上下文膨胀：每个 Agent 的完整上下文会随协作深度指数增长。
- 状态一致性与冲突解决：多个 Agent 修改同一状态时需要锁/版本控制。
- 评估困难：端到端结果难归因到单个 Agent 的行为。

## 相关资源

- 博客文章：[从"一个模型干活"到"能力系统协作"](/posts/agent-evolution-skill-governance/) · [PI Agent 架构深度解析](/posts/pi-agent-skill-registry-deep-dive/)
