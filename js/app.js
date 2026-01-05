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

  // Initialize Preview
  const preview = new Preview(elements.previewPane);

  // Initialize Editor
  const editor = new Editor(elements.editorPane, {
    theme: ui.getActiveTheme(),
    initialContent: '# Welcome to ACE Markdown Editor\n\nStart typing to see the **live preview**.\n\n## Features\n\n- Real-time preview\n- Syntax highlighting\n- Dark/Light theme\n\n```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n',
    onChange: (content) => {
      preview.render(content);
      bus.emit('editor:change', content);
    }
  });

  // Initial render
  preview.render(editor.getValue());

  // Theme change updates editor theme
  bus.on('ui:theme', (theme) => {
    editor.setTheme(theme);
    updateHljsTheme(theme);
  });

  // Initialize hljs theme based on current theme
  updateHljsTheme(ui.getActiveTheme());

  console.log('Modules loaded successfully');
  console.log('- Editor: ready');
  console.log('- Preview: ready');
  console.log('- Storage: ready');
  console.log('- UI: ready (theme + layout)');

  bus.emit('editor:ready');

  console.log('ACE Markdown Editor ready');
}

/**
 * Update highlight.js theme based on app theme
 * @param {'light'|'dark'} theme
 */
function updateHljsTheme(theme) {
  const lightLink = document.querySelector('.hljs-theme-light');
  const darkLink = document.querySelector('.hljs-theme-dark');

  if (lightLink && darkLink) {
    if (theme === 'dark') {
      lightLink.disabled = true;
      darkLink.disabled = false;
    } else {
      lightLink.disabled = false;
      darkLink.disabled = true;
    }
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { state };
