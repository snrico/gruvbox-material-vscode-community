/*---------------------------------------------------------------------------------------------
 *  Homepage:   https://github.com/sainnhe/gruvbox-material-vscode
 *  Copyright:  2020 Sainnhe Park <i@sainnhe.dev>
 *  License:    MIT
 *--------------------------------------------------------------------------------------------*/

import { Configuration } from "../../interface";
import { CONFIGURATION_DEFAULTS } from "./constants";

/**
 * Creates a Configuration object with optional overrides.
 * Uses CONFIGURATION_DEFAULTS as the base and merges in any provided overrides.
 * @param overrides - Partial configuration to override defaults
 * @returns A complete Configuration object
 */
export function createConfiguration(
  overrides?: Partial<Configuration>,
): Configuration {
  return {
    ...CONFIGURATION_DEFAULTS,
    ...overrides,
  };
}

/**
 * Creates an array of configurations with all contrast options for a given variant.
 * @param variant - The theme variant ('dark' or 'light')
 * @returns Array of 3 configurations with soft/medium/hard contrast
 */
export function createAllContrastConfigurations(
  variant: "dark" | "light",
): Configuration[] {
  const contrastKey = variant === "dark" ? "darkContrast" : "lightContrast";
  const contrasts = ["soft", "medium", "hard"] as const;

  return contrasts.map((contrast) =>
    createConfiguration({ [contrastKey]: contrast }),
  );
}

/**
 * Creates an array of configurations with all workbench options for a given variant.
 * @param variant - The theme variant ('dark' or 'light')
 * @returns Array of 3 configurations with material/flat/high-contrast workbench
 */
export function createAllWorkbenchConfigurations(
  variant: "dark" | "light",
): Configuration[] {
  const workbenchKey = variant === "dark" ? "darkWorkbench" : "lightWorkbench";
  const workbenches = ["material", "flat", "high-contrast"] as const;

  return workbenches.map((workbench) =>
    createConfiguration({ [workbenchKey]: workbench }),
  );
}

/**
 * Creates an array of configurations with all palette options for a given variant.
 * @param variant - The theme variant ('dark' or 'light')
 * @returns Array of 3 configurations with material/mix/original palette
 */
export function createAllPaletteConfigurations(
  variant: "dark" | "light",
): Configuration[] {
  const paletteKey = variant === "dark" ? "darkPalette" : "lightPalette";
  const palettes = ["material", "mix", "original"] as const;

  return palettes.map((palette) =>
    createConfiguration({ [paletteKey]: palette }),
  );
}

/**
 * Creates an array of configurations for testing boolean options.
 * Returns 5 configurations:
 * - Default (all booleans at defaults)
 * - colorfulSyntax: true
 * - italicKeywords: true
 * - italicComments: false
 * - highContrast: true
 * @returns Array of 5 configurations testing boolean options
 */
export function createBooleanToggleConfigurations(): Configuration[] {
  return [
    createConfiguration(), // Default
    createConfiguration({ colorfulSyntax: true }),
    createConfiguration({ italicKeywords: true }),
    createConfiguration({ italicComments: false }),
    createConfiguration({ highContrast: true }),
  ];
}

/**
 * Returns an array of representative configuration combinations for testing.
 * Includes at least 12 key combinations covering different variants, contrasts,
 * workbenches, and palettes.
 * @returns Array of objects with name and config for major combinations
 */
export function getAllConfigurationCombinations(): {
  name: string;
  config: Configuration;
}[] {
  return [
    // Dark variant combinations
    {
      name: "dark-soft-material-material",
      config: createConfiguration({
        darkContrast: "soft",
        darkWorkbench: "material",
        darkPalette: "material",
      }),
    },
    {
      name: "dark-medium-flat-mix",
      config: createConfiguration({
        darkContrast: "medium",
        darkWorkbench: "flat",
        darkPalette: "mix",
      }),
    },
    {
      name: "dark-hard-high-contrast-original",
      config: createConfiguration({
        darkContrast: "hard",
        darkWorkbench: "high-contrast",
        darkPalette: "original",
      }),
    },
    {
      name: "dark-medium-material-original",
      config: createConfiguration({
        darkContrast: "medium",
        darkWorkbench: "material",
        darkPalette: "original",
      }),
    },
    {
      name: "dark-soft-flat-mix",
      config: createConfiguration({
        darkContrast: "soft",
        darkWorkbench: "flat",
        darkPalette: "mix",
      }),
    },
    {
      name: "dark-hard-material-material",
      config: createConfiguration({
        darkContrast: "hard",
        darkWorkbench: "material",
        darkPalette: "material",
      }),
    },
    // Light variant combinations
    {
      name: "light-soft-material-material",
      config: createConfiguration({
        lightContrast: "soft",
        lightWorkbench: "material",
        lightPalette: "material",
      }),
    },
    {
      name: "light-medium-flat-mix",
      config: createConfiguration({
        lightContrast: "medium",
        lightWorkbench: "flat",
        lightPalette: "mix",
      }),
    },
    {
      name: "light-hard-high-contrast-original",
      config: createConfiguration({
        lightContrast: "hard",
        lightWorkbench: "high-contrast",
        lightPalette: "original",
      }),
    },
    {
      name: "light-medium-material-original",
      config: createConfiguration({
        lightContrast: "medium",
        lightWorkbench: "material",
        lightPalette: "original",
      }),
    },
    {
      name: "light-soft-flat-mix",
      config: createConfiguration({
        lightContrast: "soft",
        lightWorkbench: "flat",
        lightPalette: "mix",
      }),
    },
    {
      name: "light-hard-material-material",
      config: createConfiguration({
        lightContrast: "hard",
        lightWorkbench: "material",
        lightPalette: "material",
      }),
    },
    // Boolean option combinations
    {
      name: "dark-colorful-syntax",
      config: createConfiguration({
        colorfulSyntax: true,
      }),
    },
    {
      name: "dark-italic-keywords",
      config: createConfiguration({
        italicKeywords: true,
        italicComments: false,
      }),
    },
    {
      name: "dark-high-contrast-ui",
      config: createConfiguration({
        highContrast: true,
        darkWorkbench: "high-contrast",
      }),
    },
  ];
}

/**
 * Returns a minimal valid theme data object for testing purposes.
 * Includes all required properties: name, type, semanticHighlighting,
 * semanticTokenColors, colors, and tokenColors.
 * @returns A minimal valid theme data object
 */
export function getTestThemeData(): object {
  return {
    name: "Test Theme",
    type: "dark",
    semanticHighlighting: true,
    semanticTokenColors: {
      variable: "#d4be98",
      function: "#a9b665",
      type: "#7daea3",
    },
    colors: {
      "editor.background": "#282828",
      "editor.foreground": "#d4be98",
      "activityBar.background": "#282828",
      "activityBar.foreground": "#d4be98",
      "sideBar.background": "#32302f",
      "sideBar.foreground": "#d4be98",
      "statusBar.background": "#282828",
      "statusBar.foreground": "#d4be98",
    },
    tokenColors: [
      {
        name: "Keyword",
        scope: "keyword",
        settings: {
          foreground: "#ea6962",
        },
      },
      {
        name: "String",
        scope: "string",
        settings: {
          foreground: "#a9b665",
        },
      },
      {
        name: "Comment",
        scope: "comment",
        settings: {
          foreground: "#928374",
          fontStyle: "italic",
        },
      },
    ],
  };
}

// vim: fdm=marker fmr={{{,}}}:
