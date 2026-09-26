import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: [
    {
      command: 'npm run dev --prefix ../anecdotes',
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npx json-server --port 3001 --watch db-test.json',
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
  ],
})