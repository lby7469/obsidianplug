import * as h from "obsidian";
import * as community from "./community";
import * as support from "./sync-support";
import * as renewal from "./renewal";
import { mergeLines } from "./merge";
import { errorMessage, errorStatus, objectValue, readAccount, readManifest, readPolicy, readSettings, readStatus, readTokens, readUpload, retryAfter, splitLinesAfterLF, stringValue } from "./plugin-types";
import type { Account, AuthPolicy, PluginSettings, RemoteFile, RequestOptions } from "./plugin-types";
interface FileStamp {
    mtime: number;
    size: number;
}
interface LinkMetadata {
    rawTarget: string;
    targetPath?: string;
    kind: "link" | "embed";
    fragment?: string;
    alias?: string;
}
/** Only this UI convenience uses Obsidian's optional internal settings bridge. */
function settingsBridge(app: h.App): {
    open: () => void;
    openTabById: (id: string) => void;
} | undefined {
    const value: unknown = app;
    if (!value || typeof value !== "object" || !("setting" in value))
        return;
    const setting = value.setting;
    if (!setting || typeof setting !== "object" || !("open" in setting) || typeof setting.open !== "function" || !("openTabById" in setting) || typeof setting.openTabById !== "function")
        return;
    const open = setting.open, openTabById = setting.openTabById;
    return { open: () => { Reflect.apply(open, setting, []); }, openTabById: (id: string) => { Reflect.apply(openTabById, setting, [id]); } };
}
function installedPlugin(app: h.App, id: string): boolean {
    const value: unknown = app;
    if (!value || typeof value !== "object" || !("plugins" in value))
        return false;
    const manager = value.plugins;
    if (!manager || typeof manager !== "object")
        return false;
    if ("getPlugin" in manager && typeof manager.getPlugin === "function") {
        const result: unknown = Reflect.apply(manager.getPlugin, manager, [id]);
        if (result)
            return true;
    }
    if (!("plugins" in manager) || !manager.plugins || typeof manager.plugins !== "object")
        return false;
    return id in manager.plugins;
}
const DEFAULT_SETTINGS: PluginSettings = { serverUrl: "https://api.notecloud.asia", websiteUrl: "https://notecloud.asia", phone: "", password: "", quotaCode: "", token: "", refreshToken: "", tokenExpiresAt: 0, pendingAuth: void 0, state: {}, syncAllFolders: true, selectedFolders: [], autoSync: true, syncIntervalMinutes: 5, maxFileSizeMB: h.Platform.isMobile ? 50 : 200, conflictStrategy: "keep-both", serviceNotices: true, lastServiceCheckAt: 0, seenAnnouncementIds: [], notifiedUpdateVersion: "", serviceStatus: void 0 }, SUPPORTED_EXTENSIONS = new Set(["md", "markdown", "txt", "canvas", "pdf", "png", "jpg", "jpeg", "gif", "webp", "svg", "mp3", "m4a", "wav", "mp4", "webm", "mov", "docx", "xlsx", "pptx"]);
async function digestBytes(c: ArrayBuffer) {
    let t = await crypto.subtle.digest("SHA-256", c);
    return [...new Uint8Array(t)].map((e) => e.toString(16).padStart(2, "0")).join("");
}
function base64Url(c: Uint8Array) {
    return btoa(String.fromCharCode(...c)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function conflictPath(c: string) {
    let t = c.lastIndexOf("."), e = `.conflict-${( /* @__PURE__ */new Date()).toISOString().replace(/[:.]/g, "-")}`;
    return t > 0 ? `${c.slice(0, t)}${e}${c.slice(t)}` : `${c}${e}`;
}
function formatBytes(c: number) {
    return c < 1024 ? `${c} B` : c < 1024 ** 2 ? `${(c / 1024).toFixed(1)} KB` : c < 1024 ** 3 ? `${(c / 1024 ** 2).toFixed(2)} MB` : `${(c / 1024 ** 3).toFixed(2)} GB`;
}
function compareVersions(c: string, t: string) {
    let e = String(c || "0").split(".").map((s) => Number.parseInt(s, 10) || 0), i = String(t || "0").split(".").map((s) => Number.parseInt(s, 10) || 0);
    for (let s = 0; s < Math.max(e.length, i.length); s++)
        if ((e[s] || 0) !== (i[s] || 0))
            return (e[s] || 0) > (i[s] || 0) ? 1 : -1;
    return 0;
}
export default class NoteCloudPlugin extends h.Plugin {
    settings: PluginSettings = { ...DEFAULT_SETTINGS, state: {}, selectedFolders: [], seenAnnouncementIds: [] };
    syncing = false;
    status?: HTMLElement;
    floatingButton?: HTMLElement;
    announcementButton?: HTMLButtonElement;
    renewalButton?: HTMLButtonElement;
    renewalTop?: HTMLDivElement;
    settingsTab?: NoteCloudSettingsTab;
    syncActionButton?: h.ButtonComponent;
    startupSyncTimer?: number;
    startupStatusTimer?: number;
    renewalResumeTimer?: number;
    autoSyncTimer?: number;
    disposed = false;
    authEpoch = 0;
    authCompleting = false;
    syncedThisSession = false;
    pendingChanges = true;
    confirmingAccountSync = false;
    lastServiceAttemptAt = 0;
    lastAccountRefreshAt = 0;
    lastAccountRefreshError = "";
    authPolicy: AuthPolicy = { passwordHint: "密码至少 8 位，且必须同时包含字母和数字。", emailCodeLength: 6, emailCodeExpiresMinutes: 10 };
    digestCache = new Map<string, FileStamp & {
        hash: string;
    }>();
    dirtyPaths = new Set<string>();
    syncRun?: {
        cancelled: boolean;
        epoch: number;
    };
    saveFlight?: Promise<void>;
    refreshFlight?: Promise<void>;
    accountRefresher?: support.AccountRefresh<Account>;
    lastSyncReport?: {
        completed: number;
        conflicts: number;
        skipped: number;
        scanned: number;
        errors: {
            path: string;
            message: string;
        }[];
        cancelled: boolean;
        elapsedMs: number;
    };
    async onload() {
        const raw: unknown = await this.loadData();
        const t = readSettings(raw, DEFAULT_SETTINGS);
        {
            this.settings = { ...DEFAULT_SETTINGS, ...t || {}, state: t?.state || {}, selectedFolders: t?.selectedFolders || [], seenAnnouncementIds: t?.seenAnnouncementIds || [] };
            this.settings.password = "";
            await this.saveSettings();
            this.authPolicy = { passwordHint: "\u5BC6\u7801\u81F3\u5C11 8 \u4F4D\uFF0C\u4E14\u5FC5\u987B\u540C\u65F6\u5305\u542B\u5B57\u6BCD\u548C\u6570\u5B57\u3002", emailCodeLength: 6, emailCodeExpiresMinutes: 10 };
            await this.loadAuthPolicy();
            this.syncedThisSession = false;
            this.pendingChanges = true;
            this.registerObsidianProtocolHandler("notecloud-auth", (parameters) => void this.completeWebAuth(parameters));
            this.addSettingTab(new NoteCloudSettingsTab(this.app, this));
            if (h.Platform.isMobile) {
                this.addRibbonIcon("refresh-cw", "\u7ACB\u5373\u540C\u6B65", () => void this.sync(true));
            }
            this.status = this.addStatusBarItem();
            this.status.addClass("notecloud-status");
            this.status.onclick = () => void this.sync(true);
            this.status.addEventListener("contextmenu", (s) => {
                {
                    s.preventDefault();
                    this.openSettings();
                }
            });
            this.setStatus("\u7B49\u5F85\u540C\u6B65", "idle");
            this.addCommand({ id: "sync-now", name: "\u7ACB\u5373\u540C\u6B65", callback: () => void this.sync(true) });
            this.addCommand({ id: "open-settings", name: "\u6253\u5F00\u540C\u6B65\u8BBE\u7F6E", callback: () => this.openSettings() });
            this.addCommand({ id: "open-web-portal", name: "\u6253\u5F00 NoteCloud \u7F51\u9875\u7248", callback: () => void this.openWebPortal() });
            this.addCommand({ id: "check-updates-notices", name: "\u68C0\u67E5\u66F4\u65B0\u4E0E\u516C\u544A", callback: () => void this.checkServiceStatus(true) });
            this.registerEvent(this.app.vault.on("create", file => this.markPending(file)));
            this.registerEvent(this.app.vault.on("modify", file => this.markPending(file)));
            this.registerEvent(this.app.vault.on("delete", file => this.markPending(file)));
            this.registerEvent(this.app.vault.on("rename", (file, oldPath) => this.markPending(file, oldPath)));
            this.configureAutoSync();
            if (this.settings.autoSync) {
                this.startupSyncTimer = window.setTimeout(() => void this.sync(false), 5e3);
            }
            this.startupStatusTimer = window.setTimeout(() => void this.checkServiceStatus(false), 8e3);
        }
        community.initialize(this);
        renewal.update(this);
        this.initializeAccountRefresh();
        this.addCommand({ id: "cancel-sync", name: "停止当前同步", callback: () => this.cancelSync() });
        this.addCommand({ id: "open-announcements", name: "查看公告", callback: () => community.openAnnouncements(this) });
        this.addCommand({ id: "open-renewal", name: "查看续费与服务期限", callback: () => renewal.open(this) });
        this.addCommand({ id: "send-feedback", name: "意见反馈", callback: () => community.openFeedback(this) });
    }
    onunload() {
        this.disposed = true;
        this.authEpoch = (this.authEpoch || 0) + 1;
        this.cancelSync();
        window.clearTimeout(this.startupSyncTimer);
        window.clearTimeout(this.startupStatusTimer);
        window.clearTimeout(this.renewalResumeTimer);
        this.announcementButton?.remove();
        this.renewalButton?.remove();
        this.renewalTop = undefined;
        {
            if (this.autoSyncTimer) {
                window.clearInterval(this.autoSyncTimer);
            }
            this.floatingButton?.remove();
        }
    }
    configureAutoSync() {
        {
            if (this.autoSyncTimer) {
                window.clearInterval(this.autoSyncTimer);
            }
            this.autoSyncTimer = void 0;
            if (this.settings.autoSync) {
                this.autoSyncTimer = window.setInterval(() => void this.sync(false), Math.max(1, Math.min(60, this.settings.syncIntervalMinutes || 5)) * 6e4);
            }
        }
    }
    markPending(file?: h.TAbstractFile, oldPath?: string) {
        this.dirtyPaths ||= new Set();
        this.digestCache ||= new Map();
        if (file && !(file instanceof h.TFile)) {
            this.digestCache.clear();
            this.pendingChanges = true;
        }
        else
            for (const path of [file?.path, oldPath]) {
                if (!path || !support.safeSyncPath(path, this.app.vault.configDir) || !SUPPORTED_EXTENSIONS.has((path.split(".").pop() || "").toLowerCase()) || !this.fileInScope(path))
                    continue;
                this.dirtyPaths.add(path);
                this.digestCache.delete(path);
                this.pendingChanges = true;
            }
        this.updateSyncButton();
    }
    checkRun() {
        if (this.disposed || this.syncRun?.cancelled)
            throw new support.ServiceError("同步已停止，已完成文件保留", 499);
        if (this.syncRun)
            this.assertSession(this.syncRun.epoch);
    }
    remember(path: string, hash: string, revision: string, bytes: ArrayBuffer, stamp?: FileStamp) {
        this.settings.state[path] = { hash, remoteRevision: revision, baseContent: this.markdownBase(path, bytes) };
        const file = this.app.vault.getAbstractFileByPath(path);
        if (stamp && file instanceof h.TFile && file.stat.mtime === stamp.mtime && file.stat.size === stamp.size) {
            this.digestCache ||= new Map();
            this.digestCache.set(path, { ...stamp, hash });
            this.dirtyPaths?.delete(path);
        }
    }
    updateSyncButton() {
        if (!this.syncActionButton)
            return;
        let t = this.syncedThisSession && !this.pendingChanges;
        this.syncActionButton.setButtonText(this.syncing ? "\u540C\u6B65\u4E2D\u2026" : "\u7ACB\u5373\u540C\u6B65").setDisabled(this.syncing);
        this.syncActionButton.buttonEl.addClass("notecloud-sync-action");
        this.syncActionButton.buttonEl.toggleClass("notecloud-sync-ready", !this.syncing && t);
        this.syncActionButton.buttonEl.toggleClass("notecloud-sync-pending", !this.syncing && !t);
    }
    openHotkeys() {
        const settings = settingsBridge(this.app);
        settings?.open();
        settings?.openTabById("hotkeys");
    }
    async switchAccount() {
        await this.beginWebAuth("switch");
    }
    async loadAuthPolicy() {
        try {
            this.authPolicy = readPolicy(await this.request("/v1/auth/policy"));
        }
        catch { /* Use the local explanatory defaults when the policy endpoint is unavailable. */ }
    }
    async checkServiceStatus(t = false) {
        if (!t && Date.now() - Math.max(this.settings.lastServiceCheckAt || 0, this.lastServiceAttemptAt || 0) < 5 * 60 * 1000)
            return this.settings.serviceStatus;
        this.lastServiceAttemptAt = Date.now();
        try {
            let e = readStatus(await this.request(`/v1/plugin/status?version=${encodeURIComponent(this.manifest.version)}&platform=${h.Platform.isMobile ? "mobile" : "desktop"}`)), s = compareVersions(this.manifest.version, e.latestVersion) < 0;
            {
                this.settings.serviceStatus = e;
                this.settings.lastServiceCheckAt = Date.now();
            }
            if (s && this.settings.serviceNotices !== false && this.settings.notifiedUpdateVersion !== e.latestVersion) {
                this.settings.notifiedUpdateVersion = e.latestVersion;
                new h.Notice(`NoteCloud ${e.latestVersion} \u5DF2\u53D1\u5E03\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u6253\u5F00\u53D1\u5E03\u9875\uFF0CBRAT \u4E5F\u53EF\u68C0\u67E5\u66F4\u65B0\u3002`, 12e3);
            }
            community.ingest(this, e.announcements);
            await this.saveSettings();
            if (t)
                this.settingsTab?.refreshDisplay();
            if (t)
                new h.Notice(s ? `\u53D1\u73B0\u65B0\u7248\u672C ${e.latestVersion}` : "NoteCloud \u5DF2\u662F\u6700\u65B0\u7248\u672C");
            return e;
        }
        catch (e) {
            if (t)
                new h.Notice(`NoteCloud \u68C0\u67E5\u5931\u8D25\uFF1A${e instanceof Error ? e.message : "\u8BF7\u7A0D\u540E\u91CD\u8BD5"}`);
            return this.settings.serviceStatus;
        }
    }
    async saveSettings() {
        const snapshot: unknown = JSON.parse(JSON.stringify(this.settings));
        this.saveFlight = (this.saveFlight || Promise.resolve()).catch(() => { }).then(() => this.saveData(snapshot));
        await this.saveFlight;
    }
    openSettings() {
        const settings = settingsBridge(this.app);
        settings?.open();
        settings?.openTabById(this.manifest.id);
    }
    createFloatingButton() {
        let t = document.body.createDiv({ cls: "notecloud-floating-sync" });
        {
            t.setAttribute("role", "button");
            t.tabIndex = 0;
        }
        let e = 0, s = false, i = () => {
            {
                if (e) {
                    window.clearTimeout(e);
                }
                e = 0;
            }
        };
        {
            t.addEventListener("pointerdown", () => {
                {
                    s = false;
                    i();
                    e = window.setTimeout(() => {
                        {
                            s = true;
                            this.openSettings();
                        }
                    }, 650);
                }
            });
            t.addEventListener("pointerup", i);
            t.addEventListener("pointercancel", i);
            t.addEventListener("click", () => {
                if (s) {
                    s = false;
                    return;
                }
                void this.sync(true);
            });
            t.addEventListener("contextmenu", (r) => {
                {
                    r.preventDefault();
                    i();
                    this.openSettings();
                }
            });
            t.addEventListener("keydown", (r) => {
                if (r.key === "Enter" || r.key === " ")
                    void this.sync(true);
            });
            this.floatingButton = t;
        }
    }
    setStatus(t: string, e: "idle" | "syncing" | "error" | "success") {
        if (e === "error")
            this.pendingChanges = true;
        this.updateSyncButton();
        if (this.status) {
            this.status.empty();
            let s = this.status.createSpan({ cls: "notecloud-status-icon" });
            {
                (0, h.setIcon)(s, e === "syncing" ? "refresh-cw" : e === "error" ? "cloud-off" : "cloud");
                this.status.createSpan({ text: `NoteCloud: ${t}` });
                this.status.toggleClass("is-error", e === "error");
                this.status.toggleClass("is-syncing", e === "syncing");
                this.status.title = "\u70B9\u51FB\u7ACB\u5373\u540C\u6B65\uFF0C\u53F3\u952E\u6253\u5F00\u8BBE\u7F6E";
            }
        }
        if (this.floatingButton) {
            this.floatingButton.empty();
            (0, h.setIcon)(this.floatingButton, e === "syncing" ? "refresh-cw" : e === "error" ? "cloud-off" : "cloud");
            this.floatingButton.toggleClass("is-error", e === "error");
            this.floatingButton.toggleClass("is-syncing", e === "syncing");
            this.floatingButton.toggleClass("is-success", e === "success");
            this.floatingButton.title = `NoteCloud: ${t}\u3002\u70B9\u51FB\u540C\u6B65\uFF0C\u53F3\u952E\u6216\u957F\u6309\u6253\u5F00\u8BBE\u7F6E`;
            this.floatingButton.setAttribute("aria-label", this.floatingButton.title);
        }
    }
    async request(route: string, options: RequestOptions = {}): Promise<unknown> {
        const headers = new Headers(options.headers);
        if (options.body !== undefined)
            headers.set("Content-Type", "application/json");
        if (this.settings.token)
            headers.set("Authorization", "Bearer " + this.settings.token);
        const plainHeaders: Record<string, string> = {};
        headers.forEach((value, key) => plainHeaders[key] = value);
        const response = await support.timed(h.requestUrl({ url: this.settings.serverUrl.replace(/\/$/, "") + route, method: options.method || "GET", body: options.body, headers: plainHeaders, throw: false }));
        let body: unknown;
        try {
            body = response.json;
        }
        catch {
            body = {};
        }
        if (response.status < 200 || response.status >= 300) {
            const data = body && typeof body === "object" ? objectValue(body) : {};
            throw new support.ServiceError(typeof data.error === "string" ? data.error : "服务器错误 " + response.status, response.status, Number(response.headers["retry-after"] || 0) * 1000);
        }
        return body;
    }
    assertSession(epoch: number) {
        if (this.disposed || (this.authEpoch || 0) !== epoch)
            throw new support.ServiceError("账号已变化，操作已停止", 409);
    }
    async authorizedRequest(route: string, options: RequestOptions = {}): Promise<unknown> {
        const epoch = this.authEpoch || 0;
        if (this.settings.refreshToken && this.settings.tokenExpiresAt && this.settings.tokenExpiresAt < Date.now() + 30000)
            await this.refreshPluginToken();
        try {
            const result = await this.request(route, options);
            this.assertSession(epoch);
            return result;
        }
        catch (error) {
            this.assertSession(epoch);
            if (errorStatus(error) !== 401 && !/Unauthorized/.test(errorMessage(error, "")))
                throw error;
            if (!this.settings.refreshToken)
                throw error;
            await this.refreshPluginToken();
            this.assertSession(epoch);
            const result = await this.request(route, options);
            this.assertSession(epoch);
            return result;
        }
    }
    async binaryRequest(route: string, method = "GET", bytes?: ArrayBuffer) {
        const headers: Record<string, string> = {};
        if (this.settings.token)
            headers.Authorization = "Bearer " + this.settings.token;
        const response = await support.timed(h.requestUrl({ url: this.settings.serverUrl.replace(/\/$/, "") + route, method, body: bytes, contentType: bytes !== undefined ? "application/octet-stream" : undefined, headers, throw: false }), 120000);
        if (response.status < 200 || response.status >= 300) {
            let body: unknown;
            try {
                body = response.json;
            }
            catch {
                body = {};
            }
            const data = body && typeof body === "object" ? objectValue(body) : {};
            throw new support.ServiceError(typeof data.error === "string" ? data.error : "服务器错误 " + response.status, response.status, Number(response.headers["retry-after"] || 0) * 1000);
        }
        return response;
    }
    async authorizedBinaryRequest(route: string, method = "GET", bytes?: ArrayBuffer) {
        const epoch = this.authEpoch || 0;
        if (this.settings.refreshToken && this.settings.tokenExpiresAt && this.settings.tokenExpiresAt < Date.now() + 30000)
            await this.refreshPluginToken();
        try {
            const result = await this.binaryRequest(route, method, bytes);
            this.assertSession(epoch);
            return result;
        }
        catch (error) {
            this.assertSession(epoch);
            if (errorStatus(error) !== 401 && !/Unauthorized/.test(errorMessage(error, "")))
                throw error;
            if (!this.settings.refreshToken)
                throw error;
            await this.refreshPluginToken();
            this.assertSession(epoch);
            const result = await this.binaryRequest(route, method, bytes);
            this.assertSession(epoch);
            return result;
        }
    }
    openRegistration() {
        return this.beginWebAuth("register");
    }
    openPasswordReset() {
        return this.beginWebAuth("forgot");
    }
    async beginWebAuth(action = "login") {
        if (this.syncing)
            return void new h.Notice("请等当前同步完成后再操作账号");
        const verifier = base64Url(crypto.getRandomValues(new Uint8Array(48))), state = base64Url(crypto.getRandomValues(new Uint8Array(24))), challenge = base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
        {
            this.settings.pendingAuth = { verifier, state, createdAt: Date.now() };
            await this.saveSettings();
        }
        const deviceName = `${h.Platform.isMobile ? "Obsidian Mobile" : "Obsidian Desktop"} \u00B7 ${this.app.vault.getName()}`;
        const url = `${this.settings.websiteUrl.replace(/\/$/, "")}/auth/plugin?state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(challenge)}&device_name=${encodeURIComponent(deviceName)}&action=${encodeURIComponent(action)}`;
        {
            window.open(url, "_blank", "noopener,noreferrer");
            new h.Notice("\u5DF2\u6253\u5F00 NoteCloud \u7F51\u7AD9\uFF0C\u8BF7\u5728\u7F51\u9875\u4E2D\u5B8C\u6210\u8D26\u53F7\u64CD\u4F5C");
        }
    }
    async completeWebAuth(parameters: h.ObsidianProtocolData) {
        if (this.syncing || this.authCompleting)
            return void new h.Notice("当前正在同步或登录，请稍后重试");
        const pending = this.settings.pendingAuth;
        if (!pending || !parameters.code || parameters.state !== pending.state || Date.now() - pending.createdAt > 10 * 60 * 1e3)
            return void new h.Notice("NoteCloud \u767B\u5F55\u8BF7\u6C42\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u767B\u5F55\u9875");
        try {
            this.authCompleting = true;
            const epoch = this.authEpoch = (this.authEpoch || 0) + 1;
            this.digestCache = new Map();
            const response = await this.request("/v1/auth/plugin-exchange", { method: "POST", body: JSON.stringify({ code: parameters.code, state: parameters.state, codeVerifier: pending.verifier }) });
            this.assertSession(epoch);
            if (this.settings.pendingAuth !== pending) throw new support.ServiceError("登录请求已变化，旧登录操作已停止", 409);
            const result = readTokens(response);
            const oldId = this.settings.stateAccountId || this.settings.account?.id;
            const changed = oldId ? oldId !== result.id : this.settings.phone ? this.settings.phone !== result.phone : Object.keys(this.settings.state).length > 0;
            if (changed) {
                this.settings.state = {};
                this.settings.autoSync = false;
                this.settings.accountSwitchPending = true;
                this.settings.lastSyncAt = "";
                this.configureAutoSync();
            }
            this.settings.stateAccountId = result.id;
            {
                this.settings.token = result.token;
                this.settings.refreshToken = result.refreshToken;
                this.settings.tokenExpiresAt = Date.now() + result.expiresIn * 1e3;
                this.settings.phone = result.phone || "";
                this.settings.password = "";
                this.settings.account = result;
                this.settings.pendingAuth = void 0;
                await this.saveSettings();
                this.settingsTab?.refreshDisplay();
                this.setStatus("\u5DF2\u767B\u5F55\uFF0C\u7B49\u5F85\u540C\u6B65", "idle");
                new h.Notice(`NoteCloud\uFF1A\u5DF2\u8FDE\u63A5 ${result.displayName || "\u8D26\u53F7"}`);
            }
        }
        catch (error) {
            new h.Notice(`NoteCloud \u767B\u5F55\u5931\u8D25\uFF1A${error instanceof Error ? error.message : "\u8BF7\u91CD\u8BD5"}`);
        }
        finally {
            this.authCompleting = false;
        }
    }
    async refreshPluginToken() {
        if (this.refreshFlight)
            return this.refreshFlight;
        if (!this.settings.refreshToken)
            throw new support.ServiceError("请从 NoteCloud 网站重新登录", 401);
        const epoch = this.authEpoch || 0, refreshToken = this.settings.refreshToken, accountId = this.settings.account?.id || this.settings.stateAccountId;
        this.refreshFlight = (async () => {
            const result = readTokens(await this.request("/v1/auth/plugin-refresh", { method: "POST", body: JSON.stringify({ refreshToken }) }));
            this.assertSession(epoch);
            if (accountId && result.id !== accountId)
                throw new support.ServiceError("账号不一致，请重新登录", 401);
            const { token, refreshToken: nextRefresh, expiresIn, ...account } = result;
            this.settings.token = token;
            this.settings.refreshToken = nextRefresh;
            this.settings.tokenExpiresAt = Date.now() + expiresIn * 1000;
            this.settings.account = account;
            this.lastAccountRefreshAt = Date.now();
            this.settingsTab?.refreshAccountUI?.();
            await this.saveSettings();
        })();
        try {
            return await this.refreshFlight;
        }
        finally {
            this.refreshFlight = undefined;
        }
    }
    refreshAccount(force = false) {
        this.accountRefresher ||= new support.AccountRefresh<Account>({
            identity: () => this.disposed || this.authCompleting || (!this.settings.token && !this.settings.refreshToken) ? "" : [this.authEpoch || 0, this.settings.serverUrl, this.settings.account?.id || this.settings.stateAccountId || "current"].join("|"),
            read: async () => readAccount(await this.authorizedRequest("/v1/account")),
            apply: async (account) => {
                const expected = this.settings.stateAccountId || this.settings.account?.id;
                if (expected && account.id !== expected)
                    throw new support.ServiceError("账号不一致，请重新登录", 401);
                const changed = JSON.stringify(this.settings.account) !== JSON.stringify(account);
                const resumed = this.settings.account?.syncWritesAllowed === false && account.syncWritesAllowed === true;
                this.settings.account = account;
                this.lastAccountRefreshAt = Date.now();
                this.lastAccountRefreshError = "";
                renewal.update(this);
                this.settingsTab?.refreshAccountUI?.();
                if (changed)
                    await this.saveSettings();
                if (resumed && !this.disposed) {
                    this.setStatus("空间已恢复，可以继续同步", "idle");
                    if (this.settings.autoSync && !this.syncing) {
                        window.clearTimeout(this.renewalResumeTimer);
                        this.renewalResumeTimer = window.setTimeout(() => {
                            if (!this.disposed)
                                void this.sync(false);
                        }, 500);
                    }
                }
            },
            error: error => { this.lastAccountRefreshError = errorMessage(error, "额度暂未刷新"); this.settingsTab?.refreshAccountUI?.(); }
        });
        return this.accountRefresher.refresh(force, this.settingsTab?.accountVisible ? 10000 : 60000);
    }
    initializeAccountRefresh() {
        const wake = () => {
            if (!document.hidden)
                void this.refreshAccount(true);
        };
        this.registerInterval(window.setInterval(() => {
            if (!document.hidden)
                void this.refreshAccount();
        }, 10000));
        this.registerDomEvent(window, "focus", wake);
        this.registerDomEvent(document, "visibilitychange", wake);
        void this.refreshAccount(true);
    }
    cancelSync() {
        if (this.syncRun) {
            this.syncRun.cancelled = true;
            this.setStatus("正在停止，已完成的文件会保留", "syncing");
        }
    }
    async redeemQuotaCode() {
        let t = this.settings.quotaCode?.trim();
        if (!t)
            throw new Error("\u8BF7\u5148\u586B\u5199\u989D\u5EA6\u5151\u6362\u7801");
        const e = objectValue(await this.authorizedRequest("/v1/account/quota-code", { method: "POST", body: JSON.stringify({ code: t }) }));
        if (this.settings.account)
            this.settings.account = readAccount({ ...this.settings.account, ...e });
        this.settings.quotaCode = "";
        await this.saveSettings();
        new h.Notice(e.customerStage === "early" ? "\u5151\u6362\u6210\u529F\uFF0C\u5DF2\u6807\u8BB0\u4E3A\u65E9\u671F\u7528\u6237\u5E76\u589E\u52A0\u4E91\u7AEF\u989D\u5EA6" : "\u5151\u6362\u6210\u529F\uFF0C\u4E91\u7AEF\u989D\u5EA6\u5DF2\u66F4\u65B0");
    }
    async login() {
        if (this.settings.refreshToken)
            return this.refreshPluginToken();
        await this.beginWebAuth("login");
        throw new Error("\u8BF7\u5728\u5DF2\u6253\u5F00\u7684 NoteCloud \u7F51\u9875\u4E2D\u5B8C\u6210\u767B\u5F55");
    }
    async logout() {
        if (this.syncing)
            return void new h.Notice("请等当前同步完成后再退出账号");
        this.authEpoch = (this.authEpoch || 0) + 1;
        this.settings.stateAccountId ||= this.settings.account?.id;
        this.settings.pendingAuth = void 0;
        {
            this.settings.token = "";
            this.settings.refreshToken = "";
            this.settings.tokenExpiresAt = 0;
            this.settings.password = "";
            this.settings.account = void 0;
            await this.saveSettings();
            this.setStatus("\u5DF2\u9000\u51FA\u767B\u5F55", "idle");
            new h.Notice("NoteCloud \u5DF2\u9000\u51FA\u767B\u5F55");
        }
    }
    async checkConnection() {
        this.setStatus("正在检查连接…", "syncing");
        try {
            await this.request("/health");
            if (!this.settings.token)
                await this.login();
            const account = await this.refreshAccount(true);
            if (!account)
                throw Error(this.lastAccountRefreshError || "账户信息刷新失败");
            this.setStatus("云端连接正常", "success");
            new h.Notice("NoteCloud 云端连接正常");
            return true;
        }
        catch (error) {
            const message = errorMessage(error, "连接失败");
            this.setStatus(message, "error");
            new h.Notice("NoteCloud 连接失败：" + message);
            return false;
        }
    }
    async openWebPortal(destination?: string) {
        try {
            if (!(this.settings.token)) {
                await this.login();
            }
            const t = objectValue(await this.authorizedRequest("/v1/auth/web-ticket", { method: "POST", body: "{}" }));
            const url = new URL(stringValue(t.url));
            if (destination === "/feedback")
                url.pathname = destination;
            window.open(url.href, "_blank", "noopener,noreferrer");
        }
        catch (t) {
            let e = t instanceof Error ? t.message : "\u65E0\u6CD5\u6253\u5F00\u7F51\u9875\u7248";
            {
                this.setStatus(e, "error");
                new h.Notice(`NoteCloud\uFF1A${e}`);
            }
        }
    }
    fileInScope(t: string) {
        return this.settings.syncAllFolders ? true : this.settings.selectedFolders.some((e) => e === "/" ? !t.includes("/") : t.startsWith(`${e}/`));
    }
    files() {
        return this.app.vault.getFiles().filter((t) => SUPPORTED_EXTENSIONS.has(t.extension.toLowerCase()) && support.safeSyncPath(t.path, this.app.vault.configDir) && this.fileInScope(t.path));
    }
    isMarkdown(t: string) {
        return /\.(md|markdown)$/i.test(t);
    }
    text(t: ArrayBuffer) {
        return new TextDecoder().decode(t);
    }
    markdownBase(t: string, e: ArrayBuffer) {
        return this.isMarkdown(t) && e.byteLength <= 256 * 1024 ? this.text(e) : void 0;
    }
    async ensureParentFolders(t: string) {
        let e = t.split("/").slice(0, -1), s = "";
        for (let i of e)
            if (s = s ? `${s}/${i}` : i, !this.app.vault.getAbstractFileByPath(s))
                try {
                    await this.app.vault.createFolder(s);
                }
                catch { /* Another sync job may have created the same parent in the meantime. */ }
    }
    async remoteBytes(t: RemoteFile) {
        const bytes = (await this.authorizedBinaryRequest(`/v1/sync/file/raw?path=${encodeURIComponent(t.path)}`)).arrayBuffer;
        if (await digestBytes(bytes) !== t.revision)
            throw new Error("云端文件在读取时发生变化，请重新同步");
        return bytes;
    }
    async download(record: RemoteFile, expectedLocalHash?: string | null) {
        this.checkRun();
        const before = this.app.vault.getAbstractFileByPath(record.path);
        if (expectedLocalHash === undefined)
            expectedLocalHash = before instanceof h.TFile ? await digestBytes(await this.app.vault.readBinary(before)) : null;
        const bytes = await this.remoteBytes(record);
        this.checkRun();
        const current = this.app.vault.getAbstractFileByPath(record.path);
        const currentHash = current instanceof h.TFile ? await digestBytes(await this.app.vault.readBinary(current)) : null;
        if (currentHash !== expectedLocalHash)
            throw new Error("下载期间本地笔记已修改，已保留本地内容，请重新同步");
        this.checkRun();
        if (current instanceof h.TFile)
            await this.app.vault.modifyBinary(current, bytes);
        else {
            await this.ensureParentFolders(record.path);
            this.checkRun();
            await this.app.vault.createBinary(record.path, bytes);
        }
        this.remember(record.path, record.revision, record.revision, bytes);
        this.dirtyPaths?.delete(record.path);
    }
    async resolveConflict(t: h.TFile, e: RemoteFile, s: ArrayBuffer, i: string) {
        if (this.settings.conflictStrategy === "local")
            return await this.upload(t, i, s, e.revision), "local";
        if (this.settings.conflictStrategy === "cloud")
            return await this.download(e, i), "cloud";
        let r = conflictPath(t.path);
        {
            await this.ensureParentFolders(r);
            await this.app.vault.createBinary(r, s);
            await this.download(e, i);
        }
        return "keep-both";
    }
    linkMetadata(file: h.TFile): LinkMetadata[] {
        if (!this.isMarkdown(file.path))
            return [];
        const cache = this.app.metadataCache.getFileCache(file), result: LinkMetadata[] = [];
        const sources: [
            h.ReferenceCache[],
            "link" | "embed"
        ][] = [[cache?.links || [], "link"], [cache?.embeds || [], "embed"]];
        for (const [items, kind] of sources)
            for (const item of items) {
                const value = item.link || "", fragmentIndex = value.search(/[#^]/), rawTarget = (fragmentIndex >= 0 ? value.slice(0, fragmentIndex) : value).trim(), fragment = fragmentIndex >= 0 ? value.slice(fragmentIndex) : void 0, destination = rawTarget ? this.app.metadataCache.getFirstLinkpathDest(rawTarget, file.path) : void 0;
                if (rawTarget) {
                    result.push({ rawTarget, targetPath: destination?.path, kind, fragment, alias: item.displayText || void 0 });
                }
            }
        return result;
    }
    async upload(file: h.TFile, digest: string, bytes: ArrayBuffer | undefined, expectedRevision: string | null) {
        this.checkRun();
        bytes ||= await this.app.vault.readBinary(file);
        const path = file.path, stamp = { mtime: file.stat.mtime, size: file.stat.size };
        let uploadId: string | undefined, record: RemoteFile | undefined;
        try {
            const payload: {
                path: string;
                size: number;
                expectedRevision: string | null;
                expectedAccountId?: string;
                modifiedAt: string;
                links: LinkMetadata[];
                preferredChunkSize?: number;
                initialContent?: string;
            } = { path, size: bytes.byteLength, expectedRevision, expectedAccountId: this.settings.account?.id || this.settings.stateAccountId, modifiedAt: new Date(stamp.mtime).toISOString(), links: this.linkMetadata(file) };
            const maximum = this.settings.serviceStatus?.maxChunkSize;
            if (maximum)
                payload.preferredChunkSize = Math.min(maximum, 4 * 1024 * 1024);
            if (bytes.byteLength <= (this.settings.serviceStatus?.fastUploadBytes || 0))
                payload.initialContent = support.base64(bytes);
            const session = readUpload(await this.authorizedRequest("/v1/sync/uploads", { method: "POST", body: JSON.stringify(payload) }));
            uploadId = session.uploadId;
            record = session.record;
            const maxChunk = session.chunkSize;
            if (!session.complete && (!Number.isInteger(maxChunk) || maxChunk < 1 || maxChunk > 4 * 1024 * 1024))
                throw Error("服务器返回的分片大小异常");
            let offset = 0, index = 0, pieceSize = Math.min(maxChunk, 1024 * 1024);
            while (!session.complete && offset < bytes.byteLength) {
                this.checkRun();
                const piece = bytes.slice(offset, Math.min(bytes.byteLength, offset + pieceSize));
                const started = Date.now();
                let result: ReturnType<typeof readUpload>;
                for (let attempt = 0;; attempt++) {
                    try {
                        const response = await this.authorizedBinaryRequest("/v1/sync/uploads/" + encodeURIComponent(uploadId) + "/chunk?index=" + index, "PUT", piece);
                        const data: unknown = response.json;
                        result = readUpload(data, false);
                        break;
                    }
                    catch (error) {
                        this.checkRun();
                        if (attempt >= 2 || !support.transient(error))
                            throw error;
                        await new Promise<void>(resolve => window.setTimeout(resolve, Math.min(60000, Math.max(500 * 2 ** attempt, retryAfter(error)))));
                    }
                }
                offset += piece.byteLength;
                index++;
                if (result?.complete) {
                    record = result.record;
                    if (offset !== bytes.byteLength)
                        throw Error("服务器提前结束了文件上传");
                }
                const elapsed = Math.max(1, Date.now() - started);
                pieceSize = Math.min(maxChunk, Math.max(256 * 1024, Math.floor(piece.byteLength / elapsed * 3000 / (256 * 1024)) * 256 * 1024));
                this.setStatus("正在上传 " + file.name + "：" + Math.round(offset / bytes.byteLength * 100) + "% · " + formatBytes(piece.byteLength / elapsed * 1000) + "/秒", "syncing");
            }
            if (!record || record.revision !== digest)
                throw Error("上传完成校验失败，请重新同步确认");
            this.checkRun();
            // Capture the read stamp in sync(), not a newer edit made while awaiting the network.
            this.remember(path, digest, record.revision, bytes);
        }
        catch (error) {
            if (uploadId && !record)
                await this.authorizedRequest("/v1/sync/uploads/" + encodeURIComponent(uploadId), { method: "DELETE" }).catch(() => { });
            throw error;
        }
    }
    confirmAccountSync() {
        return new Promise<boolean>(resolve => {
            const modal = new h.Modal(this.app);
            let confirmed = false;
            modal.onOpen = () => {
                modal.contentEl.createEl("h2", { text: "确认新账号的同步范围" });
                modal.contentEl.createEl("p", { text: "你已切换账号。继续会把当前仓库中选定的文件与新账号同步；如不希望上传这些笔记，请先取消并修改同步文件夹。自动同步已暂停，可在设置中重新开启。" });
                new h.Setting(modal.contentEl).addButton(button => button.setButtonText("取消").onClick(() => modal.close())).addButton(button => button.setButtonText("确认同步").setCta().onClick(() => { confirmed = true; modal.close(); }));
            };
            modal.onClose = () => resolve(confirmed);
            modal.open();
        });
    }
    async sync(t: boolean) {
        if (this.authCompleting || (this.settings.pendingAuth && Date.now() - this.settings.pendingAuth.createdAt < 10 * 60 * 1000)) {
            if (t)
                new h.Notice("请先完成网页上的账号操作；登录请求 10 分钟后自动失效");
            return;
        }
        if (this.settings.accountSwitchPending) {
            if (!t || this.confirmingAccountSync)
                return;
            this.confirmingAccountSync = true;
            try {
                if (!await this.confirmAccountSync())
                    return;
                this.settings.accountSwitchPending = false;
                await this.saveSettings();
            }
            finally {
                this.confirmingAccountSync = false;
            }
        }
        if (this.syncing) {
            if (t) {
                new h.Notice("NoteCloud \u5DF2\u5728\u540C\u6B65\u4E2D\uFF0C\u8BF7\u7A0D\u5019");
            }
            return;
        }
        if (!this.settings.token && !this.settings.refreshToken) {
            {
                this.setStatus("\u8BF7\u767B\u5F55", "error");
                if (t) {
                    await this.beginWebAuth("login");
                    new h.Notice("\u8BF7\u5728 NoteCloud \u7F51\u7AD9\u5B8C\u6210\u767B\u5F55\u540E\u8FD4\u56DE Obsidian");
                }
            }
            return;
        }
        this.syncing = true;
        const run: {
            cancelled: boolean;
            epoch: number;
        } = this.syncRun = { cancelled: false, epoch: this.authEpoch || 0 };
        this.digestCache ||= new Map();
        this.dirtyPaths ||= new Set();
        this.setStatus("正在同步…", "syncing");
        let completed = 0, conflicts = 0, skipped = 0, scanned = 0;
        const errors: {
            path: string;
            message: string;
        }[] = [], started = Date.now();
        let checkpointAt = Date.now(), checkpointCount = 0;
        const checkpoint = async () => {
            if (!this.disposed && (++checkpointCount >= 20 || Date.now() - checkpointAt > 10000)) {
                checkpointCount = 0;
                checkpointAt = Date.now();
                await this.saveSettings();
            }
        };
        const failure = (path: string, error: unknown) => {
            errors.push({ path, message: errorMessage(error) });
            if ([401, 403, 499].includes(errorStatus(error)) || /Unauthorized/.test(errorMessage(error, ""))) {
                run.cancelled = true;
                throw error;
            }
        };
        try {
            if (!this.settings.token)
                await this.login();
            const [rawManifest] = await Promise.all([this.authorizedRequest("/v1/sync/manifest"), this.checkServiceStatus(false), this.refreshAccount(true)]);
            const manifest = readManifest(rawManifest);
            this.checkRun();
            if (manifest.syncWritesAllowed === false || this.settings.account?.syncWritesAllowed === false)
                throw new support.ServiceError("付费扩容已到期且超出永久额度，同步已暂停。仍可在网页浏览、下载和清理；续费后自动恢复。", 402);
            const remote = new Map(manifest.files.filter(file => support.safeSyncPath(file.path, this.app.vault.configDir) && SUPPORTED_EXTENSIONS.has((file.path.split(".").pop() || "").toLowerCase()) && this.fileInScope(file.path)).map(file => [file.path, file]));
            const allFiles = this.app.vault.getFiles(), localPaths = new Set(allFiles.map(file => file.path));
            const limit = Math.min((this.settings.maxFileSizeMB || (h.Platform.isMobile ? 50 : 200)) * 1024 * 1024, this.settings.serviceStatus?.maxUploadBytes || Infinity);
            const files = this.files();
            const jobs = files.filter(file => file.stat.size <= limit).map(file => ({ file, path: file.path, size: file.stat.size }));
            skipped = files.length - jobs.length;
            await support.runBounded(jobs, h.Platform.isMobile ? 1 : 2, job => job.size, (h.Platform.isMobile ? 16 : 32) * 1024 * 1024, async (job) => {
                try {
                    this.checkRun();
                    const file = job.file, path = job.path;
                    if (file.path !== path || this.app.vault.getAbstractFileByPath(path) !== file) {
                        this.pendingChanges = true;
                        return;
                    }
                    const stamp = { mtime: file.stat.mtime, size: file.stat.size };
                    const cached = this.digestCache.get(path);
                    let bytes: ArrayBuffer | undefined, digest: string;
                    if (cached && cached.mtime === stamp.mtime && cached.size === stamp.size)
                        digest = cached.hash;
                    else {
                        bytes = await this.app.vault.readBinary(file);
                        digest = await digestBytes(bytes);
                    }
                    this.checkRun();
                    if (file.path !== path)
                        return;
                    const state = this.settings.state[path], cloud = remote.get(path);
                    const localChanged = !state || state.hash !== digest, cloudChanged = !!cloud && (!state || state.remoteRevision !== cloud.revision);
                    if (cloud?.revision === digest || cloud && state && !localChanged && !cloudChanged) {
                        if (bytes)
                            this.remember(path, digest, cloud.revision, bytes, stamp);
                        else
                            this.dirtyPaths.delete(path);
                        return;
                    }
                    bytes ||= await this.app.vault.readBinary(file);
                    // Cache hits that now need bytes must be revalidated before overwriting anything.
                    if (await digestBytes(bytes) !== digest || file.path !== path)
                        throw Error("读取期间笔记已修改，请重新同步");
                    if (cloud && (!state || localChanged && cloudChanged)) {
                        if (state?.baseContent !== undefined && this.isMarkdown(path) && bytes.byteLength <= 256 * 1024 && cloud.size <= 256 * 1024) {
                            const remoteContent = await this.remoteBytes(cloud);
                            const merged = mergeLines(splitLinesAfterLF(this.text(bytes)), splitLinesAfterLF(state.baseContent), splitLinesAfterLF(this.text(remoteContent)), { excludeFalseConflicts: true });
                            if (!merged.conflict) {
                                const output = new TextEncoder().encode(merged.result.join("")).buffer;
                                if (await digestBytes(await this.app.vault.readBinary(file)) !== digest || file.path !== path)
                                    throw Error("合并期间笔记已修改，请重新同步");
                                this.checkRun();
                                await this.app.vault.modifyBinary(file, output);
                                const mergedStamp = { mtime: file.stat.mtime, size: file.stat.size };
                                await this.upload(file, await digestBytes(output), output, cloud.revision);
                                completed++;
                                if (file.stat.mtime === mergedStamp.mtime && file.stat.size === mergedStamp.size)
                                    this.dirtyPaths.delete(path);
                                else
                                    this.dirtyPaths.add(file.path);
                                return;
                            }
                        }
                        await this.resolveConflict(file, cloud, bytes, digest);
                        completed++;
                        conflicts++;
                        return;
                    }
                    if (cloud && cloudChanged && !localChanged) {
                        await this.download(cloud, digest);
                        completed++;
                        return;
                    }
                    if (localChanged || !cloud) {
                        await this.upload(file, digest, bytes, cloud?.revision || null);
                        this.remember(path, digest, digest, bytes, stamp);
                        completed++;
                        if (file.stat.mtime !== stamp.mtime || file.stat.size !== stamp.size)
                            this.dirtyPaths.add(file.path);
                    }
                }
                catch (error) {
                    failure(job.path, error);
                }
                finally {
                    scanned++;
                    await checkpoint();
                }
            }, () => run.cancelled || this.disposed);
            this.checkRun();
            const missing = [...remote.values()].filter(file => !localPaths.has(file.path));
            await support.runBounded(missing, h.Platform.isMobile ? 1 : 2, file => file.size, (h.Platform.isMobile ? 16 : 32) * 1024 * 1024, async (file) => {
                try {
                    this.checkRun();
                    // A file created or renamed while syncing is not a deletion.
                    if (this.app.vault.getAbstractFileByPath(file.path))
                        return;
                    const state = this.settings.state[file.path];
                    if (state && state.remoteRevision === file.revision) {
                        await this.authorizedRequest("/v1/sync/file?path=" + encodeURIComponent(file.path) + "&expectedRevision=" + encodeURIComponent(file.revision), { method: "DELETE" });
                        delete this.settings.state[file.path];
                        this.digestCache.delete(file.path);
                        this.dirtyPaths.delete(file.path);
                        completed++;
                    }
                    else if (file.size > limit)
                        skipped++;
                    else {
                        await this.download(file, null);
                        completed++;
                    }
                }
                catch (error) {
                    failure(file.path, error);
                }
                finally {
                    await checkpoint();
                }
            }, () => run.cancelled || this.disposed);
            this.checkRun();
            this.settings.lastSyncAt = new Date().toISOString();
            this.syncedThisSession = true;
            this.pendingChanges = errors.length > 0 || skipped > 0 || this.dirtyPaths.size > 0;
            const summary = "已同步 " + completed + " 项" + (conflicts ? "，处理 " + conflicts + " 个冲突" : "") + (skipped ? "，跳过 " + skipped + " 项" : "") + (errors.length ? "，" + errors.length + " 项失败：" + errors[0].message : "");
            this.setStatus(summary, errors.length ? "error" : "success");
            if (t)
                new h.Notice("NoteCloud " + summary);
        }
        catch (error) {
            this.pendingChanges = true;
            this.setStatus(errorMessage(error), "error");
            if (t && !this.disposed)
                new h.Notice("NoteCloud：" + errorMessage(error));
        }
        finally {
            this.lastSyncReport = { completed, conflicts, skipped, scanned, errors, cancelled: run.cancelled, elapsedMs: Date.now() - started };
            if (!this.disposed) {
                try {
                    await this.saveSettings();
                    await this.refreshAccount(true);
                }
                catch { /* Preserve sync's report if saving or refreshing is temporarily unavailable. */ }
            }
            this.syncing = false;
            this.syncRun = undefined;
            this.updateSyncButton();
        }
    }
}
class NoteCloudSettingsTab extends h.PluginSettingTab {
    plugin: NoteCloudPlugin;
    accountVisible = false;
    redeemExpanded = false;
    quotaText?: HTMLElement;
    quotaFill?: HTMLElement;
    quotaSetting?: h.Setting;
    constructor(e: h.App, s: NoteCloudPlugin) {
        super(e, s);
        {
            this.plugin = s;
            s.settingsTab = this;
        }
    }
    async persist() {
        await this.plugin.saveSettings();
    }
    hide() { this.accountVisible = false; this.plugin.syncActionButton = undefined; }
    refreshAccountUI() {
        renewal.update(this.plugin);
        const account = this.plugin.settings.account;
        if (this.quotaText)
            this.quotaText.textContent = account ? formatBytes(account.usedBytes || 0) + " / " + formatBytes(account.quotaBytes || 0) + (this.plugin.lastAccountRefreshError ? " · 暂未刷新：" + this.plugin.lastAccountRefreshError : "") : "登录后显示";
        if (this.quotaFill)
            this.quotaFill.style.width = (account?.quotaBytes ? Math.min(100, (account.usedBytes || 0) / account.quotaBytes * 100) : 0) + "%";
    }
    display() { this.refreshDisplay(); }
    refreshDisplay() {
        this.accountVisible = true;
        void this.plugin.refreshAccount(true);
        let { containerEl: e } = this;
        {
            e.empty();
            e.addClass("notecloud-modern-settings");
        }
        renewal.renderTop(this.plugin, e);
        community.renderTop(this.plugin, e);
        let s = this.plugin.settings, i = s.account, used = i?.usedBytes || 0, total = i?.quotaBytes || 0, percent = total ? Math.min(100, used / total * 100) : 0;
        let quota = new h.Setting(e).setClass("notecloud-quota-top").setName("\u4E91\u7AEF\u7A7A\u95F4").setDesc("").addButton((b) => {
            {
                this.plugin.syncActionButton = b;
                b.onClick(() => void this.plugin.sync(true));
                this.plugin.updateSyncButton();
            }
        });
        let track = quota.descEl.createDiv({ cls: "notecloud-quota-track" });
        this.quotaText = quota.descEl.createSpan({ cls: "notecloud-quota-live" });
        this.quotaFill = track.createDiv({ cls: "notecloud-quota-fill", attr: { style: `width:${percent}%` } });
        this.quotaSetting = quota;
        this.refreshAccountUI();
        new h.Setting(e).setName("空间自动刷新").setDesc("打开设置和返回 Obsidian 时刷新；设置页停留期间约 10 秒更新一次。").addButton(b => b.setButtonText("刷新额度").onClick(() => void this.plugin.refreshAccount(true))).addButton(b => b.setButtonText("停止同步").onClick(() => this.plugin.cancelSync()));
        e.createEl("h3", { text: "\u8D26\u6237" });
        let accountActions = new h.Setting(e).setName(i ? `${i.displayName || i.phone || "\u5DF2\u767B\u5F55"}${i.customerStage === "early" ? " \u00B7 \u65E9\u671F\u7528\u6237" : ""}` : "\u5C1A\u672A\u767B\u5F55").setDesc("\u767B\u5F55\u3001\u6CE8\u518C\u3001\u5207\u6362\u8D26\u53F7\u548C\u5FD8\u8BB0\u5BC6\u7801\u5747\u5728 NoteCloud \u7F51\u7AD9\u5B89\u5168\u5B8C\u6210\uFF0C\u63D2\u4EF6\u4E0D\u4FDD\u5B58\u5BC6\u7801");
        {
            accountActions.addButton((b) => b.setButtonText(i ? "\u5207\u6362\u8D26\u53F7" : "\u767B\u5F55").setCta().onClick(() => void this.plugin.beginWebAuth(i ? "switch" : "login")));
            accountActions.addButton((b) => b.setButtonText("\u6CE8\u518C").onClick(() => void this.plugin.beginWebAuth("register")));
            accountActions.addButton((b) => b.setButtonText("\u5FD8\u8BB0\u5BC6\u7801").onClick(() => this.plugin.openPasswordReset()));
        }
        new h.Setting(e).setName("NoteCloud \u7F51\u9875\u7248").setDesc("\u6D4F\u89C8\u4E91\u4ED3\u5E93\u3001\u5206\u4EAB\u7B14\u8BB0\u548C\u7BA1\u7406\u4E2A\u4EBA\u8D44\u6599").addButton((b) => b.setButtonText("\u6253\u5F00\u7F51\u7AD9").onClick(() => void this.plugin.openWebPortal()));
        if (i)
            new h.Setting(e).setName("\u9000\u51FA\u5F53\u524D\u8D26\u53F7").addButton((b) => b.setButtonText("\u9000\u51FA\u767B\u5F55").onClick(async () => {
                {
                    await this.plugin.logout();
                    this.refreshDisplay();
                }
            }));
        e.createEl("h3", { text: "\u989D\u5EA6" });
        let q2 = new h.Setting(e).setName("\u989D\u5EA6\u5151\u6362\u7801");
        {
            q2.addButton((b) => b.setButtonText("\u8F93\u5165\u5151\u6362\u7801").onClick(() => {
                {
                    this.redeemExpanded = true;
                    this.refreshDisplay();
                }
            }));
            q2.addButton((b) => b.setButtonText("\u8D2D\u4E70\u989D\u5EA6").setCta().onClick(() => window.open(`${s.serverUrl.replace(/\/$/, "")}/?purchase=1`, "_blank", "noopener,noreferrer")));
        }
        if (this.redeemExpanded) {
            let code = s.quotaCode || "";
            new h.Setting(e).setClass("notecloud-uniform-input").setName("\u8F93\u5165\u5151\u6362\u7801").addText((b) => b.setPlaceholder("\u8BF7\u8F93\u5165\u5151\u6362\u7801").setValue(code).onChange((v) => code = v)).addButton((b) => b.setButtonText("\u5151\u6362").setCta().onClick(async () => {
                s.quotaCode = code.trim();
                try {
                    {
                        await this.plugin.redeemQuotaCode();
                        this.redeemExpanded = false;
                        this.refreshDisplay();
                    }
                }
                catch (v) {
                    new h.Notice(v instanceof Error ? v.message : "\u5151\u6362\u5931\u8D25");
                }
            })).addButton((b) => b.setButtonText("\u53D6\u6D88").onClick(() => {
                {
                    this.redeemExpanded = false;
                    this.refreshDisplay();
                }
            }));
        }
        e.createEl("h3", { text: "\u540C\u6B65" });
        new h.Setting(e).setName("\u81EA\u52A8\u540C\u6B65").addToggle((b) => b.setValue(s.autoSync !== false).onChange(async (v) => {
            {
                s.autoSync = v;
                await this.persist();
                this.plugin.configureAutoSync();
                this.refreshDisplay();
            }
        }));
        if (s.autoSync !== false) {
            let input: HTMLInputElement;
            new h.Setting(e).setClass("notecloud-interval-input").setName("\u81EA\u52A8\u540C\u6B65\u95F4\u9694").addText((b) => {
                {
                    input = b.inputEl;
                    input.type = "number";
                    input.min = "1";
                    input.max = "60";
                    input.step = "1";
                    b.setValue(String(s.syncIntervalMinutes || 5)).onChange(async (v) => {
                        let n = Number.parseInt(v, 10);
                        if (Number.isFinite(n) && n >= 1 && n <= 60) {
                            s.syncIntervalMinutes = n;
                            await this.persist();
                            this.plugin.configureAutoSync();
                        }
                    });
                    input.addEventListener("blur", () => {
                        void (async () => {
                            let n = Math.max(1, Math.min(60, Number.parseInt(input.value, 10) || 5));
                            {
                                input.value = String(n);
                                s.syncIntervalMinutes = n;
                                await this.persist();
                                this.plugin.configureAutoSync();
                            }
                        })().catch(() => new h.Notice("设置保存失败，请稍后重试"));
                    });
                }
            });
        }
        new h.Setting(e).setName("\u5FEB\u6377\u952E\u540C\u6B65").addButton((b) => b.setButtonText("\u8BBE\u7F6E\u5FEB\u6377\u952E").onClick(() => this.plugin.openHotkeys()));
        e.createEl("h3", { text: "\u540C\u6B65\u8303\u56F4" });
        const controls: h.ToggleComponent[] = [];
        new h.Setting(e).setName("\u540C\u6B65\u6240\u6709\u6587\u4EF6\u5939").addToggle((b) => b.setValue(s.syncAllFolders).onChange(async (v) => {
            {
                s.syncAllFolders = v;
                controls.forEach((c) => { c.setDisabled(v); });
                await this.persist();
            }
        }));
        let folders = this.app.vault.getAllLoadedFiles().filter((b) => b instanceof h.TFolder && b.path).sort((b, v) => b.path.localeCompare(v.path)), items = [{ path: "/", name: "\u6839\u76EE\u5F55\u6587\u4EF6" }, ...folders.map((b) => ({ path: b.path, name: b.path }))];
        for (let item of items)
            new h.Setting(e).setName(item.name).addToggle((b) => {
                {
                    controls.push(b);
                    b.setValue(s.selectedFolders.includes(item.path)).setDisabled(s.syncAllFolders).onChange(async (v) => {
                        {
                            s.selectedFolders = v ? [... /* @__PURE__ */new Set([...s.selectedFolders, item.path])] : s.selectedFolders.filter((p) => p !== item.path);
                            await this.persist();
                        }
                    });
                }
            });
        e.createEl("h3", { text: "\u6587\u4EF6\u5904\u7406" });
        let serverMaxMb = Math.max(1, Math.floor((s.serviceStatus?.maxUploadBytes || 200 * 1024 * 1024) / 1024 / 1024));
        new h.Setting(e).setName("\u5927\u6587\u4EF6\u4E0A\u4F20\u4E0A\u9650").setDesc(`\u8D85\u8FC7 ${s.maxFileSizeMB} MB \u7684\u6587\u4EF6\u6682\u4E0D\u540C\u6B65\uFF1B\u670D\u52A1\u7AEF\u5F53\u524D\u4E0A\u9650 ${serverMaxMb} MB\u3002\u79FB\u52A8\u7AEF\u5EFA\u8BAE\u4FDD\u6301 50 MB \u4EE5\u4E0B`).addSlider((b) => b.setLimits(1, serverMaxMb, 1).setDynamicTooltip().setValue(Math.min(s.maxFileSizeMB, serverMaxMb)).onChange(async (v) => {
            {
                s.maxFileSizeMB = v;
                await this.persist();
            }
        }));
        new h.Setting(e).setName("\u6587\u4EF6\u51B2\u7A81\u5904\u7406").setDesc("Markdown \u4F18\u5148\u81EA\u52A8\u4E09\u65B9\u5408\u5E76\uFF1B\u65E0\u6CD5\u5408\u5E76\u65F6\u6309\u6B64\u7B56\u7565\u5904\u7406").addDropdown((b) => b.addOption("keep-both", "\u4FDD\u7559\u4E24\u4EFD\uFF08\u63A8\u8350\uFF09").addOption("local", "\u4F18\u5148\u672C\u5730").addOption("cloud", "\u4F18\u5148\u4E91\u7AEF").setValue(s.conflictStrategy || "keep-both").onChange(async (v) => {
            if (v === "keep-both" || v === "local" || v === "cloud")
                s.conflictStrategy = v;
            await this.persist();
        }));
        e.createEl("h3", { text: "\u66F4\u65B0\u4E0E\u901A\u77E5" });
        new h.Setting(e).setName("自动更新（BRAT）").setDesc("一次设置后，BRAT 可自动下载并重载新版本。添加 lby7469/obsidianplug，选择 latest，并开启“启动时自动更新 beta 插件”。需启动 Obsidian 且可连接 GitHub；固定版本不会自动更新。").addButton(b => b.setButtonText("设置自动更新").onClick(() => {
            const settings = settingsBridge(this.app);
            if (installedPlugin(this.app, "obsidian42-brat") && settings) {
                settings.open();
                settings.openTabById("obsidian42-brat");
            }
            else
                window.open("obsidian://show-plugin?id=obsidian42-brat", "_blank");
        }));
        let service = s.serviceStatus, updateAvailable = service && compareVersions(this.plugin.manifest.version, service.latestVersion) < 0, statusText = service ? `\u5F53\u524D ${this.plugin.manifest.version}\uFF0C\u6700\u65B0 ${service.latestVersion}\uFF1B\u4E0A\u6B21\u68C0\u67E5 ${new Date(s.lastServiceCheckAt).toLocaleString()}` : "\u5C1A\u672A\u68C0\u67E5";
        let updateSetting = new h.Setting(e).setName(updateAvailable ? "\u53D1\u73B0\u63D2\u4EF6\u65B0\u7248\u672C" : "\u63D2\u4EF6\u66F4\u65B0").setDesc(statusText).addButton((b) => b.setButtonText("\u7ACB\u5373\u68C0\u67E5").onClick(() => void this.plugin.checkServiceStatus(true)));
        if (updateAvailable && service) {
            const releaseUrl = service.releaseUrl;
            updateSetting.addButton((b) => b.setButtonText("\u6253\u5F00\u53D1\u5E03\u9875").setCta().onClick(() => window.open(releaseUrl, "_blank", "noopener,noreferrer")));
        }
        new h.Setting(e).setName("轻提示与图标动画").setDesc("每 5 分钟检查公告；未读公告显示在右下角和设置顶部，不强制弹窗。关闭后图标保持静态。").addToggle((b) => b.setValue(s.serviceNotices !== false).onChange(async (v) => {
            {
                s.serviceNotices = v;
                await this.persist();
                community.updateIcon(this.plugin);
            }
        }));
        new h.Setting(e).setName("意见反馈").setDesc("提出建议、报告问题或联系管理员。采纳后可获管理员发放的容量奖励。").addButton(b => b.setButtonText("提交反馈").onClick(() => community.openFeedback(this.plugin))).addButton(b => b.setButtonText("查看回复").onClick(() => void this.plugin.openWebPortal("/feedback")));
        let link = e.createEl("a", { text: "\u8BBF\u95EE NoteCloud \u7F51\u9875\u7248 \u2192", href: "#", cls: "notecloud-web-link" });
        link.onclick = (b) => {
            {
                b.preventDefault();
                void this.plugin.openWebPortal();
            }
        };
        community.renderHistory(this.plugin, e);
        renewal.settings(this.plugin, e);
    }
}
;
