import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const flag = process.argv.find(value => value.startsWith('--outfile='));
const outfile = flag ? path.resolve(flag.slice('--outfile='.length)) : path.join(root, 'main.js');
const notices = [
  ['NoteCloud Sync — MIT License (plugin client only)', 'LICENSE'],
  ['DOMPurify 3.4.14 — Copyright (c) Cure53 and other contributors; redistributed under Apache-2.0', 'licenses/DOMPurify-Apache-2.0.txt'],
  ['Marked 15.0.12 — MIT / Markdown attribution', 'licenses/Marked-LICENSE.md'],
  ['node-diff3 / Synchrotron-derived merge code — MIT; restored / adapted implementation', 'licenses/node-diff3-LICENSE.md'],
].map(([name, file]) => name + '\n' + fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n'));
const banner = '/*!\n' + notices.join('\n\n-----\n\n').replace(/\*\//g, '* /') + '\n*/';
await build({
  absWorkingDir: root, entryPoints: ['src/main.ts'], outfile,
  bundle: true, external: ['obsidian'], format: 'cjs', platform: 'node', target: 'es2018',
  legalComments: 'eof', banner: { js: banner }, logLevel: 'info',
});
