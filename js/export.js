/**
 * export.js - HTML & PDF export
 * Task-08 and Task-09 will implement full functionality
 */

/**
 * Export wrapper - HTML and PDF
 */
export class Exporter {
  /**
   * @param {import('./preview.js').Preview} preview - Preview instance for HTML generation
   */
  constructor(preview) {
    this.preview = preview;
  }

  /**
   * Export note as HTML file
   * @param {import('./storage.js').Note} note
   */
  exportHTML(note) {
    // Task-08: Implement
    console.log('Export HTML:', note.title);
  }

  /**
   * Export note as PDF using hidden iframe technique
   * @param {import('./storage.js').Note} note
   */
  exportPDF(note) {
    // Task-09: Implement with iframe technique
    console.log('Export PDF:', note.title);
  }

  /**
   * Generate complete print-ready HTML
   * @param {import('./storage.js').Note} note
   * @returns {string} HTML document with inline styles
   * @private
   */
  _generatePrintHTML(note) {
    // Task-08/09: Implement
    return '';
  }
}
