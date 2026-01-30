/*---------------------------------------------------------------------------------------------
 *  Homepage:   https://github.com/sainnhe/gruvbox-material-vscode
 *  Copyright:  2020 Sainnhe Park <i@sainnhe.dev>
 *  License:    MIT
 *--------------------------------------------------------------------------------------------*/

import { REQUIRED_THEME_PROPERTIES } from "./constants";

/**
 * Result of theme validation containing validity status and any errors/warnings
 */
export interface ThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Represents the structure of a VS Code theme
 */
export interface ThemeData {
  name: string;
  type: "dark" | "light";
  semanticHighlighting: boolean;
  semanticTokenColors: Record<string, string>;
  colors: Record<string, string>;
  tokenColors: TokenColorRule[];
}

/**
 * Represents a single token color rule in the theme
 */
export interface TokenColorRule {
  name?: string;
  scope: string | string[];
  settings: { foreground?: string; fontStyle?: string };
}

/**
 * Helper function to check if a string is a valid hex color
 * @param value - The string to validate
 * @returns True if the value is a valid hex color
 */
export function isValidHexColor(value: string): boolean {
  if (typeof value !== "string") {
    return false;
  }
  // Supports #RGB, #RRGGBB, #RRGGBBAA formats (case insensitive)
  const hexColorRegex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
  return hexColorRegex.test(value);
}

/**
 * Validates if a color string is in a valid hex color format
 * @param color - The color string to validate
 * @returns True if the color is a valid hex color format (#RGB, #RRGGBB, #RRGGBBAA)
 */
export function validateColorFormat(color: string): boolean {
  return isValidHexColor(color);
}

/**
 * Validates that the theme has all required structural properties
 * @param theme - The theme object to validate (unknown type for safety)
 * @returns ThemeValidationResult with any structural errors
 */
export function validateThemeStructure(theme: unknown): ThemeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof theme !== "object" || theme === null) {
    return {
      isValid: false,
      errors: ["Theme must be a non-null object"],
      warnings: [],
    };
  }

  const themeObj = theme as Record<string, unknown>;

  // Validate required properties exist
  for (const prop of REQUIRED_THEME_PROPERTIES) {
    if (!(prop in themeObj)) {
      errors.push(`Missing required property: ${prop}`);
    }
  }

  // Validate 'type' is either 'dark' or 'light'
  if ("type" in themeObj) {
    if (themeObj.type !== "dark" && themeObj.type !== "light") {
      errors.push(
        `Invalid type value: expected 'dark' or 'light', got '${themeObj.type}'`,
      );
    }
  }

  // Validate 'semanticHighlighting' is a boolean
  if ("semanticHighlighting" in themeObj) {
    if (typeof themeObj.semanticHighlighting !== "boolean") {
      errors.push(
        `Invalid semanticHighlighting value: expected boolean, got ${typeof themeObj.semanticHighlighting}`,
      );
    }
  }

  // Validate 'colors' is an object
  if ("colors" in themeObj) {
    if (
      typeof themeObj.colors !== "object" ||
      themeObj.colors === null ||
      Array.isArray(themeObj.colors)
    ) {
      errors.push("Invalid colors value: expected an object");
    }
  }

  // Validate 'tokenColors' is an array
  if ("tokenColors" in themeObj) {
    if (!Array.isArray(themeObj.tokenColors)) {
      errors.push("Invalid tokenColors value: expected an array");
    }
  }

  // Validate 'semanticTokenColors' is an object
  if ("semanticTokenColors" in themeObj) {
    if (
      typeof themeObj.semanticTokenColors !== "object" ||
      themeObj.semanticTokenColors === null ||
      Array.isArray(themeObj.semanticTokenColors)
    ) {
      errors.push("Invalid semanticTokenColors value: expected an object");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates all colors in the theme are valid hex colors
 * @param theme - The theme data to validate
 * @returns ThemeValidationResult with any color format errors
 */
export function validateThemeColors(theme: ThemeData): ThemeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate all colors in the 'colors' object
  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      if (!isValidHexColor(value)) {
        errors.push(`Invalid color format for '${key}': ${value}`);
      }
    }
  }

  // Validate all foreground colors in 'tokenColors'
  if (theme.tokenColors) {
    theme.tokenColors.forEach((rule, index) => {
      if (
        rule.settings?.foreground &&
        !isValidHexColor(rule.settings.foreground)
      ) {
        const ruleName = rule.name || `rule at index ${index}`;
        errors.push(
          `Invalid foreground color format in tokenColors '${ruleName}': ${rule.settings.foreground}`,
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates that the theme name matches the expected pattern for the variant
 * @param theme - The theme data to validate
 * @param expectedVariant - The expected variant ('dark' or 'light')
 * @returns True if the theme name matches the expected pattern
 */
export function validateThemeName(
  theme: ThemeData,
  expectedVariant: "dark" | "light",
): boolean {
  if (!theme.name || typeof theme.name !== "string") {
    return false;
  }

  const themeName = theme.name.toLowerCase();
  if (expectedVariant === "dark") {
    return themeName.includes("dark");
  } else {
    return themeName.includes("light");
  }
}

/**
 * Combines all validation checks for comprehensive theme validation
 * @param theme - The theme object to validate (unknown type for safety)
 * @param expectedVariant - The expected variant ('dark' or 'light')
 * @returns Comprehensive ThemeValidationResult
 */
export function validateCompleteTheme(
  theme: unknown,
  expectedVariant: "dark" | "light",
): ThemeValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // First validate structure
  const structureResult = validateThemeStructure(theme);
  allErrors.push(...structureResult.errors);
  allWarnings.push(...structureResult.warnings);

  // If structure is invalid, return early
  if (!structureResult.isValid) {
    return {
      isValid: false,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  const themeData = theme as ThemeData;

  // Validate colors
  const colorResult = validateThemeColors(themeData);
  allErrors.push(...colorResult.errors);
  allWarnings.push(...colorResult.warnings);

  // Validate theme name matches variant
  if (!validateThemeName(themeData, expectedVariant)) {
    allWarnings.push(
      `Theme name '${themeData.name}' does not contain expected variant '${expectedVariant}'`,
    );
  }

  // Validate type matches expected variant
  if (themeData.type !== expectedVariant) {
    allErrors.push(
      `Theme type '${themeData.type}' does not match expected variant '${expectedVariant}'`,
    );
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Returns the count of colors in the workbench colors object
 * @param theme - The theme data
 * @returns The number of workbench colors defined
 */
export function countWorkbenchColors(theme: ThemeData): number {
  if (!theme.colors || typeof theme.colors !== "object") {
    return 0;
  }
  return Object.keys(theme.colors).length;
}

/**
 * Returns the count of token color rules
 * @param theme - The theme data
 * @returns The number of token color rules defined
 */
export function countTokenColorRules(theme: ThemeData): number {
  if (!theme.tokenColors || !Array.isArray(theme.tokenColors)) {
    return 0;
  }
  return theme.tokenColors.length;
}
