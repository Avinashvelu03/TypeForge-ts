import { describe, it, expect } from 'vitest';
import {
  camelCase, snakeCase, kebabCase, pascalCase,
  capitalize, truncate, slugify, escapeHtml,
} from '../src/string';

describe('string', () => {
  describe('camelCase', () => {
    it('should convert snake_case', () => { expect(camelCase('hello_world')).toBe('helloWorld'); });
    it('should convert kebab-case', () => { expect(camelCase('hello-world')).toBe('helloWorld'); });
    it('should convert PascalCase', () => { expect(camelCase('HelloWorld')).toBe('helloWorld'); });
    it('should convert spaces', () => { expect(camelCase('hello world')).toBe('helloWorld'); });
    it('should handle empty', () => { expect(camelCase('')).toBe(''); });
  });

  describe('snakeCase', () => {
    it('should convert camelCase', () => { expect(snakeCase('helloWorld')).toBe('hello_world'); });
    it('should convert kebab-case', () => { expect(snakeCase('hello-world')).toBe('hello_world'); });
    it('should convert spaces', () => { expect(snakeCase('hello world')).toBe('hello_world'); });
  });

  describe('kebabCase', () => {
    it('should convert camelCase', () => { expect(kebabCase('helloWorld')).toBe('hello-world'); });
    it('should convert snake_case', () => { expect(kebabCase('hello_world')).toBe('hello-world'); });
  });

  describe('pascalCase', () => {
    it('should convert snake_case', () => { expect(pascalCase('hello_world')).toBe('HelloWorld'); });
    it('should convert camelCase', () => { expect(pascalCase('helloWorld')).toBe('HelloWorld'); });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => { expect(capitalize('hello')).toBe('Hello'); });
    it('should handle empty', () => { expect(capitalize('')).toBe(''); });
    it('should handle single char', () => { expect(capitalize('a')).toBe('A'); });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World!', 8)).toBe('Hello...');
    });
    it('should not truncate short strings', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });
    it('should use custom suffix', () => {
      expect(truncate('Hello World!', 8, '…')).toBe('Hello W…');
    });
  });

  describe('slugify', () => {
    it('should create slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
    });
    it('should handle special characters', () => {
      expect(slugify('  --Hello___World!!! ')).toBe('hello-world');
    });
    it('should handle underscores', () => {
      expect(slugify('some_page_title')).toBe('some-page-title');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
    });
    it('should escape ampersands and quotes', () => {
      expect(escapeHtml("rock & roll's \"best\"")).toBe(
        "rock &amp; roll&#39;s &quot;best&quot;",
      );
    });
  });
});
