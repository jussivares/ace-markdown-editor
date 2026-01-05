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
    themeToggle: document.getElementById('theme-toggle')
  };

  // Initialize UI (theme)
  const ui = new UI(elements, {
    onThemeChange: (theme) => {
      console.log('Theme changed to:', theme);
      bus.emit('ui:theme', theme);
    }
  });

  // Initialize theme from localStorage
  ui.initTheme();

  // Theme toggle button
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', () => ui.toggleTheme());
    // Touch support
    elements.themeToggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      ui.toggleTheme();
    });
  }

  // Initialize modules (Task-10 will wire everything)
  console.log('Modules loaded successfully');
  console.log('- Editor: stub');
  console.log('- Preview: stub');
  console.log('- Storage: stub');
  console.log('- UI: ready (theme)');

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
