import { Modal, Notice, Setting, type App } from "obsidian";
import { errorMessage, objectValue, readAccount, stringValue, type Account, type PluginSettings, type RequestOptions } from "./plugin-types";
import { reconcileStorageEpoch } from "./storage-epoch";

interface ResetPlugin {
  app: App;
  settings: PluginSettings;
  authEpoch: number;
  authCompleting?: boolean;
  disposed: boolean;
  syncing: boolean;
  vaultResetting: boolean;
  digestCache: { clear(): void };
  dirtyPaths: { clear(): void };
  pendingChanges: boolean;
  syncedThisSession: boolean;
  cancelSync(): void;
  configureAutoSync(): void;
  saveSettings(): Promise<void>;
  refreshAccount(force: boolean): Promise<Account | undefined>;
  authorizedRequest(route: string, options?: RequestOptions): Promise<unknown>;
  setStatus(text: string, state: "idle" | "error" | "success"): void;
  settingsTab?: { refreshDisplay(): void };
}
interface Confirmation { confirmationId: string; storageEpoch: number; files: number; usedBytes: number; message: string; confirmationPhrase: string }

/** A confirmation is bound to this session, account, server and remote generation. */
export class VaultResetFlow {
  private readonly epoch: number;
  private readonly server: string;
  private readonly accountId: string;
  private closed = false;
  private confirmation?: Confirmation;
  busy = false;
  constructor(private readonly plugin: ResetPlugin) {
    const s = plugin.settings;
    if (plugin.vaultResetting) throw new Error("已有清空操作，请先关闭原确认窗口");
    if (plugin.disposed || plugin.authCompleting || !s.account?.id || (!s.token && !s.refreshToken) || s.pendingAuth || s.accountSwitchPending) throw new Error("请先完成当前账号的登录");
    this.epoch = plugin.authEpoch || 0; this.server = s.serverUrl; this.accountId = s.account.id;
    plugin.vaultResetting = true;
  }
  private assertCurrent(): void {
    const p = this.plugin;
    if (this.closed || p.disposed || p.authCompleting || (p.authEpoch || 0) !== this.epoch || p.settings.serverUrl !== this.server || p.settings.account?.id !== this.accountId || p.settings.pendingAuth || p.settings.accountSwitchPending) throw new Error("账号或服务入口已变化，请重新打开清空窗口");
  }
  async prepare(): Promise<Confirmation> {
    this.assertCurrent(); if (this.busy) throw new Error("操作进行中，请稍候");
    this.busy = true; this.confirmation = undefined;
    try {
      // Persist the pause before requesting a destructive-operation confirmation.
      const p = this.plugin; p.settings.autoSync = false; p.cancelSync(); p.configureAutoSync(); await p.saveSettings();
      const deadline = Date.now() + 30000;
      while (p.syncing) {
        this.assertCurrent(); if (Date.now() > deadline) throw new Error("同步仍在停止中，请稍后重新确认；自动同步已暂停");
        await new Promise<void>(resolve => window.setTimeout(resolve, 50));
      }
      this.assertCurrent(); const account = await p.refreshAccount(true); this.assertCurrent();
      if (!account || account.id !== this.accountId) throw new Error("无法确认当前账号，请稍后再试");
      const data = objectValue(await p.authorizedRequest("/v1/account/vault-reset/prepare", { method: "POST", body: "{}" }));
      this.assertCurrent();
      for (const field of ["storageEpoch", "files", "usedBytes"] as const) if (!Number.isSafeInteger(data[field]) || Number(data[field]) < 0) throw new Error("服务器返回的清空确认信息异常");
      const proof: Confirmation = { confirmationId: stringValue(data.confirmationId), confirmationPhrase: stringValue(data.confirmationPhrase), message: stringValue(data.message), storageEpoch: Number(data.storageEpoch), files: Number(data.files), usedBytes: Number(data.usedBytes) };
      if (proof.confirmationId.length < 16 || proof.confirmationPhrase !== "清空云端笔记" || proof.storageEpoch !== (p.settings.stateStorageEpoch || 0)) throw new Error("仓库状态已变化，请重新确认");
      this.confirmation = proof; return proof;
    } finally { this.busy = false; }
  }
  async confirm(phrase: string): Promise<void> {
    this.assertCurrent(); const proof = this.confirmation;
    if (this.busy || !proof || phrase !== proof.confirmationPhrase) throw new Error("请输入完整的确认文字");
    this.busy = true;
    // A failed/ambiguous request always needs a fresh server confirmation.
    this.confirmation = undefined;
    try {
      const p = this.plugin;
      const result = objectValue(await p.authorizedRequest("/v1/account/vault-reset/confirm", { method: "POST", body: JSON.stringify({ confirmationId: proof.confirmationId, storageEpoch: proof.storageEpoch, phrase }) }));
      this.assertCurrent(); const account = readAccount(result.account);
      if (result.ok !== true || account.id !== this.accountId || account.storageEpoch !== proof.storageEpoch + 1 || result.storageEpoch !== account.storageEpoch || account.usedBytes !== 0) throw new Error("未能核对清空结果，请刷新账号状态后检查；自动同步保持暂停");
      reconcileStorageEpoch(p.settings, account); p.settings.account = account; p.settings.autoSync = false;
      p.digestCache.clear(); p.dirtyPaths.clear(); p.pendingChanges = true; p.syncedThisSession = false;
      await p.saveSettings(); this.assertCurrent();
      p.setStatus("云端仓库已清空，自动同步已暂停，本地笔记已保留", "idle");
    } finally { this.busy = false; }
  }
  close(): boolean {
    if (this.closed) return true;
    if (this.busy) return false;
    this.closed = true; this.confirmation = undefined; this.plugin.vaultResetting = false; return true;
  }
}

export function openVaultReset(plugin: ResetPlugin): void {
  let flow: VaultResetFlow;
  try { flow = new VaultResetFlow(plugin); } catch (error) { new Notice(errorMessage(error)); return; }
  const modal = new Modal(plugin.app), root = modal.contentEl;
  root.addClass("notecloud-vault-reset");
  root.createEl("h2", { text: "清空云端仓库" });
  root.createEl("p", { text: "当前账号：" + (plugin.settings.account?.displayName || plugin.settings.account?.phone || "已登录账号") });
  root.createEl("p", { text: "将删除此账号服务端仓库中的全部笔记、附件和历史版本，并移除相关分享。此操作无法自行撤销。设备中的本地笔记、账号和存储额度会保留。" });
  root.createEl("p", { text: "请先下载或备份需要保留的内容，并暂停其他设备同步。继续后，本设备自动同步也会暂停；需要重新上传时，请先调整同步范围，再手动同步或开启自动同步。" });
  const details = root.createDiv(), errorEl = root.createEl("p", { attr: { role: "alert" } });
  let proof: Confirmation | undefined, phrase = "";
  const actions = new Setting(root);
  actions.addButton(button => {
    button.setButtonText("暂停同步并继续").onClick(async () => {
      button.setDisabled(true); errorEl.textContent = "";
      try {
        if (!proof) {
          proof = await flow.prepare(); details.empty();
          details.createEl("p", { text: `${proof.files} 个当前文件，合计 ${(proof.usedBytes / 1024 / 1024).toFixed(2)} MB。自动同步已暂停。` });
          new Setting(details).setName("输入“清空云端笔记”确认").addText(input => input.setPlaceholder("清空云端笔记").onChange(value => { phrase = value; button.setDisabled(flow.busy || phrase !== proof?.confirmationPhrase); }));
          button.setButtonText("确认清空云端仓库").setDisabled(true);
          button.buttonEl.addClass("mod-warning");
        } else {
          await flow.confirm(phrase); flow.close(); modal.close(); plugin.settingsTab?.refreshDisplay();
          new Notice("云端仓库已清空。本地笔记已保留，自动同步保持关闭。", 12000);
        }
      } catch (error) {
        proof = undefined; phrase = ""; details.empty(); errorEl.textContent = errorMessage(error) + "。自动同步保持暂停，可关闭窗口后检查仓库状态。";
        button.setButtonText("重新获取确认").setDisabled(false);
      }
    });
  }).addButton(button => button.setButtonText("取消").onClick(() => { if (flow.close()) modal.close(); }));
  const close = modal.close.bind(modal);
  modal.close = () => { if (flow.close()) close(); };
  modal.onClose = () => { flow.close(); };
  modal.open();
}
