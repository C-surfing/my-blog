---
title: "麒麟OS Agent 记忆项目"
updated: 2026-08-06
description: "国产操作系统（麒麟 V11）上的 Agent 记忆系统竞赛项目：四层记忆架构、Embedding/向量引擎 SDK 适配、评测框架。"
tags: [Kylin, Agent, Memory, 赛事]
category: Projects
type: notes
---

# 麒麟OS Agent 记忆项目

在银河麒麟桌面 V11 上构建 Agent 记忆系统的竞赛项目，核心挑战是：把系统级 SDK（Embedding、向量数据库）接进通用的 Agent 记忆框架（LangMem/LangChain 适配层）。

## 架构

- **四层记忆**：偏好记忆、知识记忆、情景记忆、程序性记忆。
- **事件管道**：写入（Write）→ 管理（Manage）→ 读取（Read），事件来自多源（对话、系统操作、文件变更）。
- **冲突处理**：同一实体多个版本的状态机 + 隐私策略引擎。
- **适配层**：LangChain Embeddings / VectorStore / BaseStore 后端定制，桥接 C++ 系统 SDK 与 Python 生态。

## 开发环境要点

- 麒麟 V11 基于 Linux，但系统级 SDK 是 C++（CGO/GObject 风格），需要 C++ gateway + Python adapter。
- 开发用 VMware 虚拟机（V11），网络受限时用 vmrun 交互。
- PEP 668 限制 pip 直装，统一用 venv。

## 评测框架

四个核心指标：记忆写入准确率、检索命中率、冲突解决率、隐私合规率；配套 mock 数据与自动化评分脚本。

## 相关资源

- 博客文章：[Windows 上 VMware 安装银河麒麟 V11](/posts/kylin-v11-vmware-setup/)
- 外部：[LangMem](https://github.com/langchain-ai/langmem)（记忆框架）
