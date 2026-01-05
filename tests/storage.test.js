/**
 * storage.test.js - Unit tests for Storage module
 * Tests: CRUD operations, quota handling, settings
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Storage, StorageQuotaError } from '../js/storage.js';

describe('Storage', () => {
  let storage;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    storage = new Storage();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isAvailable', () => {
    it('should return true when localStorage is available', () => {
      // Arrange & Act
      const result = storage.isAvailable();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('getAllNotes', () => {
    it('should return empty array when no notes exist', () => {
      // Arrange & Act
      const result = storage.getAllNotes();

      // Assert
      expect(result).toEqual([]);
    });

    it('should return notes sorted by updatedAt (newest first)', () => {
      // Arrange - manually set timestamps to ensure order
      const notes = [
        { id: 'id-1', title: 'First', content: 'Content 1', createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
        { id: 'id-2', title: 'Second', content: 'Content 2', createdAt: '2024-01-01T11:00:00Z', updatedAt: '2024-01-01T11:00:00Z' }
      ];
      localStorage.setItem('ace_md_notes_v1', JSON.stringify(notes));

      // Act
      const result = storage.getAllNotes();

      // Assert - newest first
      expect(result[0].title).toBe('Second');
      expect(result[1].title).toBe('First');
    });

    it('should handle corrupted localStorage gracefully', () => {
      // Arrange
      localStorage.setItem('ace_md_notes_v1', 'invalid json {{{');

      // Act
      const result = storage.getAllNotes();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('saveNote', () => {
    it('should create a new note with generated ID', () => {
      // Arrange
      const noteData = { title: 'Test Note', content: '# Test' };

      // Act
      const result = storage.saveNote(noteData);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(result.title).toBe('Test Note');
      expect(result.content).toBe('# Test');
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should update existing note by ID', () => {
      // Arrange - create note with old timestamp
      const oldNote = {
        id: 'test-id',
        title: 'Original',
        content: 'Original content',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      };
      localStorage.setItem('ace_md_notes_v1', JSON.stringify([oldNote]));

      // Act
      const updated = storage.saveNote({
        id: 'test-id',
        title: 'Updated',
        content: 'Updated content'
      });

      // Assert
      expect(updated.id).toBe('test-id');
      expect(updated.title).toBe('Updated');
      expect(updated.content).toBe('Updated content');
      expect(updated.createdAt).toBe('2024-01-01T10:00:00Z');
      expect(updated.updatedAt).not.toBe('2024-01-01T10:00:00Z'); // Should be newer
    });

    it('should truncate title to 100 characters', () => {
      // Arrange
      const longTitle = 'a'.repeat(150);

      // Act
      const result = storage.saveNote({ title: longTitle, content: '' });

      // Assert
      expect(result.title.length).toBe(100);
    });

    it('should use "Untitled Note" for empty title', () => {
      // Arrange & Act
      const result = storage.saveNote({ title: '', content: '' });

      // Assert
      expect(result.title).toBe('Untitled Note');
    });

    it('should use "Untitled Note" for undefined title', () => {
      // Arrange & Act
      const result = storage.saveNote({ content: 'Some content' });

      // Assert
      expect(result.title).toBe('Untitled Note');
    });

    it('should persist note to localStorage', () => {
      // Arrange & Act
      storage.saveNote({ title: 'Persistent', content: 'Data' });

      // Assert
      const stored = JSON.parse(localStorage.getItem('ace_md_notes_v1'));
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Persistent');
    });
  });

  describe('getNote', () => {
    it('should return note by ID', () => {
      // Arrange
      const note = storage.saveNote({ title: 'Find Me', content: '# Content' });

      // Act
      const result = storage.getNote(note.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe('Find Me');
    });

    it('should return null for non-existent ID', () => {
      // Arrange & Act
      const result = storage.getNote('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('deleteNote', () => {
    it('should delete note by ID', () => {
      // Arrange
      const note = storage.saveNote({ title: 'Delete Me', content: '' });

      // Act
      const result = storage.deleteNote(note.id);

      // Assert
      expect(result).toBe(true);
      expect(storage.getNote(note.id)).toBeNull();
    });

    it('should return false for non-existent ID', () => {
      // Arrange & Act
      const result = storage.deleteNote('non-existent-id');

      // Assert
      expect(result).toBe(false);
    });

    it('should not affect other notes', () => {
      // Arrange
      const note1 = storage.saveNote({ title: 'Keep Me', content: '' });
      const note2 = storage.saveNote({ title: 'Delete Me', content: '' });

      // Act
      storage.deleteNote(note2.id);

      // Assert
      expect(storage.getNote(note1.id)).toBeDefined();
      expect(storage.getAllNotes()).toHaveLength(1);
    });
  });

  describe('Settings', () => {
    it('should return default settings when none exist', () => {
      // Arrange & Act
      const result = storage.getSettings();

      // Assert
      expect(result.theme).toBe('system');
      expect(result.splitRatio).toBe(0.5);
      expect(result.lastOpenNoteId).toBeNull();
      expect(result.sidebarCollapsed).toBe(false);
    });

    it('should update and persist settings', () => {
      // Arrange & Act
      storage.updateSettings({ theme: 'dark', splitRatio: 0.7 });
      const result = storage.getSettings();

      // Assert
      expect(result.theme).toBe('dark');
      expect(result.splitRatio).toBe(0.7);
    });

    it('should merge settings (partial update)', () => {
      // Arrange
      storage.updateSettings({ theme: 'dark' });

      // Act
      storage.updateSettings({ splitRatio: 0.3 });
      const result = storage.getSettings();

      // Assert
      expect(result.theme).toBe('dark');
      expect(result.splitRatio).toBe(0.3);
    });

    it('should handle corrupted settings gracefully', () => {
      // Arrange
      localStorage.setItem('ace_md_settings_v1', 'invalid json');

      // Act
      const result = storage.getSettings();

      // Assert - should return defaults
      expect(result.theme).toBe('system');
    });
  });

  describe('StorageQuotaError', () => {
    it('should have correct name and code', () => {
      // Arrange & Act
      const error = new StorageQuotaError();

      // Assert
      expect(error.name).toBe('StorageQuotaError');
      expect(error.code).toBe('STORAGE_QUOTA');
      expect(error.message).toContain('quota');
    });
  });

  describe('getStorageInfo', () => {
    it('should return storage usage info', () => {
      // Arrange
      storage.saveNote({ title: 'Test', content: 'Some content here' });

      // Act
      const result = storage.getStorageInfo();

      // Assert
      expect(result.used).toBeGreaterThan(0);
      expect(result.available).toBe(5 * 1024 * 1024); // 5MB
    });
  });
});
