## Requirements

Make sure you have the following programs installed:

1. [git](https://git-scm.com/)
2. [Node.js 20+](https://nodejs.org/en/download/) (includes npm)

## Getting Started

First, clone the repository and install dependencies:

```shell
$ git clone --depth 1 https://github.com/snrico/gruvbox-material-vscode-community.git
$ cd gruvbox-material-vscode-community
$ npm ci
```

### Build and Test Locally

```shell
# Run linting
$ npm run lint

# Run unit tests (97 tests)
$ npm run test:unit

# Run visual regression tests (9 tests)
$ npm run test:visual

# Run all tests
$ npm run test:all

# Build and package the extension
$ npm run package

# Install the packaged extension
$ code --install-extension ./gruvbox-material-*.vsix
```

### Development Workflow

1. Open this project in VS Code
2. Make your changes to the TypeScript code in `src/`
3. Press `F5` to launch the Extension Development Host
4. Test your changes visually in the new VS Code window

## The theme files

The most critical files for a theme extension are some json files located in [/themes](https://github.com/sainnhe/gruvbox-material-vscode/tree/v6.2.1/themes), they defined all the colors of a theme.

A theme file can be roughly divided into three parts:

- [workbench colors](https://github.com/sainnhe/gruvbox-material-vscode/blob/v6.2.1/themes/gruvbox-material-dark.json#L25-L332): The UI of vscode.
- [syntax highlighting](https://github.com/sainnhe/gruvbox-material-vscode/blob/v6.2.1/themes/gruvbox-material-dark.json#L333-L2117): The syntax highlighting.
- [semantic highlighting](https://github.com/sainnhe/gruvbox-material-vscode/blob/v6.2.1/themes/gruvbox-material-dark.json#L5-L24): This is a new feature since vscode 1.43, see [Semantic Highlighting Overview](https://github.com/microsoft/vscode/wiki/Semantic-Highlighting-Overview). This feature is experimental, currently supports js, ts, java and C family.

For all available workbench colors, see [this documentation](https://code.visualstudio.com/api/references/theme-color).

To get current token of syntax highlighting or semantic highlighting, press `Ctrl+Shift+P` to open command panel and search for "Inspect Editor Tokens and Scopes".

In this extension, the json files will be automatically generated when user configuration changes, so don't keep your changes in the json files, but modify the typescript code instead.

## Testing

This project has a comprehensive testing suite. **All tests must pass before submitting a PR.**

### Test Structure

```
src/test/
├── helpers/           # Shared test utilities
│   ├── constants.ts   # Theme names, paths, configuration options
│   ├── fixtures.ts    # Test data factory functions
│   └── theme-validator.ts  # Theme JSON validation utilities
├── unit/              # Unit tests (run with @vscode/test-electron)
│   ├── theme-json.test.ts    # Theme JSON structure validation
│   ├── configuration.test.ts # Configuration option testing
│   └── palette.test.ts       # Palette generation testing
└── visual/            # Visual regression tests (run with Playwright)
    └── theme-visual.spec.ts  # Screenshot comparison tests

test/screenshots/      # Baseline screenshots for visual regression
```

### Running Tests

```shell
# Run unit tests (97 tests)
$ npm run test:unit

# Run visual regression tests (9 tests)
$ npm run test:visual

# Run all tests
$ npm run test:all
```

### Updating Visual Baselines

If you intentionally change theme colors, update the baseline screenshots:

```shell
$ npm run test:visual:update
```

Review the updated screenshots in `test/screenshots/` before committing.

## Publishing

GitHub Actions automatically publishes to VS Code Marketplace and Open VSX Registry when a version tag is pushed.

**Quick Release (recommended):**

```shell
# For bug fixes, security updates, dependency updates
$ npm run release:patch

# For new features, palette updates
$ npm run release:minor

# For breaking changes or major redesigns
$ npm run release:major
```

These scripts automatically bump the version, create a commit, tag, and push.

**Manual Release:**

1. Bump version: `npm version patch` (or `minor`/`major`)
2. Push with tags: `git push origin master --tags`

### Versioning

Given a `MAJOR.MINOR.PATCH`, increment the:

1. `MAJOR` version when you make breaking changes (often with changes to design),
2. `MINOR` version when you change configuration options or add features,
3. `PATCH` version when you fix bugs or update dependencies.

## Some designs

There are 3 workbench styles available in this theme:

- material: inspired by [material-theme/vsc-material-theme](https://github.com/material-theme/vsc-material-theme)
- flat: inspired by [Binaryify/OneDark-Pro](https://github.com/Binaryify/OneDark-Pro)
- high contrast: inspired by [Monokai Pro](https://monokai.pro/vscode)

It's highly recommended to try them first if you want to modify the code of a workbench style.

When you are modifying a workbench style, remember a principle:

> Don't make elements too colorful, because this will easily distract you from the code.

You may notice that I used many grey colors in workbench styles, it's exactly because of this, colorless elements will help you focus more on the code.

In addition, this theme is designed to be borderless, so DO NOT add unnecessary borders.

There are 2 syntax highlighting logic available in this theme: default and colorful

In the default syntax highlighting logic, only minimum but necessary tokens will be colored.

Unnecessary tokens include: variables, properties, members, parameters, etc.

In contrast, in the colorful syntax highlighting logic, as many tokens as possible will be colored.

## Note

- I set up 2 pre-commit hooks, one of which is used to generate `/themes/*.json` automatically using default user settings. So when developing this extension, don't care about how the themes files looks like, but just focus on the typescript code.
- DO NOT add new colors or modify existing colors in [/src/palette](https://github.com/sainnhe/gruvbox-material-vscode/tree/master/src/palette). The current color palettes are very carefully designed and tested on several devices. If you do want to change the color palettes, create a new theme extension instead.
- Don't add new configuration options casually, there are already so many configuration options and too many options may confuse users.
- Don't forget to update the changelog.
- Don't forget to update [italic syntax file](https://github.com/sainnhe/gruvbox-material-vscode/blob/master/src/syntax/italic.ts) if the syntax source code is modified.
- Comments including `{{{` or `}}}` are vim fold markers, I use them to fold the code in vim, so don't delete them.
