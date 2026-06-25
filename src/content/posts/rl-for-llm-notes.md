---
title: LLM 后训练中的 RL：RLHF、GRPO 与 DAPO
published: 2026-06-25
description: 深入浅出地介绍 LLM 后训练阶段中的强化学习方法，从 RLHF 到 GRPO 再到 DAPO 的技术演进。
tags: [RLHF, GRPO, DAPO, LLM, Reinforcement Learning]
category: Reinforcement Learning
draft: false
pinned: false
comment: true
lang: zh-CN
---

# LLM 后训练中的 RL：RLHF、GRPO 与 DAPO

## 概述

LLM 的后训练（Post-training）阶段是决定模型行为和质量的关键环节。其中，强化学习（RL）方法扮演着越来越重要的角色。

## RLHF：开山之作

RLHF（Reinforcement Learning from Human Feedback）由 InstructGPT 论文引入，包含三个步骤：

1. **SFT**：在高质量数据上有监督微调
2. **Reward Model 训练**：基于人类偏好训练奖励模型
3. **RL 优化**：使用 PPO 算法优化策略

### PPO 目标函数

$$
\mathcal{L}_{\text{PPO}} = \mathbb{E}[\min(r_t(\theta)\hat{A}_t, \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t)]
$$

## GRPO：Group-based RL

GRPO（Group Relative Policy Optimization）由 DeepSeek 提出，相比 PPO 有以下优势：

- **无需 Critic Model**：降低显存占用
- **Group-based 优势估计**：使用组内回报的相对值
- **KL 散度约束**：直接在组内计算

```python
# GRPO 的核心思路
def grpo_loss(policy, group_responses, rewards):
    # 在组内计算优势
    advantages = (rewards - rewards.mean()) / (rewards.std() + 1e-8)
    # 策略梯度更新
    loss = -policy.log_prob(group_responses) * advantages
    return loss.mean()
```

## DAPO：Dual-Agent Policy Optimization

DAPO 是更近期的进展，引入双 Agent 架构来克服单一策略的探索瓶颈。

## 总结

从 RLHF → GRPO → DAPO，我们可以看到一个清晰的演进路径：
- **效率提升**：减少计算资源需求
- **稳定性增强**：更稳定的训练过程
- **探索能力**：更好的探索策略

## 参考文献

- [InstructGPT](https://arxiv.org/abs/2203.02155)
- [DeepSeek-R1](https://arxiv.org/abs/2501.12948)
- [GRPO 原始论文](https://arxiv.org/abs/2402.03300)
