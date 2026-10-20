import { TFile, TFolder } from "obsidian";
import type { Vault } from "obsidian";
import { safeSyncPath } from "./sync-support";

type VaultTree = Pick<Vault, "configDir" | "getRoot" | "getFiles" | "getAbstractFileByPath">;
type SyncScope = { syncAllFolders: boolean; selectedFolders: readonly string[] };
const unavailable = () => new Error("同步文件夹暂不可用，为防止误删已暂停本次同步。请恢复文件夹或重新选择同步范围后重试。");

// Obsidian's cached folder tree is used only below explicitly selected roots.
// A failed/incomplete traversal must not become an empty snapshot and delete cloud files.
function walk(vault: VaultTree, starts: readonly TFolder[], recursive: boolean, root?: TFolder, includeFiles = true) {
  const files = new Map<string, TFile>(), folders = new Map<string, TFolder>();
  const pending = [...starts], visited = new Set<TFolder>();
  while (pending.length) {
    const folder = pending.pop();
    if (!folder || visited.has(folder)) continue;
    visited.add(folder);
    const isRoot = folder === root;
    const live = () => isRoot ? vault.getRoot() : vault.getAbstractFileByPath(folder.path);
    if (live() !== folder || !Array.isArray(folder.children)) throw unavailable();
    const prefix = isRoot ? "" : folder.path + "/";
    const children = folder.children.slice();
    for (const child of children) {
      if (!(child instanceof TFile) && !(child instanceof TFolder)) throw unavailable();
      if (child instanceof TFile && !includeFiles) continue;
      if (child instanceof TFolder && !recursive) continue;
      if (!child.path.startsWith(prefix)) throw unavailable();
      const relative = child.path.slice(prefix.length);
      if (!relative || relative.includes("/")) throw unavailable();
      if (!safeSyncPath(child.path, vault.configDir)) continue;
      if (child instanceof TFile) files.set(child.path, child);
      else if (recursive) {
        folders.set(child.path, child);
        pending.push(child);
      }
    }
    if (live() !== folder) throw unavailable();
  }
  return { files, folders };
}

export function scopedVaultFiles(vault: VaultTree, scope: SyncScope): TFile[] {
  // Whole-vault sync necessarily enumerates the vault. Keep that capability explicit.
  if (scope.syncAllFolders) return vault.getFiles();
  const selected = [...new Set(scope.selectedFolders)];
  const starts: TFolder[] = [], files = new Map<string, TFile>();
  for (const selectedPath of selected) {
    if (selectedPath === "/") {
      const root = vault.getRoot();
      if (!(root instanceof TFolder)) throw unavailable();
      for (const [path, file] of walk(vault, [root], false, root).files) files.set(path, file);
      continue;
    }
    if (!safeSyncPath(selectedPath, vault.configDir)) throw unavailable();
    // Avoid resolving redundant nested selections and never inspect sibling folders.
    if (selected.some(parent => parent !== selectedPath && parent !== "/" && selectedPath.startsWith(parent + "/"))) continue;
    const folder = vault.getAbstractFileByPath(selectedPath);
    if (!(folder instanceof TFolder) || folder.path !== selectedPath) throw unavailable();
    starts.push(folder);
  }
  for (const [path, file] of walk(vault, starts, true).files) files.set(path, file);
  return [...files.values()];
}

export function selectableVaultFolders(vault: VaultTree): TFolder[] {
  const root = vault.getRoot();
  if (!(root instanceof TFolder)) throw unavailable();
  return [...walk(vault, [root], true, root, false).folders.values()];
}
