import { describe, it, expect } from 'vitest';
import {
  pick, omit, merge, get, set,
  mapKeys, mapValues, invert, isEmpty, clone,
} from '../src/object';

describe('object', () => {
  describe('pick', () => {
    it('should pick specified keys', () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
    it('should handle missing keys', () => {
      expect(pick({ a: 1 } as Record<string, number>, ['a', 'b' as never])).toEqual({ a: 1 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
    });
    it('should handle empty keys', () => {
      expect(omit({ a: 1 }, [])).toEqual({ a: 1 });
    });
  });

  describe('merge', () => {
    it('should deep merge objects', () => {
      expect(merge({ a: { x: 1 } }, { a: { y: 2 } })).toEqual({ a: { x: 1, y: 2 } });
    });
    it('should override non-object values', () => {
      expect(merge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    });
    it('should handle arrays (replace, not merge)', () => {
      expect(merge({ a: [1] }, { a: [2, 3] })).toEqual({ a: [2, 3] });
    });
    it('should merge multiple sources', () => {
      expect(merge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
    });
    it('should not merge non-plain objects into plain', () => {
      const date = new Date('2020-01-01');
      expect(merge({ a: { x: 1 } }, { a: date })).toEqual({ a: date });
    });
  });

  describe('get', () => {
    it('should get nested value', () => {
      expect(get({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42);
    });
    it('should return default for missing path', () => {
      expect(get({ a: 1 }, 'b.c', 'default')).toBe('default');
    });
    it('should handle null in path', () => {
      expect(get({ a: null }, 'a.b', 'def')).toBe('def');
    });
    it('should return value if found (no default needed)', () => {
      expect(get({ a: 0 }, 'a')).toBe(0);
    });
    it('should return default for undefined value', () => {
      expect(get({ a: undefined }, 'a', 'def')).toBe('def');
    });
  });

  describe('set', () => {
    it('should set nested value immutably', () => {
      const obj = { a: { b: 1 } };
      const result = set(obj, 'a.b', 2);
      expect(result).toEqual({ a: { b: 2 } });
      expect(obj.a.b).toBe(1); // original unchanged
    });
    it('should create nested path', () => {
      expect(set({} as any, 'a.b.c', 42)).toEqual({ a: { b: { c: 42 } } });
    });
    it('should overwrite non-object path segments', () => {
      expect(set({ a: 1 } as any, 'a.b', 2)).toEqual({ a: { b: 2 } });
    });
  });

  describe('mapKeys', () => {
    it('should transform keys', () => {
      expect(mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase())).toEqual({ A: 1, B: 2 });
    });
  });

  describe('mapValues', () => {
    it('should transform values', () => {
      expect(mapValues({ a: 1, b: 2 }, (v) => (v as number) * 2)).toEqual({ a: 2, b: 4 });
    });
  });

  describe('invert', () => {
    it('should swap keys and values', () => {
      expect(invert({ a: '1', b: '2' })).toEqual({ '1': 'a', '2': 'b' });
    });
    it('should handle numeric values', () => {
      expect(invert({ x: 10, y: 20 })).toEqual({ '10': 'x', '20': 'y' });
    });
  });

  describe('isEmpty', () => {
    it('should detect empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });
    it('should detect non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should shallow clone object', () => {
      const obj = { a: { b: 1 } };
      const c = clone(obj);
      expect(c).toEqual(obj);
      expect(c).not.toBe(obj);
      expect(c.a).toBe(obj.a); // shallow
    });
    it('should deep clone object', () => {
      const obj = { a: { b: 1 } };
      const c = clone(obj, true);
      expect(c).toEqual(obj);
      expect(c.a).not.toBe(obj.a); // deep
    });
    it('should clone arrays', () => {
      const arr = [1, [2, 3]];
      const shallow = clone(arr);
      expect(shallow).toEqual(arr);
      expect(shallow[1]).toBe(arr[1]);

      const deep = clone(arr, true);
      expect(deep).toEqual(arr);
      expect(deep[1]).not.toBe(arr[1]);
    });
    it('should return primitives as-is', () => {
      expect(clone(42)).toBe(42);
      expect(clone('hello')).toBe('hello');
      expect(clone(null)).toBe(null);
    });
    it('should return non-plain objects as-is', () => {
      const d = new Date();
      expect(clone(d, true)).toBe(d);
    });
  });
});
