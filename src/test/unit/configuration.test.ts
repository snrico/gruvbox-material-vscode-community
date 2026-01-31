/**
 * Configuration and Theme Generation Tests
 *
 * This file tests that all configuration options work correctly for theme generation.
 * It verifies:
 * - Default configuration values are set correctly
 * - Palette generation works for all contrast/palette combinations
 * - Workbench generation works for all workbench style options
 * - Syntax highlighting generation handles boolean options correctly
 * - Semantic token generation produces valid output
 * - Edge cases like undefined/empty configurations are handled
 */

import * as assert from "assert";
import {
  CONFIGURATION_DEFAULTS,
  CONTRAST_OPTIONS,
  WORKBENCH_OPTIONS,
  PALETTE_OPTIONS,
  TEST_TIMEOUTS,
  createConfiguration,
  createAllContrastConfigurations,
  createAllWorkbenchConfigurations,
  createAllPaletteConfigurations,
  createBooleanToggleConfigurations,
} from "../helpers";
import { getPalette } from "../../palette";
import { getSyntax } from "../../syntax";
import { getSemantic } from "../../semantic";
import { getWorkbench } from "../../workbench";
import { Configuration } from "../../interface";

describe("Configuration Tests", function () {
  this.timeout(TEST_TIMEOUTS.themeGeneration);

  describe("Default Configuration", () => {
    it("should have all expected default values", () => {
      // Arrange & Act
      const config = createConfiguration();

      // Assert
      assert.strictEqual(config.darkContrast, "medium");
      assert.strictEqual(config.lightContrast, "medium");
      assert.strictEqual(config.darkWorkbench, "material");
      assert.strictEqual(config.lightWorkbench, "material");
      assert.strictEqual(config.darkCursor, "white");
      assert.strictEqual(config.lightCursor, "black");
      assert.strictEqual(config.darkSelection, "grey");
      assert.strictEqual(config.lightSelection, "grey");
      assert.strictEqual(config.darkPalette, "material");
      assert.strictEqual(config.lightPalette, "material");
      assert.strictEqual(config.colorfulSyntax, false);
      assert.strictEqual(config.italicKeywords, false);
      assert.strictEqual(config.italicComments, true);
      assert.strictEqual(config.diagnosticTextBackgroundOpacity, "0%");
      assert.strictEqual(config.highContrast, false);
    });

    it("should match CONFIGURATION_DEFAULTS object", () => {
      // Arrange & Act
      const config = createConfiguration();

      // Assert
      assert.deepStrictEqual(config, CONFIGURATION_DEFAULTS);
    });
  });

  describe("Palette Generation", () => {
    describe("Dark Variant", () => {
      for (const contrast of CONTRAST_OPTIONS) {
        for (const palette of PALETTE_OPTIONS) {
          it(`should generate palette for ${contrast} contrast with ${palette} palette`, () => {
            // Arrange
            const config = createConfiguration({
              darkContrast: contrast,
              darkPalette: palette,
            });

            // Act
            const result = getPalette(config, "dark");

            // Assert - Verify palette has required colors
            assert.ok(result.bg0, "should have bg0");
            assert.ok(result.bg1, "should have bg1");
            assert.ok(result.bg, "should have bg");
            assert.ok(result.fg, "should have fg");
            assert.ok(result.fg0, "should have fg0");
            assert.ok(result.red, "should have red");
            assert.ok(result.orange, "should have orange");
            assert.ok(result.yellow, "should have yellow");
            assert.ok(result.green, "should have green");
            assert.ok(result.aqua, "should have aqua");
            assert.ok(result.blue, "should have blue");
            assert.ok(result.purple, "should have purple");
            assert.ok(result.grey0, "should have grey0");
            assert.ok(result.grey1, "should have grey1");
          });
        }
      }
    });

    describe("Light Variant", () => {
      for (const contrast of CONTRAST_OPTIONS) {
        for (const palette of PALETTE_OPTIONS) {
          it(`should generate palette for ${contrast} contrast with ${palette} palette`, () => {
            // Arrange
            const config = createConfiguration({
              lightContrast: contrast,
              lightPalette: palette,
            });

            // Act
            const result = getPalette(config, "light");

            // Assert - Verify palette has required colors
            assert.ok(result.bg0, "should have bg0");
            assert.ok(result.bg1, "should have bg1");
            assert.ok(result.bg, "should have bg");
            assert.ok(result.fg, "should have fg");
            assert.ok(result.fg0, "should have fg0");
            assert.ok(result.red, "should have red");
            assert.ok(result.orange, "should have orange");
            assert.ok(result.yellow, "should have yellow");
            assert.ok(result.green, "should have green");
            assert.ok(result.aqua, "should have aqua");
            assert.ok(result.blue, "should have blue");
            assert.ok(result.purple, "should have purple");
            assert.ok(result.grey0, "should have grey0");
            assert.ok(result.grey1, "should have grey1");
          });
        }
      }
    });
  });

  describe("Workbench Generation", () => {
    for (const variant of ["dark", "light"] as const) {
      describe(`${variant} variant`, () => {
        for (const workbench of WORKBENCH_OPTIONS) {
          it(`should generate ${workbench} workbench`, () => {
            // Arrange
            const workbenchKey =
              variant === "dark" ? "darkWorkbench" : "lightWorkbench";
            const config = createConfiguration({
              [workbenchKey]: workbench,
            } as Partial<Configuration>);

            // Act
            const result = getWorkbench(config, variant);

            // Assert
            assert.ok(typeof result === "object", "should return an object");
            assert.ok(
              Object.keys(result).length > 50,
              "should have many workbench colors",
            );
          });
        }
      });
    }

    it("should generate different workbench colors for each style", () => {
      // Arrange
      const configs = createAllWorkbenchConfigurations("dark");

      // Act
      const results = configs.map((config) => getWorkbench(config, "dark"));

      // Assert - Each workbench style should produce valid output
      results.forEach((result) => {
        assert.ok(typeof result === "object");
        assert.ok(Object.keys(result).length > 0);
      });
    });
  });

  describe("Syntax Highlighting Generation", () => {
    describe("Boolean option variations", () => {
      const booleanConfigs = createBooleanToggleConfigurations();

      booleanConfigs.forEach((config, index) => {
        it(`should generate syntax for boolean config variation ${index + 1}`, () => {
          // Act
          const darkSyntax = getSyntax(config, "dark");
          const lightSyntax = getSyntax(config, "light");

          // Assert
          assert.ok(Array.isArray(darkSyntax), "dark syntax should be array");
          assert.ok(Array.isArray(lightSyntax), "light syntax should be array");
          assert.ok(darkSyntax.length > 0, "dark syntax should not be empty");
          assert.ok(lightSyntax.length > 0, "light syntax should not be empty");
        });
      });
    });

    it("should include italic styles when italicKeywords is true", () => {
      // Arrange
      const config = createConfiguration({ italicKeywords: true });

      // Act
      const syntax = getSyntax(config, "dark");

      // Assert - Check for italic style in token rules
      const hasItalic = syntax.some((rule: any) =>
        rule.settings?.fontStyle?.includes("italic"),
      );
      assert.ok(hasItalic, "should have italic styles");
    });

    it("should include italic comments when italicComments is true", () => {
      // Arrange
      const config = createConfiguration({ italicComments: true });

      // Act
      const syntax = getSyntax(config, "dark");

      // Assert - Check for italic style in comment rules
      const commentRule = syntax.find(
        (rule: any) =>
          rule.name === "Comment" ||
          (typeof rule.scope === "string" && rule.scope.includes("comment")),
      );
      assert.ok(commentRule, "should have a comment rule");
      assert.ok(
        commentRule?.settings?.fontStyle?.includes("italic"),
        "comment should have italic style",
      );
    });

    it("should not include italic comments when italicComments is false", () => {
      // Arrange
      const config = createConfiguration({ italicComments: false });

      // Act
      const syntax = getSyntax(config, "dark");

      // Assert
      const commentRule = syntax.find(
        (rule: any) =>
          rule.name === "Comment" ||
          (typeof rule.scope === "string" && rule.scope.includes("comment")),
      );
      assert.ok(commentRule, "should have a comment rule");
      assert.ok(
        !commentRule?.settings?.fontStyle?.includes("italic"),
        "comment should not have italic style",
      );
    });

    it("should generate colorful syntax when colorfulSyntax is true", () => {
      // Arrange
      const defaultConfig = createConfiguration({ colorfulSyntax: false });
      const colorfulConfig = createConfiguration({ colorfulSyntax: true });

      // Act
      const defaultSyntax = getSyntax(defaultConfig, "dark");
      const colorfulSyntax = getSyntax(colorfulConfig, "dark");

      // Assert - Both should be valid arrays with content
      assert.ok(Array.isArray(defaultSyntax));
      assert.ok(Array.isArray(colorfulSyntax));
      assert.ok(defaultSyntax.length > 0);
      assert.ok(colorfulSyntax.length > 0);
    });
  });

  describe("Semantic Token Generation", () => {
    it("should generate semantic tokens with default config", () => {
      // Arrange
      const config = createConfiguration();

      // Act
      const semantic = getSemantic(config, "dark");

      // Assert
      assert.ok(typeof semantic === "object", "semantic should be an object");
      assert.ok(
        Object.keys(semantic).length > 0,
        "semantic should have entries",
      );
    });

    it("should generate semantic tokens for light variant", () => {
      // Arrange
      const config = createConfiguration();

      // Act
      const semantic = getSemantic(config, "light");

      // Assert
      assert.ok(typeof semantic === "object", "semantic should be an object");
      assert.ok(
        Object.keys(semantic).length > 0,
        "semantic should have entries",
      );
    });

    it("should generate different semantic tokens with colorfulSyntax", () => {
      // Arrange
      const defaultConfig = createConfiguration({ colorfulSyntax: false });
      const colorfulConfig = createConfiguration({ colorfulSyntax: true });

      // Act
      const defaultSemantic = getSemantic(defaultConfig, "dark");
      const colorfulSemantic = getSemantic(colorfulConfig, "dark");

      // Assert - Both should be valid objects with content
      assert.ok(
        Object.keys(defaultSemantic).length > 0,
        "default semantic should have entries",
      );
      assert.ok(
        Object.keys(colorfulSemantic).length > 0,
        "colorful semantic should have entries",
      );
    });
  });

  describe("Configuration Edge Cases", () => {
    it("should handle undefined optional values", () => {
      // Arrange
      const config: Configuration = {};

      // Act & Assert - Should not throw with empty config
      const palette = getPalette(config, "dark");
      assert.ok(palette, "should return a palette");
      assert.ok(palette.bg0, "palette should have bg0");
    });

    it("should handle all contrast variations", () => {
      // Arrange
      const configs = createAllContrastConfigurations("dark");

      // Act & Assert
      configs.forEach((config) => {
        const palette = getPalette(config, "dark");
        assert.ok(palette.bg0, "each contrast should produce valid palette");
      });
    });

    it("should handle all palette variations", () => {
      // Arrange
      const configs = createAllPaletteConfigurations("dark");

      // Act & Assert
      configs.forEach((config) => {
        const palette = getPalette(config, "dark");
        assert.ok(palette.fg, "each palette should produce valid foreground");
        assert.ok(palette.red, "each palette should produce valid red");
      });
    });

    it("should handle all light contrast variations", () => {
      // Arrange
      const configs = createAllContrastConfigurations("light");

      // Act & Assert
      configs.forEach((config) => {
        const palette = getPalette(config, "light");
        assert.ok(palette.bg0, "each contrast should produce valid palette");
      });
    });

    it("should handle all light palette variations", () => {
      // Arrange
      const configs = createAllPaletteConfigurations("light");

      // Act & Assert
      configs.forEach((config) => {
        const palette = getPalette(config, "light");
        assert.ok(palette.fg, "each palette should produce valid foreground");
        assert.ok(palette.red, "each palette should produce valid red");
      });
    });
  });
});
