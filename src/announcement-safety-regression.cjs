const assert = require("node:assert/strict");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const { buildSync } = require("esbuild");

// An explicit package path can reuse an isolated test-only DOM installation.
// Neither JSDOM nor this test runner is bundled into the plugin.
const requireDom = createRequire(process.env.NOTECLOUD_DOM_PACKAGE || path.join(__dirname, "../package.json"));
const { JSDOM } = requireDom("jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://notecloud.asia/" });
const moduleFixture = { exports: {} };
const context = vm.createContext({
  module: moduleFixture,
  exports: moduleFixture.exports,
  window: dom.window,
  document: dom.window.document,
  URL: dom.window.URL,
  Element: dom.window.Element,
});
const compiled = buildSync({
  entryPoints: [path.join(__dirname, "announcement-markdown.ts")],
  bundle: true, format: "cjs", platform: "browser", target: "es2018", write: false,
});
vm.runInContext(compiled.outputFiles[0].text, context);
const { announcementFragment, announcementHtml } = moduleFixture.exports;
let checks = 0;
const verify = (condition, message) => { assert.ok(condition, message); checks++; };
const render = (source, format = "markdown", siteOrigin) => {
  const fragment = announcementFragment(source, format, siteOrigin);
  verify(fragment.nodeType === 11, "Renderer returns a DOM fragment");
  const body = dom.window.document.createElement("div");
  body.append(fragment);
  assert.equal(announcementHtml(source, format, siteOrigin), body.innerHTML, "Legacy HTML API matches direct DOM rendering");
  checks++;
  return body;
};

try {
  const rich = render("# 公告\n\n**重点**\n\n- 第一项\n- 第二项\n\n| 功能 | 状态 |\n| --- | --- |\n| 同步 | 正常 |\n\n```js\nconsole.log('ok')\n```");
  verify(rich.querySelector("h1")?.textContent === "公告", "Markdown headings preserved");
  verify(rich.querySelector("strong")?.textContent === "重点", "Markdown emphasis preserved");
  verify(rich.querySelectorAll("li").length === 2, "Markdown lists preserved");
  verify(rich.querySelectorAll("table td").length === 2, "Markdown tables preserved");
  verify(rich.querySelector("pre code")?.textContent.includes("console.log"), "Code blocks preserved");

  const attacks = [
    '<script>alert("x")</script><p onclick="alert(1)">hello</p>',
    '<img src="https://invalid.test/track.png" onerror="alert(1)">',
    '<svg><a xlink:href="javascript:alert(1)">bad</a></svg>',
    '<iframe src="https://invalid.test"></iframe><object data="x"></object>',
    '<form action="https://invalid.test"><input name="password"></form>',
    '<style>body{display:none}</style><p style="display:none">text</p>',
    '[bad](javascript:alert%281%29)',
    '<a href="javascript:alert(1)">bad</a>',
    '<a href="java&#x09;script:alert(1)">bad</a>',
    '<a href="data:text/html;base64,PHNjcmlwdD4=">bad</a>',
    '<a href="obsidian://open?vault=private">bad</a>',
    '<a href="file:///C:/private.txt">bad</a>',
    '<a href="//invalid.test/path">bad</a>',
    '<a href="https://user:password@invalid.test/path">bad</a>',
    '<a href="https://invalid.test/&#10;path">bad</a>',
  ];
  for (const attack of attacks) {
    const output = render(attack);
    verify(!output.querySelector("script,img,svg,iframe,object,form,input,style"), "Active elements and remote images removed");
    for (const element of output.querySelectorAll("*")) {
      verify([...element.attributes].every(attribute => !attribute.name.startsWith("on") && attribute.name !== "style"), "Event handlers and inline styles removed");
    }
    verify(!output.querySelector("a[href]"), "Dangerous links are not navigable");
  }

  const links = render('[HTTPS](https://example.org/path) [mail](mailto:hello@example.org) [relative](/help) [section](#part) ![Picture](https://example.org/image.png)');
  verify(links.querySelectorAll("a[href]").length === 5, "Safe links and image-as-link preserved");
  verify(links.querySelectorAll("img").length === 0, "Markdown pictures never load automatically");
  verify(links.querySelector('a[href="https://notecloud.cloud/help"]'), "Relative links use the new official site even in an old-domain document");
  for (const anchor of links.querySelectorAll('a[target="_blank"]')) {
    verify(anchor.rel === "noopener noreferrer", "External links cannot access opener");
  }
  for (const origin of ['https://custom.example', 'https://CUSTOM.EXAMPLE/', 'https://custom.example:9443', 'https://notecloud.asia']) {
    const custom = render('[relative](/help) [absolute](https://example.org/read) [bad](javascript:alert%281%29) ![image](https://example.org/img.png)', 'markdown', origin);
    verify(custom.querySelector(`a[href="${new URL(origin).origin}/help"]`), 'Custom and explicit legacy HTTPS sites retain their own relative-link origin');
    verify(custom.querySelector('a[href="https://example.org/read"]'), 'Explicit safe links retain their destinations');
    verify(!custom.querySelector('a[href^="javascript:"],img'), 'A custom site does not weaken link or image sanitation');
    verify(custom.querySelector('a[href$="/help"]').rel === 'noopener noreferrer', 'Relative links keep opener isolation');
  }
  for (const origin of ['', 'invalid', 'http://custom.example', 'javascript:alert(1)', 'https://user:secret@custom.example', 'https://custom.example/path', 'https://custom.example/?x=1', 'https://custom.example/#part']) {
    const invalid = render('[relative](/help) <a href="//evil.invalid">bad</a>', 'markdown', origin);
    verify(invalid.querySelector('a[href="https://notecloud.cloud/help"]'), 'Invalid configured origins safely fall back to the official HTTPS site');
    verify(invalid.querySelectorAll('a[href]').length === 1, 'Unsafe links stay non-navigable with invalid configuration');
  }
  const plain = render('<script>private</script>\n**not markdown** & <literal>', "text");
  verify(plain.textContent === '<script>private</script>**not markdown** & <literal>', "Legacy text stays literal");
  verify(!plain.querySelector("script,strong"), "Legacy text is not reinterpreted as HTML or Markdown");
  const truncated = render("a".repeat(20000) + "DO_NOT_INCLUDE", "text");
  verify(!truncated.textContent.includes("DO_NOT_INCLUDE"), "Announcement source remains bounded to 20,000 characters");
  const textNodes = render("prefix & text <em>safe</em> suffix");
  verify(textNodes.textContent.trimEnd() === "prefix & text safe suffix", "Text nodes survive legacy serialization");
  console.log(`PASS: ${checks} real-DOM announcement safety and rendering checks; no network resources enabled`);
} finally {
  dom.window.close();
}
