import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Add your custom playwright configuration overrides here
  // Example:
  // timeout: 60000,
  // use: {
  //   baseURL: 'http://localhost:3000',
  // },
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  testDir: './e2e',
  testMatch: [/.*\.test\.(js|ts)/],
});
