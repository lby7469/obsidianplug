const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const sourcePath = path.join(__dirname, 'main.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const tree = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const settingsClass = tree.statements.find(node => ts.isClassDeclaration(node) && node.name?.text === 'NoteCloudSettingsTab');
assert.ok(settingsClass, 'Test the actual settings class');
const refreshDisplay = settingsClass.members.find(node => ts.isMethodDeclaration(node) && node.name.getText(tree) === 'refreshDisplay');
assert.ok(refreshDisplay?.body);
const statements = refreshDisplay.body.statements;
const first = statements.findIndex(node => ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => declaration.name.getText(tree) === 'serverMaxMb'));
const last = statements.findIndex(node => ts.isExpressionStatement(node)
  && ts.isCallExpression(node.expression)
  && node.expression.expression.getText(tree) === 'fileSizeSetting.addSlider');
assert.ok(first >= 0 && last > first, 'Exercise the production slider configuration, not a copied fixture');
const configuration = statements.slice(first, last + 1).map(node => node.getText(tree)).join('\n');
assert.doesNotMatch(source, /\.setDynamicTooltip\s*\(/, 'The deprecated API must not remain in plugin source');

let assertions = 4;
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); assertions++; };

async function checkSlider({ current, serverLimit, expectedLimit, next }) {
  const settings = [];
  let saves = 0;
  let savedValue;
  const s = { maxFileSizeMB: current, ...(serverLimit === undefined ? {} : { serviceStatus: { maxUploadBytes: serverLimit } }) };
  class Slider {
    setLimits(min, max, step) { this.limits = [min, max, step]; return this; }
    setValue(value) { this.value = value; return this; }
    onChange(callback) { this.changed = callback; return this; }
    // Deliberately expose no setDynamicTooltip or newly introduced slider API.
  }
  class Setting {
    constructor() { settings.push(this); this.descriptions = []; }
    setName(name) { this.name = name; return this; }
    setDesc(description) { this.description = description; this.descriptions.push(description); return this; }
    addSlider(configure) { this.slider = new Slider(); configure(this.slider); return this; }
  }
  const context = vm.createContext({ h: { Setting }, e: {}, s, fixture: { persist: async () => { saves++; savedValue = s.maxFileSizeMB; } } });
  const transpiled = ts.transpileModule(`(function () { ${configuration} }).call(fixture);`, {
    compilerOptions: { target: ts.ScriptTarget.ES2018, module: ts.ModuleKind.None },
  }).outputText;
  vm.runInContext(transpiled, context, { filename: sourcePath + ':slider-configuration', timeout: 1000 });
  equal(settings.length, 1);
  const setting = settings[0];
  equal(setting.name, '大文件上传上限');
  equal(setting.slider.limits, [1, expectedLimit, 1], 'Keep server upload limit and 1 MB steps');
  equal(setting.slider.value, Math.min(current, expectedLimit));
  equal(setting.description, `超过 ${current} MB 的文件暂不同步；服务端当前上限 ${expectedLimit} MB。移动端建议保持 50 MB 以下`);
  const completion = setting.slider.changed(next);
  equal(setting.description, `超过 ${next} MB 的文件暂不同步；服务端当前上限 ${expectedLimit} MB。移动端建议保持 50 MB 以下`, 'The selected limit is immediately visible even on older Obsidian versions');
  equal(s.maxFileSizeMB, next);
  await completion;
  equal(saves, 1, 'Changing the slider persists once');
  equal(savedValue, next);
  equal(setting.descriptions.length, 2, 'Update the existing description rather than rebuilding settings');
}

(async () => {
  await checkSlider({ current: 200, expectedLimit: 200, next: 83 });
  await checkSlider({ current: 50, serverLimit: 100 * 1024 * 1024, expectedLimit: 100, next: 24 });
  await checkSlider({ current: 200, serverLimit: 25 * 1024 * 1024, expectedLimit: 25, next: 19 });
  await checkSlider({ current: 50, serverLimit: 512 * 1024, expectedLimit: 1, next: 1 });
  console.log(`PASS: ${assertions} source-driven slider API, visible current-value, server-limit and persistence assertions`);
})().catch(error => { console.error(error); process.exitCode = 1; });
