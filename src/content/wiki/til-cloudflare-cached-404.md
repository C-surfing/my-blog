---
title: "TIL: Cloudflare 会把部署窗口期的 404 缓存一年"
updated: 2026-08-06
description: "静态站点上线新文件时，若在部署窗口期轮询该 URL 拿到 404，Cloudflare 会按 immutable 缓存一年，之后怎么部署都刷不出来。"
tags: [Cloudflare, 部署, 缓存]
category: 工程
type: tils
---

# TIL: Cloudflare 会把部署窗口期的 404 缓存一年

**问题**：git push 后立即轮询新文件 URL（如 mp3/图片），Vercel 在部署窗口期返回 404，且带 `cache-control: public, max-age=31536000, immutable`。Cloudflare 把这个 404 缓存了一整年——之后文件明明上线了，线上却永远 404（`cf-cache-status: HIT` + `age` 不断增长）。

**踩坑记录**：音乐播放器上线新歌时，边部署边轮询新 mp3，结果把 404 毒进了 CDN，播放器一直报错，后来靠给 URL 加 `?v=2` 才绕过。

**规则**：
1. **永远不要在部署窗口期轮询新静态文件 URL** 等上线——会毒化缓存。
2. 要等部署完成，轮询内容哈希的 JS 资源（如 `/_astro/musicPlayerStore.<hash>.js` 返回 200）或首页 asset hash。
3. 已中毒的修复方式（按优先级）：
   - 给 URL 加 query param（`file.mp3?v=2`）→ 新缓存键，立即生效；
   - 重命名文件（也是新 URL）；
   - Cloudflare API purge（需要 Zone 权限 token，可能没有）。

**验证**：`curl -sI <url> | grep -i "cf-cache-status"`——HIT + 大 age = 已中毒；`curl "<url>?v=999"` 返回 200/206 说明文件本身没问题。
