import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sleep, pLimit, pRetry, pTimeout, pAll } from '../src/promise';

describe('promise', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  describe('sleep', () => {
    it('should resolve after ms', async () => {
      const p = sleep(100);
      vi.advanceTimersByTime(100);
      await p;
    });
  });

  describe('pLimit', () => {
    it('should limit concurrency', async () => {
      vi.useRealTimers();
      let running = 0;
      let maxRunning = 0;
      const limit = pLimit(2);
      const task = () => limit(async () => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise((r) => setTimeout(r, 10));
        running--;
      });
      await Promise.all([task(), task(), task(), task()]);
      expect(maxRunning).toBe(2);
    });
    it('should throw on invalid concurrency', () => {
      expect(() => pLimit(0)).toThrow(RangeError);
      expect(() => pLimit(-1)).toThrow(RangeError);
      expect(() => pLimit(NaN)).toThrow(RangeError);
      expect(() => pLimit(Infinity)).toThrow(RangeError);
    });
    it('should propagate errors', async () => {
      vi.useRealTimers();
      const limit = pLimit(1);
      await expect(limit(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    });
  });

  describe('pRetry', () => {
    it('should retry on failure', async () => {
      vi.useRealTimers();
      let count = 0;
      const result = await pRetry(async () => {
        count++;
        if (count < 3) throw new Error('fail');
        return 'ok';
      }, { retries: 5 });
      expect(result).toBe('ok');
      expect(count).toBe(3);
    });
    it('should throw after max retries', async () => {
      vi.useRealTimers();
      await expect(
        pRetry(() => Promise.reject(new Error('always')), { retries: 2 }),
      ).rejects.toThrow('always');
    });
    it('should support delay between retries', async () => {
      let count = 0;
      const p = pRetry(async () => {
        count++;
        if (count < 2) throw new Error('fail');
        return 'ok';
      }, { retries: 3, delay: 100 });
      await vi.advanceTimersByTimeAsync(200);
      const result = await p;
      expect(result).toBe('ok');
    });
    it('should use default options (3 retries, no delay)', async () => {
      vi.useRealTimers();
      let count = 0;
      const result = await pRetry(async () => {
        count++;
        if (count < 3) throw new Error('fail');
        return 'done';
      });
      expect(result).toBe('done');
      expect(count).toBe(3);
    });
  });

  describe('pTimeout', () => {
    it('should resolve if fast enough', async () => {
      const p = pTimeout(
        new Promise((r) => setTimeout(() => r('ok'), 50)),
        200,
      );
      await vi.advanceTimersByTimeAsync(100);
      expect(await p).toBe('ok');
    });
    it('should reject on timeout', async () => {
      // Use a never-resolving promise; suppress its internal rejection after timeout
      let rejectInner!: (err: unknown) => void;
      const inner = new Promise<never>((_, rej) => { rejectInner = rej; });
      const p = pTimeout(inner, 100);
      p.catch(() => {}); // suppress outer timeout rejection for this test
      await vi.advanceTimersByTimeAsync(101);
      await expect(p).rejects.toThrow('timed out');
      // cleanup: reject inner to settle it cleanly
      rejectInner(new Error('cleanup'));
    });
    it('should propagate errors', async () => {
      // inner rejects immediately; pTimeout must propagate the error.
      // pTimeout calls promise.catch(() => {}) eagerly so Node does not emit
      // PromiseRejectionHandledWarning when the rejection fires before the
      // outer .then handler is attached.
      const p = pTimeout(
        new Promise<never>((_, rej) => { rej(new Error('inner')); }),
        1000,
      );
      await expect(p).rejects.toThrow('inner');
    });
  });

  describe('pAll', () => {
    it('should execute all tasks', async () => {
      vi.useRealTimers();
      const results = await pAll([
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3),
      ]);
      expect(results).toEqual([1, 2, 3]);
    });
    it('should limit concurrency', async () => {
      vi.useRealTimers();
      let running = 0;
      let maxRunning = 0;
      const results = await pAll(
        [1, 2, 3, 4].map((n) => async () => {
          running++;
          maxRunning = Math.max(maxRunning, running);
          await new Promise((r) => setTimeout(r, 10));
          running--;
          return n;
        }),
        2,
      );
      expect(results).toEqual([1, 2, 3, 4]);
      expect(maxRunning).toBe(2);
    });
  });
});
