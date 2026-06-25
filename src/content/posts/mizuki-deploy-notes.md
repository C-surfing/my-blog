---
title: Mizuki 博客部署记录
published: 2026-06-25
description: 使用 Mizuki Astro 主题部署个人技术博客的完整记录，包含环境配置、内容初始化与部署流程。
tags: [Astro, Mizuki, Blog, Deploy, WSL]
category: Projects
draft: false
pinned: false
comment: true
lang: zh-CN
---

# Mizuki 博客部署记录

## 为什么选择 Mizuki

Mizuki 是一个基于 Astro 的现代化静态博客模板，具备以下特点：

- **Material Design 3** 风格的现代化 UI
- **Pagefind** 全文搜索
- **RSS/Atom** 订阅支持
- **明暗主题切换**
- **响应式布局**

## 部署环境

| 项目 | 版本 |
|------|------|
| Node.js | v24.12.0 |
| pnpm | 10.33.2 |
| Astro | 7.0.0 |
| OS | WSL2 Ubuntu (Linux 6.6.87) |

## 关键配置步骤

### 1. 站点配置

在 `src/config/siteConfig.ts` 中设置：

- 标题、副标题
- 语言（zh-CN）
- 主题色（科技蓝，hue: 210）
- 关闭不必要的功能页面

### 2. 导航栏

配置 Home / Archive / Projects / About / Links 等导航项。

### 3. 文章管理

文章存储在 `src/content/posts/` 目录，支持 frontmatter 配置：
- 分类（category）
- 标签（tags）
- 置顶（pinned）
- 评论开关（comment）

## 部署方式

> 部署到 Cloudflare Pages 或 Vercel。

### Cloudflare Pages 配置

```yaml
Build command: pnpm i && pnpm build
Build output directory: dist
Root directory: /
Production branch: main
```

## 后续计划

- [x] 基础博客部署
- [ ] 评论系统集成（Twikoo / Giscus）
- [ ] 自定义域名与 HTTPS
- [ ] Meting API 音乐播放器
- [ ] 内容分离模式（文章量增加后启用）
