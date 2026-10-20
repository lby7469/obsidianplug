# NoteCloud Sync

Sync notes with a NoteCloud account, preserve folders, and read or share notes on the web. NoteCloud Sync is an independent community plugin, not an Obsidian product or the official Obsidian Sync service. It is designed for desktop and mobile, but has not been tested on every supported device or on the declared minimum Obsidian version.

## Installation

Back up your vault before the first sync. Cloud sync is not a replacement for an independent backup.

### Obsidian Community plugins

1. Open **Settings → Community plugins** in Obsidian and select **Browse**.
2. Search for **NoteCloud Sync**. If the entry is available to your client, select **Install**, then **Enable**.
3. Open **Settings → NoteCloud Sync** and follow the basic usage steps below.

The directory entry has been submitted and its automated review may still be in progress. If the plugin is not available in your client's directory yet, use either of the following installation methods. A published GitHub release is not proof that all directory checks have passed.

### BRAT / existing users

1. Install and enable **BRAT** from Obsidian's Community plugins browser.
2. In BRAT, choose **Add Beta plugin** and enter `lby7469/obsidianplug`, or `https://github.com/Yinds0270/NoteCloud` for the new distribution repository.
3. Enable **NoteCloud Sync** in Community plugins. Do not install both repositories into the same vault: both use the plugin ID `notecloud-sync`.

The original `lby7469/obsidianplug` URL remains available; existing users do not need to change it. Obsidian or BRAT manages updates. This plugin does not install or update itself or its dependencies.

### Manual installation

1. Download `main.js`, `manifest.json`, and `styles.css` from a [GitHub release](https://github.com/Yinds0270/NoteCloud/releases).
2. Close Obsidian and put the three files in `<vault>/.obsidian/plugins/notecloud-sync/` (use your actual configuration directory if customized).
3. Reopen Obsidian and enable **NoteCloud Sync**. When upgrading, replace only these three files; do not overwrite or share your existing `data.json`.

## Basic usage

1. Open **Settings → NoteCloud Sync** and choose **Login**. Account actions open the NoteCloud website; create an account there if needed.
2. Authorize the current device in your browser. The one-time `obsidian://notecloud-auth` callback returns to Obsidian. The plugin stores revocable device tokens, not your account password.
3. Before syncing, choose **all folders** or select specific folders, check the file-size limit and conflict strategy, and decide whether to keep automatic sync enabled. Automatic sync defaults to every five minutes after login; you can turn it off and use manual sync.
4. Run a manual sync with a backed-up test folder first. Check both local files and your web vault before expanding the selection. Switching accounts clears the previous account's sync baseline, pauses automatic sync, and asks for confirmation before the first manual sync to the new account.
5. Read notes or manage sharing at [notecloud.asia](https://notecloud.asia). Link sharing and public community submissions are separate choices; do not share private notes unintentionally.

Markdown conflicts use a three-way merge where possible. If it cannot merge safely, the default is to keep a local conflict copy. TXT and common attachments are supported as well as Markdown; see the [detailed user guide in Chinese](USER_GUIDE.md) for file types, limits, conflict handling, announcements, renewal notices, and troubleshooting.

## Account, payment and privacy

- Cloud features require a **NoteCloud account and an internet connection**. New accounts start with a limited free tier (currently 100 MB); extra storage may require payment. Selected early users may have a different permanent allowance. The plugin is not an unlimited free-storage offer.
- `https://api.notecloud.asia` handles device authorization, tokens, synchronization, quota, feedback, version checks and announcements. `https://notecloud.asia` provides browser account actions and the web vault. The public service currently uses a Cloudflare entry point.
- Sync uploads supported files in the configured scope, their relative paths, sizes, hashes and modification times. Markdown synchronization also includes Wiki Link, embed, outgoing-link and alias metadata. Version and service checks send the plugin version and desktop/mobile category; announcements are checked on startup and periodically while running.
- There is **no client-side analytics SDK or advertising**. The server keeps operational/security logs such as request times, paths, IP addresses and results. Feedback sends the fields you enter, not your private note contents automatically.
- Runtime file access uses Obsidian's Vault API, not Node.js or Electron file-system access. The Obsidian configuration directory and trash are excluded from sync. Do not publish plugin configuration or device tokens.
- HTTPS protects data in transit, but this is **not end-to-end encrypted**. Operators with server access can potentially read online files. Restic backup encryption does not remove access for people holding the server permissions or backup keys. Read [PRIVACY.md](PRIVACY.md) before connecting a vault.

## Why the plugin enumerates vault files

When **all folders** is enabled, Obsidian's `vault.getFiles()` supplies the vault-wide file snapshot needed to synchronize all files. This remains a real enumeration capability and may appear as a directory recommendation.

When you select **specific folders**, the plugin resolves only those folders through the public Vault API and walks their cached child trees; it does not call the whole-vault file-list APIs for that sync. Selecting `/` includes root-level files only, not every subfolder. Nested and duplicate selections are deduplicated. The folder picker inspects folder entries only when settings are opened and skips the configuration and trash subtrees.

The scope picker initially shows top-level folders only. Expand folders one level at a time, or use **Expand all / Collapse all**. Opening settings again starts collapsed. Expanding a folder only changes the display, not its sync selection; the separate root-files switch and your saved folder choices remain unchanged.

One in-scope path snapshot protects against unsafe deletion assumptions, and remote changes are checked again against the current local path before applying. If a selected folder is missing, moved or cannot be read reliably, the sync pauses rather than treating that failure as an empty folder and deleting cloud files. Restore the folder or reselect your sync scope, then retry; removing a whole selected folder is not treated as permission to erase its cloud copy.

Before reading a file's content for upload, the plugin checks the supported extension, safe path, configured sync scope and file-size limit. Files outside the selected scope are not uploaded by sync. Narrower discovery is not an Obsidian permission sandbox: plugins still run with Vault API access. Enumerating paths does not upload every file, and merely renaming an API call would not remove this capability. Do not enable cloud sync in a vault you do not want the plugin to access.

## Contributors and project origin

Original author and contributor: [lby7469](https://github.com/lby7469). Current distribution maintainer: [Yinds0270](https://github.com/Yinds0270). The original author's [public written authorization](https://github.com/lby7469/obsidianplug/blob/main/MAINTAINERS.md) permits continued maintenance, releases and directory submission from this repository. See [MAINTAINERS.md](MAINTAINERS.md).

Contributor credit does not grant repository or directory administration rights. The client is MIT-licensed; all applicable third-party licenses and attribution are retained. Server source, credentials and user data are not included in the client license.

## Development

The maintainer-triggered release workflow builds and tests the source on GitHub Actions, generates artifact provenance for the three build outputs, and creates a draft for download verification. It does not modify previous releases. To verify an attested release after downloading its assets, use the GitHub CLI:

```sh
gh attestation verify main.js --repo Yinds0270/NoteCloud
gh attestation verify manifest.json --repo Yinds0270/NoteCloud
gh attestation verify styles.css --repo Yinds0270/NoteCloud
```

Older manually published versions may not have attestations. Verification establishes build provenance, not a guarantee that software is bug-free or that every device has been tested.

```sh
npm ci --ignore-scripts
npm run check
npm run lint
npm run build
npm test
npm run test:release
```

Build the reviewable TypeScript source rather than editing `main.js`. Tests use isolated fixtures, not production user vaults. Release assets are `main.js`, `manifest.json`, and `styles.css`; the release tag must exactly match the manifest version without a `v` prefix.

## 中文说明

NoteCloud Sync 是无需 Git 配置的 Obsidian 云同步插件，面向桌面和移动端设计。云端保留文件夹层级，网页可阅读笔记、仅链接分享或投稿到首页。

NoteCloud Sync is an independent community plugin, not an Obsidian product or the official Obsidian Sync service. A NoteCloud account and an internet connection are required for cloud features. A limited free storage tier is available; additional storage may require payment. Please read the [data handling and privacy information](PRIVACY.md) before connecting a vault.

本插件由 NoteCloud 独立提供，与 Obsidian 官方及官方 Obsidian Sync 服务无隶属关系。**云端功能需要 NoteCloud 账号和网络连接；免费容量有限，额外扩容可能收费。** 本地阅读 Obsidian 笔记不需要本服务。现已提交官方插件目录，自动检查仍在进行；可安装范围与审核状态以实际目录页面为准，BRAT / 手动下载继续保留。

开始使用：Obsidian 设置 → 第三方插件 → 安装并启用 BRAT → 在 BRAT 添加 `lby7469/obsidianplug` → 启用 NoteCloud Sync → 插件设置里登录 → 先备份，再选择文件夹同步。

详细操作说明见 [用户使用指南](USER_GUIDE.md)，网站：[notecloud.asia](https://notecloud.asia)。

自动升级只需配置一次：在 BRAT 中让本插件跟随 **latest**，开启“启动时自动更新 Beta 插件”。固定到某个版本不会自动更新；Obsidian 关闭或 GitHub 不可访问时无法更新。没有使用 BRAT 的旧用户需先完成这一步。

NoteCloud 插件本身不安装或更新自己，也不下载可执行依赖；它只检查版本、显示提示或打开发布页。BRAT 是用户另行安装和控制的插件，不是使用 NoteCloud 云同步的运行依赖。将来进入官方目录后，可直接使用 Obsidian 的第三方插件更新入口，不必安装 BRAT。

## 网络、文件与数据处理披露

- `https://api.notecloud.asia`：账号授权、设备令牌、同步、容量、反馈、版本检查与公告。同步会上传所选范围内支持类型的文件内容、相对路径、大小、哈希、修改时间，以及 Markdown 的 Wiki Link / 嵌入 / 出链和别名元数据；登录后默认每 5 分钟自动同步，可在设置关闭或改为手动。
- `https://notecloud.asia`：浏览器内登录、注册、忘记密码、设备授权、云仓库、分享与续费记录。浏览器授权完成后通过 `obsidian://notecloud-auth` 返回插件。
- 版本与公告检查在启用插件后发起，并约每 5 分钟重查；请求包含插件版本及 mobile / desktop 分类，用于兼容与服务信息。服务端保留运行 / 安全日志，包括请求时间、路径、IP 地址、结果与必要的安全操作记录，具体说明见 [PRIVACY.md](PRIVACY.md)。关闭动画不等于停止联网检查。
- 官网 / API 目前经 Cloudflare 公网入口转发；GitHub 用于用户主动打开发布页，以及 Obsidian / BRAT 下载插件更新。没有外部广告或客户端行为分析 SDK；不自动把私人笔记附加到反馈中。
- 运行时使用 Obsidian Vault API 处理当前仓库，不读取仓库外的任意文件；不直接使用 Node.js 文件系统或 Electron 接口。同步排除 Obsidian 配置目录及回收站。设备令牌和同步基线由 Obsidian 保存在本插件配置中，请勿公开 `data.json` 或整个配置目录。
- 公告中的外部图片只显示链接，不自动加载；点击外部链接后由浏览器访问该站点。**没有端到端加密**，拥有服务器 / 备份权限的运维人员仍可能读取上传文件。

## 账号登录

插件不再要求用户输入或保存手机号密码：

1. 在插件设置中点击“登录”“注册”“切换账号”或“忘记密码”。
2. 浏览器会打开 NoteCloud 网站。
3. 在网站登录或注册，并确认连接当前 Obsidian 设备。
4. 网站通过 `obsidian://notecloud-auth` 一次性回调插件。

插件只保存可撤销的设备令牌。登录设备可以在 NoteCloud 网站的个人资料中管理。

升级后会清理旧版本遗留的本地密码。所有账号操作必须在网站完成。

## 同步能力

- 手动同步与 1–60 分钟自动同步
- 选择全部文件夹或指定文件夹；默认仅展示顶层文件夹，可逐层展开，也可一键全部展开/收起。重新打开设置默认收起，折叠不影响已有同步选择。
- Markdown 冲突自动三方合并；失败时默认保留本地冲突副本，也可选择本地优先或云端优先
- TXT、Markdown（含 .markdown）、图片、PDF、音视频、Canvas 与常见办公附件
- 小文件直传、桌面两路并发、大文件自适应分片（新服务端最多 4MiB）；失败分片最多重试两次（共三次尝试），已完成进度保留
- 设置页打开时约每 10 秒刷新容量，返回 Obsidian 时立即刷新；后台赠送额度不必等整次同步完成
- 可停止同步；未修改文件复用内存哈希缓存，减少重复读盘
- 使用 Obsidian MetadataCache 上传 Wiki Link、嵌入、出链目标和别名
- 从插件免登录打开 NoteCloud 网站
- 在线运行时约每 5 分钟检查更新和公告；标题与时间列表、单篇 Markdown 阅读框、未读红色/已读灰色、手动已读、已读删除、最近 10 条历史，不自动弹出公告
- 插件和网页意见反馈、查看管理员回复与采纳奖励
- 与公告分开的续费提醒、网页续费记录；管理员续费后自动刷新可用额度
- 网页分享可撤销展示，可选择保留快照或跟随原笔记更新；首页内容更新重新审核

切换账号会清空旧账号的同步基线、暂停自动同步，并在第一次手动同步时让你确认当前仓库是否应该传到新账号。不会删除本地笔记。

完整安装、同步、冲突、更新、平台兼容和兑换码说明见 [用户使用指南](USER_GUIDE.md)。

## 稳定、实惠、安全、隐私

新注册用户初始 100MB。指定早期用户可由管理员将永久额度补足至 5GB，已有更高永久额度不会减少。付费扩容到期后，仍在永久额度内可继续同步；超出时暂停同步，仍可浏览、下载及在网页清理文件。目前由管理员手动登记续费，用户可在网站查看记录，没有在线支付入口。新兑换码为长随机码，有效期默认 30 天，可提前作废；频繁猜码会锁定兑换功能。

正式服务使用 HTTPS，密码采用加盐 scrypt 哈希；普通用户不能访问他人的私人仓库。管理员后台有受权限控制的只读目录与正文预览入口，每次查询和读取留有审计记录，不提供代设现有用户密码。公开投稿经审核，链接分享不进入首页。

**当前没有端到端加密。** 在线笔记未做应用层静态加密；运维备份仓库已使用 Restic 加密，但持有服务器权限或备份解密密钥的人员仍可能读取相应内容，这不等于运维无法访问。链接持有人可转发和下载；已下载副本无法撤回。详细边界见 [隐私说明](PRIVACY.md) 和用户指南。

本项目处于早期体验阶段，尚未完成全部平台真机测试，不承诺零故障。云同步不是独立备份，第一次使用请先备份仓库。

## 构建

```powershell
npm ci --ignore-scripts
npm run check
npm run lint
npm run build
npm test
```

发布文件为 `main.js`、`manifest.json`、`styles.css` 和 `versions.json`。可通过 BRAT 使用仓库 `lby7469/obsidianplug`，也可以手动复制到 Vault 的 `.obsidian/plugins/notecloud-sync/`。

源码已整理为严格 TypeScript：同步、账号及界面位于 `src/main.ts`，网络 / 缓存边界位于 `src/plugin-types.ts`，范围发现位于 `src/vault-scope.ts`，三方合并位于 `src/merge.ts`。修改源码后重新构建，不直接编辑 `main.js`。本地按官方 ESLint 推荐规则检查（仅添加 NoteCloud / BRAT 品牌词配置，不关闭规则）；不调用已弃用的滑块动态提示 API，改在现有说明中实时展示当前数值，兼容旧版界面。

`npm test` 使用虚构数据，覆盖同步 / 冲突、账号隔离、取消、容量刷新、公告、续费、损坏缓存、分行兼容及真实 DOM 安全渲染；不连接正式用户仓库。静态检查和模拟测试不等于所有平台真机验收。最低声明版本为 1.5.0，具体设备首次使用仍请先用已备份的测试仓库验证。

## 维护与下载地址

原地址 `lby7469/obsidianplug` 继续保留，用于现有用户的 BRAT / Release 下载；不要求旧用户改仓库或重新安装。维护者已授权 `Yinds0270` 在 `Yinds0270/NoteCloud` 继续维护和发布，详见 [维护授权说明](MAINTAINERS.md)。两个来源使用同一插件 ID `notecloud-sync`，不是两个不同插件，不要在同一仓库重复安装。新账号仓库发布与官方目录审核是独立步骤，以各自页面实际状态为准。

## 许可证与第三方组件

插件客户端采用 [MIT License](LICENSE)，不因此为独立服务端、运维配置或用户数据授予任何开源许可。Markdown 公告使用 DOMPurify 和 Marked；三方合并代码基于 node-diff3 / Synchrotron 算法实现。来源和完整许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。构建会把客户端及已打包组件的必要许可正文保留在 `main.js` 注释中。GitHub 发布、目录展示与自动审核通过是不同状态，最新审核结果以目录页面为准。
