/**
 * ui.js - UI wrapper
 * Layout, theme, feedback
 * Task-03 and Task-07 will implement full functionality
 */

/**
 * UI wrapper - layout, theme, feedback
 */
export class UI {
  /**
   * @param {Object} elements - DOM elements
   * @param {Object} options
   * @param {function(number): void} options.onSplitChange - Divider moved
   * @param {function('light'|'dark'): void} options.onThemeChange
   * @param {function(): void} options.onSidebarToggle
   */
  constructor(elements, options = {}) {
    this.elements = elements;
    this.options = options;
    // Task-03: Initialize layout handlers
  }

  // === Layout ===

  /** @param {number} ratio - 0.0-1.0 */
  setSplitRatio(ratio) {
    // Task-03: Implement
  }

  /** @param {'split'|'edit'|'preview'} mode */
  setLayoutMode(mode) {
    // Task-03: Implement
  }

  /** @param {boolean} collapsed */
  setSidebarCollapsed(collapsed) {
    // Task-03: Implement
  }

  // === Theme ===

  /** @param {'light'|'dark'|'system'} theme */
  setTheme(theme) {
    // Task-02: Implement
  }

  /** @returns {'light'|'dark'} Active theme (system resolved) */
  getActiveTheme() {
    // Task-02: Implement
    return 'light';
  }

  // === Feedback ===

  /** @param {string} message @param {'success'|'error'|'info'} type */
  showToast(message, type = 'info') {
    // Task-07: Implement
    console.log(`Toast [${type}]: ${message}`);
  }

  /** @param {string} message @param {function(): void} onConfirm */
  showConfirm(message, onConfirm) {
    // Task-07: Implement
    if (confirm(message)) {
      onConfirm();
    }
  }

  // === Responsive ===

  /** @returns {'desktop'|'tablet'|'mobile'} */
  getBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  /** @param {function(string): void} callback - Called on breakpoint change */
  onBreakpointChange(callback) {
    // Task-03: Implement with ResizeObserver
  }
}
