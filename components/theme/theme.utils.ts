import { VenueThemeSchema, Media } from "@/lib/types";

const FALLBACK_PAGE_THEME: Partial<VenueThemeSchema> = {
  css: "",
  html: "",
  media: {
    type: "COLOR",
    color: "#fff",
    backgroundColor2: "",
  } as any as Media,
  cardSlug: "geex-one",
  iconSlug: "geex-one",
  iconColor: "#4973d4",
  inputSlug: "geex-one",
  isDark: false,
  textColor: "#000",
  buttonSlug: "geex-one",
  cardShadow: "none",
  widgetSlug: "geex-one",
  inputShadow: "none",
  dividerColor: "rgba(0, 0, 0, 0.5)",
  widgetShadow: "none",
  bodyTextColor: "#0a2b23",
  cardIconColor: "#4973d4",
  cardTextColor: "#4973d4",
  iconBoxShadow: "none",
  bodyFontFamily: "Inter",
  bodyFontWeight: "400",
  cardBackground: "rgba(255, 255, 255, 0.5)",
  inputIconColor: "#ffffff",
  inputTextColor: "#000",
  cardBorderColor: "",
  cardBorderWidth: 0,
  inputBackground: "#fff",
  cardBackdropBlur: "5px",
  headingTextColor: "#0a2b23",
  inputBorderColor: "rgba(0, 0, 0, 0.5)",
  inputBorderWidth: 1,
  widgetBackground: "rgba(255, 255, 255, 0.5)",
  headingFontFamily: "Inter",
  headingFontWeight: "400",
  iconBoxBackground: "rgba(255, 255, 255, 0.5)",
  widgetBorderColor: "",
  widgetBorderWidth: 0,
  bodyMutedTextColor: "rgba(10, 43, 35, 0.7)",
  iconBoxBorderColor: "",
  iconBoxBorderWidth: 0,
  widgetBackdropBlur: "16px",
  widgetBorderRadius: 0,
  primaryButtonShadow: "none",
  inputPlaceholderColor: "rgba(34, 64, 135, 0.7)",
  secondaryButtonShadow: "none",
  primaryButtonTextColor: "#f5f9fa",
  primaryButtonFontWeight: "400",
  cardSecondaryBackground: "rgba(0, 0, 0, 0.4)",
  primaryButtonBackground: "#4973d4",
  primaryButtonBorderColor: "",
  primaryButtonBorderWidth: 0,
  secondaryButtonTextColor: "#4973d4",
  primaryButtonBackdropBlur: "5px",
  secondaryButtonBackground: "rgba(255, 255, 255, 0.7)",
  secondaryButtonBorderColor: "",
  secondaryButtonBorderWidth: 0,
  secondaryButtonBackdropBlur: "5px",
  secondaryButtonFontWeight: "400",
};

export const getDefaultPageTheme = (
  content?: Partial<VenueThemeSchema>,
): Partial<VenueThemeSchema> => {
  const defaultTheme = FALLBACK_PAGE_THEME;

  if (!content) {
    return defaultTheme;
  }

  const combinedConfig = {
    ...defaultTheme,
    ...Object.fromEntries(
      Object.entries(content).filter(
        ([, value]) => value !== null && value !== undefined && value !== "",
      ),
    ),
  };

  return combinedConfig;
};

export const convertToOverlayNumber = (
  rgbaString: string | undefined | null,
): number => {
  if (!rgbaString) {
    return 0;
  }

  const match = rgbaString.match(/rgba\((\d+), (\d+), (\d+), ([01]?.?\d*)\)/);
  if (!match) {
    return 0; // Default to 0 if the string does not match the expected format
  }

  const [, r, g, b, a] = match.map(Number);
  // Determine if the color is closer to black or white
  // Assuming black or white for simplicity, a more complex analysis could be done for other colors
  if (r === 255 && g === 255 && b === 255) {
    // White, scale alpha to -100 to 0
    return a * 100 * -1;
  } else if (r === 0 && g === 0 && b === 0) {
    // Black, scale alpha to 0 to 100
    return a * 100;
  }

  // Default to 0 if the color is neither black nor white, though this case might require refinement
  return 0;
};
