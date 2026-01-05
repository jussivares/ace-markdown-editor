/**
 * storage.js - localStorage wrapper
 * Note entity CRUD operations
 */

import { generateUUID } from './utils.js';

/**
 * @typedef {Object} Note
 * @property {string} id - UUID v4
 * @property {string} title - Note title (max 100 chars)
 * @property {string} content - Markdown content
 * @property {string} createdAt - ISO 8601 timestamp
 * @property {string} updatedAt - ISO 8601 timestamp
 */

/**
 * @typedef {Object} Settings
 * @property {'light'|'dark'|'system'} theme
 * @property {number} splitRatio - 0.0-1.0
 * @property {string|null} lastOpenNoteId
 * @property {boolean} sidebarCollapsed
 */

const NOTES_KEY = 'ace_md_notes_v1';
const SETTINGS_KEY = 'ace_md_settings_v1';

const DEFAULT_SETTINGS = {
  theme: 'system',
  splitRatio: 0.5,
  lastOpenNoteId: null,
  sidebarCollapsed: false
};

/**
 * Custom error for storage quota exceeded
 */
export class StorageQuotaError extends Error {
  constructor() {
    super('Storage quota exceeded. Delete old notes to continue.');
    this.name = 'StorageQuotaError';
    this.code = 'STORAGE_QUOTA';
  }
}

export class Storage {
  constructor() {
    this.notesKey = NOTES_KEY;
    this.settingsKey = SETTINGS_KEY;
  }

  // === Notes ===

  /**
   * Get all notes sorted by updatedAt (newest first)
   * @returns {Note[]}
   */
  getAllNotes() {
    try {
      const json = localStorage.getItem(this.notesKey);
      if (!json) return [];

      const notes = JSON.parse(json);
      // Sort by updatedAt descending
      return notes.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (e) {
      console.error('Storage corrupted, resetting notes:', e);
      localStorage.removeItem(this.notesKey);
      return [];
    }
  }

  /**
   * Get a single note by ID
   * @param {string} id
   * @returns {Note|null}
   */
  getNote(id) {
    const notes = this.getAllNotes();
    return notes.find(note => note.id === id) || null;
  }

  /**
   * Save a note (create or update)
   * @param {Partial<Note>} note
   * @returns {Note} Saved note with id and timestamps
   * @throws {StorageQuotaError} If storage is full
   */
  saveNote(note) {
    const notes = this.getAllNotes();
    const now = new Date().toISOString();

    // Normalize title
    let title = note.title || 'Untitled Note';
    if (title.length > 100) {
      title = title.slice(0, 100);
    }

    let savedNote;

    if (note.id) {
      // Update existing note
      const index = notes.findIndex(n => n.id === note.id);
      if (index !== -1) {
        savedNote = {
          ...notes[index],
          ...note,
          title,
          updatedAt: now
        };
        notes[index] = savedNote;
      } else {
        // ID provided but not found - create new with that ID
        savedNote = {
          id: note.id,
          title,
          content: note.content || '',
          createdAt: now,
          updatedAt: now
        };
        notes.push(savedNote);
      }
    } else {
      // Create new note
      savedNote = {
        id: generateUUID(),
        title,
        content: note.content || '',
        createdAt: now,
        updatedAt: now
      };
      notes.push(savedNote);
    }

    this._saveNotes(notes);
    return savedNote;
  }

  /**
   * Delete a note by ID
   * @param {string} id
   * @returns {boolean} True if note was deleted
   */
  deleteNote(id) {
    const notes = this.getAllNotes();
    const index = notes.findIndex(n => n.id === id);

    if (index === -1) return false;

    notes.splice(index, 1);
    this._saveNotes(notes);
    return true;
  }

  /**
   * Internal: Save notes array to localStorage
   * @param {Note[]} notes
   * @throws {StorageQuotaError}
   * @private
   */
  _saveNotes(notes) {
    try {
      localStorage.setItem(this.notesKey, JSON.stringify(notes));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        throw new StorageQuotaError();
      }
      throw e;
    }
  }

  // === Settings ===

  /**
   * Get application settings
   * @returns {Settings}
   */
  getSettings() {
    try {
      const json = localStorage.getItem(this.settingsKey);
      if (!json) return { ...DEFAULT_SETTINGS };

      const settings = JSON.parse(json);
      return { ...DEFAULT_SETTINGS, ...settings };
    } catch (e) {
      console.error('Settings corrupted, resetting:', e);
      localStorage.removeItem(this.settingsKey);
      return { ...DEFAULT_SETTINGS };
    }
  }

  /**
   * Update application settings (partial update)
   * @param {Partial<Settings>} settings
   */
  updateSettings(settings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(this.settingsKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save settings:', e);
    }
  }

  // === Status ===

  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get storage usage information
   * @returns {{used: number, available: number}} Storage usage in bytes
   */
  getStorageInfo() {
    let used = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage.getItem(key).length * 2; // UTF-16
        }
      }
    } catch (e) {
      // Ignore
    }
    return {
      used,
      available: 5 * 1024 * 1024 // ~5MB typical limit
    };
  }
}

export default new Storage();
