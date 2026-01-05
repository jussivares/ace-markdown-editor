/**
 * editor.js - CodeMirror 6 wrapper
 * Task-04 will implement full functionality
 */

/**
 * CodeMirror 6 wrapper - does not expose CM6 internals
 */
export class Editor {
  /**
   * @param {HTMLElement} container - Element to mount editor into
   * @param {Object} options
   * @param {function(string): void} options.onChange - Called when content changes
   * @param {string} [options.theme='light'] - 'light' | 'dark'
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.view = null;
    // Task-04: Initialize CodeMirror
  }

  /** @returns {string} Editor content */
  getValue() {
    // Task-04: Implement
    return '';
  }

  /** @param {string} content - New content */
  setValue(content) {
    // Task-04: Implement
  }

  /** @param {'light'|'dark'} theme */
  setTheme(theme) {
    // Task-04: Implement
  }

  /** Focus the editor */
  focus() {
    // Task-04: Implement
  }

  /** @returns {number} Current scroll position */
  getScrollPosition() {
    // Task-04: Implement
    return 0;
  }

  /** @param {number} position */
  setScrollPosition(position) {
    // Task-04: Implement
  }

  /** Destroy the editor instance */
  destroy() {
    // Task-04: Implement
  }
}
