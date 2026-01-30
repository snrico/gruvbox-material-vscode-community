/**
 * VS Code test configuration file.
 * Configures the @vscode/test-cli to run Mocha tests for the extension.
 */

import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
  files: 'dist/test/unit/**/*.test.js',
  version: 'stable',
  mocha: {
    ui: 'bdd',
    timeout: 30000,
    color: true
  },
  launchArgs: [
    '--disable-extensions'
  ]
});

