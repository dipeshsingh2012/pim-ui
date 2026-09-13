// ==========================================
// Experience CMS Studio Domain Types
// ==========================================

export type ThemeColor = 'amber' | 'espresso' | 'emerald' | 'crimson' | 'slate';
export type ThemePreset = 'alpine' | 'amber' | 'espresso' | 'emerald' | 'crimson' | 'slate';
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type BorderRadius = 'rounded-none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';

export interface ThemeConfig {
  id: string;
  name: string;
  preset: ThemePreset;
  mode: ThemeMode;
  primary_color: string;
  accent_color: string;
  surface_color: string;
  background_color: string;
  text_color: string;
  font_family: FontFamily;
  border_radius: BorderRadius;
  badge_text?: string;
  is_active: boolean;
  updated_at?: string;
}

// ------------------------------------------
// 1. Global Site Shell: Promo Bar
// ------------------------------------------
export interface PromoBarConfig {
  enabled: boolean;
  text: string;
  cta_text?: string;
  cta_url?: string;
  theme: ThemeColor;
  badge?: string;
  dismissible?: boolean;
}

// ------------------------------------------
// 2. Global Site Shell: Header & Navigation Nodes
// ------------------------------------------
export interface NavNode {
  id: string;
  label: string;
  url: string;
  badge?: string;
  is_external?: boolean;
  children?: NavNode[];
}

export interface HeaderConfig {
  brand_name: string;
  brand_tagline?: string;
  brand_badge?: string;
  logo_url?: string;
  nodes: NavNode[];
  show_search: boolean;
  show_cart: boolean;
  sticky: boolean;
}

// ------------------------------------------
// 3. Global Site Shell: Footer
// ------------------------------------------
export interface FooterLink {
  label: string;
  url: string;
  is_external?: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterConfig {
  brand_name: string;
  brand_description: string;
  columns: FooterColumn[];
  show_newsletter: boolean;
  newsletter_title?: string;
  newsletter_placeholder?: string;
  social_links: { platform: string; url: string }[];
  copyright: string;
}

export interface GlobalShellConfig {
  promo_bar: PromoBarConfig;
  header: HeaderConfig;
  footer: FooterConfig;
  theme?: ThemeConfig;
}

// ------------------------------------------
// 4. Page Types & Section Types
// ------------------------------------------
export type PageType = 'home' | 'product' | 'collection' | 'static' | 'discovery';

export type SectionType =
  | 'hero_banner'
  | 'category_lane'
  | 'category_grid'
  | 'product_lane'
  | 'product_grid'
  | 'testimonials'
  | 'promo_callout';

export interface HeroBannerConfig {
  headline: string;
  subheadline: string;
  badge?: string;
  primary_cta_text: string;
  primary_cta_url: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  background_image: string;
  overlay_opacity: number; // 0 to 100
  text_align: 'left' | 'center';
}

export interface CategoryItemConfig {
  id: string;
  title: string;
  image_url: string;
  url: string;
  badge?: string;
}

export interface CategoryLaneConfig {
  card_style: 'circular' | 'standard_card';
  has_navigation_arrows: boolean;
  categories: CategoryItemConfig[];
}

export interface CategoryGridConfig {
  columns: 2 | 3 | 4;
  categories: CategoryItemConfig[];
}

export interface ProductLaneConfig {
  lane_id?: string; // Link to a ContentLane in library
  filter_category?: string;
  filter_badge?: string;
  card_style: 'slider' | 'scrollable';
  limit: number;
}

export interface ProductGridConfig {
  columns: 2 | 3 | 4;
  filter_category?: string;
  filter_brand?: string;
  limit: number;
  show_quick_add: boolean;
}

export interface TestimonialItemConfig {
  id: string;
  author: string;
  role?: string;
  avatar_url?: string;
  rating: number;
  quote: string;
  verified_purchase: boolean;
}

export interface TestimonialsConfig {
  testimonials: TestimonialItemConfig[];
}

export interface PromoCalloutConfig {
  headline: string;
  body: string;
  badge?: string;
  button_text?: string;
  button_url?: string;
  image_url?: string;
  layout: 'image_left' | 'image_right' | 'card_banner';
}

export interface PageSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  is_active: boolean;
  sort_order: number;
  config: Record<string, any>;
}

export interface CMSPage {
  id: string;
  page_type: PageType;
  title: string;
  slug: string;
  description?: string;
  is_published: boolean;
  sections: PageSection[];
  updated_at?: string;
}

