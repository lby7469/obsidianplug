# NoteCloud Sync 0.4.9

- Show only top-level folders by default in sync scope settings. Manually expand one level at a time, or use Expand all / Collapse all.
- Keep expansion separate from synchronization: collapsing or reopening settings does not change saved folder selections, inheritance or the root-files option.
- Retain the 0.4.8 scope-safety and slider fixes. The directory's necessary whole-vault enumeration recommendation may still remain in all-folders mode.

同步范围默认收起子文件夹，支持逐级展开和全部展开/收起；每次重新打开设置仍默认收起。文件夹勾选与展开分离，不修改用户原有同步范围。

---

# NoteCloud Sync 0.4.8

- Remove the deprecated `setDynamicTooltip()` call. The selected upload limit remains visible and updates immediately using long-supported settings APIs.
- Discover files only below selected folders instead of listing the whole vault for a selected-folder sync. Root-only selection stays root-only; overlapping selections are deduplicated.
- Inspect folder entries, not every file path, when building the settings folder picker. Exclude configuration and trash subtrees.
- Pause sync if a selected folder is unavailable or its tree changes unreliably, rather than interpreting a failed scan as cloud deletion. Existing path snapshots, final existence checks, file-type/size limits and conflict protection remain.
- Keep honest whole-vault enumeration in all-folders mode. This is a necessary synchronization capability, not a per-folder permission sandbox, and its informational recommendation may remain.

保留原插件ID、双仓库下载和所有旧版。已增加滑块实际配置与范围扫描/误删保护回归；真实设备及最低版本兼容仍需验证，最终自动审核以目录为准。

---

# NoteCloud Sync 0.4.7

- Upgrade DOMPurify to 3.4.17, outside the reported vulnerable range, and update the lockfile and bundled license notice.
- Add English installation, basic usage, privacy and original-author/contributor information while retaining the Chinese guide.
- Remove the renewal control's `!important`; test that hidden controls stay hidden and can reappear correctly.
- Reuse one vault file snapshot per sync instead of enumerating twice. Supported type, safe path, selected-folder and file-size checks remain in place; the necessary vault enumeration capability is explicitly disclosed.
- Add a pinned, maintainer-triggered GitHub Actions build/test/provenance workflow. It creates only a draft and does not overwrite historical release assets.
- Resolve the development checker's nested Moment advisory with a scoped override, without downgrading the checker or changing runtime Obsidian dependencies.

插件 ID、旧下载地址、同步协议和用户 `data.json` 保持不变。原作者 [lby7469](https://github.com/lby7469) 的贡献与公开维护授权继续保留。目录仍可能提示必要的仓库枚举能力；这不等于上传未选择的文件。新版本是否通过自动审核，以目录实际结果为准；本地回归不等于所有平台真机验收。

---

# NoteCloud Sync 0.4.6

- 为官方社区插件目录准备资料，明确独立产品身份、需要账号 / 网络、免费容量及可能收费的扩容。
- 新增数据处理说明，披露所传文件 / 元数据、设备令牌、本地同步基线、服务端运行日志与当前没有端到端加密的边界。
- 插件客户端采用 MIT；恢复第三方组件 / 三方合并代码的来源和完整许可，构建时作为注释包含在 main.js 中。
- 同步与界面恢复源码整理为严格 TypeScript，移除 ts-nocheck；账号 / 文件 / 服务状态采用明确数据类型和 unknown 边界校验。
- 替换三处旧 iOS 不支持的正则后行断言，保持换行符与三方合并语义；同步按钮改用 CSS 类，公告直接追加净化后的 DOM fragment，不再赋值 innerHTML。
- 损坏的可选公告 / 账号 / 状态缓存不再阻止整个插件加载；保留有效令牌、同步历史和文件夹设置。
- 修复网页登录交换响应晚到时可能撤销退出登录或覆盖新登录请求的问题；卸载后也不再应用旧交换响应。
- 保留插件 ID、同步协议、冲突副本、并发 / 取消 / 重试保护及原 BRAT 下载地址；不安装自更新器、不覆盖用户 data.json。第三方合并实现单独保留来源和许可。

严格类型、官方推荐代码规则（0 error，保留1条旧版兼容的弃用 warning）、六套本地回归通过，包含1058项兼容 / 缓存检查与107项真实 DOM 渲染安全检查。另用隔离真实服务端验证PKCE授权 / 刷新、直传 / 分片、TXT再次同步、管理员赠送额度后的界面刷新与下载哈希；不使用真实用户数据。这些不等于最低声明1.5.0和所有平台真机测试。

原 `lby7469/obsidianplug` 继续供旧用户下载；已授权新维护账号 `Yinds0270`，见 [维护说明](MAINTAINERS.md)。GitHub Release 不代表官方目录已上架，正式审核状态以目录为准。

---

# NoteCloud Sync 0.4.5

- 公告列表只展示标题与时间；“查看”打开单篇大型 Markdown 阅读框，不一次展开十条正文。
- 未读公告显示红色，按钮为“查看 / 标为已读”；已读显示灰色，按钮为“查看 / 删除”。查看不自动标为已读。
- 删除只影响当前设备，删除记录保留，刷新不会重新出现；不删除服务器公告，不跨设备同步。
- 管理员使用大尺寸 Markdown 编辑器、常用格式工具栏和实时预览，正文最多 20,000 字符。网站也提供单篇公告阅读入口。
- 共用安全渲染规则，过滤脚本和危险链接；图片转为链接，不自动请求外部图片。旧纯文本公告保留原样。
- 更新隐私说明：当前未启用端到端加密；管理员后台可审计地只读查询、预览服务器笔记，不能宣称管理员无法读取。

通过插件类型检查、同步/公告/续费回归、服务端隔离权限与持久化回归，以及实际构建产物的 DOM 交互和 Markdown 安全测试。本轮没有可用浏览器连接，未完成截图验收和移动端真机测试。自动升级仍由 BRAT 执行，每个设备需要开启 latest 与启动更新；网络无法访问 GitHub 时升级可能延迟。

---

# NoteCloud Sync 0.4.4

- 续费提醒与公告分开：独立的右下角续费图标、设置顶部提示、服务期限及网页续费记录入口，不自动弹窗。
- 管理员续费后自动刷新状态；自动同步已开启时，解除到期限制后继续同步。
- 到期且超过永久免费额度时暂停同步；未超过免费额度仍可使用。网站始终允许登录、浏览、下载和清理文件。
- 新注册账号初始 100MB；管理员可为指定早期用户将永久额度补足至 5GB。已有更高永久额度不追溯减少。
- 网站新增分享展示权限、撤销与恢复、跟随原笔记更新或手动更新一次。首页内容更新后重新审核，撤销展示后旧链接停止对外访问。
- 管理后台可登记 1—36 个月付费扩容续费、设置独立提醒，用户在网页查看记录。当前不支持在线支付。

已通过隔离服务端、插件回归及真实浏览器流程验证。移动布局已检查；不等于所有手机系统已完成真机验收。当前未启用端到端加密。

---

# NoteCloud Sync 0.4.3

- 后台赠送/调整容量后，插件设置页约 10 秒自动更新；打开设置、返回 Obsidian、兑换和同步结束也会刷新，不重建正在编辑的设置界面。
- 增加 BRAT 自动更新设置入口，指南明确 latest 和启动自动更新的一次性设置。
- JSON 和二进制请求统一走 Obsidian 网络接口；设备令牌并行刷新合并为一次，退出后忽略迟到响应。
- 小文件直传、桌面最多两路并发、自适应大文件分片；未修改文件复用内存摘要；单文件失败后继续其他文件，并保存已完成进度。
- 增加停止同步；任务未结束时禁止重叠执行。修复同步结束后按钮状态，以及上传时继续编辑的待同步标记。
- 增加 TXT / .markdown，同步范围外文件不作为删除处理，避免网页 TXT 下载后被旧插件误删。
- 配套网站在云仓库展示容量，前台约 30 秒自动刷新；刷新不覆盖尚未保存的个人资料。

通过插件模拟回归、真实隔离服务额度/上传/权限回归、实际 Edge 拖拽上传及自动额度刷新验证；未完成所有平台真机和真实用户弱网测试。速度结果取决于文件分布和网络，不承诺固定 MB/s。

升级前请先备份仓库。协议向下兼容，不会因为用户尚未升级而强制锁定同步。自动更新由 BRAT 执行，需要用户在每个设备配置一次，网站不能远程替用户开启。

详细安装和更新步骤：[用户指南](https://github.com/lby7469/obsidianplug/blob/main/USER_GUIDE.md)。

---

# NoteCloud Sync 0.4.2

面向早期用户的小规模体验版本。

- 登录、注册、切换账号和找回密码统一在 NoteCloud 网站完成。
- 公告支持右下角未读铃铛、缓慢闪烁开关、设置顶部未读、手动已读和最近 10 条历史；运行且联网时约每 5 分钟检查，不自动弹出公告。
- 插件与网页新增意见反馈入口，可在网页查看回复和采纳奖励。
- 配套网站增加仅链接分享、有效期、重生成与撤销，不进入首页推荐；首页投稿仍需审核。
- 额度兑换码升级为 192 位长随机码、哈希保存、默认 30 天有效与提前作废；增加每分钟限流、累计请求风险锁定及管理员解除。
- 后台用户查找采用索引、分页和筛选；关闭私人笔记目录、读取、下载及代设密码入口。
- 大文件分片上传、单片重试、失败清理；桌面默认 200MB，移动默认 50MB。已有用户的自定义大小设置保持不变。
- 补强多设备同时写入的版本检查，避免静默覆盖。
- 切换账号后暂停自动同步，首次手动同步确认范围。
- 保护下载期间新编辑的本地内容；冲突默认保留副本。

安装：使用 BRAT 添加 `lby7469/obsidianplug`。已有用户可在 BRAT 中检查更新，更新后重载插件或重启 Obsidian。首次网页授权需要允许打开 Obsidian。

早期福利：管理员发放的每个码仅可使用一次，每个账户的早期福利仅领取一次；后续普通扩容仍可叠加。

隐私说明：HTTPS 保护传输，密码加盐哈希；当前不是端到端加密。拥有服务器或备份权限的运维仍可能读取笔记。链接可转发，已经下载的副本无法撤回。

详细说明见 [用户指南](https://github.com/lby7469/obsidianplug/blob/main/USER_GUIDE.md)。覆盖隔离 API 回归、重启持久化、插件模拟测试和类型检查；浏览器测试环境不可用，未完成本版浏览器走查及所有平台真机测试。首次体验请先备份仓库，使用测试文件夹确认同步行为。
