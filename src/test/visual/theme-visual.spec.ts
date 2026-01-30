/**
 * Visual regression tests for Gruvbox Material VS Code theme.
 * Uses Playwright to capture and compare screenshots of the theme in VS Code web.
 */

import { test, expect, Page } from '@playwright/test';

/** Test configuration constants */
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  loadTimeout: 30000,
  screenshotDelay: 2000,
} as const;

/** Theme variants to test */
const THEME_VARIANTS = ['dark', 'light'] as const;

/**
 * Waits for VS Code web to fully load.
 * This ensures the Monaco workbench is visible and the UI has stabilized
 * before taking screenshots or interacting with the editor.
 */
async function waitForVSCodeLoad(page: Page): Promise<void> {
  // Wait for the main VS Code container
  await page.waitForSelector('.monaco-workbench', { 
    state: 'visible',
    timeout: TEST_CONFIG.loadTimeout 
  });
  // Additional wait for UI to stabilize after initial render
  await page.waitForTimeout(TEST_CONFIG.screenshotDelay);
}

/**
 * Opens the command palette in VS Code web.
 * Uses the platform-appropriate keyboard shortcut (Control+Shift+P on Linux/Windows,
 * Meta+Shift+P on macOS) instead of F1 to avoid browser-level shortcut conflicts.
 */
async function openCommandPalette(page: Page): Promise<void> {
  // Detect platform to use appropriate modifier key
  const platform = process.platform;
  const modifier = platform === 'darwin' ? 'Meta' : 'Control';
  
  // Use platform-appropriate shortcut for command palette
  await page.keyboard.press(`${modifier}+Shift+KeyP`);
  await page.waitForSelector('.quick-input-widget', { state: 'visible' });
}

/**
 * Switches to a specific theme in VS Code web.
 * Opens the command palette, navigates to theme settings,
 * and selects the specified theme by name.
 */
async function switchToTheme(page: Page, themeName: string): Promise<void> {
  await openCommandPalette(page);
  await page.keyboard.type('Preferences: Color Theme');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.quick-input-list', { state: 'visible' });
  await page.keyboard.type(themeName);
  // Wait for search results to filter
  await page.waitForTimeout(500);
  await page.keyboard.press('Enter');
  // Wait for theme to fully apply
  await page.waitForTimeout(TEST_CONFIG.screenshotDelay);
}

test.describe('Theme Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_CONFIG.baseUrl);
    await waitForVSCodeLoad(page);
  });

  test.describe('Theme Screenshots', () => {
    for (const variant of THEME_VARIANTS) {
      const themeName = `Gruvbox Material ${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
      
      test(`${variant} theme - full workbench`, async ({ page }) => {
        // Arrange: Switch to the target theme
        await switchToTheme(page, themeName);
        
        // Act & Assert: Capture and compare full workbench screenshot
        await expect(page).toHaveScreenshot(`${variant}-workbench.png`, {
          fullPage: true,
          mask: [
            // Mask dynamic content that may change between runs
            page.locator('.monaco-action-bar .badge'),
          ]
        });
      });

      test(`${variant} theme - activity bar`, async ({ page }) => {
        // Test the left-side activity bar (icons for explorer, search, etc.)
        await switchToTheme(page, themeName);
        const activityBar = page.locator('.activitybar');
        await expect(activityBar).toHaveScreenshot(`${variant}-activity-bar.png`);
      });

      test(`${variant} theme - sidebar`, async ({ page }) => {
        // Test the sidebar panel (file explorer, search results, etc.)
        await switchToTheme(page, themeName);
        const sidebar = page.locator('.sidebar');
        await expect(sidebar).toHaveScreenshot(`${variant}-sidebar.png`);
      });

      test(`${variant} theme - status bar`, async ({ page }) => {
        // Test the bottom status bar
        await switchToTheme(page, themeName);
        const statusBar = page.locator('.statusbar');
        await expect(statusBar).toHaveScreenshot(`${variant}-status-bar.png`);
      });
    }
  });

  test.describe('Theme Comparison', () => {
    test('dark and light themes should be visually distinct', async ({ page }) => {
      // This test verifies that the two themes produce different visual output,
      // serving as a basic sanity check that theme switching works correctly.
      
      // Switch to dark theme and capture screenshot
      await switchToTheme(page, 'Gruvbox Material Dark');
      const darkScreenshot = await page.screenshot();
      
      // Switch to light theme and capture screenshot
      await switchToTheme(page, 'Gruvbox Material Light');
      const lightScreenshot = await page.screenshot();
      
      // Assert that screenshots are different (basic sanity check)
      expect(darkScreenshot.equals(lightScreenshot)).toBe(false);
    });
  });
});

// Note: The "extension should be installed" test was removed because VS Code Web
// (vscode.dev) doesn't support local extensions the same way as desktop VS Code.
// Visual regression tests above cover theme appearance verification.

