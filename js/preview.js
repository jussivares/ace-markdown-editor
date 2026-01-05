/**
 * preview.js - Markdown preview wrapper
 * Uses marked + DOMPurify + highlight.js
 * Task-05 will implement full functionality
 */

/**
 * Markdown preview wrapper
 */
export class Preview {
  /**
   * @param {HTMLElement} container - Element to render into
   */
  constructor(container) {
    this.container = container;
    // Task-05: Initialize marked with highlight.js
  }

  /**
   * Render Markdown to HTML and update DOM
   * @param {string} markdown
   */
  render(markdown) {
    // Task-05: Implement with DOMPurify sanitization
    this.container.innerHTML = '<p>Preview will render here</p>';
  }

  /**
   * Get rendered HTML (for export)
   * @param {string} markdown
   * @returns {string} Sanitized HTML
   */
  toHTML(markdown) {
    // Task-05: Implement
    return '';
  }

  /** Clear the preview */
  clear() {
    this.container.innerHTML = '';
  }
}
