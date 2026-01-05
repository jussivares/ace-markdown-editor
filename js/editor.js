/**
 * editor.js - CodeMirror 6 wrapper
 * Does not expose CM6 internals
 */

import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';

/**
 * Light theme - Warm Notes Light
 * Uses CSS variables for theming
 */
const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    height: '100%'
  },
  '.cm-content': {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-base)',
    lineHeight: 'var(--line-height-relaxed)',
    padding: 'var(--space-4) var(--space-6)',
    caretColor: 'var(--color-accent)'
  },
  '.cm-gutters': {
    backgroundColor: 'var(--color-bg-deep)',
    color: 'var(--color-text-muted)',
    border: 'none',
    borderRight: '1px solid var(--color-border)',
    paddingRight: 'var(--space-2)'
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 var(--space-2)'
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--color-bg-hover)',
    color: 'var(--color-text-secondary)'
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--color-accent-subtle)'
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--color-accent)',
    borderLeftWidth: '2px'
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(224, 112, 112, 0.15)'
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'rgba(224, 112, 112, 0.25)'
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'var(--font-mono)'
  },
  '.cm-line': {
    padding: '0 var(--space-2)'
  }
}, { dark: false });

/**
 * Dark theme - Warm Notes Dark
 * Warm cocoa/mocha tones with coral accent
 */
const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    height: '100%'
  },
  '.cm-content': {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-base)',
    lineHeight: 'var(--line-height-relaxed)',
    padding: 'var(--space-4) var(--space-6)',
    caretColor: 'var(--color-accent)'
  },
  '.cm-gutters': {
    backgroundColor: 'var(--color-bg-deep)',
    color: 'var(--color-text-muted)',
    border: 'none',
    borderRight: '1px solid var(--color-border)',
    paddingRight: 'var(--space-2)'
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 var(--space-2)'
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--color-bg-hover)',
    color: 'var(--color-text-secondary)'
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--color-accent-subtle)'
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--color-accent)',
    borderLeftWidth: '2px'
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(240, 168, 168, 0.15)'
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'rgba(240, 168, 168, 0.25)'
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'var(--font-mono)'
  },
  '.cm-line': {
    padding: '0 var(--space-2)'
  }
}, { dark: true });

/**
 * CodeMirror 6 wrapper - does not expose CM6 internals
 */
export class Editor {
  /**
   * @param {HTMLElement} container - Element to mount editor into
   * @param {Object} options
   * @param {function(string): void} options.onChange - Called when content changes
   * @param {string} [options.theme='light'] - 'light' | 'dark'
   * @param {string} [options.initialContent=''] - Initial content
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.view = null;
    this.themeCompartment = new Compartment();

    this._init();
  }

  /**
   * Initialize CodeMirror
   * @private
   */
  _init() {
    // Clear container
    this.container.innerHTML = '';

    const isDark = this.options.theme === 'dark';
    const theme = isDark ? darkTheme : lightTheme;

    // Update listener
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && this.options.onChange) {
        this.options.onChange(this.getValue());
      }
    });

    const state = EditorState.create({
      doc: this.options.initialContent || '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        markdown(),
        syntaxHighlighting(defaultHighlightStyle),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap
        ]),
        this.themeCompartment.of([theme, isDark ? oneDark : []]),
        updateListener,
        EditorView.lineWrapping
      ]
    });

    this.view = new EditorView({
      state,
      parent: this.container
    });
  }

  /** @returns {string} Editor content */
  getValue() {
    if (!this.view) return '';
    return this.view.state.doc.toString();
  }

  /**
   * Set editor content
   * @param {string} content - New content
   */
  setValue(content) {
    if (!this.view) return;

    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: content
      }
    });
  }

  /**
   * Set editor theme
   * @param {'light'|'dark'} theme
   */
  setTheme(theme) {
    if (!this.view) return;

    const isDark = theme === 'dark';
    const newTheme = isDark ? darkTheme : lightTheme;

    this.view.dispatch({
      effects: this.themeCompartment.reconfigure([newTheme, isDark ? oneDark : []])
    });
  }

  /** Focus the editor */
  focus() {
    if (this.view) {
      this.view.focus();
    }
  }

  /** @returns {number} Current scroll position */
  getScrollPosition() {
    if (!this.view) return 0;
    return this.view.scrollDOM.scrollTop;
  }

  /**
   * Set scroll position
   * @param {number} position
   */
  setScrollPosition(position) {
    if (!this.view) return;
    this.view.scrollDOM.scrollTop = position;
  }

  /** Destroy the editor instance */
  destroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
}
