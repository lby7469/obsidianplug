# NoteCloud Sync

把 Obsidian 笔记同步到 NoteCloud，在多台设备间继续阅读和编辑，也可以通过网页阅读、分享笔记。

Sync Obsidian notes with a NoteCloud account while preserving folders. This is an independent community plugin, not an Obsidian product or the official Obsidian Sync service.

## 主要功能

- 手动或自动双向同步，保留文件夹层级。
- 选择整个仓库或指定文件夹；支持 Markdown、TXT、Canvas 及常见图片、音视频、PDF 和办公附件。
- Markdown 冲突优先尝试三方合并，无法合并时按所选策略处理，默认保留两份。
- 查看云端容量、兑换额度、读取公告、提交反馈和查看续费提醒。
- 在 [NoteCloud 网页版](https://notecloud.asia) 阅读笔记、管理分享；链接分享和公开到首页是不同选项。

同步不是独立备份，也不是只上传不下载的网盘操作。首次使用前请备份仓库，先用少量笔记验证同步结果。

## 安装

推荐通过 BRAT 安装：

1. 在 Obsidian 的「设置 → 第三方插件」中安装并启用 **BRAT**。
2. 打开 BRAT，选择 **Add Beta plugin**，填写 `Yinds0270/NoteCloud`。
3. 回到第三方插件列表，启用 **NoteCloud Sync**。

旧用户使用的 `lby7469/obsidianplug` 下载地址继续保留，无需更换。两个仓库是同一插件，不要在同一个 Obsidian 仓库中重复安装。

也可以在 Obsidian 第三方插件市场搜索 **NoteCloud Sync**；若搜索不到，请使用 BRAT。手动安装方式见下方英文 Installation。

## 开始使用

1. 打开「设置 → NoteCloud Sync」。第一次使用先关闭「自动同步」，选择要同步的文件夹和文件大小上限。
2. 点击「登录」或「注册」，在浏览器完成账号操作及当前设备授权，再返回 Obsidian。插件不保存账号密码。
3. 点击「立即同步」，对照本地文件和网页云仓库检查结果。
4. 确认正常后，按需开启「自动同步」。编辑停止约 2 秒后会尝试同步，持续编辑时最长约 10 秒检查一次；返回前台、恢复联网时也会校对。定期间隔用于兜底检查云端变化。
5. 分享笔记时前往网页版，确认选择的是仅链接分享还是公开投稿，避免误公开私人笔记。

切换设备或关闭应用前，请看同步状态是否显示「全部完成」。手机锁屏、切后台、划掉应用或系统强杀都可能中断上传；插件不能在进程结束后保证继续同步。未完成时请保持 Obsidian 打开，点击「立即同步」，完成后再切换设备。另一台设备也应先同步再编辑同一篇笔记。

勾选父文件夹会包含其子文件夹；「根目录文件」只包含仓库最外层的文件。展开或收起目录不改变同步选择。缺失的已选目录会使指定范围同步安全暂停：如果硬盘只是暂时断开，应先恢复连接；不再需要同步该目录时，才点击对应的「取消选择」。

同步中调整范围会停止旧任务；开启自动同步时再按新范围校对。已经发往服务器的请求可能仍会完成，取消选择不会撤回已上传内容。

切换账号会清除原账号的同步基线并暂停自动同步，但不删除本地笔记。首次同步到新账号前，需要再次确认当前仓库是否可以同步给该账号。

## 按钮与设置说明

| 入口或按钮 | 作用 |
| --- | --- |
| 立即同步／左侧同步图标／右下角同步按钮 | 立即开始一次双向同步，不是单独的上传或下载按钮。 |
| 右下角同步按钮长按或右键 | 打开插件设置。 |
| 停止同步 | 请求停止当前同步；已完成的操作保留，不会撤销。 |
| 刷新额度／刷新状态 | 重新获取账号容量和服务状态。 |
| 登录／注册／切换账号／忘记密码 | 打开网站完成相应账号操作；切换账号后的「确认同步」用于确认新的同步目标。 |
| 退出登录 | 清除本设备的登录状态，不删除本地笔记。 |
| 打开网站／访问 NoteCloud 网页版 | 打开网页云仓库等功能；已登录时尝试免重复登录跳转。 |
| 输入兑换码 → 兑换／取消 | 展开兑换框，提交额度兑换码或关闭输入框。 |
| 购买额度／续费记录／查看续费与记录／查看记录 / 联系管理员 | 打开网页续费入口，按网页提示办理；由管理员核实并确认，插件不直接收款。 |
| 自动同步／定期云端校对间隔 | 开启编辑后同步、返回前台和联网校对，并设置定期检查云端变化的间隔。 |
| 设置快捷键 | 打开 Obsidian 快捷键设置，为同步等命令分配快捷键。 |
| 同步所有文件夹／文件夹开关／根目录文件 | 设置同步范围；勾选全部时，单独选择暂不可编辑。 |
| 文件夹箭头／全部展开／全部收起 | 调整目录显示层级；重新打开设置默认收起。 |
| 不可用的已选文件夹 → 取消选择 | 只移除该旧目录的同步选择，不删除云端笔记或其他选择。 |
| 大文件上传上限 | 设置单个文件的同步大小上限，不是账号总容量。 |
| 文件冲突处理 | 自动合并失败时，选择保留两份、本地优先或云端优先。 |
| 设置自动更新 | 打开 BRAT 设置或其安装入口；真正更新由 BRAT 或 Obsidian 管理。 |
| 立即检查／打开发布页 | 检查版本与公告，或打开新版本的 GitHub 发布页。 |
| 轻提示与图标动画／续费提醒动画 | 控制提示和图标动画；关闭动画不等于停止联网检查。 |
| 公告铃铛／打开公告栏／查看全部 | 打开本设备最近收到的公告列表，最多保留 10 条。 |
| 公告中的查看／标为已读／删除 | 查看单篇公告；查看不会自动标已读。「删除」只隐藏本设备已读公告，不影响笔记。 |
| 公告中的打开详情链接／关闭 | 打开公告附带的网页，或关闭阅读框。 |
| 提交反馈／查看回复／查看回复与奖励 | 向管理员提交意见，或在网页查看处理结果；不会自动附带私人笔记。 |

需要自动更新时，在 BRAT 中选择 **latest**，并开启启动时检查更新。固定版本不会自动升级，Obsidian 关闭或无法连接 GitHub 时也不能更新。插件本身不会安装或更新自己。

更多文件类型、冲突处理和故障排查见 [用户使用指南](USER_GUIDE.md)。

## Installation

Install **BRAT** from Obsidian's Community plugins, add `Yinds0270/NoteCloud`, then enable **NoteCloud Sync**. Existing users may keep `lby7469/obsidianplug`; do not install both copies in one vault.

You can also search for **NoteCloud Sync** in Community plugins. For manual installation, download `main.js`, `manifest.json` and `styles.css` from a [release](https://github.com/Yinds0270/NoteCloud/releases), close Obsidian, and place them in `<vault>/.obsidian/plugins/notecloud-sync/`. Use your actual configuration directory if customized. When upgrading, replace only these files; keep your existing `data.json` private and unchanged.

## Basic usage

Back up your vault first. Open **Settings → NoteCloud Sync**, choose your sync scope, then log in through the browser and authorize the device. Run **立即同步** (Sync now) on a small selection first, check both local and web files, then enable automatic sync if desired.

Sync is bidirectional. Choosing a parent folder includes its descendants; choosing root files does not include subfolders. Expanding the folder picker changes only the display. After switching accounts, automatic sync pauses until you review the new destination and settings.

With automatic sync enabled, editing pauses trigger a sync after about two seconds, with a ten-second maximum debounce while editing continues. Returning to the app and reconnecting also request a check. Keep Obsidian open until the status says all changes are complete before switching devices; force-quitting or suspending the app can interrupt uploads.

## Account, payment and privacy

云端功能需要 NoteCloud 账号和网络连接。新账号有有限免费容量，扩容可能收费；具体容量和有效期以账号页面为准。插件通过 `https://api.notecloud.asia` 同步所选文件及必要元数据，通过 `https://notecloud.asia` 完成网页账号和分享操作。

HTTPS 保护传输，但**不是端到端加密**；有服务器或备份访问权限的运维人员仍可能读取上传内容。请勿公开插件配置或设备令牌。完整网络、数据及隐私边界见 [PRIVACY.md](PRIVACY.md)。

A NoteCloud account and internet access are required. A limited free tier is available; additional storage may require payment. HTTPS protects transport, but this is **not end-to-end encrypted**. Operators with server or backup access may read uploaded files. Read the [privacy information](PRIVACY.md) before connecting a vault.

## Contributors and project origin

原作者及贡献者：[lby7469](https://github.com/lby7469)。当前维护者：[Yinds0270](https://github.com/Yinds0270)。[原下载仓库](https://github.com/lby7469/obsidianplug)与[当前发布仓库](https://github.com/Yinds0270/NoteCloud)均保留；维护授权见 [MAINTAINERS.md](MAINTAINERS.md)。

插件客户端采用 [MIT License](LICENSE)。第三方组件及许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)；客户端许可不包含服务端或用户数据。构建与发布资料见 [DEVELOPMENT.md](DEVELOPMENT.md)。
