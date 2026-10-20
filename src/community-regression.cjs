const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { transformSync } = require("esbuild");
const notices = [], modals = [], settings = [];
class Element {
  constructor() { this.children = []; this.attrs = {}; }
  createEl(tag, options = {}) { const child = new Element(); Object.assign(child, { tag, ...options }); this.children.push(child); return child; }
  createSpan(options) { return this.createEl("span", options); }
  createDiv(options) { return this.createEl("div", options); }
  empty() { this.children = []; }
  append(...children) { this.children.push(...children); }
  addEventListener(type, callback) { this[type] = callback; }
  toggleClass(name, active) { this[name] = active; }
  setAttribute(name, value) { this.attrs[name] = value; }
}
class Control {
  constructor() { this.inputEl = {}; }
  setButtonText(text) { this.text = text; return this; }
  setPlaceholder() { return this; }
  setCta() { return this; }
  setDisabled(value) { this.disabled = value; return this; }
  onClick(callback) { this.click = callback; return this; }
  onChange(callback) { this.change = callback; return this; }
}
class Setting {
  constructor() { this.controls = []; this.settingEl = new Element(); settings.push(this); }
  setName(name) { this.name = name; return this; }
  setDesc(desc) { this.desc = desc; return this; }
  addButton(callback) { const control = new Control(); this.controls.push(control); callback(control); return this; }
  addText(callback) { return this.addButton(callback); }
  addTextArea(callback) { return this.addButton(callback); }
}
const obsidian = { Setting, Notice: class { constructor(message) { notices.push(message); } }, setIcon() {}, Modal: class { constructor() { this.contentEl = new Element(); modals.push(this); } open() { this.onOpen(); } close() { this.closed = true; } } };
const fragmentFixture = { sanitizedFragment: true, content: "Safe fixture" };
const moduleFixture = { exports: {} };
const context = vm.createContext({ module: moduleFixture, exports: moduleFixture.exports, require: name => name === "./announcement-markdown" ? { announcementFragment: () => fragmentFixture } : obsidian, document: { body: new Element() }, window: { open() {}, setInterval: () => 1 } });
const communitySource = fs.readFileSync(require("node:path").join(__dirname, "community.ts"), "utf8");
vm.runInContext(transformSync(communitySource, { loader: "ts", format: "cjs", target: "es2018" }).code, context);
const community = context.module.exports;
(async () => {
  let saves = 0, sent;
  const plugin = { app: {}, settings: { token: "fixture" }, registerInterval() {}, saveSettings: async () => { saves++; }, settingsTab: { display() {} }, authorizedRequest: async (route, options) => { sent = { route, ...JSON.parse(options.body) }; } };
  community.initialize(plugin); assert.equal(plugin.announcementButton.hidden, true);
  const incoming = Array.from({ length: 12 }, (_, i) => ({ id: String(i), title: "Announcement " + i, message: "Fixture", createdAt: new Date(2026, 0, i + 1).toISOString() }));
  community.ingest(plugin, incoming);
  assert.equal(plugin.settings.announcementHistory.length, 10); assert.equal(community.unread(plugin).length, 10);
  assert.equal(plugin.announcementButton.hidden, false); assert.equal(plugin.announcementButton["has-unread"], true);
  assert.equal(notices.length, 0); assert.equal(modals.length, 0);
  community.openAnnouncements(plugin); assert.equal(community.unread(plugin).length, 10, "Opening is not automatically reading");
  assert.ok(settings.every(setting => setting.settingEl["notecloud-announcement-unread"] === true), "Unread rows are marked for red styling");
  assert.ok(settings.every(setting => !setting.desc.includes("Fixture")), "List must not show announcement bodies");
  assert.deepEqual(settings[0].controls.map(control => control.text), ["查看", "标为已读"]);
  const before = community.unread(plugin).length;
  await settings[0].controls[0].click();
  assert.equal(community.unread(plugin).length, before, "Viewing does not automatically mark read");
  const announcementBody = modals.at(-1).contentEl.children.find(child => child.cls === "notecloud-announcement-markdown");
  assert.equal(announcementBody.children[0], fragmentFixture, "Append the sanitized DOM fragment directly, without reparsing HTML");
  assert.equal(announcementBody.innerHTML, undefined, "Announcement display does not assign innerHTML");
  await community.deleteAnnouncement(plugin, "11"); assert.equal(plugin.settings.announcementHistory.length, 10, "Unread deletion is refused");
  await community.markRead(plugin, "11"); assert.equal(community.unread(plugin).length, 9); assert.equal(saves, 1);
  community.ingest(plugin, incoming); assert.equal(community.unread(plugin).length, 9);
  plugin.settings = JSON.parse(JSON.stringify(plugin.settings));
  assert.equal(community.unread(plugin).length, 9, "Read state survives serialization");
  settings.length = 0; community.openAnnouncements(plugin);
  assert.equal(settings.find(setting => setting.name === "Announcement 11").settingEl["notecloud-announcement-unread"], false, "Read rows lose the red marker");
  const readRow = settings.find(setting => setting.name === "Announcement 11");
  assert.equal(readRow.settingEl["notecloud-announcement-read"], true);
  assert.deepEqual(readRow.controls.map(control => control.text), ["查看", "删除"]);
  await readRow.controls[1].click();
  assert.equal(plugin.settings.announcementHistory.length, 9);
  plugin.settings = JSON.parse(JSON.stringify(plugin.settings));
  community.ingest(plugin, incoming);
  assert.equal(plugin.settings.announcementHistory.some(item => item.id === "11"), false, "Deleted announcement cannot return after refresh/restart");
  assert.equal(plugin.announcementButton["is-animated"], true);
  plugin.settings.serviceNotices = false; community.updateIcon(plugin);
  assert.equal(plugin.announcementButton["has-unread"], true, "Disabling animation does not hide unread styling");
  assert.equal(plugin.announcementButton["is-animated"], false);
  community.ingest(plugin, []); assert.equal(community.unread(plugin).length, 0); assert.equal(plugin.settings.announcementHistory.length, 9); assert.equal(plugin.announcementButton.hidden, true);
  assert.equal(plugin.announcementButton["has-unread"], false);
  assert.equal(plugin.announcementButton["is-animated"], false);
  settings.length = 0; community.openFeedback(plugin);
  settings.find(setting => setting.name === "标题").controls[0].change("Reader suggestion");
  settings.find(setting => setting.name === "内容").controls[0].change("Please add a reader feature");
  await settings.flatMap(setting => setting.controls).find(control => control.text === "提交反馈").click();
  assert.equal(sent.route, "/v1/feedback"); assert.equal(sent.source, "plugin");
  assert.deepEqual(Object.keys(sent).sort(), ["message", "route", "source", "title"]);
  assert.equal(modals.at(-1).closed, true);
  console.log("PASS: announcement max-10 cache, explicit read, quiet delivery, read persistence, animation toggle; feedback sends only user-entered fields");
})().catch(error => { console.error(error); process.exitCode = 1; });
