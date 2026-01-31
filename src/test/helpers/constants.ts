/**
 * Constants for Gruvbox Material VS Code theme extension tests.
 * Contains theme names, paths, configuration options, and test-related values.
 */

/** Theme display names for dark and light variants */
export const THEME_NAMES = {
  dark: "Gruvbox Material Dark",
  light: "Gruvbox Material Light",
} as const;

/** Paths to theme JSON files relative to project root */
export const THEME_PATHS = {
  dark: "themes/gruvbox-material-dark.json",
  light: "themes/gruvbox-material-light.json",
} as const;

/** Available contrast options for themes */
export const CONTRAST_OPTIONS = ["soft", "medium", "hard"] as const;

/** Available workbench style options */
export const WORKBENCH_OPTIONS = ["material", "flat", "high-contrast"] as const;

/** Available color palette options */
export const PALETTE_OPTIONS = ["material", "mix", "original"] as const;

/** Available cursor color options per theme variant */
export const CURSOR_OPTIONS = {
  dark: ["white", "red", "orange", "yellow", "green", "aqua", "blue", "purple"],
  light: [
    "black",
    "red",
    "orange",
    "yellow",
    "green",
    "aqua",
    "blue",
    "purple",
  ],
} as const;

/** Available selection highlight color options */
export const SELECTION_OPTIONS = [
  "grey",
  "red",
  "orange",
  "yellow",
  "green",
  "aqua",
  "blue",
  "purple",
] as const;

/** Available diagnostic text background opacity options */
export const DIAGNOSTIC_OPACITY_OPTIONS = [
  "0%",
  "12.5%",
  "25%",
  "37.5%",
  "50%",
] as const;

/** Default configuration values for the theme extension */
export const CONFIGURATION_DEFAULTS = {
  darkContrast: "medium",
  lightContrast: "medium",
  darkWorkbench: "material",
  lightWorkbench: "material",
  darkCursor: "white",
  lightCursor: "black",
  darkSelection: "grey",
  lightSelection: "grey",
  darkPalette: "material",
  lightPalette: "material",
  colorfulSyntax: false,
  italicKeywords: false,
  italicComments: true,
  diagnosticTextBackgroundOpacity: "0%",
  highContrast: false,
} as const;

/** Test timeout values in milliseconds */
export const TEST_TIMEOUTS = {
  default: 10000,
  themeGeneration: 30000,
  visual: 60000,
} as const;

/** Theme variant names */
export const THEME_VARIANTS = ["dark", "light"] as const;

/** Required properties that every theme JSON file must have */
export const REQUIRED_THEME_PROPERTIES = [
  "name",
  "type",
  "semanticHighlighting",
  "semanticTokenColors",
  "colors",
  "tokenColors",
] as const;

/** Required palette color property names from the Palette interface */
export const REQUIRED_PALETTE_COLORS = [
  // Background colors
  "bg0",
  "bg1",
  "bg",
  "bg2",
  "bg3",
  "bg4",
  "bg5",
  "bg6",
  "bg7",
  "bg8",
  "bg9",
  // Grey colors
  "grey0",
  "grey1",
  "grey2",
  // Foreground colors
  "fg0",
  "fg",
  "fg1",
  // Accent colors
  "red",
  "orange",
  "yellow",
  "green",
  "aqua",
  "blue",
  "purple",
  // Dim accent colors
  "dimRed",
  "dimOrange",
  "dimYellow",
  "dimGreen",
  "dimAqua",
  "dimBlue",
  "dimPurple",
  // Shadow
  "shadow",
] as const;
