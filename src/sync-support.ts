export class ServiceError extends Error {
  constructor(message: string, public status = 0, public retryAfterMs = 0) { super(message); this.name = "ServiceError"; }
}
export const transient = (error: any) => !error?.status || error.status === 408 || error.status === 429 || error.status >= 500;
export async function timed<T>(operation: Promise<T>, milliseconds = 30000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  try { return await Promise.race([operation, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new ServiceError("连接超时，请检查网络后重试", 408)), milliseconds); })]); }
  finally { clearTimeout(timer!); }
}
export function base64(bytes: ArrayBuffer) {
  const view = new Uint8Array(bytes);
  let binary = "";
  for (let offset = 0; offset < view.length; offset += 8192) binary += String.fromCharCode(...view.subarray(offset, offset + 8192));
  return btoa(binary);
}
export function safeSyncPath(path: string, configDir = ".obsidian") {
  return !!path && !path.includes(String.fromCharCode(92)) && !path.split("/").some(part => !part || part === "." || part === "..") && path !== configDir && !path.startsWith(configDir + "/") && !path.startsWith(".obsidian/") && !path.startsWith(".trash/");
}
// Wait for every started job before returning; bound simultaneous in-memory files.
export async function runBounded<T>(items: T[], limit: number, bytes: (item: T) => number, budget: number, work: (item: T) => Promise<void>, stopped: () => boolean) {
  let index = 0, activeBytes = 0;
  const active = new Set<Promise<void>>();
  let fatal: unknown;
  while ((index < items.length && !stopped() && !fatal) || active.size) {
    while (index < items.length && !stopped() && !fatal && active.size < limit) {
      const item = items[index], weight = Math.max(1, bytes(item));
      if (active.size && activeBytes + weight > budget) break;
      index++; activeBytes += weight;
      let job: Promise<void>;
      job = Promise.resolve().then(() => work(item)).catch(error => { fatal ||= error; }).finally(() => { activeBytes -= weight; active.delete(job); });
      active.add(job);
    }
    if (active.size) await Promise.race(active); else break;
  }
  if (fatal) throw fatal;
}
type Account = { id: string; usedBytes: number; quotaBytes: number; [key: string]: unknown };
type RefreshOptions = {
  identity: () => string;
  read: () => Promise<Account>;
  apply: (account: Account) => Promise<void>;
  error: (error: unknown) => void;
  now?: () => number;
};
export class AccountRefresh {
  private pending?: { identity: string; promise: Promise<Account | undefined> };
  private lastIdentity = "";
  private lastAttempt = 0;
  constructor(private options: RefreshOptions) {}
  async refresh(force = false, interval = 60000) {
    const identity = this.options.identity(), now = (this.options.now || Date.now)();
    if (!identity) return;
    if (this.pending?.identity === identity) return this.pending.promise;
    if (!force && this.lastIdentity === identity && now - this.lastAttempt < interval) return;
    this.lastIdentity = identity; this.lastAttempt = now;
    const promise = this.options.read().then(async account => {
      if (this.options.identity() !== identity) return;
      if (!account?.id || !Number.isFinite(account.quotaBytes) || !Number.isFinite(account.usedBytes)) throw Error("账户信息格式异常");
      await this.options.apply(account);
      return account;
    }).catch(error => { if (this.options.identity() === identity) this.options.error(error); return undefined; })
      .finally(() => { if (this.pending?.promise === promise) this.pending = undefined; });
    this.pending = { identity, promise };
    return promise;
  }
}
