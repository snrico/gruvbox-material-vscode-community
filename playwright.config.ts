import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for visual regression testing of Gruvbox Material VS Code theme.
 *
 * This configuration is optimized for deterministic screenshot comparisons:
 * - Single worker to ensure consistent rendering order
 * - Disabled parallelism to prevent race conditions in screenshots
 * - Disabled animations to capture stable states
 *
 * Screenshot comparison thresholds:
 * - maxDiffPixels: 100 - Allows up to 100 pixels to differ, accounting for minor
 *   anti-aliasing differences across platforms
 * - threshold: 0.2 - Per-pixel color difference tolerance (0-1 scale), set to 20%
 *   to handle slight color variations in font rendering while still catching
 *   meaningful visual changes
 */
export default defineConfig({
  /**
   * Directory containing visual regression test files
   */
  testDir: './src/test/visual',

  /**
   * Pattern for matching test files
   */
  testMatch: '**/*.spec.ts',

  /**
   * Run tests sequentially for deterministic screenshots.
   * Parallel execution can cause timing-dependent visual differences.
   */
  fullyParallel: false,

  /**
   * Fail CI builds if test.only is left in code
   */
  forbidOnly: !!process.env.CI,

  /**
   * Retry failed tests in CI to handle flaky visual comparisons.
   * No retries locally for faster feedback during development.
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * Single worker ensures consistent screenshot capture order.
   * Multiple workers can cause non-deterministic rendering states.
   */
  workers: 1,

  /**
   * HTML reporter for detailed visual diff review, list reporter for CI output
   */
  reporter: [['html', { open: 'never' }], ['list']],

  /**
   * Global timeout for each test (1 minute)
   */
  timeout: 60000,

  /**
   * Directory for storing baseline screenshots.
   * Screenshots are stored per-platform to handle OS-specific font rendering differences.
   */
  snapshotDir: 'test/screenshots',

  /**
   * Snapshot path template that includes platform for cross-OS compatibility.
   * Format: test/screenshots/{platform}/{testName}.png
   * This allows separate baselines for linux, darwin, and win32.
   */
  snapshotPathTemplate: '{snapshotDir}/{platform}/{arg}{ext}',

  expect: {
    /**
     * Timeout for expect assertions (10 seconds)
     */
    timeout: 10000,

    /**
     * Screenshot comparison configuration optimized for theme testing
     */
    toHaveScreenshot: {
      /**
       * Maximum number of pixels that can differ between screenshots.
       * Set to 500 to account for anti-aliasing differences across platforms
       * and minor font rendering variations.
       */
      maxDiffPixels: 500,

      /**
       * Per-pixel color difference threshold (0-1 scale).
       * 0.3 (30%) allows for minor color variations in subpixel rendering
       * while still detecting meaningful theme color changes.
       */
      threshold: 0.3,

      /**
       * Disable animations to capture stable visual states.
       * Animations can cause flaky tests due to timing differences.
       */
      animations: 'disabled',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        /**
         * Fixed viewport for consistent screenshots across environments
         */
        viewport: { width: 1280, height: 720 },
        /**
         * Dark color scheme to match the Gruvbox Material dark theme variants
         */
        colorScheme: 'dark',
      },
    },
  ],

  /**
   * Web server configuration for VS Code web extension testing.
   * Uses @vscode/test-web to serve the extension in a browser environment.
   */
  webServer: {
    /**
     * Launch VS Code for Web with the extension loaded.
     * --browserType=none prevents auto-launching a browser (Playwright handles this)
     * --extensionDevelopmentPath=. loads the extension from the current directory
     */
    command: 'npx @vscode/test-web --browserType=none --extensionDevelopmentPath=. .',
    /**
     * Default port for @vscode/test-web
     */
    port: 3000,
    /**
     * Reuse existing server in development to speed up test iterations.
     * Always start fresh in CI for reproducibility.
     */
    reuseExistingServer: !process.env.CI,
    /**
     * Extended timeout (2 minutes) for VS Code web server startup,
     * which can be slow due to extension compilation and loading.
     */
    timeout: 120000,
  },
});

