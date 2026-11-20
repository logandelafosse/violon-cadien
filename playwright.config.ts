import { defineConfig, devices } from '@playwright/test'

// Construit puis sert le build de production (base './' : la racine du serveur suffit).
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL: 'http://localhost:4173/', trace: 'retain-on-failure', locale: 'fr-FR' },
  // Chromium (Pixel 7) par défaut ; Firefox et WebKit (moteur de Safari, profil iPhone) avec E2E_ALL=1.
  projects: [
    { name: 'chromium', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
    ...(process.env.E2E_ALL
      ? [
          { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 412, height: 915 } } },
          { name: 'webkit', use: { ...devices['iPhone 14'] } },
        ]
      : []),
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
