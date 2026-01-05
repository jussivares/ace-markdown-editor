/**
 * utils.test.js - Unit tests for utility functions
 * Tests: generateUUID, debounce, sanitizeFilename
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateUUID, debounce, sanitizeFilename } from '../js/utils.js';

describe('generateUUID', () => {
  it('should return a string', () => {
    // Arrange & Act
    const result = generateUUID();

    // Assert
    expect(typeof result).toBe('string');
  });

  it('should return a valid UUID v4 format', () => {
    // Arrange
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Act
    const result = generateUUID();

    // Assert
    expect(result).toMatch(uuidRegex);
  });

  it('should generate unique UUIDs', () => {
    // Arrange & Act
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    const uuid3 = generateUUID();

    // Assert
    expect(uuid1).not.toBe(uuid2);
    expect(uuid2).not.toBe(uuid3);
    expect(uuid1).not.toBe(uuid3);
  });

  it('should have version 4 marker at correct position', () => {
    // Arrange & Act
    const uuid = generateUUID();
    const parts = uuid.split('-');

    // Assert - version 4 has '4' as first character of third segment
    expect(parts[2][0]).toBe('4');
  });

  it('should have correct variant marker', () => {
    // Arrange & Act
    const uuid = generateUUID();
    const parts = uuid.split('-');

    // Assert - variant bits should be 8, 9, a, or b
    expect(['8', '9', 'a', 'b']).toContain(parts[3][0]);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delay function execution', () => {
    // Arrange
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // Act
    debouncedFn();

    // Assert - function should not be called immediately
    expect(fn).not.toHaveBeenCalled();

    // Act - advance time
    vi.advanceTimersByTime(100);

    // Assert - now it should be called
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should only call once for multiple rapid calls', () => {
    // Arrange
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // Act - multiple rapid calls
    debouncedFn();
    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);

    // Assert - should only be called once
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on each call', () => {
    // Arrange
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // Act
    debouncedFn();
    vi.advanceTimersByTime(50);
    debouncedFn(); // This should reset the timer
    vi.advanceTimersByTime(50);

    // Assert - should not have been called yet
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);

    // Assert - now it should be called
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    // Arrange
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // Act
    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    // Assert
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should use the latest arguments when called multiple times', () => {
    // Arrange
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // Act
    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');
    vi.advanceTimersByTime(100);

    // Assert - should be called with the last arguments
    expect(fn).toHaveBeenCalledWith('third');
  });

  it('should have a cancel method', () => {
    // Arrange
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // Act
    debouncedFn();
    debouncedFn.cancel();
    vi.advanceTimersByTime(100);

    // Assert - should not be called because it was cancelled
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('sanitizeFilename', () => {
  it('should remove invalid characters', () => {
    // Arrange
    const input = 'file<>:"/\\|?*name';

    // Act
    const result = sanitizeFilename(input);

    // Assert
    expect(result).toBe('filename');
  });

  it('should replace spaces with underscores', () => {
    // Arrange
    const input = 'my file name';

    // Act
    const result = sanitizeFilename(input);

    // Assert
    expect(result).toBe('my_file_name');
  });

  it('should replace multiple spaces with single underscore', () => {
    // Arrange
    const input = 'my   file   name';

    // Act
    const result = sanitizeFilename(input);

    // Assert
    expect(result).toBe('my_file_name');
  });

  it('should truncate to 100 characters', () => {
    // Arrange
    const input = 'a'.repeat(150);

    // Act
    const result = sanitizeFilename(input);

    // Assert
    expect(result.length).toBe(100);
  });

  it('should handle empty string', () => {
    // Arrange
    const input = '';

    // Act
    const result = sanitizeFilename(input);

    // Assert
    expect(result).toBe('');
  });

  it('should handle string with only invalid characters', () => {
    // Arrange
    const input = '<>:"/\\|?*';

    // Act
    const result = sanitizeFilename(input);

    // Assert
    expect(result).toBe('');
  });

  it('should preserve valid characters', () => {
    // Arrange
    const input = 'My-Note_2024.md';

    // Act
    const result = sanitizeFilename(input);

    // Assert
    expect(result).toBe('My-Note_2024.md');
  });
});
