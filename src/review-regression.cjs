const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { harness, TFile } = require('./test-harness.cjs');

(async () => {
  const css = fs.readFileSync(path.join(__dirname, '../styles.css'), 'utf8');
  assert.ok(!/!important\b/i.test(css), 'Plugin CSS must not need !important');
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
  const style = dom.window.document.createElement('style');
  // Test the actual renewal rules in isolation from theme and unsupported browser CSS.
  style.textContent = [...css.matchAll(/\.notecloud-renewal-(?:button|card)\b[^{}]*\{[^{}]*\}/g)].map(match => match[0]).join('\n');
  dom.window.document.head.append(style);
  for (const className of ['notecloud-renewal-button', 'notecloud-renewal-card']) {
    const element = dom.window.document.createElement('div');
    element.className = className;
    dom.window.document.body.append(element);
    assert.notEqual(dom.window.getComputedStyle(element).display, 'none');
    element.hidden = true;
    assert.equal(dom.window.getComputedStyle(element).display, 'none', 'Renewal hidden attribute must win without !important');
    element.hidden = false;
    assert.notEqual(dom.window.getComputedStyle(element).display, 'none', 'Renewal controls must reappear after unhide');
  }
  dom.window.close();

  const readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
  for (const heading of ['Installation', 'Basic usage', 'Account, payment and privacy', 'Contributors and project origin']) {
    assert.ok(readme.includes('## ' + heading), 'Keep English setup, usage and privacy instructions');
  }
  assert.ok(readme.includes('https://github.com/lby7469'), 'Retain genuine original-author credit');

  const files = ['notes/allowed.md', 'notes/nested/file.txt', 'notes/image.png', 'notes-other/private.md', 'root.md', '.custom-settings/private.md', '.trash/deleted.md', 'notes/unsupported.exe'].map(file => new TFile(file, 'fixture'));
  const oversized = new TFile('notes/large.pdf', 'fixture');
  oversized.stat.size = 201 * 1024 * 1024;
  const fixture = harness({ files: [...files, oversized] });
  const plugin = fixture.instance;
  plugin.app.vault.configDir = '.custom-settings';
  plugin.settings.syncAllFolders = false;
  plugin.settings.selectedFolders = ['notes'];
  plugin.settings.maxFileSizeMB = 200;
  plugin.settings.stateAccountId = 'account-a';
  assert.deepEqual(Array.from(plugin.files(), file => file.path), ['notes/allowed.md', 'notes/nested/file.txt', 'notes/image.png', 'notes/large.pdf']);
  let enumerations = 0;
  const getFiles = plugin.app.vault.getFiles;
  plugin.app.vault.getFiles = () => { enumerations++; return getFiles(); };
  const uploads = [];
  plugin.checkServiceStatus = async () => {};
  plugin.refreshAccount = async () => plugin.settings.account;
  plugin.authorizedRequest = async route => { assert.equal(route, '/v1/sync/manifest'); return { files: [] }; };
  plugin.upload = async file => { uploads.push(file.path); };
  await plugin.sync(false);
  assert.equal(enumerations, 1, 'One vault path snapshot must serve both conflict safety and upload discovery');
  assert.deepEqual(uploads.sort(), ['notes/allowed.md', 'notes/image.png', 'notes/nested/file.txt']);
  assert.equal(fixture.metrics.reads, 3, 'Excluded, unsupported and oversized files must not be read for upload');
  assert.equal(fixture.metrics.requests, 0, 'The review regression must never call a real service');
  console.log('PASS: renewal CSS hiding without !important, English setup and original-author credit; one vault enumeration with selected-scope, path, type and size safeguards');
})().catch(error => { console.error(error); process.exitCode = 1; });
