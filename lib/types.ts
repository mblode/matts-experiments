export type VenueThemeSchema = {
  /**
   * @generated from field: bool is_dark = 2;
   */
  isDark: boolean;

  /**
   * Font properties
   *
   * @generated from field: string heading_font_family = 9;
   */
  headingFontFamily: string;

  /**
   * @generated from field: string body_font_family = 10;
   */
  bodyFontFamily: string;

  /**
   * @generated from field: string text_color = 11;
   */
  textColor: string;

  /**
   * @generated from field: string heading_text_color = 12;
   */
  headingTextColor: string;

  /**
   * @generated from field: string heading_font_weight = 13;
   */
  headingFontWeight: string;

  /**
   * @generated from field: string body_text_color = 14;
   */
  bodyTextColor: string;

  /**
   * @generated from field: string body_muted_text_color = 15;
   */
  bodyMutedTextColor: string;

  /**
   * @generated from field: string body_font_weight = 16;
   */
  bodyFontWeight: string;

  /**
   * Widget styling
   *
   * @generated from field: string widget_background = 18;
   */
  widgetBackground: string;

  /**
   * @generated from field: string widget_backdrop_blur = 19;
   */
  widgetBackdropBlur: string;

  /**
   * @generated from field: int32 widget_border_radius = 20;
   */
  widgetBorderRadius: number;

  /**
   * @generated from field: string widget_border_color = 21;
   */
  widgetBorderColor: string;

  /**
   * @generated from field: float widget_border_width = 22;
   */
  widgetBorderWidth: number;

  /**
   * @generated from field: string widget_shadow = 23;
   */
  widgetShadow: string;

  /**
   * @generated from field: string widget_slug = 24;
   */
  widgetSlug: string;

  /**
   * Button styling - Primary
   *
   * @generated from field: string primary_button_text_color = 26;
   */
  primaryButtonTextColor: string;

  /**
   * @generated from field: string primary_button_border_color = 27;
   */
  primaryButtonBorderColor: string;

  /**
   * @generated from field: float primary_button_border_width = 28;
   */
  primaryButtonBorderWidth: number;

  /**
   * @generated from field: string primary_button_background = 29;
   */
  primaryButtonBackground: string;

  /**
   * @generated from field: string primary_button_backdrop_blur = 30;
   */
  primaryButtonBackdropBlur: string;

  /**
   * @generated from field: string primary_button_shadow = 31;
   */
  primaryButtonShadow: string;

  /**
   * @generated from field: string primary_button_font_weight = 32;
   */
  primaryButtonFontWeight: string;

  /**
   * @generated from field: string button_slug = 34;
   */
  buttonSlug: string;

  /**
   * Button styling - Secondary
   *
   * @generated from field: string secondary_button_text_color = 36;
   */
  secondaryButtonTextColor: string;

  /**
   * @generated from field: string secondary_button_border_color = 37;
   */
  secondaryButtonBorderColor: string;

  /**
   * @generated from field: float secondary_button_border_width = 38;
   */
  secondaryButtonBorderWidth: number;

  /**
   * @generated from field: string secondary_button_background = 39;
   */
  secondaryButtonBackground: string;

  /**
   * @generated from field: string secondary_button_backdrop_blur = 40;
   */
  secondaryButtonBackdropBlur: string;

  /**
   * @generated from field: string secondary_button_shadow = 41;
   */
  secondaryButtonShadow: string;

  /**
   * @generated from field: string secondary_button_font_weight = 42;
   */
  secondaryButtonFontWeight: string;

  /**
   * Divider properties
   *
   * @generated from field: string divider_color = 44;
   */
  dividerColor: string;

  /**
   * Card styling
   *
   * @generated from field: string card_text_color = 47;
   */
  cardTextColor: string;

  /**
   * @generated from field: string card_border_color = 48;
   */
  cardBorderColor: string;

  /**
   * @generated from field: float card_border_width = 49;
   */
  cardBorderWidth: number;

  /**
   * @generated from field: string card_background = 50;
   */
  cardBackground: string;

  /**
   * @generated from field: string card_backdrop_blur = 51;
   */
  cardBackdropBlur: string;

  /**
   * @generated from field: string card_shadow = 52;
   */
  cardShadow: string;

  /**
   * @generated from field: string card_icon_color = 53;
   */
  cardIconColor: string;

  /**
   * @generated from field: string card_secondary_background = 54;
   */
  cardSecondaryBackground: string;

  /**
   * @generated from field: string card_slug = 55;
   */
  cardSlug: string;

  /**
   * Icon box styling
   *
   * @generated from field: string icon_box_background = 56;
   */
  iconBoxBackground: string;

  /**
   * @generated from field: string icon_color = 57;
   */
  iconColor: string;

  /**
   * @generated from field: string icon_box_border_color = 58;
   */
  iconBoxBorderColor: string;

  /**
   * @generated from field: float icon_box_border_width = 59;
   */
  iconBoxBorderWidth: number;

  /**
   * @generated from field: string icon_box_shadow = 60;
   */
  iconBoxShadow: string;

  /**
   * @generated from field: string icon_slug = 62;
   */
  iconSlug: string;

  /**
   * Input field styling
   *
   * @generated from field: string input_placeholder_color = 63;
   */
  inputPlaceholderColor: string;

  /**
   * @generated from field: string input_border_color = 64;
   */
  inputBorderColor: string;

  /**
   * @generated from field: string input_text_color = 65;
   */
  inputTextColor: string;

  /**
   * @generated from field: float input_border_width = 66;
   */
  inputBorderWidth: number;

  /**
   * @generated from field: string input_background = 68;
   */
  inputBackground: string;

  /**
   * @generated from field: string input_icon_color = 69;
   */
  inputIconColor: string;

  /**
   * @generated from field: string input_shadow = 70;
   */
  inputShadow: string;

  /**
   * @generated from field: string input_slug = 71;
   */
  inputSlug: string;

  /**
   * Additional properties
   *
   * @generated from field: string html = 74;
   */
  html: string;

  /**
   * @generated from field: string css = 75;
   */
  css: string;

  /**
   * @generated from field: meandu.common.type.v1.Media media = 76;
   */
  media?: Media;

  /**
   * @generated from field: string header_slug = 77;
   */
  headerSlug: string;

  /**
   * @generated from field: string footer_slug = 78;
   */
  footerSlug: string;
};

export type Media = {
  /**
   * 'UNSPLASH' | 'ASSET' | 'URL' | 'BRANDFETCH' | 'COLOR'
   *
   * @generated from field: string type = 1;
   */
  type: string;

  /**
   * @generated from field: string alt_text = 2;
   */
  altText: string;

  /**
   * @generated from field: int32 width = 3;
   */
  width: number;

  /**
   * @generated from field: int32 height = 4;
   */
  height: number;

  /**
   * @generated from field: string color = 5;
   */
  color: string;

  /**
   * @generated from field: float focal_point_x = 6;
   */
  focalPointX: number;

  /**
   * @generated from field: float focal_point_y = 7;
   */
  focalPointY: number;

  /**
   * @generated from field: int32 gaussian_blur = 8;
   */
  gaussianBlur: number;

  /**
   * @generated from field: string asset_bucket = 9;
   */
  assetBucket: string;

  /**
   * @generated from field: string asset_src = 10;
   */
  assetSrc: string;

  /**
   * @generated from field: string asset_id = 11;
   */
  assetId: string;

  /**
   * @generated from field: string asset_file_name = 12;
   */
  assetFileName: string;

  /**
   * @generated from field: string unsplash_id = 13;
   */
  unsplashId: string;

  /**
   * @generated from field: string unsplash_url = 14;
   */
  unsplashUrl: string;

  /**
   * @generated from field: string unsplash_search_term = 15;
   */
  unsplashSearchTerm: string;

  /**
   * @generated from field: string custom_url = 19;
   */
  customUrl: string;

  /**
   * @generated from field: string blur_data_url = 20;
   */
  blurDataUrl: string;

  /**
   * @generated from field: string unsplash_attribution = 21;
   */
  unsplashAttribution: string;

  /**
   * @generated from field: string background_color2 = 24;
   */
  backgroundColor2: string;

  /**
   * @generated from field: float crop_x = 25;
   */
  cropX: number;

  /**
   * @generated from field: float crop_y = 26;
   */
  cropY: number;

  /**
   * @generated from field: float crop_w = 27;
   */
  cropW: number;

  /**
   * @generated from field: float crop_h = 28;
   */
  cropH: number;

  /**
   * @generated from field: string overlay_background = 29;
   */
  overlayBackground: string;

  /**
   * @generated from field: int32 size = 33;
   */
  size: number;
};
