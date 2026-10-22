export interface AutoSyncClock {
  now(): number;
  set(callback: () => void, delay: number): number;
  clear(timer: number): void;
}
interface AutoSyncOptions {
  allowed(): boolean;
  identity(): string;
  run(): Promise<void>;
  clock?: AutoSyncClock;
}

// Requests describe actual events, not a persistent dirty flag. An oversized file
// or a paused account must never create an immediate automatic retry loop.
export class AutoSyncCoordinator {
  private clock: AutoSyncClock;
  private timer?: number;
  private firstChangeAt?: number;
  private serial = 0;
  private generation = 0;
  private runGeneration = 0;
  private cancellation = 0;
  private runCancellation = 0;
  private running = false;
  private disposed = false;

  constructor(private options: AutoSyncOptions) {
    this.clock = options.clock || {
      now: () => Date.now(),
      set: (callback, delay) => window.setTimeout(callback, delay),
      clear: timer => window.clearTimeout(timer)
    };
  }
  changed(): void {
    this.generation++;
    if (!this.eligible()) { this.clearQueued(); return; }
    if (this.running) return;
    const now = this.clock.now();
    this.firstChangeAt ??= now;
    this.schedule(Math.max(0, Math.min(now + 2000, this.firstChangeAt + 10000) - now));
  }
  wake(): void {
    if (!this.eligible() || this.running) return;
    this.schedule(300);
  }
  // Starting work while a page is being hidden is best effort, not a promise
  // that a mobile OS will keep the process, network, or timers alive.
  flush(): void {
    if (!this.eligible() || this.running) return;
    this.clearQueued();
    this.dispatch(this.options.identity());
  }
  begin(): void {
    this.clearQueued();
    this.running = true;
    this.runGeneration = this.generation;
    this.runCancellation = this.cancellation;
  }
  finish(needsFollowUp: boolean): void {
    this.running = false;
    if (needsFollowUp && this.generation !== this.runGeneration && this.runCancellation === this.cancellation && this.eligible()) {
      this.firstChangeAt = this.clock.now();
      this.schedule(2000);
    }
  }
  cancel(): void {
    this.cancellation++;
    this.clearQueued();
  }
  dispose(): void {
    this.disposed = true;
    this.cancel();
  }
  private eligible(): boolean {
    return !this.disposed && this.options.allowed() && !!this.options.identity();
  }
  private clearQueued(): void {
    this.serial++;
    if (this.timer !== undefined) this.clock.clear(this.timer);
    this.timer = undefined;
    this.firstChangeAt = undefined;
  }
  private schedule(delay: number): void {
    const first = this.firstChangeAt;
    this.clearQueued();
    this.firstChangeAt = first;
    const serial = this.serial, identity = this.options.identity();
    this.timer = this.clock.set(() => {
      if (serial !== this.serial) return;
      this.timer = undefined;
      this.firstChangeAt = undefined;
      this.dispatch(identity);
    }, delay);
  }
  private dispatch(identity: string): void {
    if (!this.eligible() || this.running || identity !== this.options.identity()) return;
    // The sync engine owns errors/status and calls begin()/finish(). A rejected
    // callback must not become an unhandled rejection or an automatic retry.
    void this.options.run().catch(() => {});
  }
}
