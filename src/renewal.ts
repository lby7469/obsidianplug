import { Modal, Setting, setIcon, type App } from "obsidian";
import type { Account, PluginSettings, RenewalNotice } from "./plugin-types";

export interface RenewalPlugin {
  app: App;
  settings: PluginSettings;
  authCompleting?: boolean;
  disposed?: boolean;
  renewalButton?: HTMLButtonElement;
  renewalTop?: HTMLDivElement;
  openWebPortal(path: string): Promise<void>;
  refreshAccount(force: boolean): Promise<Account | undefined>;
  saveSettings(): Promise<void>;
}

export function currentNotice(plugin: RenewalPlugin): RenewalNotice | null {
  const settings = plugin.settings, account = settings.account;
  if ((!settings.token && !settings.refreshToken) || !account || settings.accountSwitchPending || plugin.authCompleting) return null;
  if (settings.stateAccountId && account.id !== settings.stateAccountId) return null;
  return account.renewalNotice || (account.syncWritesAllowed === false ? { title: "同步已暂停", message: "付费扩容已到期且已用空间超过永久免费额度。仍可在网页浏览、下载或清理文件；续费后恢复同步。", level: "critical" } : null);
}
function renderCard(plugin: RenewalPlugin, container: HTMLElement): void {
  container.empty();
  const notice = currentNotice(plugin);
  container.hidden = !notice;
  if (!notice) return;
  container.createEl("h3", { text: "续费提醒 · " + notice.title });
  container.createEl("p", { text: notice.message });
  new Setting(container).addButton(button => button.setButtonText("查看续费与记录").setCta().onClick(() => void plugin.openWebPortal("/billing"))).addButton(button => button.setButtonText("刷新状态").onClick(() => void plugin.refreshAccount(true)));
}
export function update(plugin: RenewalPlugin): void {
  if (typeof document === "undefined" || plugin.disposed) return;
  const notice = currentNotice(plugin);
  if (!plugin.renewalButton) {
    const button = document.body.createEl("button", { cls: "notecloud-renewal-button" });
    button.addEventListener("click", () => open(plugin)); plugin.renewalButton = button;
  }
  const button = plugin.renewalButton;
  button.hidden = !notice;
  button.empty(); setIcon(button, "credit-card");
  button.createSpan({ text: "续费" });
  button.toggleClass("is-critical", notice?.level === "critical");
  button.toggleClass("is-animated", !!notice && plugin.settings.renewalNoticeAnimation !== false);
  button.setAttribute("aria-label", notice ? "NoteCloud 续费提醒：" + notice.title : "NoteCloud 续费提醒");
  button.title = notice?.title || "续费提醒";
  if (plugin.renewalTop?.isConnected !== false && plugin.renewalTop) renderCard(plugin, plugin.renewalTop);
}
export function renderTop(plugin: RenewalPlugin, container: HTMLElement): void {
  plugin.renewalTop = container.createDiv({ cls: "notecloud-renewal-card" });
  renderCard(plugin, plugin.renewalTop);
}
export function open(plugin: RenewalPlugin): void {
  const modal = new Modal(plugin.app);
  modal.onOpen = () => {
    modal.contentEl.createEl("h2", { text: "空间与续费" });
    const notice = currentNotice(plugin), account = plugin.settings.account;
    modal.contentEl.createEl("p", { text: notice?.message || "当前无需续费。永久额度可继续使用，付费扩容到期后仅在超出永久额度时暂停同步。" });
    if (account?.subscription) modal.contentEl.createEl("p", { text: "扩容到期时间：" + new Date(account.subscription.expiresAt).toLocaleString() });
    modal.contentEl.createEl("p", { text: "目前由管理员手动登记续费。办理后返回插件，状态会自动刷新；也可以点击刷新状态。" });
    new Setting(modal.contentEl).addButton(button => button.setButtonText("查看记录 / 联系管理员").setCta().onClick(() => void plugin.openWebPortal("/billing"))).addButton(button => button.setButtonText("刷新状态").onClick(async () => { await plugin.refreshAccount(true); modal.contentEl.empty(); void modal.onOpen(); }));
  };
  modal.open();
}
export function settings(plugin: RenewalPlugin, container: HTMLElement): void {
  new Setting(container).setName("续费与服务期限").setDesc("续费提醒独立于公告。永久免费额度内可继续同步；扩容到期且超额时暂停同步，仍可在网页浏览和下载。").addButton(button => button.setButtonText("续费记录").onClick(() => void plugin.openWebPortal("/billing")));
  new Setting(container).setName("续费提醒动画").setDesc("控制右下角独立续费图标的动画，不影响公告；关闭动画后仍显示当前提醒。").addToggle(toggle => toggle.setValue(plugin.settings.renewalNoticeAnimation !== false).onChange(async value => { plugin.settings.renewalNoticeAnimation = value; await plugin.saveSettings(); update(plugin); }));
}
