const assert = require('node:assert/strict');
const { harness, TFile, TFolder, digest } = require('./test-harness.cjs');
const { testModule } = require('./test-module.cjs');

const { scopedVaultFiles, selectableVaultFolders } = testModule('vault-scope.ts', { obsidian: { TFile, TFolder } });
const selected = (...selectedFolders) => ({ syncAllFolders: false, selectedFolders });
const paths = entries => Array.from(entries, entry => entry.path).sort();
const groups = [];

function tree() {
  const root = new TFolder('');
  const notes = new TFolder('notes');
  const nested = new TFolder('notes/nested');
  const sibling = new TFolder('notes-other');
  const custom = new TFolder('.custom-settings');
  const trash = new TFolder('.trash');
  const fixtureFiles = [new TFile('root.md', 'root'), new TFile('notes/a.md', 'a'), new TFile('notes/nested/b.txt', 'b'), new TFile('notes/opaque.bin', 'opaque'), new TFile('notes/large.pdf', 'large'), new TFile('notes-other/private.md', 'private'), new TFile('.custom-settings/private.md', 'settings'), new TFile('.trash/deleted.md', 'deleted')];
  fixtureFiles[4].stat.size = 201 * 1024 * 1024;
  nested.children = [fixtureFiles[2]];
  notes.children = [fixtureFiles[1], nested, fixtureFiles[3], fixtureFiles[4]];
  sibling.children = [fixtureFiles[5]];
  custom.children = [fixtureFiles[6]];
  trash.children = [fixtureFiles[7]];
  root.children = [fixtureFiles[0], notes, sibling, custom, trash];
  const entries = new Map([root, notes, nested, sibling, custom, trash, ...fixtureFiles].map(entry => [entry.path, entry]));
  const calls = { all: 0, root: 0, lookups: [] };
  const vault = {
    configDir: '.custom-settings',
    getRoot() { calls.root++; return root; },
    getFiles() { calls.all++; return fixtureFiles; },
    getAbstractFileByPath(path) { calls.lookups.push(path); return entries.get(path) || null; },
  };
  return { vault, root, notes, nested, sibling, custom, trash, fixtureFiles, entries, calls };
}

function poisonChildren(folder, label) {
  Object.defineProperty(folder, 'children', { configurable: true, get() { throw Error('Unexpected traversal of ' + label); } });
}

function installSync(fixture, remote) {
  const plugin = fixture.instance;
  const actions = { requests: [], uploads: [], downloads: [], statuses: [] };
  plugin.settings.syncAllFolders = false;
  plugin.settings.selectedFolders = ['notes'];
  plugin.settings.stateAccountId = 'account-a';
  plugin.checkServiceStatus = async () => {};
  plugin.refreshAccount = async () => plugin.settings.account;
  plugin.setStatus = (...status) => actions.statuses.push(status);
  plugin.authorizedRequest = async (route, options) => {
    actions.requests.push({ route, method: options?.method || 'GET' });
    if (route === '/v1/sync/manifest') return { files: remote };
    throw Error('Unexpected write request: ' + route);
  };
  plugin.upload = async file => { actions.uploads.push(file.path); };
  plugin.download = async file => { actions.downloads.push(file.path); };
  return actions;
}

(async () => {
  {
    const fixture = tree();
    fixture.vault.getRoot = () => { throw Error('Selected-folder sync must not inspect the vault root'); };
    fixture.vault.getFiles = () => { throw Error('Selected-folder sync must not enumerate the whole vault'); };
    for (const folder of [fixture.sibling, fixture.custom, fixture.trash]) poisonChildren(folder, folder.path);
    assert.deepEqual(paths(scopedVaultFiles(fixture.vault, selected('notes'))), ['notes/a.md', 'notes/large.pdf', 'notes/nested/b.txt', 'notes/opaque.bin']);
    assert.ok(fixture.calls.lookups.every(path => path === 'notes' || path === 'notes/nested'));
    assert.ok(fixture.calls.lookups.includes('notes/nested'));
    groups.push('selected-folder traversal never queries root, whole-vault files, or sibling children; keeps all in-scope file types and sizes');
  }

  {
    const fixture = tree();
    for (const folder of [fixture.notes, fixture.sibling, fixture.custom, fixture.trash]) {
      poisonChildren(folder, 'root-only child');
      Object.defineProperty(folder, 'path', { get() { throw Error('Root-files selection must not inspect child-folder paths'); } });
    }
    assert.deepEqual(paths(scopedVaultFiles(fixture.vault, selected('/'))), ['root.md']);
    assert.equal(fixture.calls.all, 0);
    assert.deepEqual(fixture.calls.lookups, []);
    groups.push('root selection discovers root files only, without descending into or reading child-folder paths');
  }

  {
    const fixture = tree();
    assert.deepEqual(paths(scopedVaultFiles(fixture.vault, selected('notes/nested', 'notes', 'notes', '/'))), ['notes/a.md', 'notes/large.pdf', 'notes/nested/b.txt', 'notes/opaque.bin', 'root.md']);
    assert.ok(!fixture.calls.lookups.includes('notes-other'));
    assert.deepEqual(paths(scopedVaultFiles(fixture.vault, selected())), []);
    assert.equal(fixture.calls.all, 0);
    groups.push('nested and repeated selections deduplicate, prefix siblings remain excluded, and no selection does not mean all files');
  }

  {
    const fixture = tree();
    const settings = new TFolder('notes/.settings');
    const hidden = new TFile('notes/.settings/private.md', 'private');
    settings.children = [hidden];
    fixture.notes.children.push(settings);
    fixture.entries.set(settings.path, settings);
    fixture.entries.set(hidden.path, hidden);
    fixture.vault.configDir = settings.path;
    poisonChildren(settings, 'nested configuration directory');
    assert.deepEqual(paths(scopedVaultFiles(fixture.vault, selected('notes'))), ['notes/a.md', 'notes/large.pdf', 'notes/nested/b.txt', 'notes/opaque.bin']);
    for (const forbidden of ['notes/.settings', '.trash', '.trash/deleted.md']) assert.throws(() => scopedVaultFiles(fixture.vault, selected(forbidden)), /同步文件夹暂不可用/);
    groups.push('nested custom configuration and trash selections are rejected and excluded subtrees are never descended');
  }

  {
    for (const invalid of ['', '.', '..', './notes', 'notes/..', 'notes//nested', 'notes/', '/notes', 'notes\\nested', 'missing', 'notes/a.md', '.custom-settings', '.trash', '.trash/deleted.md']) {
      const fixture = tree();
      assert.throws(() => scopedVaultFiles(fixture.vault, selected(invalid)), /同步文件夹暂不可用/, 'Must reject unsafe or unavailable selection ' + JSON.stringify(invalid));
      assert.equal(fixture.calls.all, 0);
    }
    for (const fault of ['not-a-folder', 'missing-children', 'unexpected-child', 'misparented-child', 'stale-at-start', 'changed-after-walk']) {
      const fixture = tree();
      if (fault === 'not-a-folder') fixture.entries.set('notes', new TFile('notes', 'not a folder'));
      if (fault === 'missing-children') fixture.notes.children = undefined;
      if (fault === 'unexpected-child') fixture.notes.children.push({ path: 'notes/opaque' });
      if (fault === 'misparented-child') fixture.notes.children.push(new TFile('notes-other/wrong.md', 'wrong'));
      if (fault === 'stale-at-start') {
        const read = fixture.vault.getAbstractFileByPath;
        let count = 0;
        fixture.vault.getAbstractFileByPath = path => path === 'notes' && ++count > 1 ? new TFolder('notes') : read(path);
      }
      if (fault === 'changed-after-walk') {
        const read = fixture.vault.getAbstractFileByPath;
        let count = 0;
        fixture.vault.getAbstractFileByPath = path => path === 'notes' && ++count > 2 ? new TFolder('notes') : read(path);
      }
      assert.throws(() => scopedVaultFiles(fixture.vault, selected('notes')), /同步文件夹暂不可用/, fault + ' must not become an empty-success snapshot');
    }
    groups.push('malformed, missing, file-valued, corrupt, misparented and stale selections fail closed');
  }

  {
    const fixture = tree();
    for (const file of fixture.fixtureFiles) Object.defineProperty(file, 'path', { get() { throw Error('Folder picker must not read file paths'); } });
    poisonChildren(fixture.custom, 'configuration');
    poisonChildren(fixture.trash, 'trash');
    assert.deepEqual(paths(selectableVaultFolders(fixture.vault)), ['notes', 'notes-other', 'notes/nested']);
    assert.equal(fixture.calls.all, 0);
    groups.push('folder picker reads only folder paths and skips configuration and trash subtrees');
  }

  {
    const fixture = tree();
    const expected = fixture.vault.getFiles();
    fixture.calls.all = 0;
    fixture.vault.getRoot = () => { throw Error('Full-vault mode should use its explicit getFiles snapshot'); };
    assert.equal(scopedVaultFiles(fixture.vault, { syncAllFolders: true, selectedFolders: [] }), expected);
    assert.equal(fixture.calls.all, 1);
    groups.push('whole-vault mode remains explicit and performs exactly one getFiles call');
  }

  {
    const fixture = harness();
    const cloud = { path: 'notes/cloud.md', revision: digest('cloud'), size: 5 };
    const actions = installSync(fixture, [cloud]);
    fixture.instance.settings.state[cloud.path] = { hash: cloud.revision, remoteRevision: cloud.revision };
    fixture.instance.app.vault.getFiles = () => { throw Error('Missing selection must never fall back to whole-vault enumeration'); };
    fixture.instance.app.vault.getRoot = () => { throw Error('Missing selection must never fall back to the root'); };
    await fixture.instance.sync(false);
    assert.deepEqual(actions.requests.map(request => request.method), ['GET']);
    assert.deepEqual(actions.uploads, []);
    assert.deepEqual(actions.downloads, []);
    assert.equal(fixture.metrics.reads, 0);
    assert.equal(fixture.instance.lastSyncReport.completed, 0);
    assert.equal(fixture.instance.settings.state[cloud.path].remoteRevision, cloud.revision);
    assert.equal(fixture.instance.pendingChanges, true);
    assert.ok(actions.statuses.some(([message]) => /同步文件夹暂不可用/.test(message)));
    groups.push('real sync with a missing selected folder pauses without upload, download, file reads or cloud deletion');
  }

  {
    const existing = new TFile('notes/keep.md', 'keep');
    const fixture = harness({ files: [existing] });
    const cloud = { path: 'notes/collision.md', revision: digest('cloud'), size: 5 };
    const actions = installSync(fixture, [cloud, { path: existing.path, revision: digest('keep'), size: 4 }]);
    fixture.instance.settings.state[cloud.path] = { hash: cloud.revision, remoteRevision: cloud.revision };
    const lookup = fixture.instance.app.vault.getAbstractFileByPath;
    const occupied = new TFolder(cloud.path);
    fixture.instance.app.vault.getAbstractFileByPath = path => path === cloud.path ? occupied : lookup(path);
    await fixture.instance.sync(false);
    assert.deepEqual(actions.requests.map(request => request.method), ['GET']);
    assert.deepEqual(actions.uploads, []);
    assert.deepEqual(actions.downloads, []);
    assert.equal(fixture.instance.settings.state[cloud.path].remoteRevision, cloud.revision);
    groups.push('real sync respects a folder occupying a remote file path instead of overwriting it or deleting cloud content');
  }

  {
    const large = new TFile('notes/large.pdf', 'large');
    large.stat.size = 201 * 1024 * 1024;
    const opaque = new TFile('notes/opaque.bin', 'opaque');
    const fixture = harness({ files: [large, opaque] });
    const remote = [large, opaque].map(file => ({ path: file.path, revision: digest(file.content), size: file.stat.size }));
    const actions = installSync(fixture, remote);
    fixture.instance.settings.maxFileSizeMB = 200;
    for (const file of remote) fixture.instance.settings.state[file.path] = { hash: file.revision, remoteRevision: file.revision };
    await fixture.instance.sync(false);
    assert.deepEqual(actions.requests.map(request => request.method), ['GET']);
    assert.deepEqual(actions.uploads, []);
    assert.deepEqual(actions.downloads, []);
    assert.equal(fixture.metrics.reads, 0);
    assert.equal(fixture.instance.lastSyncReport.skipped, 1);
    for (const file of remote) assert.equal(fixture.instance.settings.state[file.path].remoteRevision, file.revision);
    groups.push('real sync never reads or deletes oversized or unsupported local files');
  }

  {
    const file = new TFile('notes/removed-during-run.md', 'same');
    const fixture = harness({ files: [file] });
    const cloud = { path: file.path, revision: digest('same'), size: 4 };
    const actions = installSync(fixture, [cloud]);
    fixture.instance.settings.state[cloud.path] = { hash: cloud.revision, remoteRevision: cloud.revision };
    const lookup = fixture.instance.app.vault.getAbstractFileByPath;
    fixture.instance.app.vault.getAbstractFileByPath = path => {
      if (path === cloud.path) fixture.store.delete(path);
      return lookup(path);
    };
    await fixture.instance.sync(false);
    assert.equal(fixture.store.has(cloud.path), false);
    assert.deepEqual(actions.requests.map(request => request.method), ['GET']);
    assert.deepEqual(actions.uploads, []);
    assert.deepEqual(actions.downloads, []);
    assert.equal(fixture.metrics.reads, 0);
    assert.equal(fixture.instance.settings.state[cloud.path].remoteRevision, cloud.revision);
    groups.push('the initial path snapshot prevents a mid-run local disappearance from becoming a cloud deletion');
  }

  {
    const existing = new TFile('notes/keep.md', 'keep');
    const fixture = harness({ files: [existing] });
    const cloud = { path: 'notes/arrived-during-run.md', revision: digest('arrived'), size: 7 };
    const actions = installSync(fixture, [cloud]);
    fixture.instance.settings.state[cloud.path] = { hash: cloud.revision, remoteRevision: cloud.revision };
    const read = fixture.instance.app.vault.readBinary;
    fixture.instance.app.vault.readBinary = async file => {
      fixture.store.set(cloud.path, new TFile(cloud.path, 'arrived'));
      return read(file);
    };
    await fixture.instance.sync(false);
    assert.deepEqual(actions.uploads, [existing.path]);
    assert.deepEqual(actions.requests.map(request => request.method), ['GET']);
    assert.deepEqual(actions.downloads, []);
    assert.equal(fixture.store.get(cloud.path).content.toString(), 'arrived');
    groups.push('a file created after the path snapshot is protected by the final point lookup');
  }

  console.log('PASS: ' + groups.length + ' vault-scope regression groups\n' + groups.map(group => '- ' + group).join('\n'));
})().catch(error => { console.error(error); process.exitCode = 1; });
