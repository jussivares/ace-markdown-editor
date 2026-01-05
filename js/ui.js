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

  /**
   * Set theme and update DOM + localStorage
   * @param {'light'|'dark'|'system'} theme
   */
  setTheme(theme) {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Apply new theme
    if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    }
    // 'system' = no class, CSS handles via prefers-color-scheme

    // Save to localStorage
    try {
      localStorage.setItem('ace_md_theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }

    // Callback
    if (this.options.onThemeChange) {
      this.options.onThemeChange(this.getActiveTheme());
    }
  }

  /** @returns {'light'|'dark'} Active theme (system resolved) */
  getActiveTheme() {
    const root = document.documentElement;

    if (root.classList.contains('dark')) {
      return 'dark';
    }
    if (root.classList.contains('light')) {
      return 'light';
    }

    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /** @returns {'light'|'dark'|'system'} Stored theme preference */
  getStoredTheme() {
    try {
      return localStorage.getItem('ace_md_theme') || 'system';
    } catch (e) {
      return 'system';
    }
  }

  /** Toggle between light and dark */
  toggleTheme() {
    const current = this.getActiveTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /** Initialize theme from localStorage */
  initTheme() {
    const stored = this.getStoredTheme();
    if (stored !== 'system') {
      this.setTheme(stored);
    }
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
