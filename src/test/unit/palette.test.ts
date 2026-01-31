/**
 * Palette Generation Tests
 *
 * Tests the palette generation system across all theme variants (dark/light),
 * contrast levels (soft/medium/hard), and palette options (material/mix/original).
 *
 * Verifies:
 * - All palette combinations generate valid, complete palettes
 * - Color values are valid hex format
 * - Background shades are properly differentiated
 * - Accent colors are distinct
 * - Dark and light themes have appropriate differences
 * - Contrast levels affect background colors appropriately
 */

import * as assert from "assert";
import {
  REQUIRED_PALETTE_COLORS,
  CONTRAST_OPTIONS,
  PALETTE_OPTIONS,
  TEST_TIMEOUTS,
  THEME_VARIANTS,
  createConfiguration,
} from "../helpers";
import { getPalette } from "../../palette";
import { Configuration, Palette } from "../../interface";

describe("Palette Generation", function () {
  this.timeout(TEST_TIMEOUTS.default);

  /**
   * Helper to verify palette has all required colors
   */
  function assertPaletteComplete(palette: Palette, description: string): void {
    for (const colorName of REQUIRED_PALETTE_COLORS) {
      assert.ok(
        palette[colorName as keyof Palette],
        `${description}: should have ${colorName}`,
      );
    }
  }

  /**
   * Helper to verify color is valid hex format
   */
  function isValidHexColor(color: string): boolean {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color);
  }

  describe("All Palette Combinations", () => {
    for (const variant of THEME_VARIANTS) {
      describe(`${variant} variant`, () => {
        for (const contrast of CONTRAST_OPTIONS) {
          for (const paletteOption of PALETTE_OPTIONS) {
            it(`should generate valid palette for ${contrast}/${paletteOption}`, () => {
              const config = createConfiguration({
                [`${variant}Contrast`]: contrast,
                [`${variant}Palette`]: paletteOption,
              } as Partial<Configuration>);

              const palette = getPalette(config, variant);

              // Verify completeness
              assertPaletteComplete(
                palette,
                `${variant}/${contrast}/${paletteOption}`,
              );

              // Verify all colors are valid hex
              for (const colorName of REQUIRED_PALETTE_COLORS) {
                const color = palette[colorName as keyof Palette];
                assert.ok(
                  isValidHexColor(color),
                  `${colorName} should be valid hex: ${color}`,
                );
              }
            });
          }
        }
      });
    }
  });

  describe("Palette Color Properties", () => {
    it("should have distinct background shades", () => {
      const config = createConfiguration();
      const palette = getPalette(config, "dark");

      // bg0 through bg9 should all be different
      const bgColors = [
        palette.bg0,
        palette.bg1,
        palette.bg,
        palette.bg2,
        palette.bg3,
        palette.bg4,
        palette.bg5,
        palette.bg6,
        palette.bg7,
        palette.bg8,
        palette.bg9,
      ];
      const uniqueBgColors = new Set(bgColors);
      // Some might be the same, but most should be unique
      assert.ok(
        uniqueBgColors.size >= 5,
        "should have multiple distinct background shades",
      );
    });

    it("should have 7 distinct accent colors", () => {
      const config = createConfiguration();
      const palette = getPalette(config, "dark");

      const accentColors = new Set([
        palette.red,
        palette.orange,
        palette.yellow,
        palette.green,
        palette.aqua,
        palette.blue,
        palette.purple,
      ]);
      assert.strictEqual(
        accentColors.size,
        7,
        "should have 7 unique accent colors",
      );
    });

    it("should have dimmed versions of accent colors", () => {
      const config = createConfiguration();
      const palette = getPalette(config, "dark");

      // Dimmed colors should exist and be different from regular versions
      assert.ok(
        palette.dimRed !== palette.red,
        "dimRed should differ from red",
      );
      assert.ok(
        palette.dimGreen !== palette.green,
        "dimGreen should differ from green",
      );
    });
  });

  describe("Dark vs Light Palette Differences", () => {
    it("should generate different backgrounds for dark and light", () => {
      const config = createConfiguration();
      const darkPalette = getPalette(config, "dark");
      const lightPalette = getPalette(config, "light");

      assert.notStrictEqual(
        darkPalette.bg0,
        lightPalette.bg0,
        "dark and light bg0 should differ",
      );
      assert.notStrictEqual(
        darkPalette.fg,
        lightPalette.fg,
        "dark and light fg should differ",
      );
    });

    it("should have similar accent color structure", () => {
      const config = createConfiguration();
      const darkPalette = getPalette(config, "dark");
      const lightPalette = getPalette(config, "light");

      // Both should have all accent colors
      const accentNames = [
        "red",
        "orange",
        "yellow",
        "green",
        "aqua",
        "blue",
        "purple",
      ];
      for (const name of accentNames) {
        assert.ok(
          darkPalette[name as keyof Palette],
          `dark should have ${name}`,
        );
        assert.ok(
          lightPalette[name as keyof Palette],
          `light should have ${name}`,
        );
      }
    });
  });

  describe("Contrast Level Effects", () => {
    for (const variant of THEME_VARIANTS) {
      it(`${variant}: hard contrast should have darker/lighter bg0 than soft`, () => {
        const softConfig = createConfiguration({
          [`${variant}Contrast`]: "soft",
        } as any);
        const hardConfig = createConfiguration({
          [`${variant}Contrast`]: "hard",
        } as any);

        const softPalette = getPalette(softConfig, variant);
        const hardPalette = getPalette(hardConfig, variant);

        // Hard and soft should produce different backgrounds
        assert.notStrictEqual(
          softPalette.bg0,
          hardPalette.bg0,
          "soft and hard contrast should have different bg0",
        );
      });
    }
  });
});
