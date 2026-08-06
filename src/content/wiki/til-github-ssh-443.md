---
title: "TIL: GitHub SSH 走 443 端口绕过封锁"
updated: 2026-08-06
description: "git push 卡死/超时（22 端口被墙）时，把 GitHub SSH 切到 ssh.github.com:443 的解决步骤。"
tags: [Git, WSL, 网络]
category: 工程
type: tils
---

# TIL: GitHub SSH 走 443 端口绕过封锁

**问题**：`git push` 挂起或超时，`ssh -T git@github.com` 报 `Connection to 20.205.243.166 port 22 timed out`，但 ping github.com 正常。

**原因**：部分网络环境（尤其国内）间歇性封锁 GitHub SSH 的 22 端口。

**解决**：GitHub 官方提供 SSH-over-443 方案，改用 ssh.github.com:443：

```bash
mkdir -p ~/.ssh
cat >> ~/.ssh/config << 'EOF'

# GitHub over HTTPS port (bypasses port 22 blocking)
Host github.com
    HostName ssh.github.com
    Port 443
    User git
EOF

# 首次连接接受主机密钥
ssh-keyscan -p 443 ssh.github.com >> ~/.ssh/known_hosts
```

配置后 `git@github.com:user/repo.git` 形式的 remote 无需改 URL，直接可用。

**验证**：`ssh -T -p 443 git@ssh.github.com` 应返回 `Hi <user>! You've successfully authenticated`。
