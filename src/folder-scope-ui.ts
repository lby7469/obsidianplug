import { Setting } from "obsidian";
import type { ToggleComponent } from "obsidian";

type FolderScopeState = { syncAllFolders: boolean; selectedFolders: string[] };
type FolderEntry = { readonly path: string };
type FolderNode = { path: string; name: string; children: FolderNode[] };
type FolderView = {
  node: FolderNode;
  button?: HTMLButtonElement;
  childrenEl?: HTMLUListElement;
  childrenRendered: boolean;
};

let childrenSequence = 0;

// Folder paths have already passed selectableVaultFolders' exclusions and tree checks.
// This renderer never reads vault files or persists expansion state.
export function renderFolderScope(container: HTMLElement, folders: readonly FolderEntry[], state: FolderScopeState, persist: () => Promise<void>): void {
  const section = container.createDiv({ cls: "notecloud-folder-scope" });
  const controls: ToggleComponent[] = [];

  new Setting(section).setName("同步所有文件夹").setClass("notecloud-all-folders").addToggle(toggle => {
    toggle.toggleEl.setAttribute("aria-label", "同步所有文件夹");
    toggle.setValue(state.syncAllFolders).onChange(async value => {
      state.syncAllFolders = value;
      for (const control of controls) control.setDisabled(value);
      await persist();
    });
  });

  const addSelection = (setting: Setting, path: string, label: string) => setting.addToggle(toggle => {
    controls.push(toggle);
    toggle.toggleEl.setAttribute("aria-label", label);
    toggle.setValue(state.selectedFolders.includes(path)).setDisabled(state.syncAllFolders).onChange(async value => {
      state.selectedFolders = value ? [...new Set([...state.selectedFolders, path])] : state.selectedFolders.filter(selected => selected !== path);
      await persist();
    });
  });

  addSelection(new Setting(section).setName("根目录文件").setDesc("仅同步仓库根目录下的文件，不包括子文件夹。").setClass("notecloud-root-files"), "/", "同步根目录文件");

  section.createEl("p", { cls: "notecloud-folder-help", text: "勾选文件夹会同步其全部子文件夹；展开或收起只影响显示，不改变同步选择。" });

  const nodes = new Map<string, FolderNode>();
  for (const folder of folders) {
    const path = folder.path;
    if (!nodes.has(path)) nodes.set(path, { path, name: path.slice(path.lastIndexOf("/") + 1), children: [] });
  }
  const roots: FolderNode[] = [];
  for (const node of nodes.values()) {
    const split = node.path.lastIndexOf("/");
    const parent = split < 0 ? undefined : nodes.get(node.path.slice(0, split));
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  const compare = (left: FolderNode, right: FolderNode) => left.path.localeCompare(right.path);
  roots.sort(compare);
  for (const node of nodes.values()) node.children.sort(compare);

  const toolbar = section.createDiv({ cls: "notecloud-folder-toolbar" });
  toolbar.setAttribute("role", "group");
  toolbar.setAttribute("aria-label", "文件夹展开控制");
  const expandAll = toolbar.createEl("button", { type: "button", text: "全部展开" });
  const collapseAll = toolbar.createEl("button", { type: "button", text: "全部收起" });
  const hasBranches = roots.some(node => node.children.length > 0);
  expandAll.disabled = !hasBranches;
  collapseAll.disabled = !hasBranches;
  const tree = section.createEl("ul", { cls: "notecloud-folder-tree" });
  tree.setAttribute("aria-label", "同步文件夹");
  const expanded = new Set<string>();
  const views = new Map<string, FolderView>();

  const setExpanded = (view: FolderView, open: boolean) => {
    if (!view.button || !view.childrenEl) return;
    if (open && !view.childrenRendered) {
      renderNodes(view.node.children, view.childrenEl);
      view.childrenRendered = true;
    }
    if (open) expanded.add(view.node.path);
    else expanded.delete(view.node.path);
    view.childrenEl.hidden = !open;
    view.button.setAttribute("aria-expanded", String(open));
    view.button.setAttribute("aria-label", `${open ? "收起" : "展开"}文件夹：${view.node.path}`);
    view.button.classList.toggle("is-expanded", open);
  };

  const renderNodes = (children: readonly FolderNode[], list: HTMLUListElement) => {
    for (const node of children) {
      const item = list.createEl("li", { cls: "notecloud-folder-node" });
      item.dataset.folderPath = node.path;
      const setting = new Setting(item).setName(node.name).setClass("notecloud-folder-row");
      setting.nameEl.title = node.path;
      addSelection(setting, node.path, `同步文件夹：${node.path}`);
      const view: FolderView = { node, childrenRendered: false };
      views.set(node.path, view);
      if (node.children.length) {
        const childList = item.createEl("ul", { cls: "notecloud-folder-children" });
        childList.id = `notecloud-folder-children-${++childrenSequence}`;
        childList.hidden = true;
        childList.setAttribute("aria-label", `${node.path} 的子文件夹`);
        const button = setting.settingEl.createEl("button", { type: "button", cls: "notecloud-folder-expand" });
        button.setAttribute("aria-controls", childList.id);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", `展开文件夹：${node.path}`);
        const chevron = button.createSpan({ cls: "notecloud-folder-chevron", text: "›" });
        chevron.setAttribute("aria-hidden", "true");
        setting.settingEl.insertBefore(button, setting.settingEl.firstChild);
        view.button = button;
        view.childrenEl = childList;
        button.addEventListener("click", () => setExpanded(view, !expanded.has(node.path)));
      }
      else {
        const spacer = setting.settingEl.createSpan({ cls: "notecloud-folder-spacer" });
        spacer.setAttribute("aria-hidden", "true");
        setting.settingEl.insertBefore(spacer, setting.settingEl.firstChild);
      }
    }
  };

  renderNodes(roots, tree);
  expandAll.addEventListener("click", () => {
    const pending = [...roots];
    while (pending.length) {
      const node = pending.pop();
      if (!node) continue;
      const view = views.get(node.path);
      if (view) setExpanded(view, true);
      for (const child of node.children) pending.push(child);
    }
  });
  collapseAll.addEventListener("click", () => {
    for (const view of views.values()) setExpanded(view, false);
  });
  if (!roots.length) {
    section.createEl("p", { cls: "notecloud-folder-help", text: "暂无可展示的文件夹；根目录文件可单独设置。" });
  }
}
