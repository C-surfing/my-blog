---
title: "RL 策略优化：GRPO / DAPO"
updated: 2026-08-06
description: "LLM 后训练中的策略优化算法族：从 PPO 到 GRPO、DAPO，去掉 Critic 的群体相对优势估计。"
tags: [RL, GRPO, DAPO, LLM]
category: RL
type: guides
---

# RL 策略优化：GRPO / DAPO

LLM 对齐与推理能力增强中，强化学习（RL）是继 SFT 之后的关键后训练阶段。策略优化算法决定模型如何从反馈信号中学习。

## 从 PPO 到 GRPO

PPO（Proximal Policy Optimization）是经典 on-policy 算法，但需要额外的 Critic（价值网络）估计优势函数，训练成本高、调参敏感。

**GRPO（Group Relative Policy Optimization）** 去掉 Critic：对同一个 prompt 采样一组（group）输出，用组内输出的相对得分作为优势估计（如某一输出得分减去组均值，再除以组标准差）。这样：

- 省掉价值网络的训练与内存开销；
- 优势估计天然归一化，对奖励尺度不敏感；
- 与可验证奖励（数学、代码）配合效果显著。

## DAPO 的改进

DAPO（Decoupled Clip and Dynamic Sampling Policy Optimization）针对 GRPO 在大规模 RL 中的不稳定问题做了几处关键修正：

- **解耦裁剪（Decoupled Clip）**：正负优势使用不同的裁剪策略，避免高熵区域策略崩溃。
- **动态采样（Dynamic Sampling）**：过滤掉 token 级优势全为 0 的样本，提高有效训练数据比例。
- **Token 级损失归一化**：按 token 而非按样本归一化，稳定梯度尺度。
- **过长的奖励惩罚**：对超长输出施加惩罚，抑制"为了拿分写长篇"的奖励黑客。

## 训练配方要点

- 基座模型先做 SFT，再进 RL；数据质量（可验证奖励）比奖励模型更重要。
- 采样组大小、温度、裁剪系数共同决定探索-利用平衡。
- 训练中要盯：响应长度分布、奖励分布、熵、KL 散度。

## 相关资源

- 博客文章：[基模技术入门](/posts/foundation-model-intro/)
- 外部：[Hands-on Modern RL](https://walkinglabs.github.io/hands-on-modern-rl/preface/intro)
