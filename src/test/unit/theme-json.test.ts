/**
 * Unit tests for Theme JSON Validation.
 *
 * This file tests the generated theme JSON files for validity and structure.
 * It validates:
 * - Theme file existence
 * - Required properties and structure
 * - Color format validity (hex colors)
 * - Theme content (names, minimum colors, token rules)
 * - JSON parse validity
 */

import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import {
  THEME_PATHS,
  THEME_VARIANTS,
  REQUIRED_THEME_PROPERTIES,
  TEST_TIMEOUTS,
  validateThemeStructure,
  validateThemeColors,
  validateCompleteTheme,
  ThemeData,
} from "../helpers";

describe("Theme JSON Validation", function () {
  this.timeout(TEST_TIMEOUTS.default);

  // Helper to get project root from test file location
  function getProjectRoot(): string {
    return path.resolve(__dirname, "..", "..", "..");
  }

  // Helper to load theme file
  function loadThemeFile(variant: "dark" | "light"): ThemeData {
    const projectRoot = getProjectRoot();
    const themePath = path.join(projectRoot, THEME_PATHS[variant]);
    const content = fs.readFileSync(themePath, "utf-8");
    return JSON.parse(content) as ThemeData;
  }

  describe("Theme File Existence", () => {
    it("should have dark theme file", () => {
      // Arrange
      const projectRoot = getProjectRoot();
      const darkThemePath = path.join(projectRoot, THEME_PATHS.dark);

      // Act & Assert
      assert.ok(
        fs.existsSync(darkThemePath),
        `Dark theme file should exist at ${darkThemePath}`,
      );
    });

    it("should have light theme file", () => {
      // Arrange
      const projectRoot = getProjectRoot();
      const lightThemePath = path.join(projectRoot, THEME_PATHS.light);

      // Act & Assert
      assert.ok(
        fs.existsSync(lightThemePath),
        `Light theme file should exist at ${lightThemePath}`,
      );
    });
  });

  describe("Theme Structure Validation", () => {
    for (const variant of THEME_VARIANTS) {
      describe(`${variant} theme`, () => {
        it("should have all required properties", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act
          const result = validateThemeStructure(theme);

          // Assert
          assert.ok(
            result.isValid,
            `Theme should have all required properties: ${result.errors.join(", ")}`,
          );
          for (const prop of REQUIRED_THEME_PROPERTIES) {
            assert.ok(prop in theme, `Theme should have property '${prop}'`);
          }
        });

        it("should have correct theme type", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act & Assert
          assert.strictEqual(
            theme.type,
            variant,
            `Theme type should be '${variant}'`,
          );
        });

        it("should have semanticHighlighting enabled", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act & Assert
          assert.strictEqual(
            theme.semanticHighlighting,
            true,
            "semanticHighlighting should be enabled",
          );
        });

        it("should have non-empty colors object", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act & Assert
          assert.ok(theme.colors, "Theme should have colors object");
          assert.ok(
            Object.keys(theme.colors).length > 0,
            "Colors object should not be empty",
          );
        });

        it("should have non-empty tokenColors array", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act & Assert
          assert.ok(
            Array.isArray(theme.tokenColors),
            "tokenColors should be an array",
          );
          assert.ok(
            theme.tokenColors.length > 0,
            "tokenColors array should not be empty",
          );
        });

        it("should have non-empty semanticTokenColors object", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act & Assert
          assert.ok(
            theme.semanticTokenColors,
            "Theme should have semanticTokenColors object",
          );
          assert.ok(
            Object.keys(theme.semanticTokenColors).length > 0,
            "semanticTokenColors object should not be empty",
          );
        });
      });
    }
  });

  describe("Color Format Validation", () => {
    for (const variant of THEME_VARIANTS) {
      describe(`${variant} theme colors`, () => {
        it("should have valid hex colors in workbench colors", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act
          const result = validateThemeColors(theme);

          // Assert
          const workbenchErrors = result.errors.filter(
            (e) => !e.includes("tokenColors"),
          );
          assert.ok(
            workbenchErrors.length === 0,
            `All workbench colors should be valid hex: ${workbenchErrors.join(", ")}`,
          );
        });

        it("should have valid hex colors in token colors", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act
          const result = validateThemeColors(theme);

          // Assert
          const tokenErrors = result.errors.filter((e) =>
            e.includes("tokenColors"),
          );
          assert.ok(
            tokenErrors.length === 0,
            `All token colors should be valid hex: ${tokenErrors.join(", ")}`,
          );
        });
      });
    }
  });

  describe("Theme Content Validation", () => {
    for (const variant of THEME_VARIANTS) {
      describe(`${variant} theme`, () => {
        it("should have correct theme name", () => {
          // Arrange
          const theme = loadThemeFile(variant);
          const expectedName =
            variant === "dark"
              ? "Gruvbox Material Dark"
              : "Gruvbox Material Light";

          // Act & Assert
          assert.strictEqual(
            theme.name,
            expectedName,
            `Theme name should be '${expectedName}'`,
          );
        });

        it("should have minimum expected workbench colors", () => {
          // Arrange
          const theme = loadThemeFile(variant);
          const minimumColors = 100;

          // Act
          const colorCount = Object.keys(theme.colors).length;

          // Assert
          assert.ok(
            colorCount >= minimumColors,
            `Should have at least ${minimumColors} workbench colors, got ${colorCount}`,
          );
        });

        it("should have minimum expected token color rules", () => {
          // Arrange
          const theme = loadThemeFile(variant);
          const minimumRules = 10;

          // Act
          const ruleCount = theme.tokenColors.length;

          // Assert
          assert.ok(
            ruleCount >= minimumRules,
            `Should have at least ${minimumRules} token color rules, got ${ruleCount}`,
          );
        });

        it("should pass complete validation", () => {
          // Arrange
          const theme = loadThemeFile(variant);

          // Act
          const result = validateCompleteTheme(theme, variant);

          // Assert
          assert.ok(
            result.isValid,
            `Theme should pass complete validation: ${result.errors.join(", ")}`,
          );
        });
      });
    }
  });

  describe("JSON Parse Validation", () => {
    for (const variant of THEME_VARIANTS) {
      it(`${variant} theme should be valid JSON`, () => {
        // Arrange
        const projectRoot = getProjectRoot();
        const themePath = path.join(projectRoot, THEME_PATHS[variant]);
        const content = fs.readFileSync(themePath, "utf-8");

        // Act & Assert
        assert.doesNotThrow(() => {
          JSON.parse(content);
        }, `${variant} theme file should be valid JSON`);
      });
    }
  });
});
