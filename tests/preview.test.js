/**
 * preview.test.js - Unit tests for Preview module
 * Tests: Markdown rendering, XSS sanitization
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Preview } from '../js/preview.js';

describe('Preview', () => {
  let preview;
  let container;

  beforeEach(() => {
    // Create a mock container element
    container = document.createElement('div');
    container.id = 'preview-pane';
    document.body.appendChild(container);
    preview = new Preview(container);
  });

  describe('toHTML', () => {
    describe('Markdown Rendering', () => {
      it('should render basic markdown', () => {
        // Arrange
        const markdown = '# Hello World';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<h1');
        expect(result).toContain('Hello World');
      });

      it('should render paragraphs', () => {
        // Arrange
        const markdown = 'This is a paragraph.';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<p>');
        expect(result).toContain('This is a paragraph.');
      });

      it('should render bold text', () => {
        // Arrange
        const markdown = '**bold text**';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<strong>bold text</strong>');
      });

      it('should render italic text', () => {
        // Arrange
        const markdown = '*italic text*';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<em>italic text</em>');
      });

      it('should render links', () => {
        // Arrange
        const markdown = '[Link](https://example.com)';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<a');
        expect(result).toContain('href="https://example.com"');
        expect(result).toContain('Link');
      });

      it('should render unordered lists', () => {
        // Arrange
        const markdown = '- Item 1\n- Item 2';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<ul>');
        expect(result).toContain('<li>');
        expect(result).toContain('Item 1');
        expect(result).toContain('Item 2');
      });

      it('should render ordered lists', () => {
        // Arrange
        const markdown = '1. First\n2. Second';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<ol>');
        expect(result).toContain('<li>');
      });

      it('should render code blocks', () => {
        // Arrange
        const markdown = '```javascript\nconst x = 1;\n```';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<pre>');
        expect(result).toContain('<code');
      });

      it('should render inline code', () => {
        // Arrange
        const markdown = 'Use `console.log()` for debugging';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<code>console.log()</code>');
      });

      it('should render blockquotes', () => {
        // Arrange
        const markdown = '> This is a quote';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<blockquote>');
        expect(result).toContain('This is a quote');
      });

      it('should render horizontal rules', () => {
        // Arrange
        const markdown = '---';

        // Act
        const result = preview.toHTML(markdown);

        // Assert
        expect(result).toContain('<hr');
      });

      it('should return empty string for empty input', () => {
        // Arrange & Act
        const result = preview.toHTML('');

        // Assert
        expect(result).toBe('');
      });

      it('should return empty string for whitespace-only input', () => {
        // Arrange & Act
        const result = preview.toHTML('   \n\n   ');

        // Assert
        expect(result).toBe('');
      });
    });

    describe('XSS Protection (Critical)', () => {
      it('should sanitize script tags', () => {
        // Arrange
        const malicious = '<script>alert("XSS")</script>';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('alert');
      });

      it('should sanitize inline event handlers', () => {
        // Arrange
        const malicious = '<img src="x" onerror="alert(1)">';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('alert');
      });

      it('should sanitize javascript: URLs', () => {
        // Arrange
        const malicious = '[Click me](javascript:alert(1))';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('javascript:');
      });

      it('should sanitize data: URLs with scripts', () => {
        // Arrange
        const malicious = '<a href="data:text/html,<script>alert(1)</script>">Link</a>';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('data:text/html');
      });

      it('should sanitize SVG with embedded scripts', () => {
        // Arrange
        const malicious = '<svg onload="alert(1)"><circle r="50"/></svg>';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('onload');
      });

      it('should sanitize iframe tags', () => {
        // Arrange
        const malicious = '<iframe src="https://evil.com"></iframe>';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('<iframe');
      });

      it('should sanitize style tags with expressions', () => {
        // Arrange
        const malicious = '<style>body{background:url("javascript:alert(1)")}</style>';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('<style>');
      });

      it('should sanitize object tags', () => {
        // Arrange
        const malicious = '<object data="malicious.swf"></object>';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('<object');
      });

      it('should sanitize embed tags', () => {
        // Arrange
        const malicious = '<embed src="malicious.swf">';

        // Act
        const result = preview.toHTML(malicious);

        // Assert
        expect(result).not.toContain('<embed');
      });

      it('should sanitize form action attribute', () => {
        // Arrange - DOMPurify allows forms but sanitizes dangerous attributes
        const malicious = '<form action="javascript:alert(1)"><input></form>';

        // Act
        const result = preview.toHTML(malicious);

        // Assert - javascript: URL should be removed
        expect(result).not.toContain('javascript:');
      });

      it('should allow safe HTML elements', () => {
        // Arrange
        const safe = '<strong>Bold</strong> and <em>italic</em>';

        // Act
        const result = preview.toHTML(safe);

        // Assert
        expect(result).toContain('<strong>Bold</strong>');
        expect(result).toContain('<em>italic</em>');
      });

      it('should preserve markdown in code blocks without executing', () => {
        // Arrange
        const codeBlock = '```html\n<script>alert("safe")</script>\n```';

        // Act
        const result = preview.toHTML(codeBlock);

        // Assert - should contain escaped/safe version
        expect(result).toContain('<code');
        expect(result).not.toMatch(/<script>/); // Raw script tag should not exist
      });
    });
  });

  describe('render', () => {
    it('should update container innerHTML', async () => {
      // Arrange
      const markdown = '# Test';

      // Act
      preview.render(markdown);

      // Wait for requestAnimationFrame
      await new Promise(resolve => setTimeout(resolve, 50));

      // Assert
      expect(container.innerHTML).toContain('<h1');
      expect(container.innerHTML).toContain('Test');
    });
  });

  describe('clear', () => {
    it('should clear container content', async () => {
      // Arrange
      preview.render('# Content');
      await new Promise(resolve => setTimeout(resolve, 50));

      // Act
      preview.clear();

      // Assert
      expect(container.innerHTML).toBe('');
    });
  });
});
