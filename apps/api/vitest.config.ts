import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@server-civilization/shared': path.resolve(
        __dirname,
        '../../packages/shared/src/index.ts',
      ),
      '@server-civilization/db': path.resolve(__dirname, '../../packages/db/src/index.ts'),
      '@server-civilization/game-core': path.resolve(
        __dirname,
        '../../packages/game-core/src/index.ts',
      ),
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
