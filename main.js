"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/community.ts
var require_community = __commonJS({
  "src/community.ts"(exports2, module2) {
    var { Modal, Setting, Notice, setIcon } = require("obsidian");
    function unread(plugin) {
      const read = new Set(plugin.settings.readAnnouncementIds || []);
      return (plugin.settings.announcementHistory || []).filter((item) => item.active !== false && !read.has(item.id));
    }
    function updateIcon(plugin) {
      if (typeof document === "undefined") return;
      const count = unread(plugin).length;
      if (!plugin.announcementButton) {
        const button2 = document.body.createEl("button", { cls: "notecloud-announcement-button" });
        button2.addEventListener("click", () => openAnnouncements(plugin));
        plugin.announcementButton = button2;
      }
      const button = plugin.announcementButton;
      button.hidden = !count;
      button.empty();
      setIcon(button, "bell");
      if (count) button.createSpan({ cls: "notecloud-announcement-count", text: String(count) });
      button.toggleClass("has-unread", count > 0 && plugin.settings.serviceNotices !== false);
      button.setAttribute("aria-label", `NoteCloud \u6709 ${count} \u6761\u672A\u8BFB\u516C\u544A\uFF0C\u70B9\u51FB\u67E5\u770B`);
      button.title = `NoteCloud\uFF1A${count} \u6761\u672A\u8BFB\u516C\u544A`;
    }
    function ingest(plugin, incoming) {
      const map = new Map((plugin.settings.announcementHistory || []).map((item) => [item.id, { ...item, active: false }]));
      for (const item of incoming || []) if ((item == null ? void 0 : item.id) && typeof item.title === "string" && typeof item.message === "string") map.set(item.id, { ...item, active: true });
      plugin.settings.announcementHistory = [...map.values()].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 10);
      const known = new Set(plugin.settings.announcementHistory.map((item) => item.id));
      plugin.settings.readAnnouncementIds = (plugin.settings.readAnnouncementIds || []).filter((id) => known.has(id));
      updateIcon(plugin);
    }
    function initialize(plugin) {
      var _a, _b, _c;
      (_b = plugin.settings).announcementHistory || (_b.announcementHistory = (((_a = plugin.settings.serviceStatus) == null ? void 0 : _a.announcements) || []).slice(0, 10));
      (_c = plugin.settings).readAnnouncementIds || (_c.readAnnouncementIds = []);
      updateIcon(plugin);
      plugin.registerInterval(window.setInterval(() => void plugin.checkServiceStatus(false), 5 * 60 * 1e3));
    }
    async function markRead(plugin, id) {
      plugin.settings.readAnnouncementIds = [.../* @__PURE__ */ new Set([...plugin.settings.readAnnouncementIds || [], id])].slice(-10);
      await plugin.saveSettings();
      updateIcon(plugin);
    }
    function renderItem(plugin, container, item, refresh) {
      const read = (plugin.settings.readAnnouncementIds || []).includes(item.id);
      const setting = new Setting(container).setName(`${read ? "" : "\u672A\u8BFB \xB7 "}${item.title}`).setDesc(`${item.message}
${item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}${item.active === false ? " \xB7 \u5386\u53F2\u516C\u544A" : ""}`);
      if (!read) setting.addButton((button) => button.setButtonText("\u6807\u8BB0\u5DF2\u8BFB").onClick(async () => {
        var _a;
        await markRead(plugin, item.id);
        refresh();
        (_a = plugin.settingsTab) == null ? void 0 : _a.display();
      }));
      if (item.linkUrl && /^https:\/\//i.test(item.linkUrl)) setting.addButton((button) => button.setButtonText("\u8BE6\u60C5").onClick(() => window.open(item.linkUrl, "_blank", "noopener,noreferrer")));
    }
    function openAnnouncements(plugin) {
      const modal = new Modal(plugin.app);
      const render = () => {
        modal.contentEl.empty();
        modal.contentEl.createEl("h2", { text: "NoteCloud \u516C\u544A" });
        const items = plugin.settings.announcementHistory || [];
        if (!items.length) modal.contentEl.createEl("p", { text: "\u6682\u65E0\u516C\u544A\u3002\u4F60\u53EF\u4EE5\u5728\u8BBE\u7F6E\u4E2D\u68C0\u67E5\u66F4\u65B0\u3002" });
        for (const item of items) renderItem(plugin, modal.contentEl, item, render);
        modal.contentEl.createEl("small", { text: "\u4FDD\u7559\u672C\u8BBE\u5907\u6536\u5230\u7684\u6700\u8FD1 10 \u6761\u516C\u544A\u3002\u9605\u8BFB\u540E\u8BF7\u70B9\u51FB\u6807\u8BB0\u5DF2\u8BFB\u3002" });
      };
      modal.onOpen = render;
      modal.open();
    }
    function renderTop(plugin, container) {
      const items = unread(plugin);
      if (!items.length) return;
      const box = container.createDiv({ cls: "notecloud-unread-announcements" });
      box.createEl("h3", { text: `\u672A\u8BFB\u516C\u544A\uFF08${items.length}\uFF09` });
      for (const item of items.slice(0, 3)) renderItem(plugin, box, item, () => {
      });
      if (items.length > 3) new Setting(box).setName("\u8FD8\u6709\u672A\u8BFB\u516C\u544A").addButton((button) => button.setButtonText("\u67E5\u770B\u5168\u90E8").onClick(() => openAnnouncements(plugin)));
    }
    function renderHistory(plugin, container) {
      new Setting(container).setName("\u516C\u544A\u680F").setDesc("\u67E5\u770B\u6700\u8FD1 10 \u6761\u5386\u53F2\u516C\u544A\uFF0C\u5DF2\u8BFB\u5185\u5BB9\u4FDD\u7559\u5728\u8FD9\u91CC\u3002").addButton((button) => button.setButtonText("\u6253\u5F00\u516C\u544A\u680F").onClick(() => openAnnouncements(plugin)));
    }
    function openFeedback(plugin) {
      const modal = new Modal(plugin.app);
      let title = "", message = "";
      modal.onOpen = () => {
        modal.contentEl.createEl("h2", { text: "\u610F\u89C1\u53CD\u9988" });
        modal.contentEl.createEl("p", { text: "\u53CD\u9988\u6B63\u6587\u4F1A\u63D0\u4F9B\u7ED9\u7BA1\u7406\u5458\uFF1B\u4E0D\u4F1A\u81EA\u52A8\u9644\u5E26\u7B14\u8BB0\u6216\u65E5\u5FD7\u3002\u8BF7\u52FF\u586B\u5199\u5BC6\u7801\u3001\u5151\u6362\u7801\u3001\u79C1\u5BC6\u94FE\u63A5\u6216\u4E0D\u613F\u62AB\u9732\u7684\u7B14\u8BB0\u3002" });
        new Setting(modal.contentEl).setName("\u6807\u9898").addText((input) => input.setPlaceholder("\u7B80\u8981\u63CF\u8FF0\u95EE\u9898\u6216\u5EFA\u8BAE").onChange((value) => title = value));
        new Setting(modal.contentEl).setName("\u5185\u5BB9").addTextArea((input) => {
          input.inputEl.rows = 6;
          input.inputEl.maxLength = 4e3;
          input.onChange((value) => message = value);
        });
        new Setting(modal.contentEl).addButton((button) => button.setButtonText("\u67E5\u770B\u56DE\u590D\u4E0E\u5956\u52B1").onClick(() => void plugin.openWebPortal("/feedback"))).addButton((button) => button.setButtonText("\u63D0\u4EA4\u53CD\u9988").setCta().onClick(async () => {
          if (title.trim().length < 2 || message.trim().length < 5) return void new Notice("\u8BF7\u586B\u5199\u81F3\u5C11 2 \u5B57\u6807\u9898\u548C 5 \u5B57\u53CD\u9988\u5185\u5BB9");
          if (!plugin.settings.token && !plugin.settings.refreshToken) return void new Notice("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u767B\u5F55");
          button.setDisabled(true);
          try {
            await plugin.authorizedRequest("/v1/feedback", { method: "POST", body: JSON.stringify({ title: title.trim(), message: message.trim(), source: "plugin" }) });
            new Notice("\u53CD\u9988\u5DF2\u63D0\u4EA4\u3002\u53EF\u4EE5\u5728\u7F51\u9875\u610F\u89C1\u53CD\u9988\u4E2D\u67E5\u770B\u56DE\u590D\u548C\u989D\u5EA6\u5956\u52B1\u3002");
            modal.close();
          } catch (error) {
            new Notice(error instanceof Error ? error.message : "\u63D0\u4EA4\u5931\u8D25");
          } finally {
            button.setDisabled(false);
          }
        }));
      };
      modal.open();
    }
    module2.exports = { initialize, ingest, unread, markRead, updateIcon, renderTop, renderHistory, openAnnouncements, openFeedback };
  }
});

// src/main.ts
var B = Object.defineProperty;
var q = Object.getOwnPropertyDescriptor;
var D = Object.getOwnPropertyNames;
var I = Object.prototype.hasOwnProperty;
var z = (c, t) => {
  for (var e in t) B(c, e, { get: t[e], enumerable: true });
};
var N = (c, t, e, s) => {
  if (t && typeof t == "object" || typeof t == "function") for (let i of D(t)) !I.call(c, i) && i !== e && B(c, i, { get: () => t[i], enumerable: !(s = q(t, i)) || s.enumerable });
  return c;
};
var M = (c) => N(B({}, "__esModule", { value: true }), c);
var H = {};
z(H, { default: () => x });
module.exports = M(H);
var h = require("obsidian");
var community = require_community();
function P(c, t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let r = 0; r < t.length; r++) {
    let u = t[r];
    e[u] ? e[u].push(r) : e[u] = [r];
  }
  let i = [{ buffer1index: -1, buffer2index: -1, chain: null }];
  for (let r = 0; r < c.length; r++) {
    let u = c[r], f = e[u] || [], a = 0, d = i[0];
    for (let n of f) {
      let l;
      for (l = a; l < i.length && !(i[l].buffer2index < n && (l === i.length - 1 || i[l + 1].buffer2index > n)); l++) ;
      if (l < i.length) {
        let o = { buffer1index: r, buffer2index: n, chain: i[l] };
        if (a === i.length ? i.push(d) : i[a] = d, a = l + 1, d = o, a === i.length) break;
      }
    }
    i[a] = d;
  }
  return i[i.length - 1];
}
function $(c, t) {
  let e = P(c, t), s = [], i = c.length, r = t.length;
  for (let u = e; u !== null; u = u.chain) {
    let f = i - u.buffer1index - 1, a = r - u.buffer2index - 1;
    i = u.buffer1index, r = u.buffer2index, (f || a) && s.push({ buffer1: [i + 1, f], buffer1Content: c.slice(i + 1, i + 1 + f), buffer2: [r + 1, a], buffer2Content: t.slice(r + 1, r + 1 + a) });
  }
  return s.reverse(), s;
}
function U(c, t, e) {
  let s = [];
  function i(a, d) {
    s.push({ ab: d, oStart: a.buffer1[0], oLength: a.buffer1[1], abStart: a.buffer2[0], abLength: a.buffer2[1] });
  }
  $(t, c).forEach((a) => i(a, "a")), $(t, e).forEach((a) => i(a, "b")), s.sort((a, d) => a.oStart - d.oStart);
  let r = [], u = 0;
  function f(a) {
    a > u && (r.push({ stable: true, buffer: "o", bufferStart: u, bufferLength: a - u, bufferContent: t.slice(u, a) }), u = a);
  }
  for (; s.length; ) {
    let a = s.shift(), d = a.oStart, n = a.oStart + a.oLength, l = [a];
    for (f(d); s.length; ) {
      let o = s[0], g = o.oStart;
      if (g > n) break;
      n = Math.max(n, g + o.oLength), l.push(s.shift());
    }
    if (l.length === 1) {
      if (a.abLength > 0) {
        let o = a.ab === "a" ? c : e;
        r.push({ stable: true, buffer: a.ab, bufferStart: a.abStart, bufferLength: a.abLength, bufferContent: o.slice(a.abStart, a.abStart + a.abLength) });
      }
    } else {
      let o = { a: [c.length, -1, t.length, -1], b: [e.length, -1, t.length, -1] };
      for (; l.length; ) {
        a = l.shift();
        let v = a.oStart, k = v + a.oLength, S = a.abStart, C = S + a.abLength, b = o[a.ab];
        b[0] = Math.min(S, b[0]), b[1] = Math.max(C, b[1]), b[2] = Math.min(v, b[2]), b[3] = Math.max(k, b[3]);
      }
      let g = o.a[0] + (d - o.a[2]), y = o.a[1] + (n - o.a[3]), m = o.b[0] + (d - o.b[2]), p = o.b[1] + (n - o.b[3]), w = { stable: false, aStart: g, aLength: y - g, aContent: c.slice(g, y), oStart: d, oLength: n - d, oContent: t.slice(d, n), bStart: m, bLength: p - m, bContent: e.slice(m, p) };
      r.push(w);
    }
    u = n;
  }
  return f(t.length), r;
}
function j(c, t, e, s) {
  s = Object.assign({ excludeFalseConflicts: true, stringSeparator: /\s+/ }, s), typeof c == "string" && (c = c.split(s.stringSeparator)), typeof t == "string" && (t = t.split(s.stringSeparator)), typeof e == "string" && (e = e.split(s.stringSeparator));
  let r = [], u = U(c, t, e), f = [];
  function a() {
    f.length && r.push({ ok: f }), f = [];
  }
  function d(n, l) {
    if (n.length !== l.length) return false;
    for (let o = 0; o < n.length; o++) if (n[o] !== l[o]) return false;
    return true;
  }
  return u.forEach((n) => {
    n.stable ? f.push(...n.bufferContent) : s.excludeFalseConflicts && d(n.aContent, n.bContent) ? f.push(...n.aContent) : (a(), r.push({ conflict: { a: n.aContent, aIndex: n.aStart, o: n.oContent, oIndex: n.oStart, b: n.bContent, bIndex: n.bStart } }));
  }), a(), r;
}
function L(c, t, e, s) {
  s = Object.assign({ excludeFalseConflicts: true, stringSeparator: /\s+/, label: {} }, s);
  let r = "<<<<<<<" + (s.label.a ? ` ${s.label.a}` : ""), u = "=======", f = ">>>>>>>" + (s.label.b ? ` ${s.label.b}` : ""), a = j(c, t, e, s), d = false, n = [];
  return a.forEach((l) => {
    l.ok ? n = n.concat(l.ok) : l.conflict && (d = true, n = n.concat([r], l.conflict.a, [u], l.conflict.b, [f]));
  }), { conflict: d, result: n };
}
var T = { serverUrl: "https://api.notecloud.asia", websiteUrl: "https://notecloud.asia", phone: "", password: "", quotaCode: "", token: "", refreshToken: "", tokenExpiresAt: 0, pendingAuth: void 0, state: {}, syncAllFolders: true, selectedFolders: [], autoSync: true, syncIntervalMinutes: 5, maxFileSizeMB: h.Platform.isMobile ? 50 : 200, conflictStrategy: "keep-both", serviceNotices: true, lastServiceCheckAt: 0, seenAnnouncementIds: [], notifiedUpdateVersion: "", serviceStatus: void 0 };
var O = /* @__PURE__ */ new Set(["md", "canvas", "pdf", "png", "jpg", "jpeg", "gif", "webp", "svg", "mp3", "m4a", "wav", "mp4", "webm", "mov", "docx", "xlsx", "pptx"]);
async function F(c) {
  let t = await crypto.subtle.digest("SHA-256", c);
  return [...new Uint8Array(t)].map((e) => e.toString(16).padStart(2, "0")).join("");
}
function Q(c) {
  return btoa(String.fromCharCode(...c)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function A(c) {
  let t = c.lastIndexOf("."), e = `.conflict-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}`;
  return t > 0 ? `${c.slice(0, t)}${e}${c.slice(t)}` : `${c}${e}`;
}
function R(c) {
  return c < 1024 ? `${c} B` : c < 1024 ** 2 ? `${(c / 1024).toFixed(1)} KB` : c < 1024 ** 3 ? `${(c / 1024 ** 2).toFixed(2)} MB` : `${(c / 1024 ** 3).toFixed(2)} GB`;
}
function K(c, t) {
  let e = String(c || "0").split(".").map((s) => Number.parseInt(s, 10) || 0), i = String(t || "0").split(".").map((s) => Number.parseInt(s, 10) || 0);
  for (let s = 0; s < Math.max(e.length, i.length); s++) if ((e[s] || 0) !== (i[s] || 0)) return (e[s] || 0) > (i[s] || 0) ? 1 : -1;
  return 0;
}
var x = class extends h.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings", { ...T });
    __publicField(this, "syncing", false);
    __publicField(this, "status");
    __publicField(this, "floatingButton");
  }
  async onload() {
    let t = await this.loadData();
    this.settings = { ...T, ...t || {}, state: (t == null ? void 0 : t.state) || {}, selectedFolders: (t == null ? void 0 : t.selectedFolders) || [], seenAnnouncementIds: (t == null ? void 0 : t.seenAnnouncementIds) || [] }, this.settings.password = "", await this.saveSettings(), this.authPolicy = { passwordHint: "\u5BC6\u7801\u81F3\u5C11 8 \u4F4D\uFF0C\u4E14\u5FC5\u987B\u540C\u65F6\u5305\u542B\u5B57\u6BCD\u548C\u6570\u5B57\u3002", emailCodeLength: 6, emailCodeExpiresMinutes: 10 }, await this.loadAuthPolicy(), this.syncedThisSession = false, this.pendingChanges = true, this.registerObsidianProtocolHandler("notecloud-auth", (parameters) => void this.completeWebAuth(parameters)), this.addSettingTab(new E(this.app, this)), h.Platform.isMobile && this.addRibbonIcon("refresh-cw", "\u7ACB\u5373\u540C\u6B65", () => void this.sync(true)), this.status = this.addStatusBarItem(), this.status.addClass("notecloud-status"), this.status.onclick = () => void this.sync(true), this.status.addEventListener("contextmenu", (s) => {
      s.preventDefault(), this.openSettings();
    }), this.setStatus("\u7B49\u5F85\u540C\u6B65", "idle"), this.addCommand({ id: "sync-now", name: "\u7ACB\u5373\u540C\u6B65", callback: () => void this.sync(true) }), this.addCommand({ id: "open-settings", name: "\u6253\u5F00\u540C\u6B65\u8BBE\u7F6E", callback: () => this.openSettings() }), this.addCommand({ id: "open-web-portal", name: "\u6253\u5F00 NoteCloud \u7F51\u9875\u7248", callback: () => void this.openWebPortal() }), this.addCommand({ id: "check-updates-notices", name: "\u68C0\u67E5\u66F4\u65B0\u4E0E\u516C\u544A", callback: () => void this.checkServiceStatus(true) }), this.registerEvent(this.app.vault.on("create", () => this.markPending())), this.registerEvent(this.app.vault.on("modify", () => this.markPending())), this.registerEvent(this.app.vault.on("delete", () => this.markPending())), this.registerEvent(this.app.vault.on("rename", () => this.markPending())), this.configureAutoSync(), this.settings.autoSync && window.setTimeout(() => void this.sync(false), 5e3), window.setTimeout(() => void this.checkServiceStatus(false), 8e3);
    community.initialize(this);
    this.addCommand({ id: "open-announcements", name: "\u67E5\u770B\u516C\u544A", callback: () => community.openAnnouncements(this) });
    this.addCommand({ id: "send-feedback", name: "\u610F\u89C1\u53CD\u9988", callback: () => community.openFeedback(this) });
  }
  onunload() {
    var _a, _b;
    (_a = this.announcementButton) == null ? void 0 : _a.remove();
    this.autoSyncTimer && window.clearInterval(this.autoSyncTimer), (_b = this.floatingButton) == null ? void 0 : _b.remove();
  }
  configureAutoSync() {
    this.autoSyncTimer && window.clearInterval(this.autoSyncTimer), this.autoSyncTimer = void 0, this.settings.autoSync && (this.autoSyncTimer = window.setInterval(() => void this.sync(false), Math.max(1, Math.min(60, this.settings.syncIntervalMinutes || 5)) * 6e4));
  }
  markPending() {
    this.pendingChanges = true, this.updateSyncButton();
  }
  updateSyncButton() {
    if (!this.syncActionButton) return;
    let t = this.syncedThisSession && !this.pendingChanges;
    this.syncActionButton.setButtonText(this.syncing ? "\u540C\u6B65\u4E2D\u2026" : "\u7ACB\u5373\u540C\u6B65").setDisabled(this.syncing), this.syncActionButton.buttonEl.style.backgroundColor = this.syncing ? "" : t ? "#16815a" : "#be3e4e", this.syncActionButton.buttonEl.style.color = "#fff";
  }
  openHotkeys() {
    let t = this.app;
    t.setting.open(), t.setting.openTabById("hotkeys");
  }
  async switchAccount() {
    await this.beginWebAuth("switch");
  }
  async loadAuthPolicy() {
    try {
      this.authPolicy = await this.request("/v1/auth/policy");
    } catch (e) {
    }
  }
  async checkServiceStatus(t = false) {
    var _a;
    if (!t && Date.now() - Math.max(this.settings.lastServiceCheckAt || 0, this.lastServiceAttemptAt || 0) < 5 * 60 * 1e3) return this.settings.serviceStatus;
    this.lastServiceAttemptAt = Date.now();
    try {
      let e = await this.request(`/v1/plugin/status?version=${encodeURIComponent(this.manifest.version)}&platform=${h.Platform.isMobile ? "mobile" : "desktop"}`), s = K(this.manifest.version, e.latestVersion) < 0, i = new Set(this.settings.seenAnnouncementIds || []);
      this.settings.serviceStatus = e, this.settings.lastServiceCheckAt = Date.now();
      if (s && this.settings.serviceNotices !== false && this.settings.notifiedUpdateVersion !== e.latestVersion) this.settings.notifiedUpdateVersion = e.latestVersion, new h.Notice(`NoteCloud ${e.latestVersion} \u5DF2\u53D1\u5E03\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u6253\u5F00\u53D1\u5E03\u9875\uFF0CBRAT \u4E5F\u53EF\u68C0\u67E5\u66F4\u65B0\u3002`, 12e3);
      community.ingest(this, e.announcements);
      await this.saveSettings();
      if (t) (_a = this.settingsTab) == null ? void 0 : _a.display();
      if (t) new h.Notice(s ? `\u53D1\u73B0\u65B0\u7248\u672C ${e.latestVersion}` : "NoteCloud \u5DF2\u662F\u6700\u65B0\u7248\u672C");
      return e;
    } catch (e) {
      if (t) new h.Notice(`NoteCloud \u68C0\u67E5\u5931\u8D25\uFF1A${e instanceof Error ? e.message : "\u8BF7\u7A0D\u540E\u91CD\u8BD5"}`);
      return this.settings.serviceStatus;
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  openSettings() {
    let t = this.app;
    t.setting.open(), t.setting.openTabById(this.manifest.id);
  }
  createFloatingButton() {
    let t = document.body.createDiv({ cls: "notecloud-floating-sync" });
    t.setAttribute("role", "button"), t.tabIndex = 0;
    let e = 0, s = false, i = () => {
      e && window.clearTimeout(e), e = 0;
    };
    t.addEventListener("pointerdown", () => {
      s = false, i(), e = window.setTimeout(() => {
        s = true, this.openSettings();
      }, 650);
    }), t.addEventListener("pointerup", i), t.addEventListener("pointercancel", i), t.addEventListener("click", () => {
      if (s) {
        s = false;
        return;
      }
      this.sync(true);
    }), t.addEventListener("contextmenu", (r) => {
      r.preventDefault(), i(), this.openSettings();
    }), t.addEventListener("keydown", (r) => {
      (r.key === "Enter" || r.key === " ") && this.sync(true);
    }), this.floatingButton = t;
  }
  setStatus(t, e) {
    e === "success" && (this.syncedThisSession = true, this.pendingChanges = false), e === "error" && (this.pendingChanges = true), this.updateSyncButton();
    if (this.status) {
      this.status.empty();
      let s = this.status.createSpan({ cls: "notecloud-status-icon" });
      (0, h.setIcon)(s, e === "syncing" ? "refresh-cw" : e === "error" ? "cloud-off" : "cloud"), this.status.createSpan({ text: `NoteCloud: ${t}` }), this.status.toggleClass("is-error", e === "error"), this.status.toggleClass("is-syncing", e === "syncing"), this.status.title = "\u70B9\u51FB\u7ACB\u5373\u540C\u6B65\uFF0C\u53F3\u952E\u6253\u5F00\u8BBE\u7F6E";
    }
    this.floatingButton && (this.floatingButton.empty(), (0, h.setIcon)(this.floatingButton, e === "syncing" ? "refresh-cw" : e === "error" ? "cloud-off" : "cloud"), this.floatingButton.toggleClass("is-error", e === "error"), this.floatingButton.toggleClass("is-syncing", e === "syncing"), this.floatingButton.toggleClass("is-success", e === "success"), this.floatingButton.title = `NoteCloud: ${t}\u3002\u70B9\u51FB\u540C\u6B65\uFF0C\u53F3\u952E\u6216\u957F\u6309\u6253\u5F00\u8BBE\u7F6E`, this.floatingButton.setAttribute("aria-label", this.floatingButton.title));
  }
  async request(t, e = {}) {
    let s = new Headers(e.headers);
    e.body !== void 0 && s.set("Content-Type", "application/json"), this.settings.token && s.set("Authorization", `Bearer ${this.settings.token}`);
    let i = await fetch(`${this.settings.serverUrl.replace(/\/$/, "")}${t}`, { ...e, headers: s }), r = await i.json().catch(() => ({}));
    if (!i.ok) throw new Error(r.error || `\u670D\u52A1\u5668\u9519\u8BEF ${i.status}`);
    return r;
  }
  async authorizedRequest(t, e = {}) {
    try {
      return await this.request(t, e);
    } catch (s) {
      if (!(s instanceof Error) || !/Unauthorized/.test(s.message)) throw s;
      return this.settings.token = "", this.settings.refreshToken ? await this.refreshPluginToken() : await this.login(), this.request(t, e);
    }
  }
  async binaryRequest(t, e = "GET", s) {
    var _a;
    let i = {};
    this.settings.token && (i.Authorization = `Bearer ${this.settings.token}`);
    let r = await (0, h.requestUrl)({ url: `${this.settings.serverUrl.replace(/\/$/, "")}${t}`, method: e, body: s, contentType: s ? "application/octet-stream" : void 0, headers: i, throw: false });
    if (r.status < 200 || r.status >= 300) {
      let u = ((_a = r.json) == null ? void 0 : _a.error) || `\u670D\u52A1\u5668\u9519\u8BEF ${r.status}`;
      throw new Error(u);
    }
    return r;
  }
  async authorizedBinaryRequest(t, e = "GET", s) {
    try {
      return await this.binaryRequest(t, e, s);
    } catch (i) {
      if (!(i instanceof Error) || !/Unauthorized/.test(i.message)) throw i;
      return this.settings.token = "", this.settings.refreshToken ? await this.refreshPluginToken() : await this.login(), this.binaryRequest(t, e, s);
    }
  }
  openRegistration() {
    return this.beginWebAuth("register");
  }
  openPasswordReset() {
    return this.beginWebAuth("forgot");
  }
  async beginWebAuth(action = "login") {
    if (this.syncing) return void new h.Notice("\u8BF7\u7B49\u5F53\u524D\u540C\u6B65\u5B8C\u6210\u540E\u518D\u64CD\u4F5C\u8D26\u53F7");
    const verifier = Q(crypto.getRandomValues(new Uint8Array(48))), state = Q(crypto.getRandomValues(new Uint8Array(24))), challenge = Q(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
    this.settings.pendingAuth = { verifier, state, createdAt: Date.now() }, await this.saveSettings();
    const deviceName = `${h.Platform.isMobile ? "Obsidian Mobile" : "Obsidian Desktop"} \xB7 ${this.app.vault.getName()}`;
    const url = `${this.settings.websiteUrl.replace(/\/$/, "")}/auth/plugin?state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(challenge)}&device_name=${encodeURIComponent(deviceName)}&action=${encodeURIComponent(action)}`;
    window.open(url, "_blank", "noopener,noreferrer"), new h.Notice("\u5DF2\u6253\u5F00 NoteCloud \u7F51\u7AD9\uFF0C\u8BF7\u5728\u7F51\u9875\u4E2D\u5B8C\u6210\u8D26\u53F7\u64CD\u4F5C");
  }
  async completeWebAuth(parameters) {
    var _a, _b;
    if (this.syncing || this.authCompleting) return void new h.Notice("\u5F53\u524D\u6B63\u5728\u540C\u6B65\u6216\u767B\u5F55\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
    const pending = this.settings.pendingAuth;
    if (!pending || !parameters.code || parameters.state !== pending.state || Date.now() - pending.createdAt > 10 * 60 * 1e3) return void new h.Notice("NoteCloud \u767B\u5F55\u8BF7\u6C42\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u767B\u5F55\u9875");
    try {
      this.authCompleting = true;
      const result = await this.request("/v1/auth/plugin-exchange", { method: "POST", body: JSON.stringify({ code: parameters.code, state: parameters.state, codeVerifier: pending.verifier }) });
      const oldId = this.settings.stateAccountId || ((_a = this.settings.account) == null ? void 0 : _a.id);
      const changed = oldId ? oldId !== result.id : this.settings.phone ? this.settings.phone !== result.phone : Object.keys(this.settings.state).length > 0;
      if (changed) {
        this.settings.state = {};
        this.settings.autoSync = false;
        this.settings.accountSwitchPending = true;
        this.settings.lastSyncAt = "";
        this.configureAutoSync();
      }
      this.settings.stateAccountId = result.id;
      this.settings.token = result.token, this.settings.refreshToken = result.refreshToken, this.settings.tokenExpiresAt = Date.now() + result.expiresIn * 1e3, this.settings.phone = result.phone || "", this.settings.password = "", this.settings.account = result, this.settings.pendingAuth = void 0, await this.saveSettings(), (_b = this.settingsTab) == null ? void 0 : _b.display(), this.setStatus("\u5DF2\u767B\u5F55\uFF0C\u7B49\u5F85\u540C\u6B65", "idle"), new h.Notice(`NoteCloud\uFF1A\u5DF2\u8FDE\u63A5 ${result.displayName || "\u8D26\u53F7"}`);
    } catch (error) {
      new h.Notice(`NoteCloud \u767B\u5F55\u5931\u8D25\uFF1A${error instanceof Error ? error.message : "\u8BF7\u91CD\u8BD5"}`);
    } finally {
      this.authCompleting = false;
    }
  }
  async refreshPluginToken() {
    if (!this.settings.refreshToken) throw new Error("\u8BF7\u4ECE NoteCloud \u7F51\u7AD9\u91CD\u65B0\u767B\u5F55");
    const result = await this.request("/v1/auth/plugin-refresh", { method: "POST", body: JSON.stringify({ refreshToken: this.settings.refreshToken }) });
    this.settings.token = result.token, this.settings.refreshToken = result.refreshToken, this.settings.tokenExpiresAt = Date.now() + result.expiresIn * 1e3, this.settings.account = result, await this.saveSettings();
  }
  async redeemQuotaCode() {
    var _a;
    let t = (_a = this.settings.quotaCode) == null ? void 0 : _a.trim();
    if (!t) throw new Error("\u8BF7\u5148\u586B\u5199\u989D\u5EA6\u5151\u6362\u7801");
    let e = await this.request("/v1/account/quota-code", { method: "POST", body: JSON.stringify({ code: t }) });
    this.settings.quotaCode = "", this.settings.account = { ...this.settings.account, ...e }, await this.saveSettings(), new h.Notice(e.customerStage === "early" ? "\u5151\u6362\u6210\u529F\uFF0C\u5DF2\u6807\u8BB0\u4E3A\u65E9\u671F\u7528\u6237\u5E76\u589E\u52A0\u4E91\u7AEF\u989D\u5EA6" : "\u5151\u6362\u6210\u529F\uFF0C\u4E91\u7AEF\u989D\u5EA6\u5DF2\u66F4\u65B0");
  }
  async login() {
    if (this.settings.refreshToken) return this.refreshPluginToken();
    await this.beginWebAuth("login");
    throw new Error("\u8BF7\u5728\u5DF2\u6253\u5F00\u7684 NoteCloud \u7F51\u9875\u4E2D\u5B8C\u6210\u767B\u5F55");
  }
  async logout() {
    var _a, _b;
    if (this.syncing) return void new h.Notice("\u8BF7\u7B49\u5F53\u524D\u540C\u6B65\u5B8C\u6210\u540E\u518D\u9000\u51FA\u8D26\u53F7");
    (_b = this.settings).stateAccountId || (_b.stateAccountId = (_a = this.settings.account) == null ? void 0 : _a.id);
    this.settings.pendingAuth = void 0;
    this.settings.token = "", this.settings.refreshToken = "", this.settings.tokenExpiresAt = 0, this.settings.password = "", this.settings.account = void 0, await this.saveSettings(), this.setStatus("\u5DF2\u9000\u51FA\u767B\u5F55", "idle"), new h.Notice("NoteCloud \u5DF2\u9000\u51FA\u767B\u5F55");
  }
  async checkConnection() {
    this.setStatus("\u6B63\u5728\u68C0\u67E5\u8FDE\u63A5\u2026", "syncing");
    try {
      let t = await fetch(`${this.settings.serverUrl.replace(/\/$/, "")}/health`);
      if (!t.ok) throw new Error(`\u670D\u52A1\u5668\u9519\u8BEF ${t.status}`);
      return this.settings.token || await this.login(), this.settings.account = await this.authorizedRequest("/v1/account"), await this.saveSettings(), this.setStatus("\u4E91\u7AEF\u8FDE\u63A5\u6B63\u5E38", "success"), new h.Notice("NoteCloud \u4E91\u7AEF\u8FDE\u63A5\u6B63\u5E38"), true;
    } catch (t) {
      let e = t instanceof Error ? t.message : "\u8FDE\u63A5\u5931\u8D25";
      return this.setStatus(e, "error"), new h.Notice(`NoteCloud \u8FDE\u63A5\u5931\u8D25\uFF1A${e}`), false;
    }
  }
  async openWebPortal(destination) {
    try {
      this.settings.token || await this.login();
      let t = await this.authorizedRequest("/v1/auth/web-ticket", { method: "POST", body: "{}" });
      const url = new URL(t.url);
      if (destination === "/feedback") url.pathname = destination;
      window.open(url.href, "_blank", "noopener,noreferrer");
    } catch (t) {
      let e = t instanceof Error ? t.message : "\u65E0\u6CD5\u6253\u5F00\u7F51\u9875\u7248";
      this.setStatus(e, "error"), new h.Notice(`NoteCloud\uFF1A${e}`);
    }
  }
  fileInScope(t) {
    return this.settings.syncAllFolders ? true : this.settings.selectedFolders.some((e) => e === "/" ? !t.includes("/") : t.startsWith(`${e}/`));
  }
  files() {
    return this.app.vault.getFiles().filter((t) => O.has(t.extension.toLowerCase()) && !t.path.startsWith(".obsidian/") && this.fileInScope(t.path));
  }
  isMarkdown(t) {
    return t.toLowerCase().endsWith(".md");
  }
  text(t) {
    return new TextDecoder().decode(t);
  }
  markdownBase(t, e) {
    return this.isMarkdown(t) ? this.text(e) : void 0;
  }
  async ensureParentFolders(t) {
    let e = t.split("/").slice(0, -1), s = "";
    for (let i of e) if (s = s ? `${s}/${i}` : i, !this.app.vault.getAbstractFileByPath(s)) try {
      await this.app.vault.createFolder(s);
    } catch (e2) {
    }
  }
  async remoteBytes(t) {
    const bytes = (await this.authorizedBinaryRequest(`/v1/sync/file/raw?path=${encodeURIComponent(t.path)}`)).arrayBuffer;
    if (await F(bytes) !== t.revision) throw new Error("\u4E91\u7AEF\u6587\u4EF6\u5728\u8BFB\u53D6\u65F6\u53D1\u751F\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u540C\u6B65");
    return bytes;
  }
  async download(t, expectedLocalHash) {
    const before = this.app.vault.getAbstractFileByPath(t.path);
    if (expectedLocalHash === void 0) expectedLocalHash = before instanceof h.TFile ? await F(await this.app.vault.readBinary(before)) : null;
    let e = await this.remoteBytes(t), s = this.app.vault.getAbstractFileByPath(t.path);
    const currentHash = s instanceof h.TFile ? await F(await this.app.vault.readBinary(s)) : null;
    if (currentHash !== expectedLocalHash) throw new Error("\u4E0B\u8F7D\u671F\u95F4\u672C\u5730\u7B14\u8BB0\u5DF2\u4FEE\u6539\uFF0C\u5DF2\u4FDD\u7559\u672C\u5730\u5185\u5BB9\uFF0C\u8BF7\u91CD\u65B0\u540C\u6B65");
    s instanceof h.TFile ? await this.app.vault.modifyBinary(s, e) : (await this.ensureParentFolders(t.path), await this.app.vault.createBinary(t.path, e)), this.settings.state[t.path] = { hash: await F(e), remoteRevision: t.revision, baseContent: this.markdownBase(t.path, e) };
  }
  async resolveConflict(t, e, s, i) {
    if (this.settings.conflictStrategy === "local") return await this.upload(t, i, s, e.revision), "local";
    if (this.settings.conflictStrategy === "cloud") return await this.download(e, i), "cloud";
    let r = A(t.path);
    await this.ensureParentFolders(r), await this.app.vault.createBinary(r, s), await this.download(e, i);
    return "keep-both";
  }
  linkMetadata(file) {
    if (!this.isMarkdown(file.path)) return [];
    const cache = this.app.metadataCache.getFileCache(file), result = [];
    for (const [items, kind] of [[(cache == null ? void 0 : cache.links) || [], "link"], [(cache == null ? void 0 : cache.embeds) || [], "embed"]]) for (const item of items) {
      const value = item.link || "", fragmentIndex = value.search(/[#^]/), rawTarget = (fragmentIndex >= 0 ? value.slice(0, fragmentIndex) : value).trim(), fragment = fragmentIndex >= 0 ? value.slice(fragmentIndex) : void 0, destination = rawTarget ? this.app.metadataCache.getFirstLinkpathDest(rawTarget, file.path) : void 0;
      rawTarget && result.push({ rawTarget, targetPath: destination == null ? void 0 : destination.path, kind, fragment, alias: item.displayText || void 0 });
    }
    return result;
  }
  async upload(t, e, s, expectedRevision) {
    s || (s = await this.app.vault.readBinary(t));
    let i, r;
    try {
      let u = await this.authorizedRequest("/v1/sync/uploads", { method: "POST", body: JSON.stringify({ path: t.path, size: s.byteLength, expectedRevision, modifiedAt: new Date(t.stat.mtime).toISOString(), links: this.linkMetadata(t) }) });
      i = u.uploadId, r = u.record;
      if (!u.complete) for (let f = 0, a = 0; f < s.byteLength; f += u.chunkSize, a++) {
        let d = s.slice(f, Math.min(s.byteLength, f + u.chunkSize)), n;
        for (let l = 0; l < 3; l++) try {
          n = (await this.authorizedBinaryRequest(`/v1/sync/uploads/${encodeURIComponent(i)}/chunk?index=${a}`, "PUT", d)).json;
          break;
        } catch (o) {
          if (l === 2) throw o;
          await new Promise((g) => window.setTimeout(g, 500 * (l + 1)));
        }
        (n == null ? void 0 : n.complete) && (r = n.record), a % 5 === 0 && this.setStatus(`\u6B63\u5728\u4E0A\u4F20 ${t.name}\uFF1A${Math.min(100, Math.round((f + d.byteLength) / s.byteLength * 100))}%`, "syncing");
      }
      if (!r) throw new Error("\u670D\u52A1\u5668\u672A\u5B8C\u6210\u6587\u4EF6\u4E0A\u4F20");
      this.settings.state[t.path] = { hash: e, remoteRevision: r.revision, baseContent: this.markdownBase(t.path, s) };
    } catch (u) {
      i && await this.authorizedRequest(`/v1/sync/uploads/${encodeURIComponent(i)}`, { method: "DELETE" }).catch(() => void 0);
      throw u;
    }
  }
  confirmAccountSync() {
    return new Promise((resolve) => {
      const modal = new h.Modal(this.app);
      let confirmed = false;
      modal.onOpen = () => {
        modal.contentEl.createEl("h2", { text: "\u786E\u8BA4\u65B0\u8D26\u53F7\u7684\u540C\u6B65\u8303\u56F4" });
        modal.contentEl.createEl("p", { text: "\u4F60\u5DF2\u5207\u6362\u8D26\u53F7\u3002\u7EE7\u7EED\u4F1A\u628A\u5F53\u524D\u4ED3\u5E93\u4E2D\u9009\u5B9A\u7684\u6587\u4EF6\u4E0E\u65B0\u8D26\u53F7\u540C\u6B65\uFF1B\u5982\u4E0D\u5E0C\u671B\u4E0A\u4F20\u8FD9\u4E9B\u7B14\u8BB0\uFF0C\u8BF7\u5148\u53D6\u6D88\u5E76\u4FEE\u6539\u540C\u6B65\u6587\u4EF6\u5939\u3002\u81EA\u52A8\u540C\u6B65\u5DF2\u6682\u505C\uFF0C\u53EF\u5728\u8BBE\u7F6E\u4E2D\u91CD\u65B0\u5F00\u542F\u3002" });
        new h.Setting(modal.contentEl).addButton((button) => button.setButtonText("\u53D6\u6D88").onClick(() => modal.close())).addButton((button) => button.setButtonText("\u786E\u8BA4\u540C\u6B65").setCta().onClick(() => {
          confirmed = true;
          modal.close();
        }));
      };
      modal.onClose = () => resolve(confirmed);
      modal.open();
    });
  }
  async sync(t) {
    var _a;
    if (this.authCompleting || this.settings.pendingAuth && Date.now() - this.settings.pendingAuth.createdAt < 10 * 60 * 1e3) {
      if (t) new h.Notice("\u8BF7\u5148\u5B8C\u6210\u7F51\u9875\u4E0A\u7684\u8D26\u53F7\u64CD\u4F5C\uFF1B\u767B\u5F55\u8BF7\u6C42 10 \u5206\u949F\u540E\u81EA\u52A8\u5931\u6548");
      return;
    }
    if (this.settings.accountSwitchPending) {
      if (!t || this.confirmingAccountSync) return;
      this.confirmingAccountSync = true;
      try {
        if (!await this.confirmAccountSync()) return;
        this.settings.accountSwitchPending = false;
        await this.saveSettings();
      } finally {
        this.confirmingAccountSync = false;
      }
    }
    if (this.syncing) {
      t && new h.Notice("NoteCloud \u5DF2\u5728\u540C\u6B65\u4E2D\uFF0C\u8BF7\u7A0D\u5019");
      return;
    }
    if (!this.settings.token && !this.settings.refreshToken) {
      this.setStatus("\u8BF7\u767B\u5F55", "error"), t && (await this.beginWebAuth("login"), new h.Notice("\u8BF7\u5728 NoteCloud \u7F51\u7AD9\u5B8C\u6210\u767B\u5F55\u540E\u8FD4\u56DE Obsidian"));
      return;
    }
    this.syncing = true, this.setStatus("\u6B63\u5728\u540C\u6B65\u2026", "syncing");
    try {
      this.settings.token || await this.login(), await this.checkServiceStatus(false);
      let s = (await this.authorizedRequest("/v1/sync/manifest")).files.filter((o) => this.fileInScope(o.path)), i = new Map(s.map((o) => [o.path, o])), r = this.files(), u = new Set(r.map((o) => o.path)), f = Math.min(this.settings.maxFileSizeMB * 1024 * 1024, ((_a = this.settings.serviceStatus) == null ? void 0 : _a.maxUploadBytes) || Number.POSITIVE_INFINITY), a = r.filter((o) => o.stat.size <= f), d = r.length - a.length, n = 0, c = 0;
      for (let o of a) {
        let g = await this.app.vault.readBinary(o), y = await F(g), m = this.settings.state[o.path], p = i.get(o.path), w = !m || m.hash !== y, v = !!p && (!m || m.remoteRevision !== p.revision);
        if (p && !m) {
          y === p.revision ? this.settings.state[o.path] = { hash: y, remoteRevision: p.revision, baseContent: this.markdownBase(o.path, g) } : (await this.resolveConflict(o, p, g, y), n++, c++);
          continue;
        }
        if (p && m && w && v) {
          if (this.isMarkdown(o.path) && m.baseContent !== void 0) {
            let k = await this.remoteBytes(p), S = L(this.text(g).split(/(?<=\n)/), m.baseContent.split(/(?<=\n)/), this.text(k).split(/(?<=\n)/), { excludeFalseConflicts: true });
            if (!S.conflict) {
              let C = new TextEncoder().encode(S.result.join("")).buffer;
              if (await F(await this.app.vault.readBinary(o)) !== y) throw new Error("\u5408\u5E76\u671F\u95F4\u7B14\u8BB0\u5DF2\u4FEE\u6539\uFF0C\u8BF7\u91CD\u65B0\u540C\u6B65");
              await this.app.vault.modifyBinary(o, C), await this.upload(o, await F(C), C, p.revision), n++;
              continue;
            }
          }
          await this.resolveConflict(o, p, g, y), n++, c++;
          continue;
        }
        if (p && v && !w) {
          await this.download(p, y), n++;
          continue;
        }
        (w || !p) && (await this.upload(o, y, g, (p == null ? void 0 : p.revision) || null), n++);
      }
      for (let o of i.values()) if (!u.has(o.path)) {
        let g = this.settings.state[o.path];
        g && g.remoteRevision === o.revision ? (await this.authorizedRequest(`/v1/sync/file?path=${encodeURIComponent(o.path)}&expectedRevision=${encodeURIComponent(o.revision)}`, { method: "DELETE" }), delete this.settings.state[o.path], n++) : o.size > f ? d++ : (await this.download(o, null), n++);
      }
      this.settings.account = await this.authorizedRequest("/v1/account"), this.settings.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString(), await this.saveSettings();
      let l = `\u5DF2\u540C\u6B65${n ? ` ${n} \u9879` : ""}${c ? `\uFF0C\u5904\u7406 ${c} \u4E2A\u51B2\u7A81` : ""}${d ? `\uFF0C\u8DF3\u8FC7 ${d} \u9879` : ""}`;
      this.setStatus(l, "success"), t && new h.Notice(`NoteCloud ${l}`);
    } catch (e) {
      e instanceof Error && /Unauthorized/.test(e.message) && (this.settings.token = "", this.settings.account = void 0, await this.saveSettings());
      let s = e instanceof Error ? e.message : "\u540C\u6B65\u5931\u8D25";
      this.setStatus(s, "error"), t && new h.Notice(`NoteCloud \u540C\u6B65\u5931\u8D25\uFF1A${s}`);
    } finally {
      this.syncing = false;
    }
  }
};
var E = class extends h.PluginSettingTab {
  constructor(e, s) {
    super(e, s);
    this.plugin = s, s.settingsTab = this;
  }
  async persist() {
    await this.plugin.saveSettings();
  }
  display() {
    var _a;
    let { containerEl: e } = this;
    e.empty(), e.addClass("notecloud-modern-settings");
    community.renderTop(this.plugin, e);
    let s = this.plugin.settings, i = s.account, used = (i == null ? void 0 : i.usedBytes) || 0, total = (i == null ? void 0 : i.quotaBytes) || 0, percent = total ? Math.min(100, used / total * 100) : 0;
    let quota = new h.Setting(e).setClass("notecloud-quota-top").setName("\u4E91\u7AEF\u7A7A\u95F4").setDesc(i ? `${R(used)} / ${R(total)}` : "\u767B\u5F55\u540E\u663E\u793A").addButton((b) => {
      this.plugin.syncActionButton = b, b.onClick(() => void this.plugin.sync(true)), this.plugin.updateSyncButton();
    });
    let track = quota.descEl.createDiv({ cls: "notecloud-quota-track" });
    track.createDiv({ cls: "notecloud-quota-fill", attr: { style: `width:${percent}%` } });
    e.createEl("h3", { text: "\u8D26\u6237" });
    let accountActions = new h.Setting(e).setName(i ? `${i.displayName || i.phone || "\u5DF2\u767B\u5F55"}${i.customerStage === "early" ? " \xB7 \u65E9\u671F\u7528\u6237" : ""}` : "\u5C1A\u672A\u767B\u5F55").setDesc("\u767B\u5F55\u3001\u6CE8\u518C\u3001\u5207\u6362\u8D26\u53F7\u548C\u5FD8\u8BB0\u5BC6\u7801\u5747\u5728 NoteCloud \u7F51\u7AD9\u5B89\u5168\u5B8C\u6210\uFF0C\u63D2\u4EF6\u4E0D\u4FDD\u5B58\u5BC6\u7801");
    accountActions.addButton((b) => b.setButtonText(i ? "\u5207\u6362\u8D26\u53F7" : "\u767B\u5F55").setCta().onClick(() => void this.plugin.beginWebAuth(i ? "switch" : "login"))), accountActions.addButton((b) => b.setButtonText("\u6CE8\u518C").onClick(() => void this.plugin.beginWebAuth("register"))), accountActions.addButton((b) => b.setButtonText("\u5FD8\u8BB0\u5BC6\u7801").onClick(() => this.plugin.openPasswordReset()));
    new h.Setting(e).setName("NoteCloud \u7F51\u9875\u7248").setDesc("\u6D4F\u89C8\u4E91\u4ED3\u5E93\u3001\u5206\u4EAB\u7B14\u8BB0\u548C\u7BA1\u7406\u4E2A\u4EBA\u8D44\u6599").addButton((b) => b.setButtonText("\u6253\u5F00\u7F51\u7AD9").onClick(() => void this.plugin.openWebPortal()));
    if (i) new h.Setting(e).setName("\u9000\u51FA\u5F53\u524D\u8D26\u53F7").addButton((b) => b.setButtonText("\u9000\u51FA\u767B\u5F55").onClick(async () => {
      await this.plugin.logout(), this.display();
    }));
    e.createEl("h3", { text: "\u989D\u5EA6" });
    let q2 = new h.Setting(e).setName("\u989D\u5EA6\u5151\u6362\u7801");
    q2.addButton((b) => b.setButtonText("\u8F93\u5165\u5151\u6362\u7801").onClick(() => {
      this.redeemExpanded = true, this.display();
    })), q2.addButton((b) => b.setButtonText("\u8D2D\u4E70\u989D\u5EA6").setCta().onClick(() => window.open(`${s.serverUrl.replace(/\/$/, "")}/?purchase=1`, "_blank", "noopener,noreferrer")));
    if (this.redeemExpanded) {
      let code = s.quotaCode || "";
      new h.Setting(e).setClass("notecloud-uniform-input").setName("\u8F93\u5165\u5151\u6362\u7801").addText((b) => b.setPlaceholder("\u8BF7\u8F93\u5165\u5151\u6362\u7801").setValue(code).onChange((v) => code = v)).addButton((b) => b.setButtonText("\u5151\u6362").setCta().onClick(async () => {
        s.quotaCode = code.trim();
        try {
          await this.plugin.redeemQuotaCode(), this.redeemExpanded = false, this.display();
        } catch (v) {
          new h.Notice(v instanceof Error ? v.message : "\u5151\u6362\u5931\u8D25");
        }
      })).addButton((b) => b.setButtonText("\u53D6\u6D88").onClick(() => {
        this.redeemExpanded = false, this.display();
      }));
    }
    e.createEl("h3", { text: "\u540C\u6B65" });
    new h.Setting(e).setName("\u81EA\u52A8\u540C\u6B65").addToggle((b) => b.setValue(s.autoSync !== false).onChange(async (v) => {
      s.autoSync = v, await this.persist(), this.plugin.configureAutoSync(), this.display();
    }));
    if (s.autoSync !== false) {
      let input;
      new h.Setting(e).setClass("notecloud-interval-input").setName("\u81EA\u52A8\u540C\u6B65\u95F4\u9694").addText((b) => {
        input = b.inputEl, input.type = "number", input.min = "1", input.max = "60", input.step = "1", b.setValue(String(s.syncIntervalMinutes || 5)).onChange(async (v) => {
          let n = Number.parseInt(v, 10);
          Number.isFinite(n) && n >= 1 && n <= 60 && (s.syncIntervalMinutes = n, await this.persist(), this.plugin.configureAutoSync());
        }), input.addEventListener("blur", async () => {
          let n = Math.max(1, Math.min(60, Number.parseInt(input.value, 10) || 5));
          input.value = String(n), s.syncIntervalMinutes = n, await this.persist(), this.plugin.configureAutoSync();
        });
      });
    }
    new h.Setting(e).setName("\u5FEB\u6377\u952E\u540C\u6B65").addButton((b) => b.setButtonText("\u8BBE\u7F6E\u5FEB\u6377\u952E").onClick(() => this.plugin.openHotkeys()));
    e.createEl("h3", { text: "\u540C\u6B65\u8303\u56F4" });
    let controls = [];
    new h.Setting(e).setName("\u540C\u6B65\u6240\u6709\u6587\u4EF6\u5939").addToggle((b) => b.setValue(s.syncAllFolders).onChange(async (v) => {
      s.syncAllFolders = v, controls.forEach((c) => c.setDisabled(v)), await this.persist();
    }));
    let folders = this.app.vault.getAllLoadedFiles().filter((b) => b instanceof h.TFolder && b.path).sort((b, v) => b.path.localeCompare(v.path)), items = [{ path: "/", name: "\u6839\u76EE\u5F55\u6587\u4EF6" }, ...folders.map((b) => ({ path: b.path, name: b.path }))];
    for (let item of items) new h.Setting(e).setName(item.name).addToggle((b) => {
      controls.push(b), b.setValue(s.selectedFolders.includes(item.path)).setDisabled(s.syncAllFolders).onChange(async (v) => {
        s.selectedFolders = v ? [.../* @__PURE__ */ new Set([...s.selectedFolders, item.path])] : s.selectedFolders.filter((p) => p !== item.path), await this.persist();
      });
    });
    e.createEl("h3", { text: "\u6587\u4EF6\u5904\u7406" });
    let serverMaxMb = Math.max(1, Math.floor((((_a = s.serviceStatus) == null ? void 0 : _a.maxUploadBytes) || 200 * 1024 * 1024) / 1024 / 1024));
    new h.Setting(e).setName("\u5927\u6587\u4EF6\u4E0A\u4F20\u4E0A\u9650").setDesc(`\u8D85\u8FC7 ${s.maxFileSizeMB} MB \u7684\u6587\u4EF6\u6682\u4E0D\u540C\u6B65\uFF1B\u670D\u52A1\u7AEF\u5F53\u524D\u4E0A\u9650 ${serverMaxMb} MB\u3002\u79FB\u52A8\u7AEF\u5EFA\u8BAE\u4FDD\u6301 50 MB \u4EE5\u4E0B`).addSlider((b) => b.setLimits(1, serverMaxMb, 1).setDynamicTooltip().setValue(Math.min(s.maxFileSizeMB, serverMaxMb)).onChange(async (v) => {
      s.maxFileSizeMB = v, await this.persist();
    }));
    new h.Setting(e).setName("\u6587\u4EF6\u51B2\u7A81\u5904\u7406").setDesc("Markdown \u4F18\u5148\u81EA\u52A8\u4E09\u65B9\u5408\u5E76\uFF1B\u65E0\u6CD5\u5408\u5E76\u65F6\u6309\u6B64\u7B56\u7565\u5904\u7406").addDropdown((b) => b.addOption("keep-both", "\u4FDD\u7559\u4E24\u4EFD\uFF08\u63A8\u8350\uFF09").addOption("local", "\u4F18\u5148\u672C\u5730").addOption("cloud", "\u4F18\u5148\u4E91\u7AEF").setValue(s.conflictStrategy || "keep-both").onChange(async (v) => {
      s.conflictStrategy = v, await this.persist();
    }));
    e.createEl("h3", { text: "\u66F4\u65B0\u4E0E\u901A\u77E5" });
    let service = s.serviceStatus, updateAvailable = service && K(this.plugin.manifest.version, service.latestVersion) < 0, statusText = service ? `\u5F53\u524D ${this.plugin.manifest.version}\uFF0C\u6700\u65B0 ${service.latestVersion}\uFF1B\u4E0A\u6B21\u68C0\u67E5 ${new Date(s.lastServiceCheckAt).toLocaleString()}` : "\u5C1A\u672A\u68C0\u67E5";
    let updateSetting = new h.Setting(e).setName(updateAvailable ? "\u53D1\u73B0\u63D2\u4EF6\u65B0\u7248\u672C" : "\u63D2\u4EF6\u66F4\u65B0").setDesc(statusText).addButton((b) => b.setButtonText("\u7ACB\u5373\u68C0\u67E5").onClick(() => void this.plugin.checkServiceStatus(true)));
    updateAvailable && updateSetting.addButton((b) => b.setButtonText("\u6253\u5F00\u53D1\u5E03\u9875").setCta().onClick(() => window.open(service.releaseUrl, "_blank", "noopener,noreferrer")));
    new h.Setting(e).setName("\u8F7B\u63D0\u793A\u4E0E\u56FE\u6807\u52A8\u753B").setDesc("\u6BCF 5 \u5206\u949F\u68C0\u67E5\u516C\u544A\uFF1B\u672A\u8BFB\u516C\u544A\u663E\u793A\u5728\u53F3\u4E0B\u89D2\u548C\u8BBE\u7F6E\u9876\u90E8\uFF0C\u4E0D\u5F3A\u5236\u5F39\u7A97\u3002\u5173\u95ED\u540E\u56FE\u6807\u4FDD\u6301\u9759\u6001\u3002").addToggle((b) => b.setValue(s.serviceNotices !== false).onChange(async (v) => {
      s.serviceNotices = v, await this.persist(), community.updateIcon(this.plugin);
    }));
    new h.Setting(e).setName("\u610F\u89C1\u53CD\u9988").setDesc("\u63D0\u51FA\u5EFA\u8BAE\u3001\u62A5\u544A\u95EE\u9898\u6216\u8054\u7CFB\u7BA1\u7406\u5458\u3002\u91C7\u7EB3\u540E\u53EF\u83B7\u7BA1\u7406\u5458\u53D1\u653E\u7684\u5BB9\u91CF\u5956\u52B1\u3002").addButton((b) => b.setButtonText("\u63D0\u4EA4\u53CD\u9988").onClick(() => community.openFeedback(this.plugin))).addButton((b) => b.setButtonText("\u67E5\u770B\u56DE\u590D").onClick(() => void this.plugin.openWebPortal("/feedback")));
    let link = e.createEl("a", { text: "\u8BBF\u95EE NoteCloud \u7F51\u9875\u7248 \u2192", href: "#", cls: "notecloud-web-link" });
    link.onclick = (b) => {
      b.preventDefault(), void this.plugin.openWebPortal();
    };
    community.renderHistory(this.plugin, e);
  }
};
