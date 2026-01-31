# Gruvbox Material VS Code Extension - Maintenance Guide

This guide covers development, testing, and ongoing maintenance for the community-maintained fork of the Gruvbox Material VS Code extension.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Local Testing](#local-testing)
3. [Automated Testing](#automated-testing)
4. [Syncing with Upstream](#syncing-with-upstream)
5. [Versioning and Releases](#versioning-and-releases)
6. [GitHub Actions Workflows](#github-actions-workflows)
7. [Troubleshooting](#troubleshooting)

---

## Development Setup

### Prerequisites

- Node.js 20 or later
- npm 10 or later
- Git

### Getting Started

```bash
# Clone the repository
git clone https://github.com/snrico/gruvbox-material-vscode-community.git
cd gruvbox-material-vscode-community

# Install dependencies
npm install

# Build the extension
npm run compile

# Run linting
npm run lint
```

---

## Local Testing

### Testing the Extension in VS Code

1. **Build the extension**
   ```bash
   npm run compile
   ```

2. **Open in VS Code Extension Development Host**
   - Open this project in VS Code
   - Press `F5` to launch the Extension Development Host
   - In the new window, select the Gruvbox Material theme

3. **Test the packaged extension**
   ```bash
   npm run package
   ```
   This creates a `.vsix` file. Install it via:
   - VS Code → Extensions → `...` menu → "Install from VSIX..."

### Testing in Browser (VS Code Web)

```bash
npm run browser
```

This opens a browser-based VS Code instance with the extension loaded.

### Running Lints

```bash
npm run lint
```

---

## Automated Testing

This project includes a comprehensive testing suite with three layers: JSON validation, configuration testing, and visual regression testing.

### Test Structure

```
src/test/
├── helpers/           # Shared test utilities
│   ├── index.ts       # Re-exports all helpers
│   ├── constants.ts   # Theme names, paths, configuration options
│   ├── fixtures.ts    # Test data factory functions
│   └── theme-validator.ts  # Theme JSON validation utilities
├── unit/              # Unit tests (run with @vscode/test-electron)
│   ├── theme-json.test.ts    # Theme JSON structure validation
│   ├── configuration.test.ts # Configuration option testing
│   └── palette.test.ts       # Palette generation testing
└── visual/            # Visual regression tests (run with Playwright)
    └── theme-visual.spec.ts  # Screenshot comparison tests
```

### Running Tests

**All Tests (Unit Only by Default):**
```bash
npm test
```

**Unit Tests Only:**
```bash
npm run test:unit
```

**Visual Regression Tests:**
```bash
npm run test:visual
```

**All Tests (Unit + Visual):**
```bash
npm run test:all
```

**Update Visual Baselines:**
When intentionally changing theme colors, update baseline screenshots:
```bash
npm run test:visual:update
```

### Unit Tests

Unit tests validate:

1. **Theme JSON Validation** (`theme-json.test.ts`)
   - Verifies theme files exist and are valid JSON
   - Validates required properties (name, type, colors, tokenColors, semanticTokenColors)
   - Checks all color values are valid hex format
   - Ensures minimum expected workbench colors (100+) and token rules (10+)

2. **Configuration Tests** (`configuration.test.ts`)
   - Tests all configuration options work correctly
   - Validates default configuration values
   - Tests palette, workbench, syntax, and semantic token generation
   - Covers edge cases with undefined/partial configurations

3. **Palette Tests** (`palette.test.ts`)
   - Tests all palette combinations (dark/light × soft/medium/hard × material/mix/original)
   - Validates all 28 palette colors are present and valid
   - Verifies dark and light variants produce different colors
   - Tests contrast level effects on background colors

### Visual Regression Tests

Visual tests use Playwright to:

1. **Capture Screenshots** of VS Code Web with the theme applied
2. **Compare Against Baselines** stored in `test/screenshots/`
3. **Detect Unintended Changes** by pixel comparison

**Screenshot Comparison Settings:**
- `maxDiffPixels`: 100 (allows minor anti-aliasing differences)
- `threshold`: 0.2 (per-pixel color difference tolerance)

**What Gets Tested:**
- Full workbench view (dark and light themes)
- Activity bar colors
- Sidebar colors
- Status bar colors
- Theme switching behavior

### CI Integration

Tests run automatically in GitHub Actions:

1. **Lint and Build** - Validates code compiles without errors
2. **Unit Tests** - Runs all unit tests with @vscode/test-electron
3. **Visual Tests** - Runs Playwright visual regression tests

On failure:
- Visual diff images are uploaded as artifacts
- Playwright HTML report is uploaded for debugging

### Adding New Tests

**Adding a Unit Test:**

1. Create or edit a file in `src/test/unit/`
2. Use Mocha syntax (`describe`, `it`)
3. Import helpers from `../helpers`
4. Follow AAA pattern (Arrange, Act, Assert)

Example:
```typescript
import * as assert from 'assert';
import { createConfiguration, validateThemeStructure } from '../helpers';

describe('My New Test Suite', function() {
  it('should test something', () => {
    // Arrange
    const config = createConfiguration({ darkContrast: 'hard' });

    // Act
    const result = someFunction(config);

    // Assert
    assert.ok(result, 'expected result to be truthy');
  });
});
```

**Adding a Visual Test:**

1. Create or edit a file in `src/test/visual/`
2. Use Playwright test syntax
3. Use `toHaveScreenshot()` for comparisons
4. Run `npm run test:visual:update` to create baselines

Example:
```typescript
import { test, expect } from '@playwright/test';

test('new visual test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForSelector('.monaco-workbench');
  await expect(page).toHaveScreenshot('my-new-screenshot.png');
});
```

### Test Helpers Reference

**Constants (`constants.ts`):**
- `THEME_NAMES` - Theme display names
- `THEME_PATHS` - Paths to theme JSON files
- `CONFIGURATION_DEFAULTS` - All default config values
- `TEST_TIMEOUTS` - Timeout values for different test types
- `REQUIRED_THEME_PROPERTIES` - Properties every theme must have
- `REQUIRED_PALETTE_COLORS` - All palette color names

**Fixtures (`fixtures.ts`):**
- `createConfiguration(overrides?)` - Factory for Configuration objects
- `createAllContrastConfigurations(variant)` - All contrast variations
- `createAllWorkbenchConfigurations(variant)` - All workbench variations
- `createAllPaletteConfigurations(variant)` - All palette variations
- `createBooleanToggleConfigurations()` - Boolean option variations
- `getAllConfigurationCombinations()` - Representative config samples

**Validators (`theme-validator.ts`):**
- `validateThemeStructure(theme)` - Validates required properties
- `validateThemeColors(theme)` - Validates color formats
- `validateCompleteTheme(theme, variant)` - Full validation
- `countWorkbenchColors(theme)` - Count workbench color entries
- `countTokenColorRules(theme)` - Count token color rules

---

## Syncing with Upstream

The canonical color palette is defined in the upstream Vim repository:
**https://github.com/sainnhe/gruvbox-material**

### Upstream Palette Location

The definitive color values are in the `gruvbox_material#get_palette()` function:
```
https://github.com/sainnhe/gruvbox-material/blob/master/autoload/gruvbox_material.vim
```

### How Often to Check

**Recommended cadence:**
- **Monthly**: Quick check for upstream releases
- **Quarterly**: Detailed palette comparison
- **On upstream release**: Check GitHub releases at https://github.com/sainnhe/gruvbox-material/releases

### Palette Synchronization Status

#### What Matches Upstream ✅

| Category | Status |
|----------|--------|
| All accent colors (`red`, `orange`, `yellow`, `green`, `aqua`, `blue`, `purple`) | ✅ Match exactly |
| Grey colors (`grey0`, `grey1`, `grey2`) | ✅ Match exactly |
| Light foreground colors | ✅ Match exactly |

#### VS Code-Specific Adaptations ⚠️

The VS Code extension has **intentional differences** from upstream to optimize for VS Code's UI:

| Difference | Reason |
|------------|--------|
| `fg0`/`fg1` swapped in dark material | Better contrast hierarchy in VS Code |
| Darker `bg0`/`bg1` values | Required for title bar, activity bar contrast |
| Additional `bg`, `bg6`-`bg9` | More granularity for VS Code UI elements |
| `dim*` colors | Dimmed accents for breadcrumbs, git decorations |
| `shadow` property | CSS shadow effects |

### Step-by-Step Sync Process

1. **Fetch the upstream palette**
   ```bash
   curl -s https://raw.githubusercontent.com/sainnhe/gruvbox-material/master/autoload/gruvbox_material.vim > /tmp/upstream-palette.vim
   ```

2. **Find the palette function and extract colors**
   Search for `function! gruvbox_material#get_palette` in the file.

3. **Compare with local palette files**
   ```
   src/palette/
   ├── dark/
   │   ├── background/   (hard.ts, medium.ts, soft.ts)
   │   └── foreground/   (material.ts, mix.ts, original.ts)
   └── light/
       ├── background/   (hard.ts, medium.ts, soft.ts)
       └── foreground/   (material.ts, mix.ts, original.ts)
   ```

4. **Update only accent colors** (unless making intentional design changes)

   The following colors should **always match upstream**:
   - `red`, `orange`, `yellow`, `green`, `aqua`, `blue`, `purple`
   - `grey0`, `grey1`, `grey2`
   - `bg_red`, `bg_green`, `bg_yellow` (if used)

5. **Rebuild and test**
   ```bash
   npm run compile
   npm run test:unit
   npm run test:visual
   ```

6. **Visual verification**
   - Press `F5` to launch Extension Development Host
   - Test all 18 combinations (dark/light × hard/medium/soft × material/mix/original)
   - Pay special attention to:
     - Syntax highlighting colors
     - Editor background contrast
     - Status bar, activity bar, sidebar colors

7. **Update visual baselines** (if colors changed intentionally)
   ```bash
   npm run test:visual:update
   ```

### Palette Structure Reference

**Upstream palette (Vim format):**
```vim
'fg0':    ['#d4be98', '223'],    " [hex_color, terminal_color]
'fg1':    ['#ddc7a1', '223'],
'red':    ['#ea6962', '167'],
...
```

**Local palette (TypeScript format):**
```typescript
export default {
  fg0: "#ddc7a1",    // Note: may differ from upstream
  fg: "#d4be98",     // VS Code-specific
  fg1: "#c5b18d",    // VS Code-specific
  red: "#ea6962",    // Should match upstream
  ...
};
```

### Color Mapping Reference

#### Dark Foreground - Material Palette

| Local Property | Upstream Property | Match? |
|----------------|-------------------|--------|
| `fg0` | `fg1` | Swapped |
| `fg` | `fg0` | VS Code adaptation |
| `fg1` | - | VS Code-specific |
| `red` | `red` | ✅ |
| `orange` | `orange` | ✅ |
| `yellow` | `yellow` | ✅ |
| `green` | `green` | ✅ |
| `aqua` | `aqua` | ✅ |
| `blue` | `blue` | ✅ |
| `purple` | `purple` | ✅ |
| `dim*` | - | VS Code-specific |

#### Dark Background - All Contrasts

| Local Property | Description |
|----------------|-------------|
| `bg0`, `bg1` | Darker than upstream for VS Code UI |
| `bg` | Main editor background (VS Code-specific) |
| `bg2`-`bg5` | Approximate match with upstream `bg1`-`bg5` |
| `bg6`-`bg9` | VS Code-specific extensions |
| `grey0/1/2` | Match upstream exactly |
| `shadow` | VS Code-specific |

### Testing After Sync

Run the full test suite to ensure nothing broke:

```bash
# 1. Lint and compile
npm run lint
npm run compile

# 2. Run all unit tests (97 tests)
npm run test:unit

# 3. Run visual regression tests (9 tests)
npm run test:visual

# 4. If visual tests fail due to intentional changes:
npm run test:visual:update
```

### Creating a Palette Update Release

If updating to match upstream changes:

1. Create a branch: `git checkout -b palette-sync-YYYYMMDD`
2. Make changes to `src/palette/**/*.ts`
3. Run full test suite
4. Commit: `git commit -am "feat: sync palette with upstream gruvbox-material"`
5. Create PR, merge, then release:
   ```bash
   npm run release:minor  # Palette updates are minor versions
   ```

---

## Versioning and Releases

### Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes or major redesigns
- **MINOR** (0.x.0): New features, palette updates, new VS Code API support
- **PATCH** (0.0.x): Bug fixes, security updates, dependency updates

### Release Process

**Quick Release (recommended):**

Use the npm release scripts for a streamlined release:

```bash
# For bug fixes, security updates, dependency updates
npm run release:patch

# For new features, palette updates
npm run release:minor

# For breaking changes or major redesigns
npm run release:major
```

These scripts automatically:
1. Bump the version in `package.json`
2. Create a git commit with the new version
3. Create a git tag (e.g., `v6.6.1`)
4. Push to master with the tag

**Manual Release (step by step):**

1. **Update CHANGELOG.md** (optional but recommended)
   Add a new section at the top with the version number and changes.

2. **Bump version and create tag**
   ```bash
   npm version patch  # or minor, or major
   ```

3. **Push with tags**
   ```bash
   git push origin master --tags
   ```

**What happens automatically:**

When you push a tag starting with `v` (e.g., `v6.6.1`), the `stable_release.yml` workflow:
1. Builds the extension
2. Packages the `.vsix` file
3. Publishes to VS Code Marketplace
4. Publishes to Open VSX Registry
5. **Creates a GitHub Release with auto-generated release notes**
6. Attaches the `.vsix` file to the GitHub Release

**Automatic Release Notes:**

GitHub automatically generates release notes based on merged PRs and commits. The notes are categorized using labels defined in `.github/release.yml`:

| Label | Category |
|-------|----------|
| `security` | 🔐 Security |
| `enhancement`, `feature` | 🚀 Features |
| `bug`, `fix` | 🐛 Bug Fixes |
| `dependencies` | 📦 Dependencies |
| `documentation` | 📚 Documentation |
| `theme`, `colors`, `palette` | 🎨 Theme Updates |
| `maintenance`, `chore` | 🔧 Maintenance |

---

## GitHub Actions Workflows

### CI (`ci.yml`)
- Runs on: Push/PR to master
- **Jobs:**
  - `lint-and-build` - Lint, compile, and package the extension
  - `unit-tests` - Run unit tests with @vscode/test-electron
  - `visual-tests` - Run Playwright visual regression tests
- **Artifacts on Failure:**
  - `visual-test-diffs` - Screenshot differences for debugging
  - `playwright-report` - HTML test report
- Purpose: Validate changes before merge

### Stable Release (`stable_release.yml`)
- Runs on: Tag push or manual trigger
- Actions: Build and publish to both marketplaces
- Secrets required: `VS_MARKETPLACE_TOKEN`, `OPEN_VSX_TOKEN`

### Development Release (`development_release.yml`)
- Runs on: Issue closed or manual trigger
- Actions: Build and upload `.vsix` as artifact
- Purpose: Provide pre-release builds for testing

### Upstream Palette Check (`check-upstream.yml`) - Recommended

Create a workflow to automatically check for upstream palette changes:

```yaml
# .github/workflows/check-upstream.yml
name: Check Upstream Palette

on:
  schedule:
    # Run monthly on the 1st at 9:00 UTC
    - cron: '0 9 1 * *'
  workflow_dispatch:  # Allow manual trigger

jobs:
  check-upstream:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Fetch upstream palette
        run: |
          curl -s https://raw.githubusercontent.com/sainnhe/gruvbox-material/master/autoload/gruvbox_material.vim > /tmp/upstream.vim

      - name: Extract accent colors from upstream
        id: extract
        run: |
          # Extract hex colors for comparison
          grep -oE "'(red|orange|yellow|green|aqua|blue|purple)':\s*\['#[a-fA-F0-9]{6}'" /tmp/upstream.vim | \
            sed "s/'//g" | sort > /tmp/upstream-colors.txt
          echo "Upstream accent colors:"
          cat /tmp/upstream-colors.txt

      - name: Compare with local palette
        run: |
          # Extract local colors from TypeScript files
          for file in src/palette/dark/foreground/*.ts; do
            echo "=== $file ==="
            grep -oE '(red|orange|yellow|green|aqua|blue|purple):\s*"#[a-fA-F0-9]{6}"' "$file" || true
          done

      - name: Check for upstream releases
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          echo "Recent upstream releases:"
          gh api repos/sainnhe/gruvbox-material/releases --jq '.[0:3] | .[] | "\(.tag_name) - \(.published_at)"'
```

**To enable this workflow:**
1. Copy the YAML above to `.github/workflows/check-upstream.yml`
2. The workflow will run monthly and can be triggered manually
3. Check the Actions tab for results

---

## Automation Recommendations

### 1. Automated Upstream Monitoring

**Option A: GitHub Actions (Recommended)**

Use the `check-upstream.yml` workflow above to:
- Fetch upstream palette monthly
- Compare accent colors with local files
- Report in workflow logs

**Option B: GitHub Dependabot-style Notifications**

Create a GitHub issue when upstream releases:
```yaml
# Add to check-upstream.yml after the check job
- name: Create issue if upstream updated
  if: steps.check-release.outputs.new_release == 'true'
  uses: peter-evans/create-issue-from-file@v5
  with:
    title: "[Palette Sync] Upstream gruvbox-material updated"
    content-filepath: /tmp/upstream-changes.md
    labels: palette, upstream-sync
```

### 2. Local Comparison Script

Create a comparison script for manual checks:

```bash
#!/bin/bash
# scripts/compare-palette.sh

echo "Fetching upstream palette..."
curl -s https://raw.githubusercontent.com/sainnhe/gruvbox-material/master/autoload/gruvbox_material.vim > /tmp/upstream.vim

echo ""
echo "=== Dark Material Foreground Comparison ==="
echo ""
echo "Upstream colors:"
grep -A20 "if a:foreground ==# 'material'" /tmp/upstream.vim | grep -E "'(fg|red|orange|yellow|green|aqua|blue|purple)'" | head -12

echo ""
echo "Local colors (src/palette/dark/foreground/material.ts):"
grep -E '^\s*(fg|red|orange|yellow|green|aqua|blue|purple):' src/palette/dark/foreground/material.ts

echo ""
echo "=== Run 'npm run test:unit' to validate all colors ==="
```

### 3. Pre-commit Palette Validation

Add to your pre-commit hooks (if using husky):

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test:unit"
    }
  }
}
```

### 4. Future Enhancements

Consider these for more robust automation:

1. **Automated PR creation**: When upstream changes detected, auto-create a PR with suggested updates
2. **Color diff visualization**: Generate HTML showing color swatches for easy comparison
3. **Semantic versioning automation**: Auto-suggest version bump based on change type

---

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
- Run `npm run lint -- --fix` to auto-fix formatting issues
- Check for breaking changes in updated dependencies

**Theme not updating after changes**
- Run `npm run compile` to regenerate theme JSON files
- Reload VS Code window (Cmd/Ctrl + Shift + P → "Reload Window")

**Tests failing after palette changes**
- If you intentionally changed colors, update visual baselines: `npm run test:visual:update`
- Run `npm run test:unit` to verify all palette combinations are valid

### Getting Help

- Original theme documentation: https://github.com/sainnhe/gruvbox-material
- VS Code theme development: https://code.visualstudio.com/api/extension-guides/color-theme
- File an issue: https://github.com/snrico/gruvbox-material-vscode-community/issues
