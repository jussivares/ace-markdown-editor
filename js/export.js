/**
 * export.js - HTML & PDF export
 * Uses Blob API for HTML, hidden iframe for PDF
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
    this.printIframe = null;
  }

  /**
   * Export note as HTML file
   * @param {import('./storage.js').Note} note
   */
  exportHTML(note) {
    const html = this._generateFullHTML(note);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = this._sanitizeFilename(note.title) + '.html';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export note as PDF using hidden iframe technique
   * This ensures the correct note is printed regardless of editor state
   * @param {import('./storage.js').Note} note
   */
  exportPDF(note) {
    // Remove existing print iframe if any
    if (this.printIframe) {
      document.body.removeChild(this.printIframe);
    }

    // Create hidden iframe - needs some size for print to work correctly
    this.printIframe = document.createElement('iframe');
    this.printIframe.style.cssText = 'position:fixed;right:-9999px;bottom:-9999px;width:800px;height:600px;border:0;';
    document.body.appendChild(this.printIframe);

    // Write content to iframe
    const html = this._generatePrintHTML(note);
    const doc = this.printIframe.contentDocument || this.printIframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Use setTimeout instead of onload since doc.write doesn't trigger onload reliably
    setTimeout(() => {
      try {
        this.printIframe.contentWindow.focus();
        this.printIframe.contentWindow.print();
      } catch (e) {
        console.error('Print failed:', e);
        // Fallback: print main window
        window.print();
      }
    }, 250);
  }

  /**
   * Generate complete standalone HTML document
   * @param {import('./storage.js').Note} note
   * @returns {string} Full HTML document
   * @private
   */
  _generateFullHTML(note) {
    const renderedContent = this.preview.toHTML(note.content);
    const styles = this._getExportStyles();

    return `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this._escapeHtml(note.title)}</title>
  <style>${styles}</style>
</head>
<body>
  <article class="markdown-body">
    ${renderedContent}
  </article>
</body>
</html>`;
  }

  /**
   * Generate print-ready HTML for PDF export
   * @param {import('./storage.js').Note} note
   * @returns {string} HTML document optimized for printing
   * @private
   */
  _generatePrintHTML(note) {
    const renderedContent = this.preview.toHTML(note.content);
    const styles = this._getExportStyles();
    const printStyles = this._getPrintStyles();

    return `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="UTF-8">
  <title>${this._escapeHtml(note.title)}</title>
  <style>${styles}${printStyles}</style>
</head>
<body>
  <article class="markdown-body">
    ${renderedContent}
  </article>
</body>
</html>`;
  }

  /**
   * Get CSS styles for exported HTML
   * @returns {string} CSS styles
   * @private
   */
  _getExportStyles() {
    return `
      * {
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1a1a;
        background-color: #ffffff;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      .markdown-body h1 { font-size: 2em; margin: 0.67em 0; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.3em; }
      .markdown-body h2 { font-size: 1.5em; margin: 0.83em 0; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.3em; }
      .markdown-body h3 { font-size: 1.25em; margin: 1em 0; }
      .markdown-body h4 { font-size: 1em; margin: 1.33em 0; }
      .markdown-body p { margin: 1em 0; }
      .markdown-body a { color: #2563eb; text-decoration: none; }
      .markdown-body a:hover { text-decoration: underline; }
      .markdown-body code {
        font-family: 'SF Mono', Monaco, Consolas, monospace;
        font-size: 0.9em;
        background-color: #f5f5f5;
        padding: 0.2em 0.4em;
        border-radius: 3px;
      }
      .markdown-body pre {
        background-color: #f5f5f5;
        padding: 1em;
        border-radius: 6px;
        overflow-x: auto;
      }
      .markdown-body pre code {
        background: none;
        padding: 0;
      }
      .markdown-body blockquote {
        margin: 1em 0;
        padding: 0.5em 1em;
        border-left: 4px solid #e0e0e0;
        color: #666;
      }
      .markdown-body ul, .markdown-body ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      .markdown-body li { margin: 0.25em 0; }
      .markdown-body table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      .markdown-body th, .markdown-body td {
        border: 1px solid #e0e0e0;
        padding: 0.5em;
        text-align: left;
      }
      .markdown-body th {
        background-color: #f5f5f5;
        font-weight: 600;
      }
      .markdown-body img {
        max-width: 100%;
        height: auto;
      }
      .markdown-body hr {
        border: none;
        border-top: 1px solid #e0e0e0;
        margin: 2em 0;
      }
      /* Highlight.js inline styles for code blocks */
      .hljs { display: block; overflow-x: auto; padding: 1em; }
      .hljs-keyword { color: #d73a49; }
      .hljs-string { color: #032f62; }
      .hljs-comment { color: #6a737d; }
      .hljs-function { color: #6f42c1; }
      .hljs-number { color: #005cc5; }
      .hljs-attr { color: #6f42c1; }
      .hljs-built_in { color: #005cc5; }
    `;
  }

  /**
   * Get additional print-specific styles
   * @returns {string} Print CSS
   * @private
   */
  _getPrintStyles() {
    return `
      @media print {
        body {
          max-width: none;
          padding: 0;
          margin: 1cm;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          page-break-inside: avoid;
        }
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
        }
        a[href]:after {
          content: " (" attr(href) ")";
          font-size: 0.8em;
          color: #666;
        }
        a[href^="#"]:after,
        a[href^="javascript:"]:after {
          content: "";
        }
        pre, code {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;
  }

  /**
   * Sanitize filename for download
   * @param {string} title
   * @returns {string} Safe filename
   * @private
   */
  _sanitizeFilename(title) {
    return title
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid chars
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .slice(0, 100) // Limit length
      || 'untitled';
  }

  /**
   * Escape HTML special characters
   * @param {string} text
   * @returns {string} Escaped text
   * @private
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.printIframe) {
      document.body.removeChild(this.printIframe);
      this.printIframe = null;
    }
  }
}
