import DOMPurify from "dompurify";
import { Marked } from "marked";

const htmlEntities: Partial<Record<string, string>> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => htmlEntities[character] ?? character);
const parser = new Marked({ gfm: true, breaks: true, renderer: {
  image({ href, text }) { return `<a href="${escapeHtml(href)}">图片：${escapeHtml(text || "点击查看")}</a>`; },
} });

// Shared by the plugin, administrator preview and website. No vault embeds or remote image requests.
export function announcementFragment(message: string, format: string = "markdown"): DocumentFragment {
  const source = String(message || "").slice(0, 20000);
  const html = format === "text" ? `<p>${escapeHtml(source).replace(/\n/g, "<br>")}</p>` : parser.parse(source) as string;
  const fragment = DOMPurify.sanitize(html, {
    RETURN_DOM_FRAGMENT: true,
    ALLOWED_TAGS: ["p", "br", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "b", "i", "s", "del", "ul", "ol", "li", "blockquote", "pre", "code", "hr", "table", "thead", "tbody", "tr", "th", "td", "a", "sup", "sub"],
    ALLOWED_ATTR: ["href", "title"],
  });
  fragment.querySelectorAll<HTMLAnchorElement>("a").forEach(anchor => {
    const href = anchor.getAttribute("href") || "";
    try {
      if (!href || [...href].some(character => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127)) throw Error("Invalid link");
      if (href.startsWith("#")) return;
      if (!/^(https:\/\/|mailto:|\/(?!\/))/i.test(href)) throw Error("Unsupported link");
      const url = new URL(href, "https://notecloud.asia");
      if (!["https:", "mailto:"].includes(url.protocol) || url.username || url.password) throw Error("Unsupported link");
      anchor.href = url.href;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    } catch { anchor.removeAttribute("href"); }
  });
  return fragment;
}

/** Preserve the shared website/admin API without reparsing HTML inside the plugin. */
export function announcementHtml(message: string, format: string = "markdown"): string {
  const fragment = announcementFragment(message, format);
  return Array.from(fragment.childNodes, node => node.nodeType === 1 ? (node as Element).outerHTML : escapeHtml(node.textContent || "")).join("");
}
