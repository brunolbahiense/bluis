import { defineConfig, devices } from '@playwright/test'

const port = 3100

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        hasTouch: true
      },
      testMatch: /layout\.spec\.ts/
    }
  ],
  // Roda contra o build de produção: faça `yarn build` antes.
  webServer: {
    command: `yarn start --port ${port}`,
    url: `http://localhost:${port}/pt`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
})
