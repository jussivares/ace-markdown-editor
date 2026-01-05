import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['js/storage.js', 'js/preview.js', 'js/utils.js'],
      reporter: ['text', 'html']
    }
  }
});
