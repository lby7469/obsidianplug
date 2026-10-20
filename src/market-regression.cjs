const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { testModule } = require('./test-module.cjs');
const types = testModule('plugin-types.ts');
let assertions = 0;
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); assertions++; };

// The reference is test-only: old iOS must never parse a lookbehind in shipped code.
const reference = new RegExp('(?<=\\n)');
const samples = ['', 'a', '\n', '\r\n', 'a\n', '\n\n', 'a\nb', 'a\r\nb\r\n', '中文\n📝\n尾行', '\u0000\n\ud800'];
let seed = 217;
const alphabet = ['a', '\n', '\r', '中', '📝', '\u0000'];
for (let index = 0; index < 500; index++) {
  let value = '';
  for (let position = 0; position < index % 79; position++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    value += alphabet[seed % alphabet.length];
  }
  samples.push(value);
}
for (const value of samples) {
  equal(Array.from(types.splitLinesAfterLF(value)), value.split(reference), 'Line splitting preserves every terminator and final line');
  equal(types.splitLinesAfterLF(value).join(''), value, 'Line splitting is lossless');
}

const account = { id: 'fixture-a', usedBytes: 1024, quotaBytes: 100 * 1024 * 1024, subscription: null, renewalNotice: null };
equal(types.readAccount(account).id, account.id);
equal(types.readAccount(account).subscription, undefined);
equal(types.readAccount(account).renewalNotice, undefined);
const tokens = types.readTokens({ ...account, token: 'fixture-access', refreshToken: 'fixture-refresh', expiresIn: 3600 });
equal(tokens.token, 'fixture-access');
equal(tokens.quotaBytes, account.quotaBytes);
assert.throws(() => types.readTokens({ ...account, token: [] })); assertions++;
assert.throws(() => types.readManifest({ files: 'not-a-file-list' })); assertions++;
assert.throws(() => types.readManifest({ files: [{ path: 'a.md', revision: [], size: 1 }] })); assertions++;

equal(types.readUpload({ uploadId: 'fixture-upload', chunkSize: 4194304 }).uploadId, 'fixture-upload');
equal(types.readUpload({ complete: false, receivedBytes: 4 }, false).complete, false);
const completed = types.readUpload({ complete: true, record: { path: 'a.md', revision: 'fixture-hash', size: 4 } }, false);
equal(completed.record.path, 'a.md');
equal(completed.complete, true);
assert.throws(() => types.readUpload({ complete: false })); assertions++;

const defaults = {
  serverUrl: 'https://api.notecloud.asia', websiteUrl: 'https://notecloud.asia', phone: '', password: '', quotaCode: '',
  token: '', refreshToken: '', tokenExpiresAt: 0, state: {}, syncAllFolders: true, selectedFolders: [],
  autoSync: true, syncIntervalMinutes: 5, maxFileSizeMB: 100, conflictStrategy: 'keep-both', serviceNotices: true,
  lastServiceCheckAt: 0, seenAnnouncementIds: [], notifiedUpdateVersion: '',
};
const state = { 'note.md': { hash: 'local-hash', remoteRevision: 'cloud-hash', baseContent: 'unchanged base' } };
const normal = { ...defaults, token: 'fixture-preserved', refreshToken: 'fixture-refresh', state, selectedFolders: ['notes'], autoSync: false };
for (const patch of [
  { pendingAuth: [] }, { account: { id: false } }, { serviceStatus: { latestVersion: [] } },
  { announcementHistory: [null, {}, { id: 'ok', title: '公告', message: 'test', format: 'markdown' }] },
]) {
  const result = types.readSettings({ ...normal, ...patch }, defaults);
  equal(result.token, normal.token, 'Damaged optional cache must not erase a valid access token');
  equal(result.refreshToken, normal.refreshToken);
  equal(JSON.stringify(result.state), JSON.stringify(state), 'Damaged optional cache must not discard synchronization history');
  equal(Array.from(result.selectedFolders), ['notes']);
  equal(result.autoSync, false);
}
equal(types.readSettings(null, defaults).token, '');
equal(types.readSettings([], defaults).autoSync, defaults.autoSync);

const { Linter } = require('eslint');
const code = fs.readFileSync(path.join(__dirname, '../main.js'), 'utf8');
const syntaxErrors = new Linter().verify(code, [{ languageOptions: { ecmaVersion: 2018, sourceType: 'script' } }])
  .filter(item => item.fatal);
equal(syntaxErrors, [], 'The shipped bundle parses as ES2018, not just on the current Node version');
equal(/\(\?<([=!])/.test(code), false, 'The installed bundle must not contain regex lookbehind syntax');
equal(/@ts-(?:nocheck|ignore)/.test(fs.readFileSync(path.join(__dirname, 'main.ts'), 'utf8')), false);

console.log(`PASS: ${assertions} market compatibility, wire-schema, isolated cache and line-splitting assertions`);
