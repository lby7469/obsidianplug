const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { webcrypto, createHash } = require("node:crypto");
const { testModule } = require("./test-module.cjs");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const bytes = value => Uint8Array.from(Buffer.isBuffer(value) ? value : Buffer.from(value)).buffer;
const digest = value => createHash("sha256").update(Buffer.from(value)).digest("hex");
class TFile {
  constructor(path, content) {
    this.path = path; this.name = path.split("/").pop(); this.extension = path.split(".").pop();
    this.content = Buffer.from(content); this.stat = { size: this.content.length, mtime: Date.now() };
  }
}
class TFolder {
  constructor(path) { this.path = path; this.name = path.split('/').pop(); this.children = []; }
}
function harness({ bundle = path.join(__dirname, "../main.js"), files = [], latency = 0, mobile = false } = {}) {
  const notices = [], metrics = { requests: 0, reads: 0, saves: 0, routes: [], peak: 0, active: 0 };
  let network = async () => { throw Error("Unexpected network request in isolated test"); };
  async function request(url, options) {
    metrics.requests++; metrics.routes.push((options?.method || "GET") + " " + new URL(url).pathname);
    metrics.active++; metrics.peak = Math.max(metrics.peak, metrics.active);
    try { await delay(latency); return await network(url, options); } finally { metrics.active--; }
  }
  const obsidian = { Plugin: class {}, PluginSettingTab: class {}, TFile, TFolder, Platform: { isMobile: mobile },
    Notice: class { constructor(value) { notices.push(value); } },
    requestUrl: async options => {
      const result = await request(options.url, { method: options.method, headers: { ...(options.contentType ? { "content-type": options.contentType } : {}), ...options.headers }, body: options.body });
      const arrayBuffer = await result.arrayBuffer(), text = new TextDecoder().decode(arrayBuffer);
      return { status: result.status, headers: Object.fromEntries(result.headers), arrayBuffer, text, get json() { return JSON.parse(text); } };
    } };
  const context = vm.createContext({ module: { exports: {} }, require: name => { assert.equal(name, "obsidian"); return obsidian; }, crypto: webcrypto, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, Headers, Error, btoa, console, URL, fetch: request, setTimeout, clearTimeout, window: { setTimeout, clearTimeout, setInterval, clearInterval, open() {} } });
  vm.runInContext(fs.readFileSync(bundle, "utf8"), context);
  const instance = new context.module.exports.default(), store = new Map(files.map(file => [file.path, file]));
  const folders = new Map();
  const folder = directory => {
    if (!folders.has(directory)) {
      const entry = new TFolder(directory);
      Object.defineProperty(entry, 'children', { configurable: true, get() {
        const entries = new Map(), prefix = directory ? directory + '/' : '';
        for (const file of store.values()) {
          if (!file.path.startsWith(prefix)) continue;
          const relative = file.path.slice(prefix.length), slash = relative.indexOf('/');
          if (!relative) continue;
          const child = slash < 0 ? file : folder(prefix + relative.slice(0, slash));
          entries.set(child.path, child);
        }
        return [...entries.values()];
      } });
      folders.set(directory, entry);
    }
    return folders.get(directory);
  };
  instance.manifest = { version: "0.4.3" };
  instance.app = { vault: {
    configDir: ".obsidian", getName: () => "Isolated Test", getFiles: () => [...store.values()],
    getRoot: () => folder(''),
    getAbstractFileByPath: path => store.get(path) || folders.get(path) || ([...store.keys()].some(file => file.startsWith(path + '/')) ? folder(path) : undefined),
    readBinary: async file => { metrics.reads++; return bytes(file.content); },
    modifyBinary: async (file, content) => { file.content = Buffer.from(content); file.stat = { size: file.content.length, mtime: file.stat.mtime + 1 }; instance.markPending(file); },
    createBinary: async (path, content) => { assert.ok(!store.has(path)); const file = new TFile(path, Buffer.from(content)); store.set(path, file); instance.markPending(file); return file; },
    createFolder: async () => {}
  }, metadataCache: { getFileCache: () => ({}), getFirstLinkpathDest: () => undefined } };
  instance.settings = { ...instance.settings, state: {}, selectedFolders: [], syncAllFolders: true, token: "fixture", account: { id: "account-a", quotaBytes: 100000000, usedBytes: 0 } };
  instance.saveData = async () => { metrics.saves++; };
  instance.configureAutoSync = () => {};
  return { instance, store, metrics, notices, support: () => testModule("sync-support.ts"), setNetwork: value => { network = value; } };
}
module.exports = { harness, TFile, TFolder, bytes, digest, delay };
