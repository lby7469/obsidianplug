# NoteCloud Sync 插件

无需 Git 配置的 Obsidian 同步插件。已有用户输入手机号和密码即可登录，新用户可以使用管理员发放的一次性邀请码自动注册。点击右下角云朵同步，也可以等待每五分钟自动同步。

构建发布包：

```sh
npm install
npm run build
```

可以通过 BRAT 安装仓库 `lby7469/obsidianplug`，也可以把 Release 中的 `main.js`、`manifest.json` 和 `styles.css` 放到 Obsidian Vault 的 `.obsidian/plugins/notecloud-sync/`，然后在社区插件页面启用。

首次启用后填写手机号和密码，新用户再填写邀请码，然后点击设置页右上角的勾保存。服务地址固定为 `https://api.notecloud.asia`，普通用户不需要填写服务器地址。

插件支持选择同步文件夹、查看 5 GB 云端空间用量，并默认跳过超过 30 MB 的文件。右下角云朵可以立即同步，右键或长按打开设置。手机端也会显示悬浮同步按钮。
