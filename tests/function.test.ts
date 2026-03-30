import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, once, memoize, pipe, noop } from '../src/function';

describe('function', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  describe('debounce', () => {
    it('should debounce calls', () => {
      const fn = vi.fn();
      const d = debounce(fn, 100);
      d(); d(); d();
      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should support leading mode', () => {
      const fn = vi.fn();
      const d = debounce(fn, 100, { leading: true });
      d();
      expect(fn).toHaveBeenCalledTimes(1);
      d();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should support cancel', () => {
      const fn = vi.fn();
      const d = debounce(fn, 100);
      d();
      d.cancel();
      vi.advanceTimersByTime(200);
      expect(fn).not.toHaveBeenCalled();
    });

    it('should support flush', () => {
      const fn = vi.fn();
      const d = debounce(fn, 100);
      d(1, 2);
      d.flush();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not flush when no timer is active', () => {
      const fn = vi.fn();
      const d = debounce(fn, 100);
      d.flush();
      expect(fn).not.toHaveBeenCalled();
    });

    it('should handle trailing call after leading', () => {
      const fn = vi.fn();
      const d = debounce(fn, 100, { leading: true });
      d(); // leading fires
      expect(fn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100); // trailing timer fires but calledLeading=true
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle calls', () => {
      const fn = vi.fn();
      const t = throttle(fn, 100);
      t(); t(); t();
      expect(fn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2); // trailing call
    });

    it('should allow immediate call after interval', () => {
      const fn = vi.fn();
      const t = throttle(fn, 100);
      t();
      vi.advanceTimersByTime(100);
      t();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should support cancel', () => {
      const fn = vi.fn();
      const t = throttle(fn, 100);
      t(); t();
      t.cancel();
      vi.advanceTimersByTime(200);
      expect(fn).toHaveBeenCalledTimes(1); // only the first immediate call
    });
  });

  describe('once', () => {
    it('should only call once', () => {
      const fn = vi.fn().mockReturnValue(42);
      const o = once(fn);
      expect(o()).toBe(42);
      expect(o()).toBe(42);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('memoize', () => {
    it('should cache results', () => {
      const fn = vi.fn((x: number) => x * 2);
      const m = memoize(fn);
      expect(m(5)).toBe(10);
      expect(m(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should use custom key function', () => {
      const fn = vi.fn((a: number, b: number) => a + b);
      const m = memoize(fn, (a, b) => `${a}+${b}`);
      m(1, 2);
      m(1, 2);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should expose cache and clear', () => {
      const m = memoize((x: number) => x);
      m(1);
      expect(m.cache.size).toBe(1);
      m.clear();
      expect(m.cache.size).toBe(0);
    });
  });

  describe('pipe', () => {
    it('should pipe functions left-to-right', () => {
      const add1 = (x: number) => x + 1;
      const double = (x: number) => x * 2;
      const result = pipe(add1, double)(5);
      expect(result).toBe(12); // (5+1)*2
    });

    it('should handle single function', () => {
      const result = pipe((x: number) => x + 1)(5);
      expect(result).toBe(6);
    });

    it('should handle three functions', () => {
      const result = pipe(
        (x: number) => x + 1,
        (x: number) => x * 2,
        (x: number) => x.toString(),
      )(5);
      expect(result).toBe('12');
    });
  });

  describe('noop', () => {
    it('should return undefined', () => {
      expect(noop()).toBeUndefined();
    });
  });
});
