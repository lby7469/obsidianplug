import { readSettings } from "./plugin-types";
import type { PluginSettings } from "./plugin-types";
import type { App, PluginManifest } from "obsidian";

export const OFFICIAL_ENTRY_URL = "https://notecloud.cloud";
const LEGACY_API_URL = "https://api.notecloud.asia";
const LEGACY_WEBSITE_URL = "https://notecloud.asia";

/** Only known HTTPS origins qualify. Never normalize a path, userinfo or lookalike into an official entry. */
function officialOrigin(value: string): string | undefined {
    if (!/^https:\/\/(?:api\.notecloud\.asia|notecloud\.asia|notecloud\.cloud)\/?$/i.test(value)) return;
    return new URL(value).origin;
}

/** The two official entries reach the same account database and sync revisions. */
export function prepareOfficialEntry(raw: unknown, defaults: PluginSettings): { settings: PluginSettings; migrated: boolean } {
    const saved = raw !== null && typeof raw === "object" && !Array.isArray(raw) && Object.keys(raw).length > 0;
    // Older versions supplied these defaults for omitted fields. Preserve that
    // interpretation for custom servers; a new install uses the new entry.
    const previousDefaults = saved ? { ...defaults, serverUrl: LEGACY_API_URL, websiteUrl: LEGACY_WEBSITE_URL } : defaults;
    const settings = readSettings(raw, previousDefaults);
    const server = officialOrigin(settings.serverUrl), website = officialOrigin(settings.websiteUrl);
    const migrated = (server === LEGACY_API_URL || server === LEGACY_WEBSITE_URL) && website === LEGACY_WEBSITE_URL;
    if (!migrated) return { settings, migrated: false };
    return {
        migrated: true,
        settings: {
            ...settings,
            serverUrl: OFFICIAL_ENTRY_URL,
            websiteUrl: OFFICIAL_ENTRY_URL,
            // An incomplete browser login belongs to the old entry. Existing
            // sessions and all sync comparison state remain valid and intact.
            pendingAuth: undefined,
            serviceStatus: undefined,
            lastServiceCheckAt: 0,
        },
    };
}

export interface EntryMigrationMarker {
    schema: 1;
    from: "https://api.notecloud.asia";
    to: "https://notecloud.cloud";
    installationId: string;
    sessionId: string;
}
export interface EntryMigrationRestart {
    ready: boolean;
    markerPath: string;
    marker: EntryMigrationMarker;
}
const INSTALLATION_STORAGE_KEY = "notecloud-sync:official-entry-installation:v1";
const SESSION_KEY = Symbol.for("notecloud-sync.official-entry-session.v1");
const RANDOM_ID = /^[a-f0-9]{48}$/;
function randomId(): string {
    return [...crypto.getRandomValues(new Uint8Array(24))].map(byte => byte.toString(16).padStart(2, "0")).join("");
}
function realmSessionId(): string {
    // This is our own non-secret marker only, not an Obsidian/global API patch.
    if (!Object.prototype.hasOwnProperty.call(window, SESSION_KEY))
        Object.defineProperty(window, SESSION_KEY, { value: randomId(), enumerable: false, configurable: false, writable: false });
    const id: unknown = Reflect.get(window, SESSION_KEY);
    if (typeof id !== "string" || !RANDOM_ID.test(id)) throw new Error("Invalid migration session marker");
    return id;
}
function installationId(app: App): string {
    // Browser storage is device-local and available at the documented Obsidian
    // 1.5 minimum. Only our non-secret installation marker is stored here.
    const key = `${INSTALLATION_STORAGE_KEY}:${encodeURIComponent(app.vault.getName())}:${encodeURIComponent(app.vault.configDir)}`;
    const read = (): unknown => window.localStorage.getItem(key);
    const write = (id: string) => window.localStorage.setItem(key, id);
    let stored = read();
    if (stored === undefined || stored === null) {
        const id = randomId();
        write(id);
        stored = read();
        if (stored !== id) throw new Error("Migration device marker was not saved");
    }
    if (typeof stored !== "string" || !RANDOM_ID.test(stored)) throw new Error("Invalid migration device marker");
    return stored;
}
function ownMarkerPath(app: App, manifest: PluginManifest): { directory: string; file: string } {
    const config = app.vault.configDir;
    if (manifest.id !== "notecloud-sync" || !config || /[\\:]/.test(config) || [...config].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) || config.split("/").some(part => !part || part === "." || part === ".."))
        throw new Error("Invalid plugin configuration directory");
    const directory = `${config}/plugins/notecloud-sync`;
    if (manifest.dir !== undefined && manifest.dir !== directory) throw new Error("Unexpected plugin installation directory");
    return { directory, file: `${directory}/entry-migration-pending-v1.json` };
}
function readMarkerJson(value: string): EntryMigrationMarker {
    if (value.length > 1024) throw new Error("Migration marker is too large");
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid migration marker");
    const marker = parsed as Record<string, unknown>;
    if (Object.keys(marker).length !== 5 || marker.schema !== 1 || marker.from !== LEGACY_API_URL || marker.to !== OFFICIAL_ENTRY_URL ||
        typeof marker.installationId !== "string" || !RANDOM_ID.test(marker.installationId) || typeof marker.sessionId !== "string" || !RANDOM_ID.test(marker.sessionId))
        throw new Error("Invalid migration marker");
    return marker as unknown as EntryMigrationMarker;
}
async function readMarker(app: App, file: string): Promise<EntryMigrationMarker | undefined> {
    const stat = await app.vault.adapter.stat(file);
    if (!stat) return;
    if (stat.type !== "file" || !Number.isSafeInteger(stat.size) || stat.size < 1 || stat.size > 1024) throw new Error("Invalid migration marker file");
    return readMarkerJson(await app.vault.adapter.read(file));
}
function sameMarker(left: EntryMigrationMarker, right: EntryMigrationMarker): boolean {
    return left.installationId === right.installationId && left.sessionId === right.sessionId;
}
/** Old 0.5.0 async saves can outlive a hot reload. Wait for a new app realm,
 * bound to this device, without touching data.json while the old code can run. */
export async function ensureEntryMigrationRestart(app: App, manifest: PluginManifest): Promise<EntryMigrationRestart> {
    const path = ownMarkerPath(app, manifest);
    if ((await app.vault.adapter.stat(path.directory))?.type !== "folder") throw new Error("Plugin directory unavailable");
    const current: EntryMigrationMarker = { schema: 1, from: LEGACY_API_URL, to: OFFICIAL_ENTRY_URL, installationId: installationId(app), sessionId: realmSessionId() };
    const previous = await readMarker(app, path.file);
    if (previous && previous.installationId === current.installationId && previous.sessionId !== current.sessionId)
        return { ready: true, markerPath: path.file, marker: previous };
    if (!previous || !sameMarker(previous, current)) {
        await app.vault.adapter.write(path.file, JSON.stringify(current) + "\n");
        const saved = await readMarker(app, path.file);
        if (!saved || !sameMarker(saved, current)) throw new Error("Migration restart marker was not saved");
    }
    return { ready: false, markerPath: path.file, marker: current };
}
export async function finishEntryMigration(app: App, manifest: PluginManifest, restart: EntryMigrationRestart): Promise<void> {
    const path = ownMarkerPath(app, manifest);
    if (!restart.ready || restart.markerPath !== path.file) throw new Error("Unexpected migration cleanup");
    const current = await readMarker(app, path.file);
    if (current && sameMarker(current, restart.marker)) await app.vault.adapter.remove(path.file);
}

/** A browser ticket must never send its credential to a different website. */
export function checkedPortalUrl(value: string, websiteUrl: string): URL {
    const website = new URL(websiteUrl), target = new URL(value);
    // Custom deployments retain their existing HTTP/HTTPS configuration. The
    // official entries are HTTPS-only and migration never selects a custom URL.
    if (!["https:", "http:"].includes(website.protocol) || website.username || website.password ||
        target.protocol !== website.protocol || target.username || target.password || target.origin !== website.origin) {
        throw new Error("网页地址与当前服务入口不一致，请重试");
    }
    return target;
}
