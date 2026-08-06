---
title: "Agent 记忆系统"
updated: 2026-08-06
description: "Agent 记忆系统的分层架构：情景/语义/程序性记忆、写入-管理-读取管道、检索与评测。"
tags: [Agent, Memory, RAG]
category: Agent
---

# Agent 记忆系统

Agent 记忆系统解决的核心问题：LLM 上下文窗口有限，Agent 需要把跨会话、跨任务的信息沉淀下来，并在需要时准确召回。

## 记忆的分层

- **情景记忆（Episodic）**：记录发生过的事件——某次对话、某个决策、某次报错。按时间线组织，回答"之前发生了什么"。
- **语义记忆（Semantic）**：从情景中提炼的稳定知识——用户偏好、领域事实、概念定义。回答"我知道什么"。
- **程序性记忆（Procedural）**：技能与流程——如何调用工具、如何排错、什么场景用什么策略。回答"我该怎么做"。

## 核心管道（Write-Manage-Read）

1. **写入（Write）**：事件/对话发生后提取关键信息，去重、压缩、分类。
2. **管理（Manage）**：冲突检测（同一实体多个版本）、遗忘/归档策略、版本状态机。
3. **读取（Read）**：根据当前上下文检索最相关的记忆注入 prompt，通常基于嵌入向量相似度 + 关键词混合检索（RAG）。

## 工程要点

- 记忆不是无限堆积：要有容量上限、过期策略和隐私控制（用户可删除）。
- 写入质量决定读取质量：写入时做好清洗和结构化，比检索时拼命调参更有效。
- 评测四指标：写入准确率、检索命中率、冲突解决率、隐私合规率。

## 相关资源

- 博客文章：[Agent Memory OS](/posts/agent-memory-os/) · [Claude Code 记忆系统设计](/posts/claude-code-memory-system-design/) · [TencentDB Agent Memory](/posts/tencentdb-agent-memory-design/)
- 外部：[Awesome AI Memory](https://github.com/IAAR-Shanghai/Awesome-AI-Memory) · [AI Agent Memory](https://aiagentmemory.org/)
