import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const manifest = json('manifest.json');
assert.equal(manifest.id, 'notecloud-sync', 'Existing installations must retain their plugin ID');
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.equal(json('package.json').version, manifest.version);
assert.equal(json('package-lock.json').version, manifest.version);
assert.equal(json('package-lock.json').packages[''].version, manifest.version);
assert.equal(json('versions.json')[manifest.version], manifest.minAppVersion);
assert.equal(manifest.isDesktopOnly, false);
assert.ok(manifest.description.length <= 250 && manifest.description.endsWith('.'));
const bundle = read('main.js');
for (const file of ['LICENSE', 'licenses/DOMPurify-Apache-2.0.txt', 'licenses/Marked-LICENSE.md', 'licenses/node-diff3-LICENSE.md']) {
  const license = read(file).replace(/\r\n/g, '\n').replace(/\*\//g, '* /');
  assert.ok(bundle.includes(license), 'Complete bundled license missing: ' + file);
}
for (const entry of fs.readdirSync(path.join(root, 'src'))) {
  if (!entry.endsWith('.ts')) continue;
  const source = read('src/' + entry);
  assert.ok(!/@ts-(?:nocheck|ignore)|eslint-disable/.test(source), 'Do not silence runtime checks: ' + entry);
}
const dependencies = [...bundle.matchAll(/\brequire\(["']([^"']+)["']\)/g)].map(match => match[1]);
assert.ok(dependencies.length > 0);
assert.ok(dependencies.every(name => name === 'obsidian'), 'All other runtime dependencies must be bundled, not fetched');
const files = ['main.js', 'manifest.json', 'styles.css'].map(name => {
  const bytes = fs.readFileSync(path.join(root, name));
  assert.ok(bytes.length > 0 && bytes.length < 1024 * 1024);
  return { name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
});
console.log(JSON.stringify({ version: manifest.version, id: manifest.id, completed: true, files }));
