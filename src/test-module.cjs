// Test-only source loader. It never changes the shipped bundle or exports test hooks to users.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { buildSync } = require('esbuild');

function testModule(filename, { obsidian = {} } = {}) {
  assert.match(filename, /^[a-z][a-z0-9-]*\.ts$/i);
  const source = path.join(__dirname, filename);
  const contents = fs.readFileSync(source, 'utf8');
  const result = buildSync({
    stdin: { contents, loader: 'ts', sourcefile: source, resolveDir: __dirname },
    bundle: true, write: false, external: ['obsidian'], platform: 'node',
    target: 'es2018', format: 'cjs', logLevel: 'silent',
  });
  const module = { exports: {} };
  const context = vm.createContext({
    module, exports: module.exports, console, Error, URL, Headers,
    TextEncoder, TextDecoder, Uint8Array, ArrayBuffer,
    require: name => { assert.equal(name, 'obsidian'); return obsidian; },
    window: { setTimeout, clearTimeout, setInterval, clearInterval },
  });
  vm.runInContext(result.outputFiles[0].text, context, { filename: source, timeout: 10000 });
  return module.exports;
}

module.exports = { testModule };
