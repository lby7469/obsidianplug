/** Wire formats are deliberately decoded from unknown, never trusted as executable input. */
export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt?: string;
  format?: "text" | "markdown";
  linkUrl?: string;
  active?: boolean;
}
export interface RenewalNotice { title: string; message: string; level?: string }
export interface Account {
  id: string;
  usedBytes: number;
  quotaBytes: number;
  displayName?: string;
  phone?: string;
  customerStage?: string;
  syncWritesAllowed?: boolean;
  renewalNotice?: RenewalNotice;
  subscription?: { expiresAt: string };
}
export interface AuthTokens extends Account { token: string; refreshToken: string; expiresIn: number }
export interface ServiceStatus {
  latestVersion: string;
  releaseUrl: string;
  maxUploadBytes?: number;
  maxChunkSize?: number;
  fastUploadBytes?: number;
  announcements: Announcement[];
}
export interface SyncState { hash: string; remoteRevision: string; baseContent?: string }
export interface PendingAuth { verifier: string; state: string; createdAt: number }
export interface PluginSettings {
  serverUrl: string;
  websiteUrl: string;
  phone: string;
  password: string;
  quotaCode: string;
  token: string;
  refreshToken: string;
  tokenExpiresAt: number;
  pendingAuth?: PendingAuth;
  state: Record<string, SyncState>;
  stateAccountId?: string;
  accountSwitchPending?: boolean;
  account?: Account;
  syncAllFolders: boolean;
  selectedFolders: string[];
  autoSync: boolean;
  syncIntervalMinutes: number;
  maxFileSizeMB: number;
  conflictStrategy: "keep-both" | "local" | "cloud";
  serviceNotices: boolean;
  renewalNoticeAnimation?: boolean;
  lastServiceCheckAt: number;
  seenAnnouncementIds: string[];
  readAnnouncementIds?: string[];
  deletedAnnouncementIds?: string[];
  announcementHistory?: Announcement[];
  notifiedUpdateVersion: string;
  serviceStatus?: ServiceStatus;
  lastSyncAt?: string;
}
export interface RemoteFile { path: string; revision: string; size: number }
export interface SyncManifest { files: RemoteFile[]; syncWritesAllowed?: boolean }
export interface UploadResult { uploadId: string; complete: boolean; chunkSize: number; record?: RemoteFile }
export interface AuthPolicy { passwordHint: string; emailCodeLength: number; emailCodeExpiresMinutes: number }
export interface RequestOptions { method?: string; body?: string; headers?: HeadersInit }

export function objectValue(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("服务器返回的数据格式异常");
  return value as Record<string, unknown>;
}
export function stringValue(value: unknown): string {
  if (typeof value !== "string") throw new Error("服务器返回的文字字段异常");
  return value;
}
function numberValue(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("服务器返回的数字字段异常");
  return value;
}
const optionalString = (value: unknown): string | undefined => typeof value === "string" ? value : undefined;
const optionalNumber = (value: unknown): number | undefined => typeof value === "number" && Number.isFinite(value) ? value : undefined;
const optionalBoolean = (value: unknown): boolean | undefined => typeof value === "boolean" ? value : undefined;
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
export function readAccount(value: unknown): Account {
  const data = objectValue(value);
  const notice = data.renewalNotice ? objectValue(data.renewalNotice) : undefined;
  const subscription = data.subscription ? objectValue(data.subscription) : undefined;
  return {
    ...data,
    id: stringValue(data.id), usedBytes: numberValue(data.usedBytes), quotaBytes: numberValue(data.quotaBytes),
    displayName: optionalString(data.displayName), phone: optionalString(data.phone), customerStage: optionalString(data.customerStage),
    syncWritesAllowed: optionalBoolean(data.syncWritesAllowed),
    renewalNotice: notice ? { title: stringValue(notice.title), message: stringValue(notice.message), level: optionalString(notice.level) } : undefined,
    subscription: subscription ? { ...subscription, expiresAt: stringValue(subscription.expiresAt) } : undefined,
  };
}
export function readTokens(value: unknown): AuthTokens {
  const data = objectValue(value);
  return { ...readAccount(value), token: stringValue(data.token), refreshToken: stringValue(data.refreshToken), expiresIn: numberValue(data.expiresIn) };
}
function readAnnouncement(value: unknown): Announcement {
  const data = objectValue(value);
  return { id: stringValue(data.id), title: stringValue(data.title), message: stringValue(data.message), createdAt: optionalString(data.createdAt), format: data.format === "markdown" ? "markdown" : "text", linkUrl: optionalString(data.linkUrl), active: optionalBoolean(data.active) };
}
export function readStatus(value: unknown): ServiceStatus {
  const data = objectValue(value);
  return { ...data, latestVersion: stringValue(data.latestVersion), releaseUrl: stringValue(data.releaseUrl), maxUploadBytes: optionalNumber(data.maxUploadBytes), maxChunkSize: optionalNumber(data.maxChunkSize), fastUploadBytes: optionalNumber(data.fastUploadBytes), announcements: Array.isArray(data.announcements) ? data.announcements.map(readAnnouncement) : [] };
}
export function readRemoteFile(value: unknown): RemoteFile {
  const data = objectValue(value);
  return { path: stringValue(data.path), revision: stringValue(data.revision), size: numberValue(data.size) };
}
export function readManifest(value: unknown): SyncManifest {
  const data = objectValue(value);
  if (!Array.isArray(data.files)) throw new Error("同步文件清单格式异常");
  return { files: data.files.map(readRemoteFile), syncWritesAllowed: optionalBoolean(data.syncWritesAllowed) };
}
export function readUpload(value: unknown, requireSession = true): UploadResult {
  const data = objectValue(value);
  return { uploadId: requireSession ? stringValue(data.uploadId) : "", complete: data.complete === true, chunkSize: optionalNumber(data.chunkSize) || 0, record: data.record ? readRemoteFile(data.record) : undefined };
}
export function readPolicy(value: unknown): AuthPolicy {
  const data = objectValue(value);
  return { passwordHint: stringValue(data.passwordHint), emailCodeLength: numberValue(data.emailCodeLength), emailCodeExpiresMinutes: numberValue(data.emailCodeExpiresMinutes) };
}
export function errorMessage(value: unknown, fallback = "同步失败"): string {
  if (value instanceof Error && value.message) return value.message;
  if (value && typeof value === "object" && "message" in value && typeof value.message === "string") return value.message || fallback;
  return fallback;
}
export function errorStatus(value: unknown): number {
  return value && typeof value === "object" && "status" in value && typeof value.status === "number" ? value.status : 0;
}
export function retryAfter(value: unknown): number {
  return value && typeof value === "object" && "retryAfterMs" in value && typeof value.retryAfterMs === "number" ? value.retryAfterMs : 0;
}
function cachedValue<T>(value: unknown, decode: (input: unknown) => T): T | undefined {
  try { return decode(value); }
  catch { return undefined; /* An invalid optional cache must not discard authentication or sync state. */ }
}
/** Preserve line terminators exactly, matching split-after-LF without regex lookbehind. */
export function splitLinesAfterLF(value: string): string[] {
  if (!value) return [""];
  const lines: string[] = [];
  let offset = 0;
  for (let position = 0; position < value.length; position++) {
    if (value.charCodeAt(position) === 10) { lines.push(value.slice(offset, position + 1)); offset = position + 1; }
  }
  if (offset < value.length) lines.push(value.slice(offset));
  return lines;
}
export function readSettings(value: unknown, defaults: PluginSettings): PluginSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...defaults, state: {}, selectedFolders: [], seenAnnouncementIds: [] };
  const data = objectValue(value);
  const state: Record<string, SyncState> = {};
  if (data.state && typeof data.state === "object" && !Array.isArray(data.state)) for (const [path, raw] of Object.entries(data.state)) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const entry = objectValue(raw);
    if (typeof entry.hash === "string" && typeof entry.remoteRevision === "string") state[path] = { hash: entry.hash, remoteRevision: entry.remoteRevision, baseContent: optionalString(entry.baseContent) };
  }
  const pending = data.pendingAuth && typeof data.pendingAuth === "object" && !Array.isArray(data.pendingAuth) ? objectValue(data.pendingAuth) : undefined;
  return {
    ...defaults, ...data,
    serverUrl: optionalString(data.serverUrl) || defaults.serverUrl, websiteUrl: optionalString(data.websiteUrl) || defaults.websiteUrl,
    phone: optionalString(data.phone) || "", password: "", quotaCode: optionalString(data.quotaCode) || "",
    token: optionalString(data.token) || "", refreshToken: optionalString(data.refreshToken) || "", tokenExpiresAt: optionalNumber(data.tokenExpiresAt) || 0,
    pendingAuth: pending && typeof pending.verifier === "string" && typeof pending.state === "string" && typeof pending.createdAt === "number" ? { verifier: pending.verifier, state: pending.state, createdAt: pending.createdAt } : undefined,
    state, stateAccountId: optionalString(data.stateAccountId), accountSwitchPending: optionalBoolean(data.accountSwitchPending), account: data.account ? cachedValue(data.account, readAccount) : undefined,
    syncAllFolders: optionalBoolean(data.syncAllFolders) ?? defaults.syncAllFolders, selectedFolders: strings(data.selectedFolders), autoSync: optionalBoolean(data.autoSync) ?? defaults.autoSync,
    syncIntervalMinutes: optionalNumber(data.syncIntervalMinutes) ?? defaults.syncIntervalMinutes, maxFileSizeMB: optionalNumber(data.maxFileSizeMB) ?? defaults.maxFileSizeMB,
    conflictStrategy: data.conflictStrategy === "local" || data.conflictStrategy === "cloud" ? data.conflictStrategy : "keep-both",
    serviceNotices: optionalBoolean(data.serviceNotices) ?? defaults.serviceNotices, renewalNoticeAnimation: optionalBoolean(data.renewalNoticeAnimation),
    lastServiceCheckAt: optionalNumber(data.lastServiceCheckAt) || 0, seenAnnouncementIds: strings(data.seenAnnouncementIds), readAnnouncementIds: strings(data.readAnnouncementIds), deletedAnnouncementIds: strings(data.deletedAnnouncementIds),
    announcementHistory: Array.isArray(data.announcementHistory) ? data.announcementHistory.flatMap((item: unknown) => { const parsed = cachedValue(item, readAnnouncement); return parsed ? [parsed] : []; }) : undefined,
    notifiedUpdateVersion: optionalString(data.notifiedUpdateVersion) || "", serviceStatus: data.serviceStatus ? cachedValue(data.serviceStatus, readStatus) : undefined, lastSyncAt: optionalString(data.lastSyncAt),
  };
}
