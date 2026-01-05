/**
 * app.js - Application Orchestrator
 * Event bus, note management, autosave, exports
 */

import { Editor } from './editor.js';
import { Preview } from './preview.js';
import { Storage, StorageQuotaError } from './storage.js';
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
  isDirty: false
};

// === Module references ===
let storage, editor, preview, exporter, ui;

// === Initialization ===

async function init() {
  console.log('ACE Markdown Editor initializing...');

  // Initialize Storage
  storage = new Storage();
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
    mobileTabs: document.getElementById('mobile-tabs'),
    noteList: document.getElementById('note-list'),
    newNoteBtn: document.getElementById('new-note-btn'),
    exportHtmlBtn: document.getElementById('export-html-btn'),
    exportPdfBtn: document.getElementById('export-pdf-btn')
  };

  // Initialize UI (theme + layout)
  ui = new UI(elements, {
    onThemeChange: (theme) => {
      bus.emit('ui:theme', theme);
    },
    onSplitChange: (ratio) => {
      bus.emit('ui:split', ratio);
      storage.updateSettings({ splitRatio: ratio });
    },
    onSidebarToggle: (isOpen) => {
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
  preview = new Preview(elements.previewPane);

  // Initialize Exporter
  exporter = new Exporter(preview);

  // Load notes from storage
  state.notes = storage.getAllNotes();

  // Determine initial content
  let initialContent = '';
  let initialNoteId = null;

  if (state.notes.length > 0) {
    // Load last opened note or first note
    const lastNoteId = settings.lastOpenNoteId;
    const lastNote = lastNoteId ? state.notes.find(n => n.id === lastNoteId) : null;
    const noteToOpen = lastNote || state.notes[0];
    initialContent = noteToOpen.content;
    initialNoteId = noteToOpen.id;
  } else {
    // Create welcome note for new users
    initialContent = getWelcomeContent();
  }

  // Initialize Editor
  editor = new Editor(elements.editorPane, {
    theme: ui.getActiveTheme(),
    initialContent,
    onChange: (content) => {
      preview.render(content);
      state.isDirty = true;
      debouncedAutosave();
      bus.emit('editor:change', content);
    }
  });

  // Set current note
  state.currentNoteId = initialNoteId;

  // Initial render
  preview.render(editor.getValue());

  // Render note list
  renderNoteList(elements.noteList);

  // === Event Handlers ===

  // Theme change updates editor theme
  bus.on('ui:theme', (theme) => {
    editor.setTheme(theme);
    updateHljsTheme(theme);
  });

  // New note button
  if (elements.newNoteBtn) {
    elements.newNoteBtn.addEventListener('click', createNewNote);
    elements.newNoteBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      createNewNote();
    });
  }

  // Note list click handling
  if (elements.noteList) {
    elements.noteList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.note-delete-btn');
      if (deleteBtn) {
        e.stopPropagation();
        const noteId = deleteBtn.dataset.noteId;
        deleteNote(noteId);
        return;
      }

      const noteItem = e.target.closest('.note-item');
      if (noteItem) {
        selectNote(noteItem.dataset.noteId);
      }
    });
  }

  // Export buttons
  if (elements.exportHtmlBtn) {
    elements.exportHtmlBtn.addEventListener('click', () => exportCurrentNote('html'));
  }
  if (elements.exportPdfBtn) {
    elements.exportPdfBtn.addEventListener('click', () => exportCurrentNote('pdf'));
  }

  // Initialize hljs theme
  updateHljsTheme(ui.getActiveTheme());

  // Save on page unload
  window.addEventListener('beforeunload', () => {
    if (state.isDirty) {
      saveCurrentNote();
    }
  });

  console.log('ACE Markdown Editor ready');
  console.log(`Loaded ${state.notes.length} notes`);

  bus.emit('editor:ready');
}

// === Note Management ===

/**
 * Create a new note
 */
function createNewNote() {
  // Save current note first
  if (state.isDirty) {
    saveCurrentNote();
  }

  const newNote = storage.saveNote({
    title: 'Untitled Note',
    content: '# New Note\n\nStart writing...'
  });

  state.notes.unshift(newNote);
  state.currentNoteId = newNote.id;
  state.isDirty = false;

  editor.setValue(newNote.content);
  preview.render(newNote.content);

  renderNoteList(document.getElementById('note-list'));
  storage.updateSettings({ lastOpenNoteId: newNote.id });

  // Focus editor
  editor.focus();

  bus.emit('note:create', newNote);
}

/**
 * Select and load a note
 * @param {string} noteId
 */
function selectNote(noteId) {
  if (noteId === state.currentNoteId) return;

  // Save current note first
  if (state.isDirty) {
    saveCurrentNote();
  }

  const note = storage.getNote(noteId);
  if (!note) return;

  state.currentNoteId = noteId;
  state.isDirty = false;

  editor.setValue(note.content);
  preview.render(note.content);

  renderNoteList(document.getElementById('note-list'));
  storage.updateSettings({ lastOpenNoteId: noteId });

  bus.emit('note:select', noteId);
}

/**
 * Delete a note
 * @param {string} noteId
 */
function deleteNote(noteId) {
  const note = state.notes.find(n => n.id === noteId);
  if (!note) return;

  // Confirm deletion
  if (!confirm(`Delete "${note.title}"?`)) return;

  storage.deleteNote(noteId);
  state.notes = state.notes.filter(n => n.id !== noteId);

  // If deleting current note, switch to another
  if (noteId === state.currentNoteId) {
    if (state.notes.length > 0) {
      selectNote(state.notes[0].id);
    } else {
      // No notes left - create new one
      state.currentNoteId = null;
      state.isDirty = false;
      editor.setValue('# New Note\n\nStart writing...');
      preview.render(editor.getValue());
    }
  }

  renderNoteList(document.getElementById('note-list'));
  bus.emit('note:delete', noteId);
}

/**
 * Save current note to storage
 */
function saveCurrentNote() {
  if (!state.currentNoteId) {
    // Create new note if none exists
    const content = editor.getValue();
    const title = extractTitle(content);

    try {
      const newNote = storage.saveNote({ title, content });
      state.notes.unshift(newNote);
      state.currentNoteId = newNote.id;
      renderNoteList(document.getElementById('note-list'));
      bus.emit('note:save', newNote);
    } catch (e) {
      if (e instanceof StorageQuotaError) {
        showToast('Storage full. Delete old notes.', 'error');
      }
      throw e;
    }
  } else {
    // Update existing note
    const content = editor.getValue();
    const title = extractTitle(content);

    try {
      const updatedNote = storage.saveNote({
        id: state.currentNoteId,
        title,
        content
      });

      // Update in state
      const index = state.notes.findIndex(n => n.id === state.currentNoteId);
      if (index !== -1) {
        state.notes[index] = updatedNote;
      }

      // Re-sort by updatedAt
      state.notes.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      renderNoteList(document.getElementById('note-list'));
      bus.emit('note:save', updatedNote);
    } catch (e) {
      if (e instanceof StorageQuotaError) {
        showToast('Storage full. Delete old notes.', 'error');
      }
      throw e;
    }
  }

  state.isDirty = false;
}

// Debounced autosave (2 seconds)
const debouncedAutosave = debounce(() => {
  if (state.isDirty) {
    saveCurrentNote();
  }
}, 2000);

/**
 * Extract title from markdown content
 * @param {string} content
 * @returns {string}
 */
function extractTitle(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return trimmed.slice(2).trim().slice(0, 100) || 'Untitled Note';
    }
    if (trimmed.length > 0) {
      return trimmed.slice(0, 100) || 'Untitled Note';
    }
  }
  return 'Untitled Note';
}

// === Note List Rendering ===

/**
 * Render note list in sidebar
 * @param {HTMLElement} container
 */
function renderNoteList(container) {
  if (!container) return;

  if (state.notes.length === 0) {
    container.innerHTML = '<div class="note-list-empty">No notes yet.<br>Click "New Note" to start.</div>';
    return;
  }

  container.innerHTML = state.notes.map(note => `
    <div class="note-item${note.id === state.currentNoteId ? ' active' : ''}" data-note-id="${note.id}">
      <div class="note-item-content">
        <div class="note-title">${escapeHtml(note.title)}</div>
        <div class="note-date">${formatDate(note.updatedAt)}</div>
      </div>
      <button class="note-delete-btn" data-note-id="${note.id}" aria-label="Delete note">✕</button>
    </div>
  `).join('');
}

/**
 * Format date for display
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString('fi-FI');
  }
}

/**
 * Escape HTML special characters
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// === Export ===

/**
 * Export current note
 * @param {'html'|'pdf'} format
 */
function exportCurrentNote(format) {
  // Save first to get latest content
  if (state.isDirty) {
    saveCurrentNote();
  }

  const note = state.currentNoteId
    ? storage.getNote(state.currentNoteId)
    : { title: extractTitle(editor.getValue()), content: editor.getValue() };

  if (!note) {
    showToast('No note to export', 'error');
    return;
  }

  if (format === 'html') {
    exporter.exportHTML(note);
    bus.emit('export:html');
  } else {
    exporter.exportPDF(note);
    bus.emit('export:pdf');
  }
}

// === UI Helpers ===

/**
 * Show toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
  // Simple toast implementation
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
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

/**
 * Get welcome content for new users
 * @returns {string}
 */
function getWelcomeContent() {
  return `# Welcome to ACE Markdown Editor

Start typing to see the **live preview**.

## Features

- Real-time preview
- Syntax highlighting
- Dark/Light theme
- Auto-save
- HTML & PDF export

## Markdown Basics

**Bold text** and *italic text*

- Bullet list item 1
- Bullet list item 2

1. Numbered list
2. Second item

> Blockquote example

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

---

Create a new note using the **+ New Note** button in the sidebar.
`;
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { state };
