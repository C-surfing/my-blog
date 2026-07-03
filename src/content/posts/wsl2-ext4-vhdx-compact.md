---
title: WSL2 删除 Docker 大文件后，D 盘 ext4.vhdx 不变小的解决记录
published: 2026-07-03
description: WSL2 Ubuntu 中删除了 Docker 镜像和大文件，但 Windows D 盘的 ext4.vhdx 没有自动变小。记录完整的排查与压缩流程：fstrim + diskpart compact vdisk，解决虚拟磁盘只膨胀不收缩的问题。
tags: [WSL, Docker, Windows, VHDX, Disk-Cleanup, ext4]
category: Projects
draft: false
pinned: false
comment: true
lang: zh-CN
---

## 结论

在 WSL2 Ubuntu 中删除 Docker 镜像、容器、大文件之后，Windows D 盘里的 `ext4.vhdx` 不会自动变小。原因是：**Linux 文件系统内部空间已经释放，但 WSL2 的虚拟磁盘文件不会自动把这部分空间还给 Windows**。正确处理方式是：先在 Ubuntu 内执行 `fstrim` 标记空闲块，再在 Windows 侧使用 `Optimize-VHD` 或 `diskpart compact vdisk` 压缩 `ext4.vhdx`。

我这次遇到的实际情况是：Ubuntu 内部只用了大约 **99G**，但 Windows 看到的 `D:\WSL\Ubuntu\ext4.vhdx` 仍然有 **193G**。最后通过 `fstrim` + `diskpart compact vdisk` 解决。

## 问题现象

最近在 WSL Ubuntu 中清理了一批 Docker 相关的大文件，本以为 D 盘空间会立即释放，但实际发现：**Linux 里面文件确实删了，Windows 里的 VHDX 文件大小却没怎么变**。

先在 Ubuntu 中查看根目录占用：

```bash
df -h /
sudo du -xh --max-depth=1 / | sort -h
```

输出大致如下：

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdd       1007G   99G  858G  11% /

86G     /home
5.7G    /var
7.0G    /usr
99G     /
```

可以看到，Ubuntu 内部真实使用量只有 **99G**。随后在 Windows PowerShell 中查看 WSL 的虚拟磁盘大小：

```powershell
$Distro = "Ubuntu"

$Vhd = (Get-ChildItem -Path HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss |
  Where-Object { $_.GetValue("DistributionName") -eq $Distro }).GetValue("BasePath") + "\ext4.vhdx"

$Vhd
(Get-Item $Vhd).Length / 1GB
```

结果显示：

```text
D:\WSL\Ubuntu\ext4.vhdx
193.64453125
```

也就是说，**Ubuntu 内部只用了 99G，但 Windows 上的 ext4.vhdx 仍然占了 193G**。

## 为什么删了文件，ext4.vhdx 还不变小？

WSL2 本质上是一个轻量虚拟机，Ubuntu 的 Linux 文件系统并不是直接存在 Windows 普通目录里，而是存放在一个虚拟磁盘文件中：

```text
ext4.vhdx
```

这个文件有一个特点：**容易变大，不会主动变小**。

可以这样理解：

| 操作 | Linux 内部空间 | Windows 侧 ext4.vhdx |
| --- | :---: | :---: |
| 下载大文件 | 占用增加 | VHDX 变大 |
| Docker 拉镜像 | 占用增加 | VHDX 变大 |
| 删除大文件 | Linux 内部空间释放 | VHDX 不一定变小 |
| 清理 Docker | Linux 内部空间释放 | VHDX 通常仍保持原大小 |
| 压缩 VHDX | 不改变 Linux 文件 | Windows 侧文件变小 |

根本原因是：`rm`、`docker system prune` 这类操作只是在 Linux 文件系统内部释放空间，Windows 并不会自动知道哪些 VHDX 块已经可以回收。因此，需要额外执行一次"压缩虚拟磁盘"的操作。

## 先确认 Docker 是否仍然占空间

因为我之前主要怀疑是 Docker 占用，所以先查看 Docker 空间：

```bash
docker system df -v
```

我的结果显示 Docker 当前占用并不大：

```text
Images space usage:

REPOSITORY      SIZE
xiaohongshu-mcp 1.82GB
napcat-docker   2.1GB

Containers space usage:
napcat          131MB

Build cache usage: 0B
```

这说明当前真正的问题不是 Docker 还占着很多空间，而是：**之前写入过的大量数据已经让 ext4.vhdx 膨胀了，删除后它没有自动缩回去**。

## 在 Ubuntu 内执行 fstrim

在压缩 VHDX 之前，先进入 Ubuntu，执行：

```bash
sudo apt clean
sudo fstrim -av
```

我的输出是：

```text
/: 907.2 GiB (974139850752 bytes) trimmed on /dev/sdd
```

这一步很关键。`fstrim` 的作用是告诉底层存储：**这些块已经不用了，可以被回收**。

它不会直接让 `ext4.vhdx` 立刻变小，但它为后续 Windows 侧压缩 VHDX 做准备。

## 关闭 WSL

接下来回到 Windows PowerShell，先关闭所有 WSL 发行版：

```powershell
wsl --shutdown
wsl -l -v
```

确认所有状态都是 `Stopped`：

```text
NAME                      STATE           VERSION
podman-net-usermode       Stopped         2
Ubuntu                    Stopped         2
podman-machine-default    Stopped         2
docker-desktop            Stopped         2
```

这里要注意，最好同时关闭这些程序：

| 程序 | 原因 |
| --- | --- |
| Docker Desktop | 可能占用 WSL 虚拟磁盘 |
| Podman Desktop | 可能启动自己的 WSL 发行版 |
| VS Code Remote WSL | 可能偷偷拉起 Ubuntu |
| Windows Terminal 中的 Ubuntu 标签页 | 会重新启动 WSL |
| 正在访问 `\\wsl$` 的资源管理器窗口 | 可能占用 WSL 文件系统 |

## 找到 Ubuntu 的 ext4.vhdx 路径

不要手动猜路径，推荐用注册表查询。PowerShell 中执行：

```powershell
$Distro = "Ubuntu"

$Vhd = (Get-ChildItem -Path HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss |
  Where-Object { $_.GetValue("DistributionName") -eq $Distro }).GetValue("BasePath") + "\ext4.vhdx"

$Vhd
(Get-Item $Vhd).Length / 1GB
```

我的结果是：

```text
D:\WSL\Ubuntu\ext4.vhdx
193.64453125
```

## 尝试 Optimize-VHD

网上很多教程会推荐使用：

```powershell
Optimize-VHD -Path $Vhd -Mode Full
```

但是我这里报错：

```text
Optimize-VHD : 无法将"Optimize-VHD"项识别为 cmdlet、函数、脚本文件或可运行程序的名称。
```

这通常说明当前 Windows 环境没有 Hyper-V PowerShell 模块，常见于 Windows 家庭版或没有启用相关组件的系统。

所以我改用更通用的方案：`diskpart compact vdisk`。

## 使用 diskpart 压缩 ext4.vhdx

打开**管理员 PowerShell**，输入：

```powershell
diskpart
```

进入 `DISKPART>` 后，依次执行：

```text
select vdisk file="D:\WSL\Ubuntu\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

这几条命令的含义如下：

| 命令 | 作用 |
| --- | --- |
| `select vdisk file=...` | 选择要处理的 VHDX 文件 |
| `attach vdisk readonly` | 以只读方式挂载虚拟磁盘，避免修改数据 |
| `compact vdisk` | 压缩虚拟磁盘，回收空闲块 |
| `detach vdisk` | 卸载虚拟磁盘 |
| `exit` | 退出 diskpart |

如果看到类似这样的提示，说明压缩已经完成：

```text
DiskPart successfully compacted the virtual disk file.
```

## 压缩后检查大小

退出 `diskpart` 后，在 PowerShell 中重新查看 VHDX 文件大小：

```powershell
(Get-Item "D:\WSL\Ubuntu\ext4.vhdx").Length / 1GB
```

我压缩前是 193.64GB，由于 Ubuntu 内部实际占用是 99G，所以压缩后理论上会接近 **100G～120G**。它不一定会刚好等于 99G，因为还有文件系统元数据、保留空间和碎片等额外开销。

## 如果 compact 后仍然很大怎么办？

如果执行 `compact vdisk` 后，`ext4.vhdx` 依然没有明显变小，可以使用更彻底的方案：**导出 + 注销 + 重新导入 WSL 发行版**。

这种方法的本质是：不再压缩旧 VHDX，而是根据当前 Ubuntu 中真实存在的文件重新生成一个新的 VHDX。

示例命令如下：

```powershell
wsl --shutdown
mkdir D:\wsl-backup
wsl --export Ubuntu D:\wsl-backup\ubuntu.tar
```

确认导出成功后，注销旧发行版：

```powershell
wsl --unregister Ubuntu
```

重新导入到 D 盘新目录：

```powershell
mkdir D:\WSL\Ubuntu-New
wsl --import Ubuntu D:\WSL\Ubuntu-New D:\wsl-backup\ubuntu.tar --version 2
```

导入后启动：

```powershell
wsl -d Ubuntu
```

如果启动后默认进入了 `root` 用户，可以在 Ubuntu 中配置默认用户：

```bash
sudo nano /etc/wsl.conf
```

写入：

```ini
[user]
default=你的用户名
```

然后回到 PowerShell：

```powershell
wsl --shutdown
wsl -d Ubuntu
```

这种方法更干净，但也更激进。一般情况下，优先使用 `fstrim + compact vdisk`，只有压缩效果不明显时再考虑导出重建。

## 完整处理流程

最终我的处理流程可以总结为：

1. 在 Ubuntu 内确认真实占用
2. 检查 Docker 是否仍然占大量空间
3. 执行 `sudo apt clean`
4. 执行 `sudo fstrim -av`
5. Windows 侧执行 `wsl --shutdown`
6. 确认所有 WSL 发行版都是 Stopped
7. 找到 Ubuntu 对应的 ext4.vhdx
8. 尝试 `Optimize-VHD`
9. 如果没有 Optimize-VHD，就使用 `diskpart compact vdisk`
10. 压缩完成后重新检查 ext4.vhdx 文件大小

Ubuntu 侧命令汇总：

```bash
df -h /
sudo du -xh --max-depth=1 / | sort -h
docker system df -v
sudo apt clean
sudo fstrim -av
```

Windows PowerShell 侧命令汇总：

```powershell
wsl --shutdown
wsl -l -v

$Distro = "Ubuntu"
$Vhd = (Get-ChildItem -Path HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss |
  Where-Object { $_.GetValue("DistributionName") -eq $Distro }).GetValue("BasePath") + "\ext4.vhdx"
$Vhd
(Get-Item $Vhd).Length / 1GB
```

```powershell
diskpart
```

```text
select vdisk file="D:\WSL\Ubuntu\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

```powershell
(Get-Item "D:\WSL\Ubuntu\ext4.vhdx").Length / 1GB
```

## 几个容易踩的坑

| 问题 | 说明 |
| --- | --- |
| 只在 Ubuntu 里删除文件 | 只能释放 Linux 内部空间，不会自动缩小 Windows 侧 VHDX |
| 没执行 `fstrim` 就压缩 | 可能导致 compact 效果不明显 |
| WSL 没完全关闭 | VHDX 被占用，压缩失败 |
| 压错 VHDX | Ubuntu、docker-desktop、podman 都可能有自己的 VHDX |
| 直接删除 ext4.vhdx | 等于删除整个 WSL 发行版数据，非常危险 |
| VS Code 还连着 WSL | 可能导致 Ubuntu 自动重新启动 |
| Docker Desktop 没退出 | 可能占用 docker-desktop 或 Ubuntu 的虚拟磁盘 |

## 总结

WSL2 的 `ext4.vhdx` 是动态扩展虚拟磁盘，它的特点是：**写入数据时会变大，但删除数据后不会自动变小**。所以，清理 Docker 镜像、容器、大文件之后，如果 Windows D 盘空间没有释放，不代表文件没有删成功，而是还缺少最后一步：**压缩 VHDX**。

这次问题的关键路径是：

```
删除大文件 / 清理 Docker
        ↓
Ubuntu 内部空间释放
        ↓
sudo fstrim -av 标记空闲块
        ↓
wsl --shutdown 关闭 WSL
        ↓
diskpart compact vdisk 压缩 ext4.vhdx
        ↓
Windows D 盘空间真正释放
```

以后如果 WSL 或 Docker 再次把磁盘撑大，也可以按这套流程处理。核心原则只有一句：**Linux 里删文件，Windows 里压 VHDX，两个动作都完成，空间才算真正回收。**

## 参考

- [【Linux】WSL 中 Docker 占用大量磁盘空间但无法释放的完整解决记录](https://zade23.github.io/2026/01/23/%E3%80%90Linux%E3%80%91WSL-%E4%B8%AD-Docker-%E5%8D%A0%E7%94%A8%E5%A4%A7%E9%87%8F%E7%A3%81%E7%9B%98%E7%A9%BA%E9%97%B4%E4%BD%86%E6%97%A0%E6%B3%95%E9%87%8A%E6%94%BE%E7%9A%84%E5%AE%8C%E6%95%B4%E8%A7%A3%E5%86%B3%E8%AE%B0%E5%BD%95/index.html)
- [知乎 —— WSL2 ext4.vhdx 清理记录](https://zhuanlan.zhihu.com/p/18333386892)
- [CSDN —— WSL2 ext4.vhdx 缩小方法](https://blog.csdn.net/plmm__/article/details/147101949)
- [掘金 —— WSL2 磁盘空间清理指南](https://juejin.cn/post/7614566158142357513)
