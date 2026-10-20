# Third-party notices / 第三方组件说明

本插件客户端由维护者确认采用根目录 [MIT License](LICENSE)，不包含独立服务端、运维配置或用户数据。下列组件依各自许可证保留原权利。

| 组件 | 用途 | 许可 / 上游 |
| --- | --- | --- |
| DOMPurify 3.4.14 | 清理公告 Markdown 产生的 HTML | Apache-2.0 OR MPL-2.0；[上游](https://github.com/cure53/DOMPurify)，完整已安装许可见 [licenses/DOMPurify-Apache-2.0.txt](licenses/DOMPurify-Apache-2.0.txt) 与 [licenses/DOMPurify-MPL-2.0.txt](licenses/DOMPurify-MPL-2.0.txt) |
| Marked 15.0.12 | 公告 Markdown 解析 | MIT，包含 Markdown 来源归属；[上游](https://github.com/markedjs/marked)，[完整已安装许可](licenses/Marked-LICENSE.md) |
| node-diff3 / Synchrotron | `src/main.ts` 中恢复自旧发布包的最长公共子序列及三方合并实现 | MIT；[上游](https://github.com/bhousel/node-diff3)，[完整许可](licenses/node-diff3-LICENSE.md)，[3.1.2 上游参照](https://github.com/bhousel/node-diff3/blob/v3.1.2/LICENSE.md) |

三方合并实现经过恢复、变量格式化和安全调整（包括使用无原型键映射），其上游结构可与 node-diff3 的 `LCS` / `diffIndices` / `diff3MergeRegions` / `diff3Merge` / `merge` 对照。早期依赖锁与确切原版本尚未找回，不能凭结构相似声明已证明某一个精确版本；提交前仍需核对原始来源、保留原作者归属和完整许可。

node-diff3 的上游归属包括 Tony Garnock-Jones、LShift Ltd. 和 Bryan Housel；其 MIT 许可不意味着可以删除这些版权及许可声明。上游来源是 Project Synchrotron。

DOMPurify 采用上游双许可中的 Apache-2.0 路径分发，MPL-2.0 原文同时保留供参照。开发工具 TypeScript / esbuild 不会作为运行时依赖远程下载；Obsidian API 由宿主提供。`tools/build.mjs` 把客户端 MIT、DOMPurify Apache-2.0、Marked 及 node-diff3 的完整许可作为注释写入候选 `main.js`，不依赖安装器额外下载许可文件。现有远程 0.4.5 附件未被替换；新候选仍待维护者确认发布和官方目录审核。
