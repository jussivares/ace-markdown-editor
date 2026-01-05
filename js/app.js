/**
 * app.js - Application Orchestrator
 * Event bus, dependency injection, lifecycle
 * Task-10 will implement full orchestration
 */

import { Editor } from './editor.js';
import { Preview } from './preview.js';
import { Storage } from './storage.js';
import { Exporter } from './export.js';
import { UI } from './ui.js';
import { debounce } from './utils.js';

// === Event Bus ===

const events = {
  // Editor events
  'editor:change': [],
  'editor:ready': [],

  // Note events
  'note:select': [],
  'note:create': [],
  'note:save': [],
  'note:delete': [],
  'note:rename': [],

  // Export events
  'export:html': [],
  'export:pdf': [],

  // UI events
  'ui:theme': [],
  'ui:split': [],
  'ui:sidebar': [],

  // System events
  'storage:error': [],
  'storage:warning': []
};

export const bus = {
  on(event, callback) {
    if (events[event]) {
      events[event].push(callback);
    }
  },

  off(event, callback) {
    if (events[event]) {
      events[event] = events[event].filter(cb => cb !== callback);
    }
  },

  emit(event, ...args) {
    if (events[event]) {
      events[event].forEach(cb => {
        try {
          cb(...args);
        } catch (err) {
          console.error(`Event handler error [${event}]:`, err);
        }
      });
    }
  }
};

// === Application State ===

const state = {
  currentNoteId: null,
  notes: [],
  isDirty: false,
  autosaveTimer: null
};

// === Initialization ===

async function init() {
  console.log('ACE Markdown Editor initializing...');

  // Check storage availability
  const storage = new Storage();
  if (!storage.isAvailable()) {
    console.warn('localStorage not available - notes will not persist');
  }

  // Get DOM elements
  const elements = {
    sidebar: document.getElementById('sidebar'),
    editorPane: document.getElementById('editor-pane'),
    previewPane: document.getElementById('preview-pane'),
    divider: document.getElementById('divider'),
    themeToggle: document.getElementById('theme-toggle'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    mobileTabs: document.getElementById('mobile-tabs')
  };

  // Initialize UI (theme + layout)
  const ui = new UI(elements, {
    onThemeChange: (theme) => {
      console.log('Theme changed to:', theme);
      bus.emit('ui:theme', theme);
    },
    onSplitChange: (ratio) => {
      console.log('Split ratio changed to:', ratio);
      bus.emit('ui:split', ratio);
      // Save to storage
      storage.updateSettings({ splitRatio: ratio });
    },
    onSidebarToggle: (isOpen) => {
      console.log('Sidebar toggled:', isOpen);
      bus.emit('ui:sidebar', isOpen);
    }
  });

  // Initialize theme from localStorage
  ui.initTheme();

  // Load saved split ratio
  const settings = storage.getSettings();
  if (settings.splitRatio) {
    ui.setSplitRatio(settings.splitRatio);
  }

  // Theme toggle button
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', () => ui.toggleTheme());
    elements.themeToggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      ui.toggleTheme();
    });
  }

  // Sidebar toggle button
  if (elements.sidebarToggle) {
    elements.sidebarToggle.addEventListener('click', () => ui.setSidebarCollapsed());
    elements.sidebarToggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      ui.setSidebarCollapsed();
    });
  }

  // Sidebar overlay (close on click)
  if (elements.sidebarOverlay) {
    elements.sidebarOverlay.addEventListener('click', () => ui.setSidebarCollapsed(true));
    elements.sidebarOverlay.addEventListener('touchend', (e) => {
      e.preventDefault();
      ui.setSidebarCollapsed(true);
    });
  }

  // Mobile tabs
  if (elements.mobileTabs) {
    elements.mobileTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.mobile-tab');
      if (tab && tab.dataset.mode) {
        ui.setLayoutMode(tab.dataset.mode);
      }
    });
  }

  // Initialize modules (Task-10 will wire everything)
  console.log('Modules loaded successfully');
  console.log('- Editor: stub');
  console.log('- Preview: stub');
  console.log('- Storage: ready');
  console.log('- UI: ready (theme + layout)');

  // Task-10: Wire up event handlers and initialize full app

  console.log('ACE Markdown Editor ready');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { state };
