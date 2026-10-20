const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { buildSync } = require('esbuild');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>');
const document = dom.window.document;
// Obsidian's long-standing DOM helpers retain normal DOM parenting and text
// semantics. Install them only in this isolated JSDOM window's prototype.
dom.window.HTMLElement.prototype.createEl = function (tag, options = {}, callback) {
  if (typeof options === 'string') options = { cls: options };
  const element = this.ownerDocument.createElement(tag);
  if (options.text !== undefined) element.textContent = options.text;
  if (options.type !== undefined) element.setAttribute('type', options.type);
  if (options.cls) {
    const classes = Array.isArray(options.cls) ? options.cls : options.cls.split(/\s+/);
    element.classList.add(...classes.filter(Boolean));
  }
  for (const [name, value] of Object.entries(options.attr || {})) element.setAttribute(name, String(value));
  if (options.prepend) this.prepend(element);
  else this.append(element);
  if (callback) callback(element);
  return element;
};
dom.window.HTMLElement.prototype.createDiv = function (options, callback) { return this.createEl('div', options, callback); };
dom.window.HTMLElement.prototype.createSpan = function (options, callback) { return this.createEl('span', options, callback); };
let assertions = 0;
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); assertions++; };
const verify = (condition, message) => { assert.ok(condition, message); assertions++; };
const selection = state => Array.from(state.selectedFolders);
const stateSnapshot = state => JSON.stringify({ syncAllFolders: state.syncAllFolders, selectedFolders: selection(state) });

// Only public Setting/Toggle APIs are mocked; rendering, hidden ancestors,
// button clicks, checkbox changes and accessibility attributes use real DOM.
class Toggle {
  constructor(container) {
    this.toggleEl = document.createElement('input');
    this.toggleEl.type = 'checkbox';
    container.append(this.toggleEl);
    this.toggleEl.addEventListener('change', () => { if (this.changed) void this.changed(this.toggleEl.checked); });
  }
  setValue(value) { this.toggleEl.checked = value; return this; }
  setDisabled(value) { this.toggleEl.disabled = value; return this; }
  onChange(callback) { this.changed = callback; return this; }
}
class Button {
  constructor(container) {
    this.buttonEl = document.createElement('button');
    this.buttonEl.type = 'button';
    container.append(this.buttonEl);
    this.buttonEl.addEventListener('click', () => { if (this.clicked) void this.clicked(); });
  }
  setButtonText(text) { this.buttonEl.textContent = text; return this; }
  setDisabled(value) { this.buttonEl.disabled = value; return this; }
  onClick(callback) { this.clicked = callback; return this; }
}
class Setting {
  constructor(container) {
    this.settingEl = document.createElement('div');
    this.settingEl.className = 'setting-item';
    this.nameEl = document.createElement('div');
    this.nameEl.className = 'setting-item-name';
    this.descEl = document.createElement('div');
    this.descEl.className = 'setting-item-description';
    this.controlEl = document.createElement('div');
    this.controlEl.className = 'setting-item-control';
    this.settingEl.append(this.nameEl, this.descEl, this.controlEl);
    container.append(this.settingEl);
  }
  setName(name) { this.nameEl.textContent = name; return this; }
  setDesc(description) { this.descEl.textContent = description; return this; }
  setClass(name) { this.settingEl.classList.add(name); return this; }
  addToggle(configure) { configure(new Toggle(this.controlEl)); return this; }
  addButton(configure) { configure(new Button(this.controlEl)); return this; }
}
const moduleFixture = { exports: {} };
const compiled = buildSync({
  entryPoints: [path.join(__dirname, 'folder-scope-ui.ts')],
  bundle: true, format: 'cjs', platform: 'browser', target: 'es2018', write: false, external: ['obsidian'],
});
const context = vm.createContext({
  module: moduleFixture,
  exports: moduleFixture.exports,
  require: name => { assert.equal(name, 'obsidian'); return { Setting }; },
});
vm.runInContext(compiled.outputFiles[0].text, context, { timeout: 1000 });
const { renderFolderScope } = moduleFixture.exports;
verify(typeof renderFolderScope === 'function', 'Exercise the actual source module');

const longName = '学习笔记📝'.repeat(30);
const folders = [
  'alpha', 'alpha/beta', 'alpha/beta/deep', 'alpha/gamma', 'delta', 'delta/beta', 'delta/beta/deep', 'delta/epsilon', 'loose', longName,
  '<img src=x onerror=alert(1)>', '<img src=x onerror=alert(1)>/child',
].map(path => ({ path }));
const roots = ['alpha', 'delta', 'loose', '<img src=x onerror=alert(1)>', longName].sort();
const allPaths = folders.map(folder => folder.path).sort();

function fixture({ syncAllFolders = false, selectedFolders = ['/', 'alpha/beta', 'unavailable-preserved'], entries = folders } = {}) {
  const container = document.createElement('div');
  document.body.append(container);
  const state = { syncAllFolders, selectedFolders: [...selectedFolders] };
  const original = stateSnapshot(state);
  let saves = 0;
  const persist = async () => { saves++; };
  const render = () => { container.replaceChildren(); renderFolderScope(container, entries, state, persist); };
  render();
  const nodes = () => [...container.querySelectorAll('.notecloud-folder-node')];
  const visibleNodes = () => nodes().filter(node => !node.closest('[hidden]'));
  const paths = () => visibleNodes().map(node => node.dataset.folderPath).sort();
  const node = folderPath => nodes().find(candidate => candidate.dataset.folderPath === folderPath);
  const expand = folderPath => node(folderPath)?.querySelector(':scope > .notecloud-folder-row > .notecloud-folder-expand');
  const toggle = label => [...container.querySelectorAll('input[type=checkbox]')].find(input => input.getAttribute('aria-label') === label);
  const toolbar = text => [...container.querySelectorAll('.notecloud-folder-toolbar button')].find(button => button.textContent === text);
  return { container, state, original, render, nodes, paths, node, expand, toggle, toolbar, get saves() { return saves; } };
}
async function click(element) {
  verify(element, 'Requested DOM control exists');
  element.click();
  await Promise.resolve();
  await Promise.resolve();
}

(async () => {
  const tree = fixture();
  equal(tree.paths(), roots, 'Initially show only root-level folder rows');
  equal(tree.nodes().length, roots.length, 'Nested Setting controls are not rendered before expansion');
  equal(stateSnapshot(tree.state), tree.original, 'Opening settings preserves stored selections and sync-all state');
  equal(tree.saves, 0);
  equal(tree.toggle('同步根目录文件').checked, true, 'Root-level files remain an independent selection');
  equal(tree.toggle('同步文件夹：alpha').checked, false);
  verify(!tree.expand('loose'), 'Leaf folders have no misleading expansion button');
  equal(tree.expand('alpha').getAttribute('aria-expanded'), 'false');
  const controlled = document.getElementById(tree.expand('alpha').getAttribute('aria-controls'));
  verify(controlled?.hidden, 'Collapsed disclosure identifies its hidden child list');

  await click(tree.expand('alpha'));
  equal(tree.paths(), [...roots, 'alpha/beta', 'alpha/gamma'].sort(), 'Expanding a folder shows exactly one deeper level');
  equal(tree.node('alpha/beta/deep'), undefined, 'Grandchildren are created only when their own parent opens');
  equal(tree.expand('alpha').getAttribute('aria-expanded'), 'true');
  equal(tree.toggle('同步文件夹：alpha/beta').checked, true, 'A lazily created toggle restores the existing selection');
  equal(stateSnapshot(tree.state), tree.original, 'Expanding is a display-only action');
  await click(tree.expand('alpha/beta'));
  verify(tree.paths().includes('alpha/beta/deep'), 'Nested expansion works independently');
  await click(tree.expand('alpha'));
  equal(tree.paths(), roots, 'Collapsing a parent hides all of its descendants');
  equal(tree.saves, 0, 'Disclosure actions must never save sync selections');

  await click(tree.toolbar('全部展开'));
  equal(tree.paths(), allPaths, 'Expand all reveals every folder level');
  equal(tree.nodes().length, folders.length, 'Each folder row exists only once');
  for (const button of tree.container.querySelectorAll('.notecloud-folder-expand')) {
    equal(button.getAttribute('aria-expanded'), 'true');
    verify(!document.getElementById(button.getAttribute('aria-controls')).hidden);
    verify(button.getAttribute('aria-label').startsWith('收起文件夹：'));
  }
  await click(tree.toolbar('全部展开'));
  equal(tree.nodes().length, folders.length, 'Repeated expand-all is idempotent');
  await click(tree.toolbar('全部收起'));
  equal(tree.paths(), roots);
  for (const button of tree.container.querySelectorAll('.notecloud-folder-expand')) {
    equal(button.getAttribute('aria-expanded'), 'false', 'Collapse all clears nested expansion state');
    verify(document.getElementById(button.getAttribute('aria-controls')).hidden);
  }
  await click(tree.expand('alpha'));
  verify(!tree.paths().includes('alpha/beta/deep'), 'Opening a parent after collapse-all does not silently reopen grandchildren');
  equal(stateSnapshot(tree.state), tree.original);
  equal(tree.saves, 0);

  await click(tree.toolbar('全部展开'));
  const dangerousPath = '<img src=x onerror=alert(1)>';
  const dangerousName = tree.node(dangerousPath).querySelector(':scope > .notecloud-folder-row .setting-item-name');
  equal(dangerousName.textContent, dangerousPath, 'Folder names remain literal text');
  equal(dangerousName.title, dangerousPath, 'The full path remains available without parsing HTML');
  equal(tree.container.querySelector('img,script,iframe,svg'), null, 'Untrusted folder names do not create active markup');
  verify(tree.toggle('同步文件夹：' + dangerousPath), 'Special characters do not break accessible toggle labels');
  const longNameEl = tree.node(longName).querySelector(':scope > .notecloud-folder-row .setting-item-name');
  equal(longNameEl.textContent, longName, 'Long multilingual and emoji names are preserved');
  equal(longNameEl.title, longName);
  equal(tree.toggle('同步文件夹：' + longName).getAttribute('aria-label'), '同步文件夹：' + longName);
  equal(tree.node('alpha/beta').querySelector(':scope > .notecloud-folder-row .setting-item-name').textContent, 'beta');
  equal(tree.node('delta/beta').querySelector(':scope > .notecloud-folder-row .setting-item-name').textContent, 'beta');
  equal(tree.toggle('同步文件夹：alpha/beta').checked, true);
  equal(tree.toggle('同步文件夹：delta/beta').checked, false, 'Same-name folders under different parents have independent full-path selections');
  verify(tree.expand('alpha/beta').getAttribute('aria-controls') !== tree.expand('delta/beta').getAttribute('aria-controls'), 'Disclosure IDs cannot collide for same-name folders');

  const beforeRootChange = selection(tree.state).filter(path => path !== '/');
  await click(tree.toggle('同步根目录文件'));
  equal(selection(tree.state), beforeRootChange, 'Disabling root files changes only the standalone root marker');
  equal(tree.saves, 1);
  await click(tree.toggle('同步文件夹：alpha'));
  equal(selection(tree.state), [...beforeRootChange, 'alpha'], 'Selecting a folder does not rewrite child or unavailable selections');
  equal(tree.saves, 2);
  const parentSelected = stateSnapshot(tree.state);
  await click(tree.toolbar('全部收起'));
  await click(tree.toolbar('全部展开'));
  equal(stateSnapshot(tree.state), parentSelected, 'Expanding a selected parent does not create implicit child selections');
  equal(tree.toggle('同步文件夹：alpha/beta').checked, true);
  equal(tree.toggle('同步文件夹：alpha/gamma').checked, false, 'Only explicitly saved child selections receive checked toggles');
  equal(tree.saves, 2, 'Display actions on a selected parent do not persist');
  await click(tree.toggle('同步文件夹：alpha/beta'));
  equal(selection(tree.state), [...beforeRootChange.filter(path => path !== 'alpha/beta'), 'alpha'], 'A child toggle does not alter its parent selection');
  equal(tree.saves, 3);
  const afterSelection = stateSnapshot(tree.state);
  tree.render();
  equal(tree.paths(), roots, 'Reopening settings always starts fully collapsed');
  equal(tree.nodes().length, roots.length, 'Reopening does not eagerly restore old subtree controls');
  equal(stateSnapshot(tree.state), afterSelection);
  equal(tree.toggle('同步根目录文件').checked, false);
  equal(tree.toggle('同步文件夹：alpha').checked, true);
  equal(tree.saves, 3, 'Reopening causes no selection persistence');

  const disabled = fixture({ syncAllFolders: true });
  for (const input of disabled.container.querySelectorAll('.notecloud-root-files input,.notecloud-folder-row input')) {
    equal(input.disabled, true, 'Sync-all disables existing per-folder and root-file choices');
  }
  await click(disabled.expand('alpha'));
  equal(disabled.toggle('同步文件夹：alpha/beta').disabled, true, 'Lazily created controls obey sync-all too');
  await click(disabled.toggle('同步文件夹：alpha/beta'));
  equal(stateSnapshot(disabled.state), disabled.original, 'Clicking a disabled choice cannot alter the sync scope');
  equal(disabled.saves, 0);
  await click(disabled.toolbar('全部展开'));
  equal(disabled.paths(), allPaths, 'Display controls remain usable while all folders synchronize');
  equal(disabled.toggle('同步文件夹：alpha/beta/deep').disabled, true, 'A newly materialized grandchild stays disabled under sync-all');
  await click(disabled.toggle('同步所有文件夹'));
  equal(disabled.state.syncAllFolders, false);
  equal(selection(disabled.state), ['/', 'alpha/beta', 'unavailable-preserved'], 'Leaving sync-all restores, rather than resets, saved per-folder choices');
  equal(disabled.saves, 1);
  for (const input of disabled.container.querySelectorAll('.notecloud-root-files input,.notecloud-folder-row input')) {
    equal(input.disabled, false);
  }
  await click(disabled.toggle('同步所有文件夹'));
  equal(disabled.state.syncAllFolders, true);
  for (const input of disabled.container.querySelectorAll('.notecloud-root-files input,.notecloud-folder-row input')) {
    equal(input.disabled, true);
  }
  equal(disabled.saves, 2);

  const empty = fixture({ entries: [], selectedFolders: ['/'] });
  equal(empty.paths(), []);
  equal(empty.toolbar('全部展开').disabled, true);
  equal(empty.toolbar('全部收起').disabled, true);
  verify(empty.container.textContent.includes('暂无可展示的文件夹'));
  await click(empty.toggle('同步根目录文件'));
  equal(selection(empty.state), [], 'Root-file synchronization works even with no folders');
  equal(empty.saves, 1);

  const leaves = fixture({ entries: [{ path: 'one' }, { path: 'two' }], selectedFolders: [] });
  equal(leaves.paths(), ['one', 'two']);
  equal(leaves.toolbar('全部展开').disabled, true, 'Expand-all is disabled when nothing can expand');
  equal(leaves.toolbar('全部收起').disabled, true);

  const missingRows = fixture => [...fixture.container.querySelectorAll('.notecloud-unavailable-folder')];
  const missingRow = (fixture, folderPath) => missingRows(fixture).find(row => row.dataset.folderPath === folderPath);
  const cancelMissing = (fixture, folderPath) => missingRow(fixture, folderPath)?.querySelector('button');
  const dangerousMissing = '<svg onload=alert(1)>旧目录📝';
  const unavailable = fixture({ selectedFolders: ['/', 'alpha/beta', 'removed-old', dangerousMissing] });
  equal(stateSnapshot(unavailable.state), unavailable.original, 'Missing folders are never automatically removed from saved selections');
  equal(unavailable.saves, 0);
  equal(missingRows(unavailable).map(row => row.dataset.folderPath).sort(), ['removed-old', dangerousMissing].sort(), 'Only unavailable folders get a separate recovery control, not the root-file marker or known folders');
  verify(unavailable.container.querySelector('.notecloud-unavailable-folders').textContent.includes('不可用的已选文件夹'));
  equal(missingRow(unavailable, dangerousMissing).querySelector('.setting-item-name').textContent, dangerousMissing, 'Unavailable old paths render literally, including markup-like names');
  equal(unavailable.container.querySelector('svg,img,script'), null);
  equal(cancelMissing(unavailable, 'removed-old').textContent, '取消选择');
  equal(cancelMissing(unavailable, 'removed-old').disabled, false);
  await click(unavailable.toolbar('全部展开'));
  await click(unavailable.toolbar('全部收起'));
  equal(stateSnapshot(unavailable.state), unavailable.original, 'Display controls cannot implicitly remove unavailable selections');
  equal(unavailable.saves, 0);
  await click(cancelMissing(unavailable, 'removed-old'));
  equal(selection(unavailable.state), ['/', 'alpha/beta', dangerousMissing], 'Explicit cancellation removes only the selected missing path');
  equal(unavailable.saves, 1, 'Cancellation persists exactly once');
  equal(cancelMissing(unavailable, 'removed-old').textContent, '已取消');
  equal(cancelMissing(unavailable, 'removed-old').disabled, true, 'A completed cancellation cannot be repeated');
  await click(cancelMissing(unavailable, 'removed-old'));
  equal(unavailable.saves, 1);
  await click(unavailable.toggle('同步所有文件夹'));
  equal(unavailable.state.syncAllFolders, true);
  equal(cancelMissing(unavailable, dangerousMissing).disabled, true, 'Sync-all disables recovery controls without deleting old choices');
  equal(cancelMissing(unavailable, 'removed-old').disabled, true);
  const beforeDisabledCancel = stateSnapshot(unavailable.state);
  await click(cancelMissing(unavailable, dangerousMissing));
  equal(stateSnapshot(unavailable.state), beforeDisabledCancel);
  equal(unavailable.saves, 2, 'A disabled recovery button cannot save or change the scope');
  await click(unavailable.toggle('同步所有文件夹'));
  equal(cancelMissing(unavailable, dangerousMissing).disabled, false, 'Leaving sync-all restores active recovery controls');
  equal(cancelMissing(unavailable, 'removed-old').disabled, true, 'Leaving sync-all never re-enables already cancelled paths');
  equal(unavailable.saves, 3);
  await click(cancelMissing(unavailable, dangerousMissing));
  equal(selection(unavailable.state), ['/', 'alpha/beta'], 'Cancelling another missing path keeps known-folder and root-file choices');
  equal(unavailable.saves, 4);
  unavailable.render();
  equal(missingRows(unavailable).length, 0, 'Cancelled missing selections disappear after reopening settings');
  equal(selection(unavailable.state), ['/', 'alpha/beta']);
  equal(unavailable.saves, 4);

  const initiallyDisabled = fixture({ syncAllFolders: true, selectedFolders: ['/', 'alpha/beta', 'legacy-old'] });
  equal(cancelMissing(initiallyDisabled, 'legacy-old').disabled, true, 'Recovery choices are disabled from the first render when syncing all folders');
  await click(cancelMissing(initiallyDisabled, 'legacy-old'));
  equal(stateSnapshot(initiallyDisabled.state), initiallyDisabled.original);
  equal(initiallyDisabled.saves, 0);
  await click(initiallyDisabled.toggle('同步所有文件夹'));
  equal(cancelMissing(initiallyDisabled, 'legacy-old').disabled, false);
  await click(cancelMissing(initiallyDisabled, 'legacy-old'));
  equal(selection(initiallyDisabled.state), ['/', 'alpha/beta']);
  equal(initiallyDisabled.saves, 2, 'The explicit global-setting change and cancellation each save once');

  const onlyMissing = fixture({ entries: [], selectedFolders: ['/', 'gone-a', 'gone-b', dangerousMissing] });
  equal(onlyMissing.paths(), []);
  equal(missingRows(onlyMissing).length, 3, 'An empty folder tree still exposes all unavailable selections');
  equal(stateSnapshot(onlyMissing.state), onlyMissing.original);
  equal(onlyMissing.saves, 0);
  let expectedMissing = ['/', 'gone-a', 'gone-b', dangerousMissing];
  for (const [index, folderPath] of ['gone-a', dangerousMissing, 'gone-b'].entries()) {
    await click(cancelMissing(onlyMissing, folderPath));
    expectedMissing = expectedMissing.filter(path => path !== folderPath);
    equal(selection(onlyMissing.state), expectedMissing, 'Each cancellation is limited to the chosen unavailable path');
    equal(onlyMissing.saves, index + 1);
  }
  equal(selection(onlyMissing.state), ['/'], 'Clearing every unavailable folder never removes root-file selection');
  equal(onlyMissing.toggle('同步根目录文件').checked, true);
  equal(onlyMissing.container.querySelector('svg,img,script'), null, 'Unavailable paths remain safe text even in an empty vault');
  console.log(`PASS: ${assertions} real-DOM folder-scope disclosure, lazy rendering, accessibility, root-file, selection, disabled-state and safe-name assertions; no network requests`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => dom.window.close());
