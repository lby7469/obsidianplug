const assert = require('node:assert/strict');
const path = require('node:path');
const { buildSync } = require('esbuild');
const { testModule } = require('./test-module.cjs');
const { harness, TFile, TFolder, bytes, digest } = require('./test-harness.cjs');
const { AutoSyncCoordinator } = testModule('auto-sync-coordinator.ts');
let assertions = 0;
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); assertions++; };
const verify = (condition, message) => { assert.ok(condition, message); assertions++; };
const settle = async () => { for (let i = 0; i < 8; i++) await new Promise(resolve => setImmediate(resolve)); };
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; };
class Clock {
  time = 0;
  sequence = 0;
  tasks = new Map();
  history = [];
  now = () => this.time;
  set = (callback, delay) => { const id = ++this.sequence; this.tasks.set(id, { at: this.time + delay, callback }); this.history.push(callback); return id; };
  clear = id => { this.tasks.delete(id); };
  tick(duration) {
    const end = this.time + duration;
    for (;;) {
      const next = [...this.tasks.entries()].filter(([, task]) => task.at <= end).sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
      if (!next) break;
      this.time = next[1].at; this.tasks.delete(next[0]); next[1].callback();
    }
    this.time = end;
  }
}
function unit({ finish = true } = {}) {
  const clock = new Clock();
  let allowed = true, identity = 'account-a', runs = 0;
  const coordinator = new AutoSyncCoordinator({ clock, allowed: () => allowed, identity: () => identity, run: async () => { runs++; coordinator.begin(); if (finish) coordinator.finish(false); } });
  return { clock, coordinator, get runs() { return runs; }, set allowed(value) { allowed = value; }, set identity(value) { identity = value; } };
}

// Compile production source only in memory. Never overwrite a release asset.
const sourceBundle = buildSync({ entryPoints: [path.join(__dirname, 'main.ts')], bundle: true, write: false, external: ['obsidian'], platform: 'browser', target: 'es2018', format: 'cjs', logLevel: 'silent' }).outputFiles[0].text;
function client(files = [], { mobile = false } = {}) {
  const clock = new Clock(), document = { hidden: false };
  const result = harness({ bundleSource: sourceBundle, files, mobile, runtime: { document, window: { setTimeout: clock.set, clearTimeout: clock.clear } } });
  const plugin = result.instance;
  plugin.configureAutoSync = Object.getPrototypeOf(plugin).configureAutoSync;
  plugin.autoSyncReady = true;
  const actions = { runs: 0, uploads: [], requests: [], statuses: [], portals: [], pending: [] };
  const cloud = new Map();
  plugin.checkServiceStatus = async () => {};
  plugin.refreshAccount = async () => plugin.settings.account;
  plugin.setStatus = (text, state) => { actions.statuses.push({ text, state }); if (state === 'error') plugin.pendingChanges = true; };
  plugin.authorizedRequest = async (route, options) => {
    actions.requests.push({ route, method: options?.method || 'GET' });
    if (route === '/v1/sync/manifest') return { files: [...cloud.values()] };
    throw Error('Unexpected isolated route: ' + route);
  };
  plugin.upload = async (file, revision, contents) => {
    actions.uploads.push({ path: file.path, revision, content: Buffer.from(contents).toString() });
    cloud.set(file.path, { path: file.path, revision, size: contents.byteLength });
    plugin.remember(file.path, revision, revision, contents);
  };
  plugin.autoSyncCoordinator = new AutoSyncCoordinator({ clock, allowed: () => plugin.autoSyncAllowed(), identity: () => [plugin.authEpoch, plugin.settings.serverUrl, plugin.settings.account?.id || plugin.settings.stateAccountId || ''].join('|'), run: async () => {
    actions.runs++;
    const running = plugin.sync(false);
    actions.pending.push(running);
    await running;
  } });
  return { ...result, clock, document, plugin, actions, cloud, async advance(time) { clock.tick(time); await settle(); await Promise.all(actions.pending); } };
}

(async () => {
  {
    const q = unit(); q.coordinator.changed(); q.clock.tick(1999); equal(q.runs, 0);
    q.coordinator.changed(); q.clock.tick(1999); equal(q.runs, 0); q.clock.tick(1); equal(q.runs, 1, 'Edits debounce for two seconds after the latest change');
    q.clock.tick(60000); equal(q.runs, 1, 'A completed pass does not self-retry');
    const continuous = unit(); continuous.coordinator.changed();
    for (let i = 0; i < 9; i++) { continuous.clock.tick(1000); continuous.coordinator.changed(); }
    equal(continuous.runs, 0); continuous.clock.tick(1000); equal(continuous.runs, 1, 'Continuous editing cannot postpone the first request beyond ten seconds');
  }
  {
    const q = unit(); q.coordinator.changed(); const late = q.clock.history.at(-1); q.coordinator.cancel(); late(); q.clock.tick(5000); equal(q.runs, 0, 'Cancelled timer callbacks remain inert even if delivered late');
    q.coordinator.changed(); q.allowed = false; q.clock.tick(2000); equal(q.runs, 0, 'The setting is checked again at dispatch');
    q.allowed = true; q.coordinator.changed(); q.identity = 'account-b'; q.clock.tick(2000); equal(q.runs, 0, 'An old account timer cannot start work for a different account');
    q.coordinator.wake(); q.clock.tick(300); equal(q.runs, 1);
    q.coordinator.changed(); const unloaded = q.clock.history.at(-1); q.coordinator.dispose(); unloaded(); q.clock.tick(60000); equal(q.runs, 1, 'Unload permanently disables late callbacks');
  }
  {
    const q = unit({ finish: false }); q.coordinator.wake(); q.clock.tick(300); equal(q.runs, 1);
    for (let i = 0; i < 50; i++) q.coordinator.changed();
    q.coordinator.wake(); q.coordinator.flush(); q.clock.tick(10000); equal(q.runs, 1, 'An active sync never overlaps another pass');
    q.coordinator.finish(true); q.clock.tick(1999); equal(q.runs, 1); q.clock.tick(1); equal(q.runs, 2, 'Many in-flight edits coalesce into one follow-up');
    q.coordinator.finish(true); q.clock.tick(60000); equal(q.runs, 2, 'Pending flags without a new generation do not loop');
    q.coordinator.changed(); q.coordinator.begin(); q.coordinator.changed(); q.coordinator.cancel(); q.coordinator.finish(true); q.clock.tick(60000); equal(q.runs, 2, 'A manual cancellation removes a queued follow-up');
  }
  {
    const q = unit(); q.coordinator.changed(); q.coordinator.flush(); equal(q.runs, 1, 'Hidden/pagehide can start best-effort work immediately');
    q.clock.tick(5000); equal(q.runs, 1, 'Flushing consumes the original debounce timer');
    const paused = unit(); paused.allowed = false; paused.coordinator.changed(); paused.coordinator.wake(); paused.coordinator.flush(); paused.clock.tick(30000); equal(paused.runs, 0);
    paused.allowed = true; paused.clock.tick(30000); equal(paused.runs, 0, 'Turning eligibility back on does not revive an old edit timer');
    paused.coordinator.wake(); paused.clock.tick(300); equal(paused.runs, 1);
    const failed = unit({ finish: false }); failed.coordinator.wake(); failed.clock.tick(300); failed.coordinator.changed(); failed.coordinator.finish(false); failed.clock.tick(30000); equal(failed.runs, 1, 'A failed/paused pass does not create an automatic retry chain');
  }
  {
    const test = client([new TFile('notes/a.md', 'before')]);
    test.plugin.settings.syncAllFolders = false; test.plugin.settings.selectedFolders = ['notes'];
    test.plugin.markPending(new TFile('elsewhere/private.md', 'excluded'));
    test.plugin.markPending(new TFile('notes/private.exe', 'unsupported'));
    test.plugin.markPending(new TFolder('elsewhere'));
    await test.advance(3000); equal(test.actions.runs, 0, 'Only supported in-scope events request synchronization');
    const file = test.store.get('notes/a.md');
    await test.plugin.app.vault.modifyBinary(file, bytes('edited'));
    verify(test.actions.statuses.at(-1).text.includes('待同步'), 'Editing immediately stops claiming everything is synchronized');
    await test.advance(1999); equal(test.actions.runs, 0); await test.advance(1);
    equal(test.actions.runs, 1); equal(test.actions.uploads.map(item => item.content), ['edited']);
    equal(test.plugin.pendingChanges, false); equal(test.actions.statuses.at(-1).state, 'success');
    verify(test.plugin.settings.lastSyncAt, 'A completely clean pass updates the success timestamp');
  }
  {
    const test = client([new TFile('edit.md', 'before')]); const file = test.store.get('edit.md');
    const started = deferred(), release = deferred(), upload = test.plugin.upload;
    test.plugin.upload = async (...args) => { await upload(...args); if (test.actions.uploads.length === 1) { started.resolve(); await release.promise; } };
    test.plugin.markPending(file); test.clock.tick(2000); await started.promise;
    await test.plugin.app.vault.modifyBinary(file, bytes('after'));
    release.resolve(); await settle(); await Promise.all(test.actions.pending);
    equal(test.actions.runs, 1); equal(test.plugin.pendingChanges, true); equal(test.plugin.settings.lastSyncAt, undefined, 'An edit during upload prevents a misleading full-success timestamp');
    await test.advance(2000); equal(test.actions.runs, 2); equal(test.actions.uploads.map(item => item.content), ['before', 'after']);
    equal(test.plugin.pendingChanges, false); await test.advance(60000); equal(test.actions.runs, 2, 'The clean follow-up ends the chain');
  }
  {
    const test = client([new TFile('cancel.md', 'before')]); const file = test.store.get('cancel.md');
    const started = deferred(), release = deferred(), upload = test.plugin.upload;
    test.plugin.upload = async (...args) => { started.resolve(); await release.promise; test.plugin.checkRun(); await upload(...args); };
    test.plugin.markPending(file); test.clock.tick(2000); await started.promise;
    await test.plugin.app.vault.modifyBinary(file, bytes('edited while uploading'));
    test.plugin.cancelSync(); equal(test.plugin.syncing, true, 'Cancel keeps the single-flight gate until an in-flight operation has stopped');
    release.resolve(); await settle(); await Promise.all(test.actions.pending); await test.advance(60000);
    equal(test.actions.runs, 1); equal(test.plugin.syncing, false); equal(test.actions.uploads.length, 0); equal(test.plugin.pendingChanges, true);
    equal(test.store.get(file.path).content.toString(), 'edited while uploading', 'Cancel preserves local edits and does not trigger the queued pass');
  }
  {
    const test = client(); const record = { path: 'download.md', revision: digest('remote'), size: 6 };
    test.cloud.set(record.path, record); test.plugin.remoteBytes = async () => bytes('remote');
    test.plugin.requestAutoSync(); await test.advance(300);
    equal(test.store.get(record.path).content.toString(), 'remote'); equal(test.plugin.pendingChanges, false);
    await test.advance(60000); equal(test.actions.runs, 1, 'The plugin own download event does not start an endless upload/download loop');
  }
  {
    const file = new TFile('large.pdf', 'large'); file.stat.size = 201 * 1024 * 1024;
    const test = client([file]); test.plugin.settings.maxFileSizeMB = 200; test.plugin.settings.lastSyncAt = 'preserved-success';
    test.plugin.markPending(file); await test.advance(2000);
    equal(test.actions.runs, 1); equal(test.metrics.reads, 0); equal(test.plugin.pendingChanges, true);
    equal(test.actions.statuses.at(-1).state, 'idle'); verify(test.actions.statuses.at(-1).text.includes('部分未完成'));
    equal(test.plugin.settings.lastSyncAt, 'preserved-success'); await test.advance(60000); equal(test.actions.runs, 1, 'An oversized file cannot cause rapid retries');
  }
  {
    const test = client([new TFile('failure.md', 'keep me')]);
    test.plugin.settings.lastSyncAt = 'prior-full-success';
    test.plugin.upload = async () => { throw new Error('Temporary network failure'); };
    test.plugin.markPending(test.store.get('failure.md')); await test.advance(2000);
    equal(test.actions.runs, 1); equal(test.plugin.lastSyncReport.errors.length, 1); equal(test.plugin.pendingChanges, true);
    equal(test.actions.statuses.at(-1).state, 'error'); equal(test.plugin.settings.lastSyncAt, 'prior-full-success');
    await test.advance(60000); equal(test.actions.runs, 1, 'Network failure waits for a real wake, event or periodic check rather than retrying forever');
    test.plugin.requestAutoSync(); await test.advance(300); equal(test.actions.runs, 2, 'A later explicit wake can retry the outstanding edit');
  }
  {
    const test = client(); const removed = new TFile('never-uploaded.md', 'local only');
    test.plugin.markPending(removed); await test.advance(2000);
    equal(test.actions.runs, 1); equal(test.actions.requests.length, 1); equal(test.actions.uploads.length, 0);
    equal(test.plugin.dirtyPaths.size, 0); equal(test.plugin.pendingChanges, false, 'A path absent on both sides no longer leaves a permanent dirty flag');
    await test.advance(60000); equal(test.actions.runs, 1);
  }
  {
    for (const mode of ['auto-off', 'confirmation', 'auth-pending', 'expired-token', 'no-account', 'account-mismatch', 'no-scope', 'expired-plan', 'logout', 'unload', 'cancel', 'account-change']) {
      const test = client([new TFile('a.md', 'a')]); test.plugin.markPending(test.store.get('a.md'));
      if (mode === 'auto-off') { test.plugin.settings.autoSync = false; test.plugin.configureAutoSync(); }
      if (mode === 'confirmation') test.plugin.settings.accountSwitchPending = true;
      if (mode === 'auth-pending') test.plugin.settings.pendingAuth = { state: 'fixture', verifier: 'fixture', createdAt: Date.now() };
      if (mode === 'expired-token') test.plugin.settings.tokenExpiresAt = Date.now() - 1;
      if (mode === 'no-account') test.plugin.settings.account = undefined;
      if (mode === 'account-mismatch') test.plugin.settings.stateAccountId = 'different-account';
      if (mode === 'no-scope') { test.plugin.settings.syncAllFolders = false; test.plugin.settings.selectedFolders = []; }
      if (mode === 'expired-plan') test.plugin.settings.account.syncWritesAllowed = false;
      if (mode === 'logout') await test.plugin.logout();
      if (mode === 'unload') test.plugin.onunload();
      if (mode === 'cancel') test.plugin.cancelSync();
      if (mode === 'account-change') { test.plugin.authEpoch++; test.plugin.settings.account = { ...test.plugin.settings.account, id: 'different-account' }; }
      await test.advance(5000); equal(test.actions.runs, 0, mode + ' must invalidate a pending automatic request');
    }
  }
  {
    const test = client([new TFile('pending.md', 'pending')]); const listeners = [];
    let ready;
    test.plugin.autoSyncReady = false;
    test.plugin.app.workspace = { onLayoutReady(callback) { ready = callback; } };
    test.plugin.registerDomEvent = (target, event, callback) => listeners.push({ target, event, callback });
    test.plugin.initializeAutoSync(); test.plugin.markPending(test.store.get('pending.md'));
    await test.advance(20000); equal(test.actions.runs, 0, 'No synchronization before Obsidian layout becomes ready');
    ready(); await test.advance(4999); equal(test.actions.runs, 0); await test.advance(301); equal(test.actions.runs, 1, 'The existing five-second startup delay is retained after layout readiness');
    const emit = async event => { for (const listener of listeners.filter(item => item.event === event)) listener.callback(); await settle(); };
    await emit('focus'); await emit('visibilitychange'); await test.advance(300); equal(test.actions.runs, 2, 'Foreground/focus notifications coalesce into a remote check');
    await emit('online'); await test.advance(300); equal(test.actions.runs, 3, 'Network recovery schedules a fresh remote check');
    test.plugin.markPending(test.store.get('pending.md')); test.document.hidden = true;
    await emit('visibilitychange'); equal(test.actions.runs, 4, 'Hiding starts best-effort work while JavaScript can still run');
    await Promise.all(test.actions.pending); await test.advance(3000); equal(test.actions.runs, 4);
    equal(listeners.filter(item => item.event === 'beforeunload').length, 0, 'No claim that unload can be blocked to finish mobile uploads');
  }
  {
    const test = client(); let ready;
    test.plugin.autoSyncReady = false;
    test.plugin.app.workspace = { onLayoutReady(callback) { ready = callback; } };
    test.plugin.registerDomEvent = () => {};
    test.plugin.initializeAutoSync(); ready(); test.plugin.cancelSync(); await test.advance(5300);
    equal(test.plugin.autoSyncReady, true); equal(test.actions.runs, 0, 'Stopping during startup suppresses the already planned initial sync without permanently disabling later synchronization');
    test.plugin.requestAutoSync(); await test.advance(300); equal(test.actions.runs, 1);
  }
  {
    const test = client(); let opened;
    // The same production method is exercised with a ticket URL; only approved
    // portal routes may replace its pathname, and query credentials remain intact.
    test.plugin.authorizedRequest = async () => ({ url: 'https://notecloud.asia/?ticket=fixture-ticket' });
    const portal = harness({ bundleSource: sourceBundle, runtime: { window: { open(url) { opened = url; } } } }).instance;
    portal.authorizedRequest = test.plugin.authorizedRequest;
    await portal.openWebPortal('/billing'); equal(new URL(opened).pathname, '/billing'); equal(new URL(opened).searchParams.get('ticket'), 'fixture-ticket');
    await portal.openWebPortal('/feedback'); equal(new URL(opened).pathname, '/feedback');
    await portal.openWebPortal('/unapproved'); equal(new URL(opened).pathname, '/');
  }
  {
    const test = client(['drop/a.md', 'drop/b.md', 'drop/c.md', 'keep/k.md'].map(path => new TFile(path, path)));
    test.plugin.settings.syncAllFolders = false; test.plugin.settings.selectedFolders = ['keep', 'drop'];
    test.plugin.settings.state['drop/c.md'] = { hash: 'preserved-hash', remoteRevision: 'preserved-revision' };
    const originalBaseline = JSON.stringify(test.plugin.settings.state['drop/c.md']);
    const started = deferred(), release = deferred(), upload = test.plugin.upload;
    let blocked = 0;
    test.plugin.upload = async (...args) => {
      if (args[0].path.startsWith('drop/')) { if (++blocked === 2) started.resolve(); await release.promise; test.plugin.checkRun(); }
      await upload(...args);
    };
    test.plugin.markPending(test.store.get('drop/a.md')); test.clock.tick(2000); await started.promise;
    test.plugin.settings.selectedFolders = ['keep'];
    await test.plugin.persistSyncScope();
    equal(test.plugin.syncRun.cancelled, true, 'Changing scope cancels the old run before persisting further work');
    equal(test.plugin.syncing, true, 'The old run retains the single-flight gate until in-flight work has settled');
    equal(test.actions.runs, 1);
    release.resolve(); await settle(); await Promise.all(test.actions.pending);
    equal(test.actions.uploads.length, 0, 'Old-scope queued jobs cannot upload after the scope changes');
    await test.advance(299); equal(test.actions.runs, 1);
    await test.advance(1); equal(test.actions.runs, 2, 'The saved new scope receives one fresh non-overlapping automatic pass');
    equal(test.actions.uploads.map(item => item.path), ['keep/k.md']);
    equal(test.plugin.pendingChanges, false, 'Ephemeral dirty paths outside the new selection do not leave a misleading pending status');
    equal(JSON.stringify(test.plugin.settings.state['drop/c.md']), originalBaseline, 'Removing a selection preserves its saved sync baseline and cloud history');
    await test.advance(60000); equal(test.actions.runs, 2, 'Scope change does not create a retry loop');
  }
  {
    const test = client([new TFile('drop/a.md', 'old scope'), new TFile('keep/k.md', 'new scope')]);
    test.plugin.settings.syncAllFolders = false; test.plugin.settings.selectedFolders = ['drop'];
    const started = deferred(), release = deferred();
    test.plugin.upload = async () => { started.resolve(); await release.promise; test.plugin.checkRun(); };
    test.plugin.markPending(test.store.get('drop/a.md')); test.clock.tick(2000); await started.promise;
    test.plugin.settings.selectedFolders = ['keep']; await test.plugin.persistSyncScope(); test.plugin.cancelSync();
    release.resolve(); await settle(); await Promise.all(test.actions.pending); await test.advance(60000);
    equal(test.actions.runs, 1, 'An explicit stop after changing scope cancels the newly requested follow-up too');
    equal(test.plugin.scopeSyncRequest, undefined);
  }
  {
    const test = client([new TFile('a.md', 'a')]); test.plugin.settings.autoSync = false;
    test.plugin.settings.syncAllFolders = false; test.plugin.settings.selectedFolders = ['/'];
    await test.plugin.persistSyncScope(); await test.advance(5000);
    equal(test.actions.runs, 0, 'Scope persistence never starts automatic sync when the setting is disabled');
    equal(test.plugin.settings.selectedFolders.join(','), '/');
    test.plugin.settings.autoSync = true; test.plugin.saveData = async () => { throw Error('isolated storage failure'); };
    await assert.rejects(test.plugin.persistSyncScope(), /isolated storage failure/); assertions++;
    equal(test.plugin.scopeSyncRequest, undefined, 'Failed scope persistence does not silently schedule a new pass');
    await test.advance(5000); equal(test.actions.runs, 0);
  }
  for (const saved of [false, true]) {
    const test = client([new TFile('drop/a.md', 'old scope'), new TFile('keep/k.md', 'new scope')]);
    test.plugin.settings.syncAllFolders = false; test.plugin.settings.selectedFolders = ['drop'];
    const started = deferred(), release = deferred();
    const upload = test.plugin.upload;
    test.plugin.upload = async (...args) => { if (args[0].path.startsWith('drop/')) { started.resolve(); await release.promise; test.plugin.checkRun(); } await upload(...args); };
    test.plugin.markPending(test.store.get('drop/a.md')); test.clock.tick(2000); await started.promise;
    let resolveSave, rejectSave, calls = 0;
    const blockedSave = new Promise((resolve, reject) => { resolveSave = resolve; rejectSave = reject; });
    // Separate the persistence completion from old-run cleanup explicitly. This
    // guards the scheduler even if a future storage adapter changes save queuing.
    test.plugin.saveSettings = async () => { if (++calls === 1) await blockedSave; };
    test.plugin.settings.selectedFolders = ['keep'];
    const persistence = test.plugin.persistSyncScope();
    const completion = saved ? persistence : assert.rejects(persistence, /delayed scope save failed/);
    equal(test.plugin.scopeSyncRequest.saved, false);
    release.resolve(); await settle(); await Promise.all(test.actions.pending); await test.advance(5000);
    equal(test.plugin.syncing, false);
    equal(test.actions.runs, 1, 'Old-run completion cannot restart sync before the new scope is durably saved');
    equal(test.plugin.scopeSyncRequest.saved, false, 'A not-yet-saved request remains pending rather than being consumed');
    test.plugin.requestAutoSync(); test.plugin.markPending(test.store.get('keep/k.md')); await test.advance(5000);
    equal(test.actions.runs, 1, 'Foreground/periodic wakes and edit events cannot bypass the pending-save barrier');
    await test.plugin.sync(true);
    equal(test.actions.requests.length, 1, 'Manual sync cannot bypass the pending-save barrier either');
    if (saved) resolveSave(); else rejectSave(Error('delayed scope save failed'));
    await completion;
    await test.advance(300);
    equal(test.actions.runs, saved ? 2 : 1, 'Only a successful delayed scope save can release the fresh pass');
    if (saved) equal(test.actions.uploads.map(item => item.path), ['keep/k.md']);
    equal(test.plugin.scopeSaveBlocked, !saved, 'Failed scope persistence stays blocked until the user saves again');
    if (!saved) {
      test.plugin.requestAutoSync(); test.plugin.markPending(test.store.get('keep/k.md')); await test.advance(5000); await test.plugin.sync(true);
      equal(test.actions.runs, 1, 'Later wakes and edits do not silently use a failed unsaved scope');
      equal(test.actions.requests.length, 1);
      await test.plugin.persistSyncScope(); await test.advance(300);
      equal(test.plugin.scopeSaveBlocked, false, 'An explicit successful scope save clears the failure barrier');
      equal(test.actions.runs, 2);
    }
    equal(test.plugin.scopeSyncRequest, undefined);
  }
  console.log(`PASS: ${assertions} virtual-clock and source-bundled real-harness auto-sync, cancellation, account, scope, lifecycle, pending-status and billing assertions; no network or release-asset writes`);
})().catch(error => { console.error(error); process.exitCode = 1; });
