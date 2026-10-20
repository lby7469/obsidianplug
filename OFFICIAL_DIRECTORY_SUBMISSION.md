# NoteCloud Sync 官方目录提交清单

核对日期：2026-10-20。GitHub 发布不等于官方上架；本文件不是审核通过的证明。

## 双账号与原地址保留

- 用户已从关联 `Yinds0270` 的 Obsidian 账号提交 `https://github.com/Yinds0270/NoteCloud`，最初报告条目已展示、0.4.6 自动检查进行中；这不是所有检查通过的证明。后续版本按实际反馈修复依赖、文档、界面与同步范围扫描，最新审核以原条目为准。
- 原仓库 `https://github.com/lby7469/obsidianplug` 保留并继续提供 BRAT / Release 下载，不改名、不转移，不覆盖旧标签和旧版附件。
- 原维护者对新账号的公开授权见 [MAINTAINERS.md](MAINTAINERS.md)。保留项目来源与第三方许可；不是隐瞒来源的新插件。
- 两处使用同一个插件 ID `notecloud-sync`，每个版本的三个安装文件应逐字节一致。只提交一个官方目录条目。
- 在新账号仓库发布，需要该仓库的写入权限；登录 Obsidian 或关联 GitHub 不自动授权这台电脑的 GitHub CLI / 连接工具。

## 提交材料

| 字段 | 内容 |
| --- | --- |
| Repository | `https://github.com/Yinds0270/NoteCloud` |
| Owner | 已关联 Yinds0270 的目录账号，选择 Myself |
| ID | `notecloud-sync`，仍由目录核验唯一性 |
| Name | `NoteCloud Sync` |
| Description | `Sync notes with a NoteCloud account, preserve folders, and read or share notes on the web.` |
| Version | `0.4.9` |
| Declared minimum app version | `1.5.0`；静态检查不代表所有设备真机已验收 |
| Desktop only | `false`；运行时不依赖 Node.js / Electron |
| Payment | Optional payment：有限免费容量，额外扩容可能收费 |
| Account / network | 需要 NoteCloud 账号及网络，详见 README |
| Privacy | `PRIVACY.md`；目前不是端到端加密 |
| License | 客户端 MIT；第三方原许可保留，不包括服务端或用户数据 |

可用长简介：

> Sync selected vault files with a NoteCloud account, keep folder hierarchy, and read or share notes through the NoteCloud web app. Supports conflict copies and browser-based device authorization. Requires a network connection; storage beyond the limited free tier may require payment. This is an independent community plugin, not the official Obsidian Sync service.

## 发布与验证

```powershell
npm ci --ignore-scripts
npm run check
npm run lint
npm run build
npm test
```

- 版本标签必须与 manifest 完全一致：`0.4.9`，不是 `v0.4.9`。保留所有旧标签与附件，不覆盖旧版来伪装新审核结果。
- 默认分支、版本标签、Release 附件的 manifest 版本一致；附件为 `main.js`、`manifest.json`、`styles.css`。
- 0.4.8移除 `setDynamicTooltip`，用现有说明实时显示数值；不关闭规则。所选文件夹同步不调用全库文件枚举，全部同步仍保留必要能力及真实披露，不承诺仅因此消除能力提示。
- 0.4.9默认折叠同步范围的子文件夹，可逐层展开或全部展开/收起；重新打开设置仍默认收起，展开状态与同步选择分离。
- 构建保留客户端与已打包第三方的完整许可。重建、同步 / 账号 / 公告 / 续费 / 缓存 / DOM 安全回归均已执行。
- 另用独立虚构用户服务端检查 PKCE、令牌刷新、直传 / 分片、赠送额度刷新、TXT 重复同步及下载哈希；不对正式用户数据做破坏性测试。
- 最低 Obsidian 版本、Android 和 iOS 全平台真机仍待验收，不能宣传“全平台无故障”。
- 发布后重新下载每个仓库的三个附件并核对 SHA256，保留所有旧版下载。不覆盖真实 Vault 的 `data.json`。

## 官方目录操作

依照 [官方提交指南](https://docs.obsidian.md/plugins/releasing/submit-plugin)、
[账号与归属说明](https://docs.obsidian.md/community-directory/set-up-and-claim)、
[开发者政策](https://docs.obsidian.md/community-directory/developer-policies)：

1. 维护者本人登录 [Community 目录](https://community.obsidian.md)，确认关联的是 Yinds0270。
2. Plugins → New plugin，填新账号仓库 URL，Owner 选择 Myself。
3. 本人审阅开发者政策和持续维护承诺，然后提交。不要发送密码或验证码给协作者。
4. 按实际 Manifest / Releases / Source / Build 审核结果整改；有结果才报告“已提交”或“已通过”，本地预查不代表官方通过。
5. 目录允许安装后，再从 Obsidian 搜索、安装、登录和测试仓库同步验证，才改用户安装说明。
6. 不沿用旧教程盲目向 community-plugins.json 提 PR，不为换账号更改插件 ID。后续正常版本通过 GitHub Release 更新，不重复提交多个条目。

已提交后不用新建第二个条目。新Release发布后，在现有条目菜单选择 **Check for new releases** / **Request review**；**Review branch** 可先预览。给原作者公开署名可选择 **Add contributor**，不转移Owner、不授权编辑权限；必要时使用其Obsidian目录身份，而不是猜测GitHub账号一定能匹配。

官方 [条目管理说明](https://docs.obsidian.md/community-directory/manage-entry) 指出 warning 不阻断提交；
新版本检测或审核结果以官方实际页面为准。此插件不安装或更新自身；
BRAT 是用户另行选择的下载方式，不是云同步的运行依赖。
