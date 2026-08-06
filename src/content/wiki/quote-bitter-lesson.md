---
title: "Quote: Rich Sutton — The Bitter Lesson"
updated: 2026-08-06
description: "《苦涩的教训》：试图把知识构建进 AI 的路线短期有效但终将停滞，基于搜索与学习的规模扩展才是突破性进展的来源。"
tags: [AI, 观点, Scaling]
category: 观点
type: quotes
---

# Quote: Rich Sutton — The Bitter Lesson

> 原文：[The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)（Rich Sutton, 2019）

> The bitter lesson is based on the historical observations that
> 1) AI researchers have often tried to build knowledge into their agents,
> 2) this always works in the short term and is personally satisfying,
> 3) but eventually plateaus and even fails to further progress,
> 4) breakthrough progress eventually arrives by an opposing approach based on scaling computation by search and learning.

**我的想法**：这篇值得每隔一段时间重读一遍。教训对 LLM 时代同样成立——手工规则、人工特征、领域先验在短期总能赢，但通用方法（scaling + 学习）最终会超越。工程上做 Agent 时也常犯同样的错：为当前场景手写一堆规则，短期效果好，长期锁死扩展性。Sutton 的解法不是"不要先验"，而是"别把先验焊死在系统里"。
