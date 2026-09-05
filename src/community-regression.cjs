const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const notices = [], modals = [], settings = [];
class Element {
  constructor() { this.children = []; this.attrs = {}; }
  createEl(tag, options = {}) { const child = new Element(); Object.assign(child, { tag, ...options }); this.children.push(child); return child; }
  createSpan(options) { return this.createEl("span", options); }
  createDiv(options) { return this.createEl("div", options); }
  empty() { this.children = []; }
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
  constructor() { this.controls = []; settings.push(this); }
  setName(name) { this.name = name; return this; }
  setDesc(desc) { this.desc = desc; return this; }
  addButton(callback) { const control = new Control(); this.controls.push(control); callback(control); return this; }
  addText(callback) { return this.addButton(callback); }
  addTextArea(callback) { return this.addButton(callback); }
}
const obsidian = { Setting, Notice: class { constructor(message) { notices.push(message); } }, setIcon() {}, Modal: class { constructor() { this.contentEl = new Element(); modals.push(this); } open() { this.onOpen(); } close() { this.closed = true; } } };
const context = vm.createContext({ module: { exports: {} }, require: () => obsidian, document: { body: new Element() }, window: { open() {}, setInterval: () => 1 } });
vm.runInContext(fs.readFileSync(require("node:path").join(__dirname, "community.ts"), "utf8"), context);
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
  await community.markRead(plugin, "11"); assert.equal(community.unread(plugin).length, 9); assert.equal(saves, 1);
  community.ingest(plugin, incoming); assert.equal(community.unread(plugin).length, 9);
  plugin.settings = JSON.parse(JSON.stringify(plugin.settings));
  assert.equal(community.unread(plugin).length, 9, "Read state survives serialization");
  plugin.settings.serviceNotices = false; community.updateIcon(plugin); assert.equal(plugin.announcementButton["has-unread"], false);
  community.ingest(plugin, []); assert.equal(community.unread(plugin).length, 0); assert.equal(plugin.settings.announcementHistory.length, 10); assert.equal(plugin.announcementButton.hidden, true);
  settings.length = 0; community.openFeedback(plugin);
  settings.find(setting => setting.name === "标题").controls[0].change("Reader suggestion");
  settings.find(setting => setting.name === "内容").controls[0].change("Please add a reader feature");
  await settings.flatMap(setting => setting.controls).find(control => control.text === "提交反馈").click();
  assert.equal(sent.route, "/v1/feedback"); assert.equal(sent.source, "plugin");
  assert.deepEqual(Object.keys(sent).sort(), ["message", "route", "source", "title"]);
  assert.equal(modals.at(-1).closed, true);
  console.log("PASS: announcement max-10 cache, explicit read, quiet delivery, read persistence, animation toggle; feedback sends only user-entered fields");
})().catch(error => { console.error(error); process.exitCode = 1; });
