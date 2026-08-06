# NoteCloud Sync 插件

无需 Git 配置的 Obsidian 同步插件。用户输入已由管理员创建的手机号和密码后，即可点击右下角状态按钮同步，也可以等待每五分钟自动同步。

构建发布包：

```sh
npm install
npm run build
```

可以通过 BRAT 安装仓库 `lby7469/obsidianplug`，也可以把 Release 中的 `main.js`、`manifest.json` 和 `styles.css` 放到 Obsidian Vault 的 `.obsidian/plugins/notecloud-sync/`，然后在社区插件页面启用。

首次启用后只填写手机号和密码。服务地址固定为 `https://api.notecloud.asia`，普通用户不需要填写服务器地址。

右下角 “NoteCloud” 状态文字可以立即同步。插件每五分钟自动同步一次。
