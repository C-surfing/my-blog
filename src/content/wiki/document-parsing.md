---
title: "文档解析：MinerU 生态"
updated: 2026-08-06
description: "PDF/扫描件/Office/网页 → Markdown/JSON 的文档解析方案：MinerU 双引擎、flash-extract 与 precision extract 模式、API 接入。"
tags: [MinerU, 文档解析, RAG, OCR]
category: Tools
---

# 文档解析：MinerU 生态

MinerU（OpenDataLab）是开箱即用的文档解析引擎：把 PDF、扫描件、图片、Word/PPT/Excel、网页转换成干净的 Markdown / HTML / LaTeX / JSON，专为 LLM 预训练、RAG 与 Agent 工作流设计。

## 双引擎模式

| 模式 | flash-extract | extract（precision） |
|---|---|---|
| Token | 无需 | 需要（mineru.net 免费申请） |
| 输出格式 | Markdown | md / html / latex / docx / json |
| 模型 | pipeline | vlm / pipeline / MinerU-HTML |
| 批量 | 否 | 是 |
| 限制 | 10MB / 20 页 | 宽松得多 |

## 核心能力

- 公式 → LaTeX，表格 → HTML，复杂版面重建；
- 支持扫描件、手写、多栏布局、跨页表格合并；
- 输出遵循人类阅读顺序，自动去页眉页脚；
- VLM + OCR 双引擎，109 种语言。

## 接入方式

```bash
npm install -g mineru-open-api
mineru-open-api flash-extract file.pdf          # 免登录快速转换
mineru-open-api auth                            # 配置 token
mineru-open-api extract file.pdf -o ./out       # 高精度多格式
mineru-open-api crawl https://example.com       # 网页转 Markdown
```

## 在 RAG / Agent 中的位置

文档解析是 RAG 管线的第一环：解析质量直接决定后续切块、嵌入、检索的上限。表格和公式识别准确率是关键差异点——大多数解析器在"文字"上没问题，在"结构"（表格、公式、多栏）上翻车。

## 相关资源

- 博客文章：[WSL2 环境搭建](/posts/wsl2-ext4-vhdx-compact/)（解析管线运行环境）
- 外部：[MinerU 官方仓库](https://github.com/opendatalab/MinerU) · [MinerU-Ecosystem](https://github.com/opendatalab/MinerU-Ecosystem)
