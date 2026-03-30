import { describe, it, expect } from 'vitest';
import {
  chunk, compact, flatten, unique, groupBy, sortBy,
  intersection, difference, zip, unzip, range, shuffle,
  sample, partition, take, drop,
} from '../src/array';

describe('array', () => {
  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });
    it('should floor fractional size', () => {
      expect(chunk([1, 2, 3, 4], 2.9)).toEqual([[1, 2], [3, 4]]);
    });
    it('should throw on invalid size', () => {
      expect(() => chunk([1], 0)).toThrow(RangeError);
      expect(() => chunk([1], -1)).toThrow(RangeError);
      expect(() => chunk([1], NaN)).toThrow(RangeError);
      expect(() => chunk([1], Infinity)).toThrow(RangeError);
    });
  });

  describe('compact', () => {
    it('should remove falsy values', () => {
      expect(compact([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([1, 2, 3]);
    });
    it('should handle empty array', () => {
      expect(compact([])).toEqual([]);
    });
  });

  describe('flatten', () => {
    it('should flatten one level by default', () => {
      expect(flatten([1, [2, [3]]])).toEqual([1, 2, [3]]);
    });
    it('should flatten deeply', () => {
      expect(flatten([1, [2, [3, [4]]]], 3)).toEqual([1, 2, 3, 4]);
    });
    it('should handle depth 0', () => {
      expect(flatten([1, [2]], 0)).toEqual([1, [2]]);
    });
    it('should handle empty array', () => {
      expect(flatten([])).toEqual([]);
    });
  });

  describe('unique', () => {
    it('should deduplicate primitives', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });
    it('should deduplicate by key function', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
      expect(unique(items, (i) => i.id)).toEqual([{ id: 1 }, { id: 2 }]);
    });
    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe('groupBy', () => {
    it('should group by key function', () => {
      const result = groupBy([1, 2, 3, 4, 5], (n) => n % 2 === 0 ? 'even' : 'odd');
      expect(result).toEqual({ odd: [1, 3, 5], even: [2, 4] });
    });
    it('should handle empty array', () => {
      expect(groupBy([], () => 'key')).toEqual({});
    });
  });

  describe('sortBy', () => {
    it('should sort ascending by default', () => {
      expect(sortBy([3, 1, 2], (n) => n)).toEqual([1, 2, 3]);
    });
    it('should sort descending', () => {
      expect(sortBy([3, 1, 2], (n) => n, 'desc')).toEqual([3, 2, 1]);
    });
    it('should sort by string key', () => {
      const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
      expect(sortBy(items, (i) => i.name)).toEqual([
        { name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' },
      ]);
    });
    it('should handle equal values', () => {
      expect(sortBy([1, 1, 1], (n) => n)).toEqual([1, 1, 1]);
    });
  });

  describe('intersection', () => {
    it('should return common items', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });
    it('should return empty for disjoint', () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });
  });

  describe('difference', () => {
    it('should return items in a not in b', () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });
    it('should return all if no overlap', () => {
      expect(difference([1, 2], [3, 4])).toEqual([1, 2]);
    });
  });

  describe('zip', () => {
    it('should zip arrays', () => {
      expect(zip([1, 2], ['a', 'b'])).toEqual([[1, 'a'], [2, 'b']]);
    });
    it('should truncate to shortest', () => {
      expect(zip([1, 2, 3], ['a'])).toEqual([[1, 'a']]);
    });
    it('should handle empty input', () => {
      expect(zip()).toEqual([]);
    });
  });

  describe('unzip', () => {
    it('should unzip tuples', () => {
      expect(unzip([[1, 'a'], [2, 'b']])).toEqual([[1, 2], ['a', 'b']]);
    });
    it('should handle empty', () => {
      expect(unzip([])).toEqual([]);
    });
  });

  describe('range', () => {
    it('should generate range', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
    });
    it('should support custom step', () => {
      expect(range(0, 10, 3)).toEqual([0, 3, 6, 9]);
    });
    it('should support negative step', () => {
      expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1]);
    });
    it('should throw on step 0', () => {
      expect(() => range(0, 5, 0)).toThrow(RangeError);
    });
    it('should throw on non-finite step', () => {
      expect(() => range(0, 5, Infinity)).toThrow(RangeError);
    });
    it('should return empty for invalid range', () => {
      expect(range(5, 0, 1)).toEqual([]);
    });
  });

  describe('shuffle', () => {
    it('should return array of same length', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      expect(result).toHaveLength(5);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });
    it('should not mutate original', () => {
      const arr = [1, 2, 3];
      shuffle(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('sample', () => {
    it('should return a single item', () => {
      const arr = [1, 2, 3];
      const item = sample(arr);
      expect(arr).toContain(item);
    });
    it('should return n items', () => {
      const arr = [1, 2, 3, 4, 5];
      const items = sample(arr, 3);
      expect(items).toHaveLength(3);
    });
    it('should return undefined for empty (no n)', () => {
      expect(sample([])).toBeUndefined();
    });
    it('should return empty array for empty (with n)', () => {
      expect(sample([], 3)).toEqual([]);
    });
    it('should handle n=0', () => {
      expect(sample([1, 2, 3], 0)).toEqual([]);
    });
  });

  describe('partition', () => {
    it('should split by predicate', () => {
      expect(partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)).toEqual([[2, 4], [1, 3, 5]]);
    });
    it('should handle empty', () => {
      expect(partition([], () => true)).toEqual([[], []]);
    });
  });

  describe('take', () => {
    it('should take first n', () => {
      expect(take([1, 2, 3, 4], 2)).toEqual([1, 2]);
    });
    it('should handle n > length', () => {
      expect(take([1, 2], 5)).toEqual([1, 2]);
    });
    it('should handle n=0', () => {
      expect(take([1, 2], 0)).toEqual([]);
    });
  });

  describe('drop', () => {
    it('should drop first n', () => {
      expect(drop([1, 2, 3, 4], 2)).toEqual([3, 4]);
    });
    it('should handle n > length', () => {
      expect(drop([1, 2], 5)).toEqual([]);
    });
    it('should handle n=0', () => {
      expect(drop([1, 2], 0)).toEqual([1, 2]);
    });
  });
});
