const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { createHash } = require('node:crypto');
const { buildSync } = require('esbuild');
const { harness, TFile, bytes, digest } = require('./test-harness.cjs');
let assertions = 0;
const equal = (a, b, message) => { assert.deepEqual(a, b, message); assertions++; };
const verify = (value, message) => { assert.ok(value, message); assertions++; };
const json = value => JSON.parse(JSON.stringify(value));
const settle = async () => { for (let i = 0; i < 8; i++) await new Promise(resolve => setImmediate(resolve)); };
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
// Compile the production client in memory: no real Vault, host, credentials or release artifact is used.
const sourceBundle = buildSync({ entryPoints: [path.join(__dirname, 'main.ts')], bundle: true, write: false, external: ['obsidian'], platform: 'browser', target: 'es2018', format: 'cjs', logLevel: 'silent' }).outputFiles[0].text;
const account = { id: 'migration-account', phone: 'synthetic', quotaBytes: 100000000, usedBytes: 6, syncWritesAllowed: true };
function saved(overrides = {}) {
  return { serverUrl: 'https://api.notecloud.asia', websiteUrl: 'https://notecloud.asia', token: 'synthetic-access', refreshToken: 'synthetic-refresh', tokenExpiresAt: Date.now() + 3600000,
    stateAccountId: account.id, account: { ...account }, state: { 'notes/a.md': { hash: digest('before'), remoteRevision: 'revision-before', baseContent: 'before' } },
    syncAllFolders: false, selectedFolders: ['notes'], autoSync: true, conflictStrategy: 'cloud', maxFileSizeMB: 123, syncIntervalMinutes: 17,
    lastSyncAt: '2026-11-01T00:00:00.000Z', serviceNotices: false, readAnnouncementIds: ['read'], deletedAnnouncementIds: ['deleted'],
    ...overrides };
}
function boot(raw, { failSave = false, saveGate, files = [], mobile = false, storage, runtimeFrom, markerFailure, installationFailure } = {}) {
  const opened = [], events = [], persisted = [], requests = [], registrations = [];
  const disk = storage || { data: raw == null ? raw : json(raw), markers: new Map() };
  disk.locals ||= new Map();
  const localStorage = {
    getItem: key => { if (installationFailure === 'installation-read') throw Error('synthetic local storage read failure'); return disk.locals.get(key) ?? null; },
    setItem: (key, value) => { if (installationFailure === 'installation-write') throw Error('synthetic local storage write failure'); if (installationFailure !== 'installation-readback') disk.locals.set(key, value); },
  };
  const result = runtimeFrom ? { ...runtimeFrom, instance: new runtimeFrom.plugin.constructor() } : harness({ bundleSource: sourceBundle, files, mobile, runtime: { window: { setInterval: () => 1, clearInterval() {}, setTimeout: () => 2, clearTimeout() {}, open: url => opened.push(url), localStorage } } });
  const plugin = result.instance;
  if (runtimeFrom) plugin.app = runtimeFrom.plugin.app;
  plugin.manifest = { id: 'notecloud-sync', dir: '.obsidian/plugins/notecloud-sync', version: '0.5.1' };
  const dirs = new Set(['.obsidian', '.obsidian/plugins', '.obsidian/plugins/notecloud-sync']);
  plugin.app.vault.adapter = {
    exists: async file => disk.markers.has(file) || dirs.has(file),
    stat: async file => dirs.has(file) ? { type: 'folder', size: 0 } : disk.markers.has(file) ? { type: 'file', size: Buffer.byteLength(disk.markers.get(file)) } : null,
    read: async file => { if (markerFailure === 'read') throw Error('synthetic marker read failure'); if (!disk.markers.has(file)) throw Error('missing synthetic marker'); return disk.markers.get(file); },
    write: async (file, value) => { if (markerFailure === 'write') throw Error('synthetic marker write failure'); disk.markers.set(file, value); events.push('marker-write'); },
    remove: async file => { if (markerFailure === 'remove') throw Error('synthetic marker remove failure'); disk.markers.delete(file); events.push('marker-remove'); },
    rename: async (from, to) => { disk.markers.set(to, disk.markers.get(from)); disk.markers.delete(from); },
  };
  plugin.loadData = async () => { events.push('load'); return disk.data == null ? disk.data : json(disk.data); };
  plugin.saveData = async value => {
    events.push('save-start');
    if (saveGate) await saveGate.promise;
    if (failSave) throw Error('synthetic settings failure');
    persisted.push(json(value)); disk.data = json(value); events.push('save-complete');
  };
  plugin.registerObsidianProtocolHandler = (id, callback) => registrations.push({ id, callback });
  plugin.addSettingTab = () => {};
  plugin.addRibbonIcon = () => {};
  plugin.addCommand = command => registrations.push(command);
  plugin.registerEvent = () => {};
  plugin.registerInterval = () => {};
  plugin.app.vault.on = () => ({});
  plugin.addStatusBarItem = () => ({ addClass() {}, addEventListener() {} });
  plugin.setStatus = () => {};
  // UI/timer registration is irrelevant to migration; real network, persistence,
  // request/refresh/auth and sync methods remain intact.
  plugin.initializeAutoSync = () => { events.push('auto-initialized'); };
  plugin.initializeAccountRefresh = () => { events.push('account-initialized'); };
  let route = async url => {
    if (new URL(url).pathname === '/v1/auth/policy') return { passwordHint: 'fixture', emailCodeLength: 6, emailCodeExpiresMinutes: 10 };
    if (new URL(url).pathname === '/v1/account') return account;
    throw Error('Unexpected isolated path: ' + new URL(url).pathname);
  };
  result.setNetwork(async (url, options) => {
    events.push('request'); requests.push({ url, ...options });
    const response = await route(url, options);
    return response instanceof Response ? response : new Response(JSON.stringify(response), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  return { ...result, plugin, disk, events, persisted, requests, opened, registrations, route: value => { route = value; } };
}

// Establish the pending handshake using an actual earlier JS realm, then return
// an unstarted client in a fresh realm. Used by the post-restart migration cases.
async function preparedBoot(raw, options = {}) {
  const before = boot(raw, { mobile: options.mobile, storage: options.storage });
  await before.plugin.onload();
  return boot(raw, { ...options, storage: before.disk });
}

(async () => {
  const markerPath = '.obsidian/plugins/notecloud-sync/entry-migration-pending-v1.json';
  for (const raw of [undefined, null, {}, []]) {
    const fresh = boot(raw); await fresh.plugin.onload();
    equal(fresh.plugin.settings.serverUrl, 'https://notecloud.cloud'); equal(fresh.plugin.settings.websiteUrl, 'https://notecloud.cloud');
    equal(fresh.plugin.entryRestartRequired, false, 'A genuinely new installation does not require the old-version handoff');
    equal(fresh.disk.markers.size, 0); equal(fresh.requests.length, 1);
    verify(fresh.events.indexOf('save-complete') < fresh.events.indexOf('request'));
  }
  {
    const original = saved(), first = boot(original); await first.plugin.onload();
    equal(first.plugin.entryInitializationBlocked, true); equal(first.plugin.entryRestartRequired, true);
    equal(first.requests.length, 0); equal(first.persisted.length, 0);
    equal(first.disk.data, original, 'First upgrade handshake does not rewrite data.json while an old instance can still save');
    equal(first.disk.markers.size, 1);
    const marker = JSON.parse(first.disk.markers.get(markerPath));
    equal(Object.keys(marker).sort(), ['from', 'installationId', 'schema', 'sessionId', 'to']);
    equal(marker.schema, 1); equal(marker.from, 'https://api.notecloud.asia'); equal(marker.to, 'https://notecloud.cloud');
    verify(/^[a-f0-9]{48}$/.test(marker.installationId) && /^[a-f0-9]{48}$/.test(marker.sessionId));
    verify(!JSON.stringify(marker).includes(original.token) && !JSON.stringify(marker).includes('notes/a.md'), 'The independent marker contains no credentials or note state');
    await assert.rejects(first.plugin.request('/v1/account')); assertions++;
    await assert.rejects(first.plugin.beginWebAuth()); assertions++;
    await assert.rejects(first.plugin.saveSettings()); assertions++;
    await first.plugin.sync(true); equal(first.requests.length, 0);
    const reload = boot(undefined, { storage: first.disk, runtimeFrom: first }); await reload.plugin.onload();
    equal(reload.plugin.entryRestartRequired, true, 'Disabling and enabling the plugin within one JS realm is not a restart');
    equal(reload.persisted.length, 0); equal(reload.requests.length, 0);
    equal(JSON.parse(reload.disk.markers.get(markerPath)), marker);
    reload.plugin.onunload(); equal(reload.disk.data, original, 'Unloading the pending version does not save a stale settings copy');
    const restarted = boot(undefined, { storage: first.disk }); await restarted.plugin.onload();
    equal(restarted.plugin.entryInitializationBlocked, false); equal(restarted.plugin.entryRestartRequired, false);
    equal(restarted.plugin.settings.serverUrl, 'https://notecloud.cloud'); equal(restarted.disk.markers.size, 0);
    equal(json(restarted.plugin.settings.state), original.state);
  }
  for (const value of ['{', 'a'.repeat(1025), JSON.stringify({ schema: 7 }), JSON.stringify({ schema: 1, from: 'https://evil.invalid', to: 'https://notecloud.cloud', installationId: 'a'.repeat(48), sessionId: 'b'.repeat(48) })]) {
    const test = boot(saved()); test.disk.markers.set(markerPath, value);
    await assert.rejects(test.plugin.onload()); assertions++;
    equal(test.requests.length, 0); equal(test.persisted.length, 0); equal(test.plugin.entryInitializationBlocked, true);
    equal(test.disk.markers.get(markerPath), value, 'Malformed markers are not silently replaced');
  }
  {
    const first = boot(saved()); await first.plugin.onload();
    const otherDeviceDisk = { data: json(first.disk.data), markers: first.disk.markers, locals: new Map() };
    const foreign = boot(undefined, { storage: otherDeviceDisk }); await foreign.plugin.onload();
    equal(foreign.plugin.entryRestartRequired, true, 'A marker copied from another installation does not prove this device restarted');
    equal(foreign.requests.length, 0); equal(foreign.persisted.length, 0);
  }
  for (const failure of ['write', 'read']) {
    const first = boot(saved()); if (failure === 'read') await first.plugin.onload();
    const test = boot(undefined, { storage: first.disk, markerFailure: failure });
    await assert.rejects(test.plugin.onload()); assertions++;
    equal(test.requests.length, 0); equal(test.persisted.length, 0);
  }
  for (const failure of ['installation-read', 'installation-write', 'installation-readback', 'foreign-directory', 'unsafe-config-directory', 'wrong-plugin']) {
    const test = boot(saved(), { installationFailure: failure });
    if (failure === 'foreign-directory') test.plugin.manifest.dir = '.obsidian/plugins/other-plugin';
    if (failure === 'unsafe-config-directory') test.plugin.app.vault.configDir = '../outside';
    if (failure === 'wrong-plugin') test.plugin.manifest.id = 'other-plugin';
    await assert.rejects(test.plugin.onload()); assertions++;
    equal(test.requests.length, 0); equal(test.persisted.length, 0); equal(test.disk.markers.size, 0);
  }
  {
    const first = boot(saved());
    first.plugin.app.loadLocalStorage = first.plugin.app.saveLocalStorage = () => { throw Error('Unsupported Obsidian API must not be used'); };
    await first.plugin.onload();
    equal(first.plugin.entryRestartRequired, true, 'All supported Obsidian versions use device-local browser storage');
    const restarted = boot(undefined, { storage: first.disk });
    restarted.plugin.app.loadLocalStorage = restarted.plugin.app.saveLocalStorage = () => { throw Error('Unsupported Obsidian API must not be used'); };
    await restarted.plugin.onload();
    equal(restarted.plugin.settings.serverUrl, 'https://notecloud.cloud'); equal(restarted.disk.markers.size, 0);
  }
  for (const [serverUrl, websiteUrl] of [['https://notecloud.cloud', 'https://notecloud.cloud'], ['https://self.example', 'https://portal.example']]) {
    const test = boot(saved({ serverUrl, websiteUrl })); test.disk.markers.set(markerPath, 'do not touch unrelated stale file');
    await test.plugin.onload(); equal(test.plugin.settings.serverUrl, serverUrl); equal(test.disk.markers.get(markerPath), 'do not touch unrelated stale file');
    verify(!test.events.includes('marker-write') && !test.events.includes('marker-remove'), 'Already-migrated and custom configurations do not operate on migration markers');
  }
  {
    const first = boot(saved()); await first.plugin.onload();
    const restarted = boot(undefined, { storage: first.disk, markerFailure: 'remove' }); await restarted.plugin.onload();
    equal(restarted.plugin.settings.serverUrl, 'https://notecloud.cloud'); equal(restarted.plugin.entryInitializationBlocked, false);
    equal(json(restarted.plugin.settings.state), saved().state, 'Marker cleanup failure never clears the saved baseline');
    equal(restarted.disk.markers.size, 1);
  }
  for (const mode of ['late-http', 'late-save']) {
    const legacyPath = path.join(__dirname, 'fixtures', 'legacy-0.5.0-main.cjs');
    equal(createHash('sha256').update(fs.readFileSync(legacyPath)).digest('hex'), 'e29b0f80810a2b21e7a2284576710e9039163eaf39e5314ed5283bac5ea4297d', 'The old client is the actual immutable published 0.5.0 artifact');
    const late = deferred(), entered = deferred(), disk = { data: saved(), markers: new Map() };
    const legacy = harness({ bundle: legacyPath });
    legacy.instance.settings = saved({ lastServiceCheckAt: 0, state: { 'notes/a.md': { hash: 'late-hash', remoteRevision: 'late-revision', baseContent: 'late saved baseline' } } });
    legacy.instance.setStatus = () => {};
    legacy.instance.saveData = async value => { if (mode === 'late-save') { entered.resolve(); await late.promise; } disk.data = json(value); };
    legacy.setNetwork(async () => { if (mode === 'late-http') { entered.resolve(); await late.promise; } return new Response(JSON.stringify({ latestVersion: '0.5.0', releaseUrl: 'https://github.com/Yinds0270/NoteCloud/releases/tag/0.5.0', announcements: [] }), { status: 200, headers: { 'content-type': 'application/json' } }); });
    const oldRequest = legacy.instance.checkServiceStatus(true); await entered.promise; legacy.instance.onunload();
    const pending = boot(undefined, { storage: disk }); await pending.plugin.onload();
    equal(pending.requests.length, 0); equal(pending.persisted.length, 0);
    late.resolve(); await oldRequest;
    equal(disk.data.serverUrl, 'https://api.notecloud.asia', 'The real old client still completes its late write after unload');
    equal(disk.data.state['notes/a.md'].remoteRevision, 'late-revision');
    const sameRealm = boot(undefined, { storage: disk, runtimeFrom: pending }); await sameRealm.plugin.onload();
    equal(sameRealm.plugin.entryRestartRequired, true); equal(sameRealm.requests.length, 0);
    const freshRealm = boot(undefined, { storage: disk }); await freshRealm.plugin.onload();
    equal(freshRealm.plugin.settings.serverUrl, 'https://notecloud.cloud');
    equal(freshRealm.plugin.settings.state['notes/a.md'].remoteRevision, 'late-revision', 'After process restart migration reads the latest completed old write');
    equal(freshRealm.plugin.settings.state['notes/a.md'].baseContent, 'late saved baseline');
    equal(freshRealm.plugin.settings.token, legacy.instance.settings.token);
    equal(freshRealm.disk.markers.size, 0);
  }
  {
    const test = await preparedBoot(saved()); await test.plugin.onload();
    const entered = deferred(), late = deferred();
    test.route(async () => { entered.resolve(); await late.promise; return { latestVersion: '0.5.1', releaseUrl: 'https://github.com/Yinds0270/NoteCloud/releases/tag/0.5.1', announcements: [] }; });
    const writesBefore = test.persisted.length;
    const request = test.plugin.checkServiceStatus(true); await entered.promise; test.plugin.onunload(); late.resolve(); await request;
    equal(test.persisted.length, writesBefore, 'The new version does not repeat the old late-status-write bug');
  }
  {
    const test = await preparedBoot(saved()); await test.plugin.onload();
    const gate = deferred(), writesBefore = test.persisted.length; test.plugin.saveFlight = gate.promise;
    const saving = assert.rejects(test.plugin.saveSettings()); assertions++;
    test.plugin.onunload(); gate.resolve(); await saving;
    equal(test.persisted.length, writesBefore, 'A queued new-version save checks disposal again immediately before writing');
  }
  for (const mobile of [false, true]) {
    const before = saved({ pendingAuth: { verifier: 'old-verifier', state: 'old-state', createdAt: Date.now() }, lastServiceCheckAt: Date.now() });
    const test = await preparedBoot(before, { mobile }); await test.plugin.onload();
    equal(test.plugin.settings.serverUrl, 'https://notecloud.cloud'); equal(test.plugin.settings.websiteUrl, 'https://notecloud.cloud');
    verify(test.events.indexOf('save-complete') < test.events.indexOf('request'), 'The new origin is durably saved before the first real request');
    equal(test.requests.length, 1); equal(test.requests[0].url, 'https://notecloud.cloud/v1/auth/policy');
    equal(test.requests[0].headers.authorization, 'Bearer synthetic-access', 'Existing bearer credentials are retained for the same backend');
    for (const field of ['token', 'refreshToken', 'tokenExpiresAt', 'stateAccountId', 'state', 'selectedFolders', 'syncAllFolders', 'autoSync', 'conflictStrategy', 'maxFileSizeMB', 'syncIntervalMinutes', 'lastSyncAt', 'serviceNotices', 'readAnnouncementIds', 'deletedAnnouncementIds']) {
      equal(json(test.plugin.settings[field]), json(before[field]), 'Migration preserves ' + field);
    }
    equal(test.plugin.settings.account.id, account.id); equal(test.plugin.settings.pendingAuth, undefined);
    equal(test.plugin.settings.lastServiceCheckAt, 0); equal(test.plugin.settings.accountSwitchPending, undefined);
    const requestsBefore = test.requests.length;
    await test.plugin.completeWebAuth({ code: 'old-callback-code', state: 'old-state' });
    equal(test.requests.length, requestsBefore, 'An incomplete old-domain PKCE callback cannot exchange credentials after migration');
    const again = boot(test.persisted[0], { mobile }); await again.plugin.onload();
    equal(json(again.plugin.settings.state), json(before.state), 'Reloading the updated plugin preserves the sync baseline');
    equal(again.plugin.settings.serverUrl, 'https://notecloud.cloud');
    equal(again.notices.filter(text => text.includes('入口')).length, 0, 'A subsequent load does not repeat migration notices');
  }
  for (const raw of [undefined, null, {}, saved({ serverUrl: undefined, websiteUrl: undefined }), saved({ serverUrl: 'https://api.notecloud.asia/', websiteUrl: 'https://notecloud.asia/' }), saved({ serverUrl: 'HTTPS://API.NOTECLOUD.ASIA', websiteUrl: 'HTTPS://NOTECLOUD.ASIA/' }), saved({ serverUrl: 'https://notecloud.asia' })]) {
    const test = await preparedBoot(raw); await test.plugin.onload();
    equal(test.plugin.settings.serverUrl, 'https://notecloud.cloud'); equal(test.plugin.settings.websiteUrl, 'https://notecloud.cloud');
    verify(test.requests.every(item => new URL(item.url).origin === 'https://notecloud.cloud'));
  }
  for (const [serverUrl, websiteUrl] of [
    ['https://self.example', 'https://portal.example'], ['http://127.0.0.1:8790', 'http://127.0.0.1:8790'],
    ['https://api.notecloud.asia.evil.invalid', 'https://notecloud.asia'], ['https://api.notecloud.asia@evil.invalid', 'https://notecloud.asia'],
    ['http://api.notecloud.asia', 'https://notecloud.asia'], ['https://api.notecloud.asia:444', 'https://notecloud.asia'],
    ['https://api.notecloud.asia/path', 'https://notecloud.asia'], ['https://api.notecloud.asia?next=evil', 'https://notecloud.asia'],
    ['https://api.notecloud.asia', 'https://custom.example'], ['https://notecloud.cloud', 'https://notecloud.asia'],
  ]) {
    const test = await preparedBoot(saved({ serverUrl, websiteUrl })); await test.plugin.onload();
    equal(test.plugin.settings.serverUrl, serverUrl, 'Do not silently migrate a custom or ambiguous endpoint'); equal(test.plugin.settings.websiteUrl, websiteUrl);
    verify(test.requests.every(item => item.url.startsWith(serverUrl.replace(/\/$/, '') + '/')), 'Custom credentials stay on the explicitly configured API endpoint');
  }
  {
    const test = await preparedBoot(saved({ serverUrl: 'https://self.example', websiteUrl: undefined })); await test.plugin.onload();
    equal(test.plugin.settings.websiteUrl, 'https://notecloud.asia', 'An omitted old custom-site setting retains its old interpretation');
    equal(test.plugin.settings.serverUrl, 'https://self.example');
  }
  for (const pendingSave of [false, true]) {
    const gate = pendingSave ? deferred() : undefined, test = await preparedBoot(saved(), { failSave: true, saveGate: gate });
    const loading = assert.rejects(test.plugin.onload(), /network access remains paused/); assertions++;
    await settle();
    if (gate) {
      equal(test.requests.length, 0, 'A slow settings write blocks startup network');
      await assert.rejects(test.plugin.request('/v1/account')); assertions++;
      await assert.rejects(test.plugin.binaryRequest('/v1/sync/download')); assertions++;
      gate.resolve();
    }
    await loading;
    await assert.rejects(test.plugin.authorizedRequest('/v1/account')); assertions++;
    await assert.rejects(test.plugin.authorizedBinaryRequest('/v1/sync/download')); assertions++;
    await assert.rejects(test.plugin.beginWebAuth('login')); assertions++;
    await test.plugin.openWebPortal('/billing');
    await test.plugin.sync(true);
    equal(test.requests.length, 0, 'Neither manual sync, authorization, binary nor portal requests bypass a failed startup save');
    equal(test.opened.length, 0); equal(test.persisted.length, 0); equal(test.plugin.autoSyncAllowed(), false);
    verify(!test.events.includes('auto-initialized') && !test.events.includes('account-initialized'));
  }
  {
    const gate = deferred(), test = await preparedBoot(saved(), { saveGate: gate });
    const loading = test.plugin.onload(); await settle(); test.plugin.onunload(); gate.resolve();
    await assert.rejects(loading); assertions++;
    equal(test.requests.length, 0, 'An unload while migration is saving cannot initialize stale networking');
  }
  {
    const test = await preparedBoot(saved()); await test.plugin.onload();
    test.route(async url => new URL(url).pathname === '/v1/auth/plugin-refresh'
      ? { ...account, token: 'rotated-access', refreshToken: 'rotated-refresh', expiresIn: 3600 } : account);
    test.plugin.settings.tokenExpiresAt = Date.now() - 1000;
    await test.plugin.authorizedRequest('/v1/account');
    equal(test.requests.slice(-2).map(item => new URL(item.url).pathname), ['/v1/auth/plugin-refresh', '/v1/account']);
    verify(test.requests.slice(-2).every(item => new URL(item.url).origin === 'https://notecloud.cloud'));
    equal(JSON.parse(test.requests.at(-2).body).refreshToken, 'synthetic-refresh');
    equal(test.requests.at(-1).headers.authorization, 'Bearer rotated-access');
    equal(test.plugin.settings.refreshToken, 'rotated-refresh'); equal(json(test.plugin.settings.state), json(saved().state));
  }
  {
    const test = await preparedBoot(saved()); await test.plugin.onload();
    test.route(async () => new Response(Uint8Array.from([1, 2, 3]), { status: 200 }));
    const binary = await test.plugin.authorizedBinaryRequest('/v1/sync/download?path=notes%2Fa.md');
    equal([...new Uint8Array(binary.arrayBuffer)], [1, 2, 3]);
    equal(new URL(test.requests.at(-1).url).origin, 'https://notecloud.cloud');
    equal(test.requests.at(-1).headers.Authorization, 'Bearer synthetic-access');
    await test.plugin.beginWebAuth('register');
    equal(new URL(test.opened.at(-1)).origin, 'https://notecloud.cloud'); equal(new URL(test.opened.at(-1)).pathname, '/auth/plugin');
  }
  for (const destination of ['https://notecloud.cloud/?ticket=synthetic', 'https://notecloud.asia/?ticket=synthetic', 'https://evil.invalid/?ticket=synthetic', 'https://notecloud.cloud@evil.invalid/?ticket=synthetic', 'javascript:alert(1)']) {
    const test = await preparedBoot(saved()); await test.plugin.onload(); test.route(async () => ({ url: destination }));
    await test.plugin.openWebPortal('/billing');
    const approved = destination.startsWith('https://notecloud.cloud/');
    equal(test.opened.length, approved ? 1 : 0, 'A portal ticket only opens the currently configured origin');
    if (approved) { equal(new URL(test.opened[0]).pathname, '/billing'); equal(new URL(test.opened[0]).searchParams.get('ticket'), 'synthetic'); }
  }
  for (const change of ['epoch', 'server', 'website', 'unload']) {
    const test = await preparedBoot(saved()); await test.plugin.onload(); const entered = deferred(), gate = deferred();
    test.route(async () => { entered.resolve(); await gate.promise; return { url: 'https://notecloud.cloud/?ticket=synthetic' }; });
    const opening = test.plugin.openWebPortal('/billing'); await entered.promise;
    if (change === 'epoch') test.plugin.authEpoch++;
    if (change === 'server') test.plugin.settings.serverUrl = 'https://other.invalid';
    if (change === 'website') test.plugin.settings.websiteUrl = 'https://other.invalid';
    if (change === 'unload') test.plugin.onunload();
    gate.resolve(); await opening; equal(test.opened.length, 0, 'A late portal response cannot outlive ' + change);
  }
  {
    const before = saved({ conflictStrategy: 'keep-both' });
    const test = await preparedBoot(before, { files: [new TFile('notes/a.md', 'before'), new TFile('excluded/private.md', 'never send')] });
    await test.plugin.onload();
    test.plugin.checkServiceStatus = async () => undefined;
    test.route(async url => {
      if (new URL(url).pathname === '/v1/account') return account;
      if (new URL(url).pathname === '/v1/sync/manifest') return { files: [{ path: 'notes/a.md', revision: 'revision-before', size: 6 }] };
      throw Error('Unexpected write or download: ' + new URL(url).pathname);
    });
    const initialRequests = test.requests.length;
    await test.plugin.sync(false);
    verify(test.requests.slice(initialRequests).every(item => item.method === 'GET'), 'Unchanged notes need no upload/download after migrating origins');
    equal(test.plugin.lastSyncReport.errors.length, 0); equal(test.plugin.lastSyncReport.conflicts, 0);
    equal(test.store.size, 2); equal(test.store.get('notes/a.md').content.toString(), 'before');
    equal(test.plugin.settings.state['notes/a.md'].remoteRevision, 'revision-before');
    // A local edit must still use the saved remote revision, not an empty baseline.
    await test.plugin.app.vault.modifyBinary(test.store.get('notes/a.md'), bytes('edited'));
    const uploads = [];
    test.plugin.upload = async (file, hash, content, revision) => { uploads.push({ path: file.path, revision, content: Buffer.from(content).toString() }); test.plugin.remember(file.path, hash, 'revision-after', content); };
    await test.plugin.sync(false);
    equal(uploads, [{ path: 'notes/a.md', revision: 'revision-before', content: 'edited' }]);
    equal(test.plugin.lastSyncReport.conflicts, 0); equal(test.store.size, 2, 'No conflict copies are fabricated by the endpoint migration');
    verify(test.requests.every(item => new URL(item.url).origin === 'https://notecloud.cloud'));
  }
  console.log(JSON.stringify({ ok: true, assertions, suite: 'cloud-entry', isolation: 'compiled production plugin with synthetic settings, network and memory Vault' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
