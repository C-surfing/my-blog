<div align="center">

# 🚀 Csurfing's Agent Lab

**个人博客 · 知识库 · AI Agent 学习笔记**

[![Website](https://img.shields.io/badge/网站-csurfing.xyz-22c55e?style=for-the-badge&logo=cloudflare&logoColor=white)](https://csurfing.xyz/)
[![Astro](https://img.shields.io/badge/Astro-6.3.8-orange?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Theme](https://img.shields.io/badge/Theme-Mizuki-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://github.com/LyraVoid/Mizuki)
[![Deploy](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge&logo=apache)](LICENSE)

软件工程学生 · Home Lab 玩家 · Agent 生态观察者

</div>

---

## 📝 关于本站

这里是 [csurfing.xyz](https://csurfing.xyz/) 的源码仓库。我用它记录:

- **AI Agent 与记忆系统** —— Agent 记忆架构、技能治理、记忆工程
- **工程实践** —— WSL 调优、Vibe Coding、工作流沉淀
- **学习笔记** —— 数学 / 物理 / C++ 复习笔记、深度学习基础

写作闭环:Zotero 划线高亮 → 融合思考 → 博客文章发布,内容全部沉淀在这个仓库的 `src/content/posts/`。

## 📚 文章分类

<details open>
<summary><b>🤖 AI Agent / 记忆系统</b> (9)</summary>

| 文章 | 说明 |
| :--- | :--- |
| [Agent Memory OS](src/content/posts/agent-memory-os.mdx) | Agent 记忆操作系统全景 |
| [TencentDB Agent Memory Design](src/content/posts/tencentdb-agent-memory-design.mdx) | 腾讯云记忆系统设计 |
| [Claude Code Memory System](src/content/posts/claude-code-memory-system-design.mdx) | Claude Code 记忆系统设计 |
| [Memory Extraction](src/content/posts/memory-extraction.mdx) | 记忆提取 |
| [Memory Organization](src/content/posts/memory-organization.mdx) | 记忆组织 |
| [Agent Evolution & Skill Governance](src/content/posts/agent-evolution-skill-governance.mdx) | Agent 演进与技能治理 |
| [PI Agent Skill Registry Deep Dive](src/content/posts/pi-agent-skill-registry-deep-dive.mdx) | PI Agent 技能注册表剖析 |
| [Modern Agent 01: Reasoning & Planning](src/content/posts/modern-agent-01-reasoning-planning.mdx) | 现代 Agent 推理与规划 |
| [Foundation Model Intro](src/content/posts/foundation-model-intro.mdx) | 大模型入门 |

</details>

<details open>
<summary><b>🛠️ 工程实践</b> (8)</summary>

| 文章 | 说明 |
| :--- | :--- |
| [个人 Workflow 优化](src/content/posts/personal-workflow-optimization.mdx) | 个人工作流沉淀(融合《vibe时代的软件工程》) |
| [React + TS Vibe Coding](src/content/posts/react-ts-vibe-coding-guide.mdx) | Vibe Coding 实战指南 |
| [Codex 断网思考](src/content/posts/codex-disconnect-network-think.mdx) | Codex 使用心得 |
| [LangChain vs LangGraph](src/content/posts/langchain-vs-langgraph-react.mdx) | React Agent 框架对比 |
| [WSL2 ext4 VHDX 瘦身](src/content/posts/wsl2-ext4-vhdx-compact.md) | WSL 磁盘清理 |
| [麒麟 V11 + VMware](src/content/posts/kylin-v11-vmware-setup.mdx) | 麒麟系统虚拟机部署 |
| [Mizuki 部署笔记](src/content/posts/mizuki-deploy-notes.md) | 本站搭建记录 |
| [Ontology vs DDD](src/content/posts/ontology-vs-ddd-palantir.mdx) | 领域建模对比 |
| [Git 指南](src/content/posts/git-guide.mdx) | Git 使用指南 |

</details>

<details>
<summary><b>📖 学习笔记</b> (5)</summary>

| 文章 | 说明 |
| :--- | :--- |
| [高等数学期末复习](src/content/posts/advanced-math-final-review.mdx) | 高数复习笔记 |
| [大学物理期末复习](src/content/posts/college-physics-final-review.mdx) | 大物复习笔记 |
| [C++ 期末复习](src/content/posts/cpp-final-review.mdx) | C++ 复习笔记 |
| [相对论与人生哲学](src/content/posts/relativity-and-life-philosophy.mdx) | 物理与哲思 |

</details>

## 🧱 技术栈

| 层 | 选型 |
| :--- | :--- |
| 框架 | [Astro 6](https://astro.build) + TypeScript |
| 主题 | [Mizuki](https://github.com/LyraVoid/Mizuki)(深度定制) |
| 内容 | MDX / Markdown + Pagefind 站内搜索 |
| 部署 | Cloudflare Pages(自动构建,`pnpm build` → `dist/`) |
| 依赖管理 | pnpm workspace |

## 🚀 本地开发

```bash
pnpm install
pnpm dev        # 本地预览 http://localhost:4321
pnpm build      # 构建到 dist/
pnpm preview    # 预览构建产物
```

## 📁 仓库结构

```text
csurfing-blog/
├── src/
│   ├── content/posts/     # 📝 全部文章(MDX/MD)
│   └── config/            # 站点配置(导航、资料、评论、公告…)
├── public/pdfs/           # 学习笔记 PDF 归档
├── docs/                  # 部署/迁移/内容维护文档 + 归档素材
├── scripts/               # 发布/维护脚本
├── astro.config.mjs       # Astro 配置
└── vercel.json            # 构建配置(兼容)
```

## 📜 License

源码基于 [Apache-2.0](LICENSE)(衍生自 [Mizuki](https://github.com/LyraVoid/Mizuki) 主题);
文章内容版权归作者所有。

---

<p align="center">✨ 持续记录 · 持续进化 · <a href="https://csurfing.xyz">csurfing.xyz</a></p>
