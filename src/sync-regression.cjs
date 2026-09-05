const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { webcrypto, createHash } = require("node:crypto");
const notices = [];
class TFile { constructor(path, content) { this.path = path; this.name = path.split("/").pop(); this.extension = path.split(".").pop(); this.content = content; this.stat = { size: Buffer.byteLength(content), mtime: Date.now() }; } }
const obsidian = { Plugin: class {}, PluginSettingTab: class {}, TFile, Platform: { isMobile: false }, Notice: class { constructor(message) { notices.push(message); } } };
const context = vm.createContext({ module: { exports: {} }, require: name => { assert.equal(name, "obsidian"); return obsidian; }, crypto: webcrypto, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, Headers, Error, btoa, console, window: { setTimeout, clearTimeout, open() {} }, setTimeout, clearTimeout });
vm.runInContext(fs.readFileSync(require("node:path").join(__dirname, "../main.js"), "utf8"), context);
const Plugin = context.module.exports.default;
const buffer = text => new TextEncoder().encode(text).buffer;
const digest = text => createHash("sha256").update(text).digest("hex");
function plugin(files = []) {
  const instance = new Plugin();
  const store = new Map(files.map(file => [file.path, file]));
  instance.app = {
    vault: {
      getName: () => "Test Vault",
      getFiles: () => [...store.values()],
      getAbstractFileByPath: path => store.get(path),
      readBinary: async file => buffer(file.content),
      modifyBinary: async (file, data) => { file.content = new TextDecoder().decode(data); file.stat.size = data.byteLength; },
      createBinary: async (path, data) => { assert.ok(!store.has(path)); const file = new TFile(path, new TextDecoder().decode(data)); store.set(path, file); return file; },
      createFolder: async () => {}
    },
    metadataCache: { getFileCache: () => ({}), getFirstLinkpathDest: () => undefined }
  };
  instance.settings = { ...instance.settings, state: {}, selectedFolders: [], token: "fixture", account: { id: "account-a" } };
  instance.saveSettings = async () => {};
  instance.setStatus = () => {};
  instance.configureAutoSync = () => {};
  instance.checkServiceStatus = async () => {};
  return { instance, store };
}
(async () => {
  const result = vm.runInContext('L(["ONE\\n", "two\\n", "three\\n"], ["one\\n", "two\\n", "three\\n"], ["one\\n", "two\\n", "THREE\\n"])', context);
  assert.equal(result.conflict, false);
  assert.equal(result.result.join(""), "ONE\ntwo\nTHREE\n");
  assert.equal(vm.runInContext('L(["local"], ["base"], ["cloud"]).conflict', context), true);
  const { instance, store } = plugin([new TFile("note.md", "local")]);
  instance.remoteBytes = async () => buffer("cloud");
  await instance.resolveConflict(store.get("note.md"), { path: "note.md", revision: digest("cloud") }, buffer("local"), digest("local"));
  assert.equal(store.get("note.md").content, "cloud");
  assert.ok([...store.values()].some(file => file.path.includes(".conflict-") && file.content === "local"));
  store.get("note.md").content = "before";
  instance.remoteBytes = async () => { store.get("note.md").content = "new typing"; return buffer("cloud"); };
  await assert.rejects(instance.download({ path: "note.md", revision: digest("cloud") }, digest("before")), /本地笔记已修改/);
  assert.equal(store.get("note.md").content, "new typing");
  const swapped = plugin().instance;
  swapped.settings.state = { "old.md": { hash: "old", remoteRevision: "old" } };
  swapped.settings.phone = "13700000001";
  swapped.settings.pendingAuth = { state: "nonce", verifier: "verifier", createdAt: Date.now() };
  swapped.request = async () => ({ id: "account-b", phone: "13700000002", token: "new", refreshToken: "refresh", expiresIn: 900 });
  await swapped.completeWebAuth({ code: "code", state: "nonce" });
  assert.equal(Object.keys(swapped.settings.state).length, 0);
  assert.equal(swapped.settings.autoSync, false);
  assert.equal(swapped.settings.accountSwitchPending, true);
  let requests = 0;
  swapped.authorizedRequest = async () => { requests++; throw Error("should not sync"); };
  await swapped.sync(false);
  assert.equal(requests, 0);
  swapped.confirmAccountSync = async () => false;
  await swapped.sync(true);
  assert.equal(requests, 0);
  const same = plugin().instance;
  same.settings.state = { "existing.md": { hash: "keep" } };
  same.settings.pendingAuth = { state: "nonce", verifier: "v", createdAt: Date.now() };
  same.request = async () => ({ id: "account-a", token: "token", expiresIn: 900 });
  await same.completeWebAuth({ code: "code", state: "nonce" });
  assert.equal(same.settings.state["existing.md"].hash, "keep");
  same.syncing = true;
  await same.beginWebAuth("switch");
  assert.equal(same.settings.pendingAuth, undefined);
  const stale = plugin().instance;
  stale.authorizedBinaryRequest = async () => ({ arrayBuffer: buffer("changed") });
  await assert.rejects(stale.remoteBytes({ path: "note.md", revision: digest("old") }), /云端文件/);
  console.log("PASS: three-way merge, true conflict, keep-both copy, local edit during download, account isolation, manual confirmation, same-account preservation, busy guard, remote revision verification");
})().catch(error => { console.error(error); process.exitCode = 1; });
