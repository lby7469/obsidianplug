const assert = require("node:assert/strict");
const vm = require("node:vm"), fs = require("node:fs"), path = require("node:path");
const { transformSync } = require("esbuild");
const { harness, TFile } = require("./test-harness.cjs");
class Element {
  constructor() { this.children = []; this.isConnected = true; }
  createEl(tag, options = {}) { const child = Object.assign(new Element(), { tag }, options); this.children.push(child); return child; }
  createSpan(options) { return this.createEl("span", options); }
  createDiv(options) { return this.createEl("div", options); }
  empty() { this.children = []; }
  addEventListener(type, callback) { this[type] = callback; }
  toggleClass(key, value) { this[key] = value; }
  setAttribute(key, value) { this[key] = value; }
}
class Control { setButtonText() { return this; } setCta() { return this; } setValue() { return this; } onClick(callback) { this.click = callback; return this; } onChange(callback) { this.change = callback; return this; } }
class Setting { constructor() {} setName() { return this; } setDesc() { return this; } addButton(fn) { fn(new Control()); return this; } addToggle(fn) { fn(new Control()); return this; } }
const modals = [];
const obsidian = { Setting, setIcon() {}, Modal: class { constructor() { this.contentEl = new Element(); modals.push(this); } open() { this.onOpen(); } } };
const moduleFixture = { exports: {} };
const context = vm.createContext({ module: moduleFixture, exports: moduleFixture.exports, require: () => obsidian, document: { body: new Element() } });
const renewalSource = fs.readFileSync(path.join(__dirname, "renewal.ts"), "utf8");
vm.runInContext(transformSync(renewalSource, { loader: "ts", format: "cjs", target: "es2018" }).code, context);
const renewal = context.module.exports;
(async () => {
  const plugin = { settings: { token: "fixture", stateAccountId: "a", account: { id: "a", syncWritesAllowed: false, renewalNotice: { title: "已到期", message: "Fixture", level: "critical" } }, readAnnouncementIds: ["announcement"] }, refreshAccount: async () => {}, saveSettings: async () => {} };
  renewal.update(plugin); assert.equal(plugin.renewalButton.hidden, false); assert.equal(plugin.renewalButton["is-critical"], true);
  assert.equal(modals.length, 0, "No forced popups");
  const container = new Element(); renewal.renderTop(plugin, container); assert.equal(plugin.renewalTop.hidden, false);
  plugin.settings.renewalNoticeAnimation = false; renewal.update(plugin); assert.equal(plugin.renewalButton["is-animated"], false); assert.equal(plugin.renewalButton.hidden, false);
  plugin.settings.account = { id: "a", syncWritesAllowed: true, renewalNotice: null }; renewal.update(plugin);
  assert.equal(plugin.renewalButton.hidden, true); assert.equal(plugin.renewalTop.hidden, true, "Renewal clears settings reminder without reopening");
  assert.deepEqual(plugin.settings.readAnnouncementIds, ["announcement"], "Announcement read state untouched");
  plugin.settings.account = { id: "other", syncWritesAllowed: false }; assert.equal(renewal.currentNotice(plugin), null, "Never show another account's reminder");
  plugin.settings.account.id = "a"; plugin.settings.token = ""; assert.equal(renewal.currentNotice(plugin), null);
  const t = harness({ files: [new TFile("private.md", "Must not upload")] });
  t.setNetwork(async url => {
    if (url.endsWith("/v1/sync/manifest")) return new Response(JSON.stringify({ files: [], syncWritesAllowed: false }));
    if (url.endsWith("/v1/account")) return new Response(JSON.stringify({ id: "account-a", quotaBytes: 10, usedBytes: 20, syncWritesAllowed: false }));
    return new Response(JSON.stringify({ latestVersion: "0.4.4", releaseUrl: "https://github.com/lby7469/obsidianplug/releases", announcements: [] }));
  });
  await t.instance.sync(true);
  assert.equal(t.metrics.reads, 0); assert.ok(!t.metrics.routes.some(route => /uploads|DELETE/.test(route)));
  assert.equal(t.store.get("private.md").content.toString(), "Must not upload");
  assert.ok(t.notices.some(text => text.includes("同步已暂停")));
  console.log("PASS: independent renewal icon, no forced popup, animation preference, live clearing after renewal, account isolation, untouched announcements, expired sync performs no file reads/writes/deletes");
})().catch(error => { console.error(error); process.exitCode = 1; });
