import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text'], // text only: no coverage/ folder to lint or commit
      // the logic files only (team decision): animation-heavy components are checked by eye and in review
      include: [
        'src/site/content.ts',
        'src/site/Split.tsx',
        'src/site/ready.ts',
        'src/site/Nav.tsx',
        'src/site/ChapterIndex.tsx',
        'src/site/preload.ts',
      ],
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
})
