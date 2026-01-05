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
    this.currentMode = 'edit';
    this.splitRatio = 0.5;
    this.isDragging = false;

    // Sidebar is open by default on tablet/desktop, closed on mobile
    this.sidebarOpen = this.getBreakpoint() !== 'mobile';

    this._initDividerDrag();
    this._initBreakpointListener();
  }

  // === Layout ===

  /**
   * Set the split ratio between editor and preview
   * @param {number} ratio - 0.0-1.0
   */
  setSplitRatio(ratio) {
    // Clamp to 20%-80% range
    this.splitRatio = Math.max(0.2, Math.min(0.8, ratio));

    const mainLayout = document.querySelector('.main-layout');
    if (mainLayout) {
      mainLayout.style.setProperty('--split-ratio', this.splitRatio);
    }

    if (this.options.onSplitChange) {
      this.options.onSplitChange(this.splitRatio);
    }
  }

  /**
   * Set layout mode (for mobile tabs)
   * @param {'edit'|'preview'} mode
   */
  setLayoutMode(mode) {
    this.currentMode = mode;

    const mainLayout = document.querySelector('.main-layout');
    if (mainLayout) {
      mainLayout.setAttribute('data-mode', mode);
    }

    // Update mobile tab active state
    const tabs = document.querySelectorAll('.mobile-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });
  }

  /**
   * Toggle or set sidebar collapsed state
   * @param {boolean} [collapsed] - If undefined, toggles current state
   */
  setSidebarCollapsed(collapsed) {
    const sidebar = this.elements.sidebar || document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mainLayout = document.querySelector('.main-layout');

    if (collapsed === undefined) {
      // Toggle
      this.sidebarOpen = !this.sidebarOpen;
    } else {
      this.sidebarOpen = !collapsed;
    }

    if (sidebar) {
      sidebar.classList.toggle('open', this.sidebarOpen);
      sidebar.classList.toggle('collapsed', !this.sidebarOpen);
    }

    if (overlay) {
      overlay.classList.toggle('visible', this.sidebarOpen && this.getBreakpoint() === 'mobile');
    }

    if (mainLayout) {
      mainLayout.classList.toggle('sidebar-collapsed', !this.sidebarOpen);
    }

    if (this.options.onSidebarToggle) {
      this.options.onSidebarToggle(this.sidebarOpen);
    }
  }

  /**
   * Initialize divider drag handling
   * @private
   */
  _initDividerDrag() {
    const divider = this.elements.divider || document.getElementById('divider');
    if (!divider) return;

    const onStart = (e) => {
      e.preventDefault();
      this.isDragging = true;
      divider.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const mainLayout = document.querySelector('.main-layout');
      if (!mainLayout) return;

      const rect = mainLayout.getBoundingClientRect();
      const sidebar = this.elements.sidebar || document.getElementById('sidebar');
      const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;

      // Calculate ratio within the editor+preview area
      const availableWidth = rect.width - sidebarWidth;
      const relativeX = clientX - rect.left - sidebarWidth;
      const ratio = relativeX / availableWidth;

      this.setSplitRatio(ratio);
    };

    const onEnd = () => {
      this.isDragging = false;
      divider.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };

    divider.addEventListener('mousedown', onStart);
    divider.addEventListener('touchstart', onStart, { passive: false });
  }

  /**
   * Initialize breakpoint change listener
   * @private
   */
  _initBreakpointListener() {
    let lastBreakpoint = this.getBreakpoint();

    const checkBreakpoint = () => {
      const current = this.getBreakpoint();
      if (current !== lastBreakpoint) {
        lastBreakpoint = current;
        if (this._breakpointCallback) {
          this._breakpointCallback(current);
        }
      }
    };

    window.addEventListener('resize', checkBreakpoint);
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
    this._breakpointCallback = callback;
  }
}
