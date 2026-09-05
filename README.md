# NoteCloud Sync 0.4.1

NoteCloud Sync 是无需 Git 的 Obsidian 云同步插件，支持桌面端与移动端。

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
- 选择全部文件夹或指定文件夹
- Markdown 冲突自动三方合并；失败时默认保留本地冲突副本，也可选择本地优先或云端优先
- 图片、PDF、音视频、Canvas 与常见办公附件
- 1MB 分片上传、单片三次重试和失败清理；桌面端默认上限 200MB，移动端默认 50MB
- 使用 Obsidian MetadataCache 上传 Wiki Link、嵌入、出链目标和别名
- 从插件免登录打开 NoteCloud 网站
- 每 6 小时最多检查一次更新和公告，同一消息只提示一次

切换账号会清空旧账号的同步基线、暂停自动同步，并在第一次手动同步时让你确认当前仓库是否应该传到新账号。不会删除本地笔记。

完整安装、同步、冲突、更新、平台兼容和兑换码说明见 [用户使用指南](USER_GUIDE.md)。

## 构建

```powershell
npm install
npm run check
npm run build
```

发布文件为 `main.js`、`manifest.json`、`styles.css` 和 `versions.json`。可通过 BRAT 使用仓库 `lby7469/obsidianplug`，也可以手动复制到 Vault 的 `.obsidian/plugins/notecloud-sync/`。

`src/main.ts` 是从旧生产发布包恢复并格式化的源码，目前采用渐进类型化；后续功能应修改源码后重新构建，不再直接编辑压缩的 `main.js`。
