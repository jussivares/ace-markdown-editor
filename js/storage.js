/**
 * storage.js - localStorage wrapper
 * Note entity CRUD operations
 * Task-06 will implement full functionality
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

export class Storage {
  constructor() {
    this.notesKey = NOTES_KEY;
    this.settingsKey = SETTINGS_KEY;
  }

  // === Notes ===

  /** @returns {Note[]} All notes sorted by updatedAt (newest first) */
  getAllNotes() {
    // Task-06: Implement
    return [];
  }

  /** @param {string} id @returns {Note|null} */
  getNote(id) {
    // Task-06: Implement
    return null;
  }

  /** @param {Note} note @returns {Note} Saved note with id */
  saveNote(note) {
    // Task-06: Implement
    return note;
  }

  /** @param {string} id @returns {boolean} */
  deleteNote(id) {
    // Task-06: Implement
    return false;
  }

  // === Settings ===

  /** @returns {Settings} */
  getSettings() {
    // Task-06: Implement
    return { ...DEFAULT_SETTINGS };
  }

  /** @param {Partial<Settings>} settings */
  updateSettings(settings) {
    // Task-06: Implement
  }

  // === Status ===

  /** @returns {boolean} Is localStorage available */
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

  /** @returns {{used: number, available: number}} Storage usage in bytes */
  getStorageInfo() {
    // Task-06: Implement
    return { used: 0, available: 5 * 1024 * 1024 };
  }
}

export default new Storage();
