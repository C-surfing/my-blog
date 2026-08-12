---
title: "记忆组织专题：让零散经验形成可推理的结构"
updated: 2026-08-12
description: "记忆组织是 Agent 记忆系统写入链路之后的第二环。本文梳理四种组织结构（树/图/超图/时序图）、时间结构与事件结构（双信号会话切分、LLM 事件关系推理 7 类关系）、语义结构与关系建模（轻标签层与槽位层、四步结构化建模）、层级化与抽象建模（贪心聚类 + LLM 模式归纳 + CONTAINS 抽象边），并给出《记忆工程》第 5 章的可运行实现（Chapter_5 组织器全套代码）。"
tags: [记忆组织, Memory, Agent, LLM, 知识图谱, 事件抽取, MemBook]
category: Agent
type: entries
---

> 完整长文（含 7 张 Mermaid 图与全部代码）：[记忆组织专题：让零散经验形成可推理的结构](/posts/memory-organization/)
> 代码出处：《记忆工程》[MemTensor/MemBook](https://github.com/MemTensor/MemBook) `code/Chapter_5/`

## 一句话

记忆组织 = 按**四条线索**（时间/事件/语义/层级）把零散记忆条目织成**可推理的结构**：双信号（时间间隔 + 标签重叠度）切分会话、LLM 抽取事件槽位并推断 7 类事件关系、向量相似度 + 双证据分类建语义边、贪心聚类 + LLM 模式归纳沉淀抽象节点——最后汇入 MemoryGraph 统一落库。

## 核心框架

### 1. 四种组织结构（理论坐标系）

| 形态 | 核心思想 | 代表工作（库内） |
| --- | --- | --- |
| 树 | 父节点概括子节点，检索逐层剪枝 | RAPTOR（递归聚类+摘要）、HNSW、MemGPT 分层 |
| 图 | 节点=记忆，边=关系 | Generative Agents、A-MEM、Mem0、HippoRAG |
| 超图 | 超边连接 n 个节点，表达 n 元事件 | Memoria（库外，arXiv:2310.03052）；代码里 EventUnit 五槽位即隐性超边 |
| 时序图 | 图 + 时间语义（时间线/带时间边） | MemoryBank（遗忘曲线）、Generative Agents、MemGPT |

取舍一句话：**树管效率、图管关系、超图管整体、时序图管演化**。MemBook 用 `MemoryGraph`（memories + edges + sessions + phases + abstractions）把四者织成一张图。

### 2. 时间结构与事件结构

**会话切分（temporal_builder）**：按时间排序后逐对检查，双信号任一触发即切分——

- 信号1：时间间隔 `> time_threshold_minutes`（时间断裂）
- 信号2：标签 **Jaccard 重叠度** `< topic_drift_threshold`（主题漂移，`tags_a ∩ tags_b / tags_a ∪ tags_b`）

会话主题取众数标签；会话再按天归并成 Phase 阶段。时间边 FOLLOWS 在 2 倍阈值窗口内建立，同会话权重 0.9、跨会话 0.6。

**事件结构（event_builder）**：LLM 抽取五槽位事件（agent/action/object/outcome/context，`EVENT_EXTRACTION_PROMPT`），关键词规则兜底；再对时间序窗口内（i+1..i+4）事件两两配对，LLM 判断 7 类关系：

`causes / resolves / depends_on / same_topic / contains / related_to / follows`

输出 `{relation, confidence, reasoning}`，`confidence ≥ 0.5` 才建边。规则兜底：计划→完成=CAUSES(0.8)、问题→解决=RESOLVES(0.85)、需要/依赖=DEPENDS_ON(0.7)、默认 FOLLOWS(0.6)。

**LLM 关系推理四护栏**：封闭类型集合（输出校验，非法回退 related_to）· 置信度门槛 · reasoning 留痕可审计 · 规则兜底（LLM 失败不中断）。

### 3. 语义结构与关系建模

- **轻标签层（tags）**：作用 = 主题漂移检测 / 会话主题提取 / 语义关系分类 / 检索过滤；价值 = 零成本（抽取顺带产出）、精确命中、可解释、跨语言。原则：宁少勿多、宁稳定勿花哨（标签漂移会失真）。
- **槽位层（EventUnit 五槽位）**：**跨表述对齐**——「我昨天把项目提交了」与「Tom completed the submission」填槽后结构一致，是去重/合并/关系推断/结构化检索的前提。分工：标签层=开放贴标（粗分类索引），槽位层=封闭填槽（精确表示对齐）。

**结构化关系建模四步（semantic_builder）**：
1. **编码**：`key + value` 拼接 embedding（key 给主题锚点，value 给细节，抗长文本稀释）；
2. **两两相似度**：O(n²)，生产用标签粗筛或 ANN 剪枝；
3. **阈值建边**：`similarity ≥ similarity_threshold`（密度旋钮）；
4. **关系分类**：双证据——`sim ≥ 0.8 且 标签重叠 ≥ 0.5` → SAME_TOPIC，否则 RELATED_TO。**向量证明「像」，标签证明「是一类」**。

### 4. 层级化与抽象建模（hierarchy_builder）

1. **贪心聚类**：embedding 相似度 ≥ `abstraction_threshold` 并入当前簇，`used` 集合防重复，`min_cluster_size` 过滤小簇；
2. **LLM 模式归纳**（`ABSTRACTION_PROMPT`）：簇内记忆 → `{label, condition, solution, verification}`——condition/solution/verification 构成程序性记忆闭环（何时适用 → 怎么做 → 怎么验证），即「经验」的定义；
3. **抽象边**：抽象节点 → 支撑记忆，`CONTAINS` 关系，weight=confidence（默认0.8）。抽象可递归成多层树（RAPTOR 式）。

**地图路径算法启发**：抽象层 = 记忆的「高速公路」——Contraction Hierarchies（高层跳远 + 低层精细）对应层级检索加速；Hub Labeling 对应「这条记忆属于哪个模式」查表；A* 启发对应先判模式再查的剪枝。

### 5. 整合流水线（organizer.py）

顺序即依赖：时间 → 事件 → 语义 → 层级（层级吃事件产物，必须靠后）→ 边去重（(source,target,type) 保留最高权重）→ Neo4j 落库 → MemoryGraph。四模块可用 `use_*` 开关按场景裁剪（第 13 章演示用 use_hierarchy=False）。双写架构：Milvus 管语义召回，Neo4j 管关系导航。

## 核心实现（MemBook Chapter_5）

- `data_structures.py`：Session / Phase / EventUnit / AbstractionNode / MemoryGraph 五种数据结构；
- `temporal_builder.py`：双信号会话切分 + 按天 Phase + FOLLOWS 时间边；
- `event_builder.py`：LLM 五槽位抽取 + 7 类关系窗口配对推断（含规则兜底）；
- `semantic_builder.py`：embedding 编码 → 两两相似度 → 阈值建边 → 双证据分类；
- `hierarchy_builder.py`：贪心聚类 → LLM 模式归纳 → CONTAINS 抽象边；
- `organizer.py`：四阶段流水线 + 边去重 + Neo4j 落库（`organize_memories()` 便捷入口）。

## 落地建议

先开「时间 + 语义」两结构（便宜、立竿见影），再按需加「事件」（LLM 成本高，高价值对话才开）与「层级」（记忆量级上来后必开，类比 Contraction Hierarchies 的预计算加速）。两条心法：**轻标签层是组织器的免费燃料**（抽取时多输出几个标签，四处受益）；**LLM 关系推理必须设护栏**（封闭类型集 + 置信度门槛 + reasoning 留痕 + 规则兜底），智能做判断、算法做执行。
