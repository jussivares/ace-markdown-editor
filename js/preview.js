/**
 * preview.js - Markdown preview wrapper
 * Uses marked + DOMPurify + highlight.js
 */

import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

// Configure marked with highlight.js
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (e) {
        console.warn('Highlight error:', e);
      }
    }
    // Auto-detect language
    try {
      return hljs.highlightAuto(code).value;
    } catch (e) {
      return code;
    }
  }
}));

// Configure marked options
marked.setOptions({
  gfm: true,        // GitHub Flavored Markdown
  breaks: true,     // Convert \n to <br>
  silent: true      // Don't throw on errors
});

/**
 * Markdown preview wrapper
 */
export class Preview {
  /**
   * @param {HTMLElement} container - Element to render into
   */
  constructor(container) {
    this.container = container;
    this._pendingRender = null;
  }

  /**
   * Render Markdown to HTML and update DOM
   * Uses requestAnimationFrame for performance
   * @param {string} markdown
   */
  render(markdown) {
    // Cancel pending render
    if (this._pendingRender) {
      cancelAnimationFrame(this._pendingRender);
    }

    // Schedule render on next frame
    this._pendingRender = requestAnimationFrame(() => {
      const html = this.toHTML(markdown);
      this.container.innerHTML = html;
      this._pendingRender = null;
    });
  }

  /**
   * Get rendered HTML (for export)
   * @param {string} markdown
   * @returns {string} Sanitized HTML
   */
  toHTML(markdown) {
    if (!markdown || markdown.trim() === '') {
      return '';
    }

    try {
      // Parse markdown to HTML
      const rawHTML = marked.parse(markdown);

      // Sanitize with DOMPurify
      const cleanHTML = DOMPurify.sanitize(rawHTML, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target'],  // Allow target attribute for links
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'hr',
          'ul', 'ol', 'li',
          'blockquote', 'pre', 'code',
          'strong', 'em', 'del', 's',
          'a', 'img',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'div', 'span'
        ]
      });

      return cleanHTML;
    } catch (e) {
      console.error('Markdown parse error:', e);
      return `<p style="color: var(--color-error);">Error rendering markdown</p>`;
    }
  }

  /** Clear the preview */
  clear() {
    if (this._pendingRender) {
      cancelAnimationFrame(this._pendingRender);
      this._pendingRender = null;
    }
    this.container.innerHTML = '';
  }
}
