// @ts-nocheck
const { Modal, Setting, Notice, setIcon } = require("obsidian");

function unread(plugin) {
  const read = new Set(plugin.settings.readAnnouncementIds || []);
  return (plugin.settings.announcementHistory || []).filter(item => item.active !== false && !read.has(item.id));
}
function updateIcon(plugin) {
  if (typeof document === "undefined") return;
  const count = unread(plugin).length;
  if (!plugin.announcementButton) {
    const button = document.body.createEl("button", { cls: "notecloud-announcement-button" });
    button.addEventListener("click", () => openAnnouncements(plugin));
    plugin.announcementButton = button;
  }
  const button = plugin.announcementButton;
  button.hidden = !count;
  button.empty();
  setIcon(button, "bell");
  if (count) button.createSpan({ cls: "notecloud-announcement-count", text: String(count) });
  button.toggleClass("has-unread", count > 0 && plugin.settings.serviceNotices !== false);
  button.setAttribute("aria-label", `NoteCloud 有 ${count} 条未读公告，点击查看`);
  button.title = `NoteCloud：${count} 条未读公告`;
}
function ingest(plugin, incoming) {
  const map = new Map((plugin.settings.announcementHistory || []).map(item => [item.id, { ...item, active: false }]));
  for (const item of incoming || []) if (item?.id && typeof item.title === "string" && typeof item.message === "string") map.set(item.id, { ...item, active: true });
  plugin.settings.announcementHistory = [...map.values()].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 10);
  const known = new Set(plugin.settings.announcementHistory.map(item => item.id));
  plugin.settings.readAnnouncementIds = (plugin.settings.readAnnouncementIds || []).filter(id => known.has(id));
  updateIcon(plugin);
}
function initialize(plugin) {
  plugin.settings.announcementHistory ||= (plugin.settings.serviceStatus?.announcements || []).slice(0, 10);
  plugin.settings.readAnnouncementIds ||= [];
  updateIcon(plugin);
  plugin.registerInterval(window.setInterval(() => void plugin.checkServiceStatus(false), 5 * 60 * 1000));
}
async function markRead(plugin, id) {
  plugin.settings.readAnnouncementIds = [...new Set([...(plugin.settings.readAnnouncementIds || []), id])].slice(-10);
  await plugin.saveSettings(); updateIcon(plugin);
}
function renderItem(plugin, container, item, refresh) {
  const read = (plugin.settings.readAnnouncementIds || []).includes(item.id);
  const setting = new Setting(container).setName(`${read ? "" : "未读 · "}${item.title}`).setDesc(`${item.message}\n${item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}${item.active === false ? " · 历史公告" : ""}`);
  if (!read) setting.addButton(button => button.setButtonText("标记已读").onClick(async () => { await markRead(plugin, item.id); refresh(); plugin.settingsTab?.display(); }));
  if (item.linkUrl && /^https:\/\//i.test(item.linkUrl)) setting.addButton(button => button.setButtonText("详情").onClick(() => window.open(item.linkUrl, "_blank", "noopener,noreferrer")));
}
function openAnnouncements(plugin) {
  const modal = new Modal(plugin.app);
  const render = () => {
    modal.contentEl.empty();
    modal.contentEl.createEl("h2", { text: "NoteCloud 公告" });
    const items = plugin.settings.announcementHistory || [];
    if (!items.length) modal.contentEl.createEl("p", { text: "暂无公告。你可以在设置中检查更新。" });
    for (const item of items) renderItem(plugin, modal.contentEl, item, render);
    modal.contentEl.createEl("small", { text: "保留本设备收到的最近 10 条公告。阅读后请点击标记已读。" });
  };
  modal.onOpen = render;
  modal.open();
}
function renderTop(plugin, container) {
  const items = unread(plugin);
  if (!items.length) return;
  const box = container.createDiv({ cls: "notecloud-unread-announcements" });
  box.createEl("h3", { text: `未读公告（${items.length}）` });
  for (const item of items.slice(0, 3)) renderItem(plugin, box, item, () => {});
  if (items.length > 3) new Setting(box).setName("还有未读公告").addButton(button => button.setButtonText("查看全部").onClick(() => openAnnouncements(plugin)));
}
function renderHistory(plugin, container) {
  new Setting(container).setName("公告栏").setDesc("查看最近 10 条历史公告，已读内容保留在这里。").addButton(button => button.setButtonText("打开公告栏").onClick(() => openAnnouncements(plugin)));
}
function openFeedback(plugin) {
  const modal = new Modal(plugin.app);
  let title = "", message = "";
  modal.onOpen = () => {
    modal.contentEl.createEl("h2", { text: "意见反馈" });
    modal.contentEl.createEl("p", { text: "反馈正文会提供给管理员；不会自动附带笔记或日志。请勿填写密码、兑换码、私密链接或不愿披露的笔记。" });
    new Setting(modal.contentEl).setName("标题").addText(input => input.setPlaceholder("简要描述问题或建议").onChange(value => title = value));
    new Setting(modal.contentEl).setName("内容").addTextArea(input => { input.inputEl.rows = 6; input.inputEl.maxLength = 4000; input.onChange(value => message = value); });
    new Setting(modal.contentEl).addButton(button => button.setButtonText("查看回复与奖励").onClick(() => void plugin.openWebPortal("/feedback"))).addButton(button => button.setButtonText("提交反馈").setCta().onClick(async () => {
      if (title.trim().length < 2 || message.trim().length < 5) return void new Notice("请填写至少 2 字标题和 5 字反馈内容");
      if (!plugin.settings.token && !plugin.settings.refreshToken) return void new Notice("请先在插件设置中登录");
      button.setDisabled(true);
      try { await plugin.authorizedRequest("/v1/feedback", { method: "POST", body: JSON.stringify({ title: title.trim(), message: message.trim(), source: "plugin" }) }); new Notice("反馈已提交。可以在网页意见反馈中查看回复和额度奖励。"); modal.close(); }
      catch (error) { new Notice(error instanceof Error ? error.message : "提交失败"); }
      finally { button.setDisabled(false); }
    }));
  };
  modal.open();
}
module.exports = { initialize, ingest, unread, markRead, updateIcon, renderTop, renderHistory, openAnnouncements, openFeedback };
