import {
  GlobalShellConfig,
  PromoBarConfig,
  HeaderConfig,
  FooterConfig,
  ThemeConfig,
  ThemePreset,
  CMSPage,
  PageSection,
  SectionType,
} from '../types/cms';
import type { Product } from '../types/product';
import { CONTENT_API_URL } from './dataProvider';

const STORAGE_SHELL_KEY = 'pim_cms_global_shell_v1';
const STORAGE_PAGES_KEY = 'pim_cms_pages_v1';
const STORAGE_THEME_KEY = 'pim_cms_theme_v1';

// ==========================================
// Default Theme Presets
// ==========================================
export const DEFAULT_THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  alpine: {
    id: 'theme_hill_jhil_alpine',
    name: 'Hill Jhil Alpine Tarn',
    preset: 'alpine',
    mode: 'light',
    primary_color: '#085454',
    accent_color: '#0d9488',
    surface_color: '#ffffff',
    background_color: '#f0fdfa',
    text_color: '#042f2e',
    font_family: 'serif',
    border_radius: 'rounded-2xl',
    badge_text: 'ALPINE ESTATE HARVEST',
    is_active: true,
  },
  amber: {
    id: 'theme_warm_amber',
    name: 'Warm Amber Roast',
    preset: 'amber',
    mode: 'light',
    primary_color: '#92400e',
    accent_color: '#f59e0b',
    surface_color: '#ffffff',
    background_color: '#fbf9f6',
    text_color: '#1c1917',
    font_family: 'serif',
    border_radius: 'rounded-2xl',
    badge_text: 'FLAGSHIP HARVEST',
    is_active: true,
  },
  espresso: {
    id: 'theme_midnight_espresso',
    name: 'Midnight Espresso',
    preset: 'espresso',
    mode: 'dark',
    primary_color: '#1c1917',
    accent_color: '#d97706',
    surface_color: '#18181b',
    background_color: '#09090b',
    text_color: '#f4f4f5',
    font_family: 'sans',
    border_radius: 'rounded-xl',
    badge_text: 'BARISTA NIGHTS',
    is_active: false,
  },
  emerald: {
    id: 'theme_highland_emerald',
    name: 'Highland Emerald',
    preset: 'emerald',
    mode: 'light',
    primary_color: '#064e3b',
    accent_color: '#10b981',
    surface_color: '#ffffff',
    background_color: '#f0fdf4',
    text_color: '#064e3b',
    font_family: 'sans',
    border_radius: 'rounded-2xl',
    badge_text: 'ESTATE ORIGINS',
    is_active: false,
  },
  crimson: {
    id: 'theme_berry_crimson',
    name: 'Berry Crimson Velvet',
    preset: 'crimson',
    mode: 'light',
    primary_color: '#881337',
    accent_color: '#f43f5e',
    surface_color: '#ffffff',
    background_color: '#fff1f2',
    text_color: '#4c0519',
    font_family: 'serif',
    border_radius: 'rounded-2xl',
    badge_text: 'LIMITED NANO-LOT',
    is_active: false,
  },
  slate: {
    id: 'theme_modern_slate',
    name: 'Modern Minimal Slate',
    preset: 'slate',
    mode: 'light',
    primary_color: '#0f172a',
    accent_color: '#64748b',
    surface_color: '#ffffff',
    background_color: '#f8fafc',
    text_color: '#0f172a',
    font_family: 'sans',
    border_radius: 'rounded-lg',
    badge_text: 'PRECISION LAB',
    is_active: false,
  },
};

// ==========================================
// Default Seed Data: Global Site Shell
// ==========================================
export const DEFAULT_GLOBAL_SHELL: GlobalShellConfig = {
  promo_bar: {
    enabled: true,
    text: 'Complimentary express delivery on whole bean harvest orders over $50 · Small-batch roasted daily',
    cta_text: 'Explore Fresh Roasts',
    cta_url: '#/coffees',
    theme: 'amber',
    badge: 'FRESH HARVEST',
    dismissible: true,
  },
  header: {
    brand_name: 'Hiljhil Roasters',
    brand_tagline: 'Specialty Sourced & Micro-Lot Roasted',
    brand_badge: 'FLAGSHIP ROASTERY',
    show_search: true,
    show_cart: true,
    sticky: true,
    nodes: [
      {
        id: 'nav_coffees',
        label: 'Whole Bean Coffees',
        url: '#/coffees',
        badge: 'FRESH',
        children: [
          {
            id: 'nav_single_origin',
            label: 'Single Origin Lots',
            url: '#/coffees?category=single_origin',
          },
          {
            id: 'nav_producer_series',
            label: 'Producer Series Nano-Lots',
            url: '#/coffees?category=producer_series',
            badge: 'EXCLUSIVE',
          },
          {
            id: 'nav_espresso_blends',
            label: 'House & Espresso Blends',
            url: '#/coffees?category=espresso_blend',
          },
          {
            id: 'nav_decaf',
            label: 'Mountain Water Decaf',
            url: '#/coffees?category=decaf',
          },
        ],
      },
      {
        id: 'nav_equipment',
        label: 'Espresso & Brewing Gear',
        url: '#/equipment',
        children: [
          {
            id: 'nav_machines',
            label: 'Espresso Machines',
            url: '#/equipment?category=espresso_machine',
          },
          {
            id: 'nav_grinders',
            label: 'Precision Burr Grinders',
            url: '#/equipment?category=grinder',
          },
          {
            id: 'nav_accessories',
            label: 'Barista Tools & Drinkware',
            url: '#/equipment?category=accessories',
          },
        ],
      },
      {
        id: 'nav_discovery',
        label: 'Discovery (CounterCheck™)',
        url: '#/discovery',
        badge: 'GUIDE',
      },
      {
        id: 'nav_subscriptions',
        label: 'Roast Subscriptions',
        url: '#/subscriptions',
        badge: 'SAVE 15%',
      },
      {
        id: 'nav_cafes',
        label: 'Roasteries & Cafes',
        url: '#/cafes',
      },
      {
        id: 'nav_about',
        label: 'Our Story',
        url: '#/about',
      },
    ],
  },
  footer: {
    brand_name: 'HILJHIL ROASTERS',
    brand_description:
      'Artisan specialty coffee roasters dedicated to direct trade sourcing, anaerobic fermentation nano-lots, and precision-engineered brewing equipment.',
    show_newsletter: true,
    newsletter_title: 'Join the Roasters Circle',
    newsletter_placeholder: 'Enter your email for private lot access & brew recipes...',
    columns: [
      {
        id: 'col_shop',
        title: 'Shop Experience',
        links: [
          { label: 'Whole Bean Coffees', url: '#/coffees' },
          { label: 'Espresso Machines', url: '#/equipment?category=espresso_machine' },
          { label: 'Precision Grinders', url: '#/equipment?category=grinder' },
          { label: 'Roast Subscriptions', url: '#/subscriptions' },
          { label: 'Barista Drinkware', url: '#/equipment' },
        ],
      },
      {
        id: 'col_roastery',
        title: 'Roastery & Craft',
        links: [
          { label: 'Sourcing Philosophy', url: '#/about' },
          { label: 'Anaerobic Fermentation', url: '#/about' },
          { label: 'Direct Trade Transparency', url: '#/about' },
          { label: 'CounterCheck™ Clearance Guarantee', url: '#/discovery' },
        ],
      },
      {
        id: 'col_guides',
        title: 'Learn & Brew',
        links: [
          { label: 'Espresso Extraction Guide', url: '#/about' },
          { label: 'V60 & Chemex Ratio Calculator', url: '#/about' },
          { label: 'Water Mineralization Science', url: '#/about' },
          { label: 'Roast Schedule & Freshness', url: '#/coffees' },
        ],
      },
      {
        id: 'col_support',
        title: 'Customer Care & Legal',
        links: [
          { label: 'Orders & Express Shipping', url: '#/about' },
          { label: '3-Year Equipment Warranty', url: '#/about' },
          { label: 'Privacy Policy', url: '#/privacy' },
          { label: 'Terms of Service', url: '#/terms' },
        ],
      },
    ],
    social_links: [
      { platform: 'Instagram', url: 'https://instagram.com' },
      { platform: 'YouTube', url: 'https://youtube.com' },
      { platform: 'X / Twitter', url: 'https://x.com' },
    ],
    copyright: '© 2026 Hiljhil Roasters Co. All rights reserved. Precision-crafted for specialty coffee devotees.',
  },
  theme: DEFAULT_THEME_PRESETS.alpine,
};

// ==========================================
// Default Seed Data: Pages & Section Layouts
// ==========================================
export const SEED_CATALOG_PRODUCTS: Product[] = [
  {
    "id": "prod_mooleh_manay_excelsa",
    "name": "Excelsa by Mooleh Manay Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-EXCELSA-100",
    "category": "producer_series",
    "price": 600,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "NANO LOT",
    "rating": 5,
    "review_count": 28,
    "tax_category": "coffee_beans",
    "width_cm": 10,
    "height_cm": 18,
    "depth_cm": 5,
    "weight_kg": 0.1,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "light",
    "process_method": "carbonic_maceration",
    "estate_name": "Mooleh Manay Estate",
    "region": "Coorg, Karnataka",
    "elevation_m": 1100,
    "varietal": "Excelsa",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/final.png?v=1788875724",
    "description": "Exploration beyond Arabica and Robusta with rare Excelsa cherries. 132-hour dual-phase fermentation with wine yeast and lactobacillus creates a creamy, fruit-forward mouthfeel.",
    "taste_notes": [
      "Wild Berries",
      "Red Plum",
      "Ripe Banana",
      "Nutmeg",
      "Sweet Cedar",
      "Malt"
    ]
  },
  {
    "id": "prod_baarbara_estate_whiskey_barrel",
    "name": "Baarbara Estate - Whiskey Barrel Aged",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-BAARBARA-WBA-250",
    "category": "single_origin",
    "price": 1250,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "EXCLUSIVE LOT",
    "rating": 5,
    "review_count": 64,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium",
    "process_method": "whiskey_barrel",
    "estate_name": "Baarbara Estate",
    "region": "Baba Budangiri, Karnataka",
    "elevation_m": 1450,
    "varietal": "Arabica Selection",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1_6.jpg?v=1787560255",
    "description": "Aged for nearly four months in freshly emptied malt whiskey oak barrels in a controlled microclimate. Wine-like aromas with non-alcoholic whiskey oak and Irish cream finish.",
    "taste_notes": [
      "Red Plum",
      "Whiskey Oak",
      "Ripe Banana",
      "Cocoa",
      "Sweet Cardamom",
      "Irish Cream"
    ]
  },
  {
    "id": "prod_riverdale_estate_mosto",
    "name": "Riverdale Estate - Mosto",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-RIVERDALE-MOSTO-200",
    "category": "producer_series",
    "price": 1000,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "PRODUCER SERIES",
    "rating": 4.9,
    "review_count": 31,
    "tax_category": "coffee_beans",
    "width_cm": 11,
    "height_cm": 19,
    "depth_cm": 5.5,
    "weight_kg": 0.2,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "light",
    "process_method": "carbonic_maceration",
    "estate_name": "Riverdale Estate",
    "region": "Shevaroy Hills, Tamil Nadu",
    "elevation_m": 1500,
    "varietal": "SLN 9",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/PS-Mosto-list.png?v=1787554172",
    "description": "Fermented with microbe-rich Gesha Mosto liquid starter culture through a 72-hour controlled fermentation, followed by slow drying on raised beds for 30 days.",
    "taste_notes": [
      "Pink Pomelo",
      "Tart Cherries",
      "Chamomile",
      "Pomegranate",
      "Gooseberry"
    ]
  },
  {
    "id": "prod_raxidi_lobo_pichia_yeast",
    "name": "Raxidi Lobo Estate - Pichia Yeast",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-RAXIDI-PICHIA-200",
    "category": "producer_series",
    "price": 1000,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "PRODUCER SERIES",
    "rating": 4.9,
    "review_count": 22,
    "tax_category": "coffee_beans",
    "width_cm": 11,
    "height_cm": 19,
    "depth_cm": 5.5,
    "weight_kg": 0.2,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "light",
    "process_method": "anaerobic",
    "estate_name": "Raxidi Lobo Estate",
    "region": "Karnataka",
    "elevation_m": 1200,
    "varietal": "Arabica Selection",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/PS-Listing_Web.png?v=1784289488",
    "description": "Selected ripe red cherries guided by a 48-hour stainless steel anaerobic fermentation with Pichia yeast strain, then slow dried on raised beds for 21 days.",
    "taste_notes": [
      "Strawberry Jam",
      "Raspberry",
      "Plum Tart",
      "Marigold",
      "Red Cherry",
      "Candied Orange Peel"
    ]
  },
  {
    "id": "prod_the_monsoon_trio",
    "name": "The Monsoon Trio (Discovery Pack)",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-MONSOON-TRIO-225",
    "category": "sampler",
    "price": 600,
    "compare_at_price": 650,
    "status": "active",
    "in_stock": true,
    "badge": "DISCOVERY BOX",
    "rating": 4.8,
    "review_count": 89,
    "tax_category": "coffee_beans",
    "width_cm": 15,
    "height_cm": 22,
    "depth_cm": 7,
    "weight_kg": 0.225,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium_dark",
    "process_method": "monsooned",
    "estate_name": "Multi-Estate Assortment",
    "region": "Karnataka & Tamil Nadu",
    "elevation_m": 1300,
    "varietal": "Monsoon Malabar AA & Arabica Washed",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/Card-01_a5dbef83-3fa2-4cf6-ba07-c0227a545720.jpg?v=1787035346",
    "description": "Curated trio bringing together comforting medium-dark roasts: Monsoon Malabar AA from Hoysala Estate, St. Joseph Estate washed, and Sampigehoney Estate.",
    "taste_notes": [
      "Cocoa Nibs",
      "Raisins",
      "Orange Marmalade",
      "Clove",
      "Toffee",
      "Dark Chocolate"
    ]
  },
  {
    "id": "prod_sampigehoney_estate",
    "name": "Sampigehoney Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-SAMPIGE-250",
    "category": "single_origin",
    "price": 700,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "SEASONAL ROSTER",
    "rating": 4.9,
    "review_count": 115,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium_dark",
    "process_method": "washed",
    "estate_name": "Sampigehoney Estate",
    "region": "Chikmagalur, Karnataka",
    "elevation_m": 1250,
    "varietal": "Arabica Washed",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-Sampigehoney-Estate-_Front_dc9733a5-f382-4f6e-a2fa-a04081f2457a.jpg?v=1786096950",
    "description": "Comforting washed coffee from Chikmagalur with aromas of honey and raisins, delivering layers of zesty orange marmalade and rich dark chocolate finish.",
    "taste_notes": [
      "Orange Marmalade",
      "Dark Chocolate",
      "Honey",
      "Sweet Raisins"
    ]
  },
  {
    "id": "prod_unakki_estate",
    "name": "Unakki Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-UNAKKI-250",
    "category": "single_origin",
    "price": 800,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "HARVEST '26",
    "rating": 4.9,
    "review_count": 78,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium",
    "process_method": "washed",
    "estate_name": "Unakki Estate",
    "region": "Joldal Palya, Chikmagalur, Karnataka",
    "elevation_m": 1200,
    "varietal": "Arabica Washed",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-Unakki-Estate__Front.jpg?v=1786091498",
    "description": "Grown in the lush forests of Joldal Palya in Chikmagalur. Honey aroma leading into chocolate, brown spices, and raisins with a refined tea-like finish.",
    "taste_notes": [
      "Chocolate",
      "Brown Spices",
      "Sweet Honey",
      "Raisins"
    ]
  },
  {
    "id": "prod_ms_estate",
    "name": "M.S. Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-MS-250",
    "category": "single_origin",
    "price": 800,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "PERENNIAL FAVORITE",
    "rating": 5,
    "review_count": 184,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium",
    "process_method": "washed",
    "estate_name": "M.S. Estate",
    "region": "Chikmagalur, Karnataka",
    "elevation_m": 1350,
    "varietal": "S795 & Rare Ethiopian Varietal",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-M.S.-Estate__Front.jpg?v=1784120116",
    "description": "Cultivating a rare Ethiopian heirloom varietal alongside S795 in Chikmagalur since the late 1990s. Aromas of dried apricots and peaches leading to a lingering chocolate finish.",
    "taste_notes": [
      "Dried Apricots",
      "Peaches",
      "Chocolate Essence",
      "Black Tea"
    ]
  },
  {
    "id": "prod_krishnagiri_estate",
    "name": "Krishnagiri Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-KRISHNAGIRI-250",
    "category": "single_origin",
    "price": 700,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "RAINFOREST ALLIANCE",
    "rating": 4.8,
    "review_count": 92,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "dark",
    "process_method": "washed",
    "estate_name": "Krishnagiri Estate",
    "region": "Karnataka",
    "elevation_m": 1200,
    "varietal": "Arabica Washed",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-Krishnagiri-Estate__Front.jpg?v=1784120117",
    "description": "Rainforest Alliance-certified farm using custom-designed eco-pulpers to conserve water. A deep dark roast with brown spice aromatics, oak, toasted walnuts, and malt finish.",
    "taste_notes": [
      "Brown Spices",
      "Oak",
      "Toasted Walnuts",
      "Malt",
      "Bittersweet Cocoa"
    ]
  },
  {
    "id": "prod_salawara_estate",
    "name": "Salawara Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-SALAWARA-250",
    "category": "single_origin",
    "price": 850,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "HARVEST '26",
    "rating": 5,
    "review_count": 45,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "light",
    "process_method": "anaerobic",
    "estate_name": "Salawara Estate",
    "region": "Chikmagalur, Karnataka",
    "elevation_m": 1250,
    "varietal": "Arabica Anaerobic Natural",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-Salawara-Estate__Front_8b9bc3a2-4cc5-48d6-b256-ec2549e4558e.jpg?v=1784115306",
    "description": "Crafted by third-generation producer Sharan in Chikmagalur. Anaerobic natural lot delivering a burst of fruit: pineapple, molasses on the nose, settling into crisp red apple and almond.",
    "taste_notes": [
      "Pineapple",
      "Molasses",
      "Red Apple",
      "Pear",
      "Roasted Almond"
    ]
  },
  {
    "id": "prod_kerehaklu_blossom_culture",
    "name": "Kerehaklu Estate - Blossom Culture",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-KEREHAKLU-BC-200",
    "category": "producer_series",
    "price": 1000,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "PRODUCER SERIES",
    "rating": 5,
    "review_count": 36,
    "tax_category": "coffee_beans",
    "width_cm": 11,
    "height_cm": 19,
    "depth_cm": 5.5,
    "weight_kg": 0.2,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "light",
    "process_method": "anaerobic",
    "estate_name": "Kerehaklu Estate",
    "region": "Chikmagalur, Karnataka",
    "elevation_m": 1300,
    "varietal": "Arabica Blossom Fermentation",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/finalproductimgs.png?v=1782896537",
    "description": "Wild blossoms collected from the fog-shrouded block to create a starter culture for 71-hour anoxic fermentation. Jammy ripe berries, orange blossom, and sun melon.",
    "taste_notes": [
      "Ripe Berries",
      "Strawberry",
      "Orange Blossom",
      "Pomegranate",
      "Sun Melon"
    ]
  },
  {
    "id": "prod_attikan_estate",
    "name": "Attikan Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-ATTIKAN-250",
    "category": "single_origin",
    "price": 700,
    "compare_at_price": 700,
    "status": "active",
    "in_stock": true,
    "badge": "BESTSELLER",
    "rating": 5,
    "review_count": 420,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium_dark",
    "process_method": "washed",
    "estate_name": "Attikan Estate",
    "region": "Biligiriranga Hills, Karnataka",
    "elevation_m": 1650,
    "varietal": "Selection 9, S795, Cauvery, Kent",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/Attikan-estate-Front.jpg?v=1734956514",
    "description": "Grown in the cloud-draped Biligiriranga Hills at 1650 meters, amongst the highest coffee elevations in India. Sweet with nutty overtones, balanced acidity, and rich dark chocolate crema.",
    "taste_notes": [
      "Dark Chocolate",
      "Roasted Almonds",
      "Sweet Fig",
      "Nutty"
    ]
  },
  {
    "id": "prod_13th_birthday_blend",
    "name": "13th Birthday Blend",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-13BDAY-250",
    "category": "blend",
    "price": 800,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "LIMITED RELEASE",
    "rating": 4.9,
    "review_count": 52,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium",
    "process_method": "natural",
    "estate_name": "Stanmore, Orchardale, Riverdale & Unakki",
    "region": "Yercaud & Chikmagalur",
    "elevation_m": 1400,
    "varietal": "Multi-Estate Blend",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/Card_01_1_c34d4c4f-016a-4780-af62-97ce1a125f21.jpg?v=1767077475",
    "description": "Celebratory anniversary blend reminiscent of classic Black Forest cake. Natural lots from Yercaud paired with a washed base from Unakki Estate. Chocolate-covered strawberries finish.",
    "taste_notes": [
      "Strawberry",
      "Dark Chocolate",
      "Black Forest Cherry",
      "Pear"
    ]
  },
  {
    "id": "prod_howdia_estate",
    "name": "Howdia Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-HOWDIA-250",
    "category": "single_origin",
    "price": 850,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "ROASTER FAVORITE",
    "rating": 4.9,
    "review_count": 67,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "light",
    "process_method": "washed",
    "estate_name": "Howdia Estate",
    "region": "Pulney Hills, Tamil Nadu",
    "elevation_m": 1400,
    "varietal": "Arabica Washed",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-Howdia-Estate__Front.jpg?v=1782107101",
    "description": "Among our most delicate light roasts, reminiscent of a floral black tea. Bright acidity, orange marmalade notes, and a clean tea-like finish.",
    "taste_notes": [
      "Coffee Blossoms",
      "Orange Marmalade",
      "Floral Black Tea"
    ]
  },
  {
    "id": "prod_st_joseph_estate",
    "name": "St. Joseph Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-STJOSEPH-250",
    "category": "single_origin",
    "price": 700,
    "compare_at_price": 700,
    "status": "active",
    "in_stock": true,
    "badge": "PARTNER FARM",
    "rating": 4.8,
    "review_count": 73,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium_dark",
    "process_method": "washed",
    "estate_name": "St. Joseph Estate",
    "region": "Tamil Nadu",
    "elevation_m": 1300,
    "varietal": "Arabica Washed",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-St.Joseph-Estate__Front_2.jpg?v=1764321548",
    "description": "Cultivated by a community of Jesuit priests with generations of stewardship. Warm brown spices, roasted almonds, grapefruit, and comforting toffee finish.",
    "taste_notes": [
      "Grapefruit",
      "Roasted Almond",
      "Toffee",
      "Warm Brown Spices"
    ]
  },
  {
    "id": "prod_raxidi_lobo_anaerobic_natural",
    "name": "Raxidi Lobo Estate - Anaerobic Natural",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-RAXIDI-AN-250",
    "category": "single_origin",
    "price": 900,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "LIMITED RELEASE",
    "rating": 5,
    "review_count": 39,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium",
    "process_method": "anaerobic",
    "estate_name": "Raxidi Lobo Estate",
    "region": "Karnataka",
    "elevation_m": 1200,
    "varietal": "Arabica Anaerobic Natural",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-Raxidi-Lobo-Estate__Front_1f24d4f9-58d2-45c0-8266-c3767720de8d.jpg?v=1777466382",
    "description": "Carries the sweet nostalgia of drinking fresh mosambi juice in summer. Berries on the nose, settling into bright tart-sweet notes of green apple and plum.",
    "taste_notes": [
      "Fresh Mosambi Juice",
      "Green Apple",
      "Summer Berries",
      "Plum"
    ]
  },
  {
    "id": "prod_kerehaklu_estate_light",
    "name": "Kerehaklu Estate (Light Roast)",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-KEREHAKLU-LT-250",
    "category": "single_origin",
    "price": 850,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "HARVEST '26",
    "rating": 5,
    "review_count": 88,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "light",
    "process_method": "washed",
    "estate_name": "Kerehaklu Estate",
    "region": "Chikmagalur, Karnataka",
    "elevation_m": 1300,
    "varietal": "Selection 9",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/1.-Kerehaklu-Estate__Front.jpg?v=1775204109",
    "description": "Bright, citrusy light roast. Ripe Selection 9 cherries fermented with farm's local starter microbes for 37 hours, shade dried, then finished in polyhouses.",
    "taste_notes": [
      "Orange Blossoms",
      "Brown Sugar",
      "Green Grapes",
      "Orange Marmalade"
    ]
  },
  {
    "id": "prod_sandalwood_estate",
    "name": "Sandalwood Estate",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-SANDALWOOD-250",
    "category": "single_origin",
    "price": 750,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "PERENNIAL ROSTER",
    "rating": 4.9,
    "review_count": 134,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium_dark",
    "process_method": "washed",
    "estate_name": "Sandalwood Estate",
    "region": "Coorg, Karnataka",
    "elevation_m": 1200,
    "varietal": "Sarchimor",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/Sandalwood-Estate-Front.jpg?v=1734957649",
    "description": "Washed coffee of the resilient Sarchimor varietal grown in lush Coorg. Tasting notes of rich dark chocolate, sweet prune, and lingering butter biscuits aftertaste.",
    "taste_notes": [
      "Rich Dark Chocolate",
      "Sweet Prune",
      "Orange Marmalade",
      "Butter Biscuits"
    ]
  },
  {
    "id": "prod_dhak_blend",
    "name": "Dhak Blend",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-DHAK-250",
    "category": "blend",
    "price": 700,
    "compare_at_price": 650,
    "status": "active",
    "in_stock": true,
    "badge": "BESTSELLER",
    "rating": 5,
    "review_count": 312,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "dark",
    "process_method": "natural",
    "estate_name": "Chikmagalur Naturals",
    "region": "Chikmagalur, Karnataka",
    "elevation_m": 1200,
    "varietal": "Natural Process Blend",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/Dhak-Blend-Front.jpg?v=1734947063",
    "description": "Ode to the flame of the forest tree. Naturally dried with cherry for rich sweetness and heavy cocoa body. Superb for milk-based espresso drinks, Moka Pot, and South Indian Filter.",
    "taste_notes": [
      "Dark Chocolate",
      "Fruit Jam",
      "Heavy Cocoa",
      "Molasses"
    ]
  },
  {
    "id": "prod_silver_oak_cafe_blend",
    "name": "Silver Oak Café Blend",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-SILVEROAK-250",
    "category": "blend",
    "price": 750,
    "compare_at_price": 700,
    "status": "active",
    "in_stock": true,
    "badge": "SIGNATURE HOUSE BLEND",
    "rating": 5,
    "review_count": 540,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium",
    "process_method": "washed",
    "estate_name": "Silver Oak Plantations",
    "region": "Karnataka & Tamil Nadu",
    "elevation_m": 1350,
    "varietal": "House Signature Blend",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/SilverOak-blend-Front.jpg?v=1734957127",
    "description": "The flagship cafe blend poured at Hiljhil roasteries across the country. Named after the shade-providing silver oak trees. Harmonious balance of hazelnut, milk chocolate, and sweet honey.",
    "taste_notes": [
      "Hazelnut",
      "Milk Chocolate",
      "Sweet Honey",
      "Caramel"
    ]
  },
  {
    "id": "prod_amaltas_blend",
    "name": "Amaltas Blend",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-AMALTAS-250",
    "category": "blend",
    "price": 700,
    "compare_at_price": 650,
    "status": "active",
    "in_stock": true,
    "badge": "LIGHT & FRUITY",
    "rating": 4.9,
    "review_count": 180,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "light",
    "process_method": "washed",
    "estate_name": "Kerala & Tamil Nadu Blend",
    "region": "Kerala & Tamil Nadu",
    "elevation_m": 1300,
    "varietal": "Washed & Natural Arabica",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/Amaltas-Blend-Front.jpg?v=1735023810",
    "description": "Celebration of the golden Indian summer tree. Combination of washed and natural lots roasted light for refreshing notes of ripe blueberry, sweet citrus, and milk chocolate finish.",
    "taste_notes": [
      "Blueberry",
      "Milk Chocolate",
      "Sweet Citrus",
      "Floral"
    ]
  },
  {
    "id": "prod_cold_brew_blend_bold",
    "name": "Cold Brew Blend Bold",
    "brand": "Hiljhil Roasters",
    "sku": "HJ-COLDBREW-BOLD-250",
    "category": "blend",
    "price": 700,
    "compare_at_price": 650,
    "status": "active",
    "in_stock": true,
    "badge": "COLD BREW FAVORITE",
    "rating": 5,
    "review_count": 290,
    "tax_category": "coffee_beans",
    "width_cm": 12,
    "height_cm": 20,
    "depth_cm": 6,
    "weight_kg": 0.25,
    "top_clearance_cm": 0,
    "side_clearance_cm": 0,
    "rear_clearance_cm": 0,
    "roast_level": "medium_dark",
    "process_method": "washed",
    "estate_name": "Karnataka Blend",
    "region": "Karnataka",
    "elevation_m": 1200,
    "varietal": "Arabica Washed",
    "image_url": "https://cdn.shopify.com/s/files/1/0738/1409/files/Cold-Brew-Blend-Bold-Front.jpg?v=1735024000",
    "description": "Engineered for deep steep extraction. Low acidity, high sweetness, and heavy body. Delivers chocolate-thick iced glasses with roasted nut aromas and bittersweet finish.",
    "taste_notes": [
      "Dark Chocolate",
      "Toffee",
      "Roasted Nuts",
      "Bittersweet Finish"
    ]
  },
  {
    "id": "prod_breville_barista_touch",
    "name": "Barista Touch Espresso Machine",
    "brand": "Breville",
    "sku": "BES880BSS",
    "category": "espresso_machine",
    "price": 999.95,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "BESTSELLER",
    "rating": 5,
    "review_count": 142,
    "tax_category": "equipment",
    "width_cm": 32.2,
    "height_cm": 40.7,
    "depth_cm": 32.2,
    "weight_kg": 10.3,
    "top_clearance_cm": 12,
    "side_clearance_cm": 5,
    "rear_clearance_cm": 5,
    "roast_level": null,
    "process_method": null,
    "estate_name": null,
    "region": null,
    "elevation_m": null,
    "varietal": null,
    "image_url": "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80",
    "description": "Automated touchscreen espresso machine with integrated precision grinder and automated microfoam milk texturing.",
    "taste_notes": null
  },
  {
    "id": "prod_fellow_ode_gen2",
    "name": "Fellow Ode Gen 2 Brew Grinder",
    "brand": "Fellow",
    "sku": "FEL-ODE-G2-BLK",
    "category": "grinder",
    "price": 345,
    "compare_at_price": null,
    "status": "active",
    "in_stock": true,
    "badge": "PRO GEAR",
    "rating": 4.9,
    "review_count": 84,
    "tax_category": "equipment",
    "width_cm": 12,
    "height_cm": 24.1,
    "depth_cm": 23.9,
    "weight_kg": 4.5,
    "top_clearance_cm": 4,
    "side_clearance_cm": 2,
    "rear_clearance_cm": 2,
    "roast_level": null,
    "process_method": null,
    "estate_name": null,
    "region": null,
    "elevation_m": null,
    "varietal": null,
    "image_url": "https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=800&auto=format&fit=crop&q=80",
    "description": "Engineered for pour-over and drip brewing with commercial-grade 64mm flat burrs, anti-static technology, and single-dose zero-retention loading.",
    "taste_notes": null
  }
];


export function generateDefaultProductSections(product: Product): PageSection[] {
  const isCoffee = product.category === 'coffee_beans' || Boolean(product.roast_level);

  const showcaseSection: PageSection = {
    id: `sec_pdp_${product.id}_showcase`,
    type: 'product_lane',
    title: `${product.name} Showcase & Specifications`,
    subtitle: `${product.brand} · ${product.badge || (isCoffee ? 'Specialty Harvest' : 'Precision Commercial Gear')}`,
    is_active: true,
    sort_order: 1,
    config: {
      card_style: 'slider',
      display_count: 4,
      show_badges: true,
      enable_quick_add: true,
      product_id: product.id,
    },
  };

  const featureSection: PageSection = isCoffee
    ? {
        id: `sec_pdp_${product.id}_terroir`,
        type: 'promo_callout',
        title: `${product.roast_level || 'Artisan'} Terroir & Roast Profile`,
        subtitle: product.estate_name
          ? `Harvested at ${product.estate_name}${product.region ? `, ${product.region}` : ''}`
          : 'Small-batch direct-trade micro-lot extraction',
        is_active: true,
        sort_order: 2,
        config: {
          headline:
            product.taste_notes && product.taste_notes.length > 0
              ? `Tasting Notes: ${product.taste_notes.join(' · ')}`
              : 'Reserve Micro-Lot Cupping Score',
          body:
            product.description ||
            `Cultivated at ${product.elevation_m || 2000}m altitude. ${product.process_method || 'Washed'} process developing dense fruit sweetness and vibrant floral cup acidity.`,
          badge: product.process_method ? `${product.process_method.toUpperCase()} PROCESS` : 'MICRO-LOT ROAST',
          button_text: 'Explore Origin Harvest',
          button_url: '#/coffees',
          image_url:
            product.image_url ||
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
          layout: 'image_right',
        },
      }
    : {
        id: `sec_pdp_${product.id}_specs`,
        type: 'promo_callout',
        title: 'CounterCheck™ Spatial Fit & Engineering Verification',
        subtitle: 'Guaranteed kitchen cabinet and countertop clearance',
        is_active: true,
        sort_order: 2,
        config: {
          headline: `Dimensions: ${product.width_cm}cm W × ${product.height_cm}cm H × ${product.depth_cm}cm D (${product.weight_kg || 5}kg)`,
          body: `Verified spatial clearances: Overhead ${product.top_clearance_cm || 0}cm, Side ${product.side_clearance_cm || 0}cm, Rear ${product.rear_clearance_cm || 0}cm. Engineered for seamless under-cabinet placement with zero steam condensation risk.`,
          badge: 'SPATIAL FIT VERIFIED',
          button_text: 'View CounterCheck™ Guide',
          button_url: '#/discovery',
          image_url:
            product.image_url ||
            'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80',
          layout: 'image_left',
        },
      };

  const pairingSection: PageSection = {
    id: `sec_pdp_${product.id}_pairing`,
    type: 'product_lane',
    title: isCoffee ? 'Recommended Brewing Gear & Companion Tools' : 'Recommended Roaster Harvest Pairings',
    subtitle: isCoffee ? 'Precision espresso machines and grinders' : 'Fresh micro-lot harvests roasted daily',
    is_active: true,
    sort_order: 3,
    config: {
      filter_category: isCoffee ? 'espresso_machine' : 'coffee_beans',
      card_style: 'slider',
      limit: 4,
    },
  };

  const reviewSection: PageSection = {
    id: `sec_pdp_${product.id}_reviews`,
    type: 'testimonials',
    title: 'Devotee Extraction Reviews',
    subtitle: `Rated ${product.rating || 4.9} ★ across ${product.review_count || 100}+ verified coffee enthusiasts`,
    is_active: true,
    sort_order: 4,
    config: {
      testimonials: [
        {
          id: `test_${product.id}_1`,
          author: 'Marcus V.',
          role: 'Verified Home Barista',
          rating: 5,
          quote: `Incredible extraction consistency with the ${product.name}. Essential gear in our daily specialty coffee workflow.`,
          verified_purchase: true,
        },
        {
          id: `test_${product.id}_2`,
          author: 'Dr. Elena R.',
          role: 'Q-Grader & Roaster',
          rating: 5,
          quote: `Exceptional tolerances and cup clarity. Surpassed expectations on our cupping table.`,
          verified_purchase: true,
        },
      ],
    },
  };

  return [showcaseSection, featureSection, pairingSection, reviewSection];
}

export function generateProductPage(product: Product): CMSPage {
  return {
    id: `page_product_${product.id}`,
    page_type: 'product',
    title: `${product.name} (PDP)`,
    slug: `/products/${product.id}`,
    description: product.description || `${product.brand} ${product.name} product showcase and specifications.`,
    is_published: product.status === 'active',
    updated_at: new Date().toISOString(),
    sections: generateDefaultProductSections(product),
  };
}

export const DEFAULT_CMS_PAGES: CMSPage[] = [
  {
    id: 'page_home',
    page_type: 'home',
    title: 'Homepage',
    slug: '/',
    description: 'Main store landing experience featuring hero banner, origin lanes, and curated collections.',
    is_published: true,
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: 'sec_home_hero',
        type: 'hero_banner',
        title: 'Hero Banner',
        subtitle: 'Primary high-impact hero introducing autumn reserve micro-lots',
        is_active: true,
        sort_order: 1,
        config: {
          headline: 'Rare Harvests. Uncompromising Extraction.',
          subheadline:
            'Direct-trade micro-lots roasted with scientific precision and paired with CounterCheck™ space-fit verified espresso gear.',
          badge: 'AUTUMN 2026 RESERVE',
          primary_cta_text: 'Explore Fresh Harvests',
          primary_cta_url: '#/coffees',
          secondary_cta_text: 'Equipment & Gear Guide',
          secondary_cta_url: '#/discovery',
          background_image:
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&auto=format&fit=crop&q=85',
          overlay_opacity: 65,
          text_align: 'center',
        },
      },
      {
        id: 'sec_home_category_lane',
        type: 'category_lane',
        title: 'Curated Origin & Gear Collections',
        subtitle: 'Circular origin discovery rail',
        is_active: true,
        sort_order: 2,
        config: {
          card_style: 'circular',
          has_navigation_arrows: true,
          categories: [
            {
              id: 'cat_coffee',
              title: 'Roasted Coffee',
              image_url:
                'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&q=80',
              url: '#/coffees',
              badge: 'FRESH ROAST',
            },
            {
              id: 'cat_espresso',
              title: 'Espresso Machines',
              image_url:
                'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop&q=80',
              url: '#/equipment',
              badge: 'POPULAR',
            },
            {
              id: 'cat_brewing',
              title: 'Brewing Equipment',
              image_url:
                'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop&q=80',
              url: '#/equipment',
            },
            {
              id: 'cat_grinders',
              title: 'Burr Grinders',
              image_url:
                'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=300&h=300&fit=crop&q=80',
              url: '#/equipment',
            },
            {
              id: 'cat_drinkware',
              title: 'Barista Drinkware',
              image_url:
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop&q=80',
              url: '#/equipment',
            },
            {
              id: 'cat_subs',
              title: 'Roast Subscriptions',
              image_url:
                'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=300&h=300&fit=crop&q=80',
              url: '#/subscriptions',
              badge: 'SAVE 15%',
            },
          ],
        },
      },
      {
        id: 'sec_home_origin_lane',
        type: 'product_lane',
        title: 'Single-Origin Reserve Lots',
        subtitle: 'Micro-lots with cupping scores exceeding 87.5 points',
        is_active: true,
        sort_order: 3,
        config: {
          filter_category: 'coffee_beans',
          card_style: 'slider',
          display_count: 6,
          show_badges: true,
          enable_quick_add: true,
        },
      },
      {
        id: 'sec_home_precision_gear',
        type: 'product_lane',
        title: 'Benchtop Espresso Gear & Benchmarks',
        subtitle: 'CounterCheck™ verified spatial clearance equipment',
        is_active: true,
        sort_order: 4,
        config: {
          filter_category: 'espresso_machine',
          card_style: 'grid',
          limit: 4,
          show_badges: true,
          enable_quick_add: false,
        },
      },
      {
        id: 'sec_home_roastery_callout',
        type: 'promo_callout',
        title: 'Ethical Sourcing & Experimental Fermentation',
        subtitle: 'Roastery values and producer partnerships',
        is_active: true,
        sort_order: 5,
        config: {
          headline: 'Carbonic Maceration & Anaerobic Precision',
          body: 'We collaborate directly with estate farmers in Coorg and Chikmagalur to develop bespoke yeast inoculation and anaerobic fermentation protocols that unlock exotic tropical florals.',
          badge: 'DIRECT TRADE ETHICS',
          button_text: 'Read Sourcing Manifesto',
          button_url: '#/about',
          image_url:
            'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800&auto=format&fit=crop&q=80',
          layout: 'image_right',
        },
      },
      {
        id: 'sec_home_testimonials',
        type: 'testimonials',
        title: 'What Coffee Devotees Say',
        subtitle: 'Verified customer cupping reviews',
        is_active: true,
        sort_order: 6,
        config: {
          testimonials: [
            {
              id: 'test_1',
              author: 'Elena R.',
              role: 'Home Barista & Q-Grader',
              avatar_url:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
              rating: 5,
              quote:
                'The Mooleh Manay Excelsa was a revelation—crisp elderflower acidity with a dense cacao finish. CounterCheck™ saved me from buying a machine 2cm too deep!',
              verified_purchase: true,
            },
            {
              id: 'test_2',
              author: 'David K.',
              role: 'Coffee Roaster & Cafe Owner',
              avatar_url:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              rating: 5,
              quote:
                'Best roast development profiles in the country. Packaging keeps nitrogen flush intact for weeks. Invaluable curation for serious home espresso.',
              verified_purchase: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: 'page_collection_coffees',
    page_type: 'collection',
    title: 'Whole Bean Single Origins & Blends (PLP)',
    slug: '/coffees',
    description: 'Category product listing grid featuring origin terroir filters, roast development level, and process method badges.',
    is_published: true,
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: 'sec_coll_hero',
        type: 'hero_banner',
        title: 'Collection Header Banner',
        subtitle: 'Origin catalogue introduction',
        is_active: true,
        sort_order: 1,
        config: {
          headline: 'Specialty Harvest Collection',
          subheadline: 'Filter by roast level, cupping score, varietal, and estate processing method.',
          badge: 'CURRENT ROAST SELECTION',
          primary_cta_text: 'View Roasting Schedule',
          primary_cta_url: '#/about',
          background_image:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop&q=80',
          overlay_opacity: 60,
          text_align: 'center',
        },
      },
      {
        id: 'sec_coll_categories',
        type: 'category_lane',
        title: 'Filter by Origin & Varietal',
        subtitle: 'Region shortcuts',
        is_active: true,
        sort_order: 2,
        config: {
          card_style: 'circular',
          has_navigation_arrows: false,
          categories: [
            {
              id: 'cat_c1',
              title: 'Coorg Estates',
              image_url:
                'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=200&h=200&fit=crop&q=80',
              url: '#/coffees',
            },
            {
              id: 'cat_c2',
              title: 'Chikmagalur',
              image_url:
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop&q=80',
              url: '#/coffees',
            },
            {
              id: 'cat_c3',
              title: 'Anaerobic Naturals',
              image_url:
                'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop&q=80',
              url: '#/coffees',
            },
            {
              id: 'cat_c4',
              title: 'Washed Micro-lots',
              image_url:
                'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&h=200&fit=crop&q=80',
              url: '#/coffees',
            },
          ],
        },
      },
      {
        id: 'sec_coll_products',
        type: 'product_grid',
        title: 'All Active Coffee Offerings',
        subtitle: 'Full ground-truth coffee beans from catalog',
        is_active: true,
        sort_order: 3,
        config: {
          columns: 3,
          filter_category: 'coffee_beans',
          limit: 12,
          show_quick_add: true,
        },
      },
    ],
  },
  ...SEED_CATALOG_PRODUCTS.map(generateProductPage),
  {
    id: 'page_about',
    page_type: 'static',
    title: 'About Hiljhil Roasters & Philosophy',
    slug: '/about',
    description: 'Our sourcing transparency, roasting manifesto, and engineering standards.',
    is_published: true,
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: 'sec_about_hero',
        type: 'hero_banner',
        title: 'Story Hero Banner',
        subtitle: 'Introduction to roasting manifesto',
        is_active: true,
        sort_order: 1,
        config: {
          headline: 'Sourcing with Integrity. Roasting with Science.',
          subheadline:
            'Founded by coffee obsessives and precision engineers, Hiljhil bridges experimental agricultural fermentation with uncompromising home extraction.',
          badge: 'ROASTERY MANIFESTO',
          primary_cta_text: 'Explore Harvest Lots',
          primary_cta_url: '#/coffees',
          background_image:
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=80',
          overlay_opacity: 65,
          text_align: 'center',
        },
      },
      {
        id: 'sec_about_callout_1',
        type: 'promo_callout',
        title: 'Direct Trade Promise',
        subtitle: 'Sourcing ethics',
        is_active: true,
        sort_order: 2,
        config: {
          headline: 'Direct Farm Transparency',
          body: 'We reject commoditized coffee supply chains. We partner directly with estate owners in Karnataka and Oromia, financing raised drying beds and anaerobic fermentation tanks.',
          badge: 'FARM DIRECT',
          button_text: 'View Estate Harvests',
          button_url: '#/coffees',
          image_url:
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
          layout: 'image_right',
        },
      },
      {
        id: 'sec_about_testimonials',
        type: 'testimonials',
        title: 'Industry Accolades & Roaster Recognition',
        subtitle: 'Celebrated by international coffee judges',
        is_active: true,
        sort_order: 3,
        config: {
          testimonials: [
            {
              id: 'accolade_1',
              author: 'Specialty Coffee Guild 2025',
              role: 'Award for Fermentation Innovation',
              avatar_url:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              rating: 5,
              quote:
                'Hiljhil demonstrates what happens when scientific rigor meets artisanal micro-lot farming. The flavor clarity is unmatched.',
              verified_purchase: true,
            },
          ],
        },
      },
    ],
  },
];

// ==========================================
// Provider Operations with Content Service API & Local Storage Sync
// ==========================================

export function getGlobalShell(): GlobalShellConfig {
  try {
    const raw = localStorage.getItem(STORAGE_SHELL_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read global shell from storage, using default:', e);
  }
  return DEFAULT_GLOBAL_SHELL;
}

export async function fetchGlobalShell(): Promise<GlobalShellConfig> {
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/shell`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        const config: GlobalShellConfig = {
          promo_bar: data.promo_bar,
          header: data.header,
          footer: data.footer,
          theme: data.theme || DEFAULT_THEME_PRESETS.alpine,
        };
        try {
          localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(config));
          if (config.theme) {
            localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(config.theme));
          }
        } catch {}
        return config;
      }
    } catch (e) {
      console.warn('Could not fetch global shell from content-service, using cached:', e);
    }
  }
  return getGlobalShell();
}

export async function saveGlobalShell(config: GlobalShellConfig): Promise<void> {
  try {
    localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(config));
    if (config.theme) {
      localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(config.theme));
    }
  } catch (e) {
    console.error('Failed to save global shell to storage:', e);
  }

  if (CONTENT_API_URL) {
    try {
      await fetch(`${CONTENT_API_URL}/cms/shell`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
    } catch (e) {
      console.warn('Could not sync global shell to content-service:', e);
    }
  }
}

export function getTheme(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_THEME_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read theme from storage, using default:', e);
  }
  const shell = getGlobalShell();
  return shell.theme || DEFAULT_THEME_PRESETS.alpine;
}

export async function fetchTheme(): Promise<ThemeConfig> {
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/shell/theme`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        try {
          localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(data));
        } catch {}
        return data;
      }
    } catch (e) {
      console.warn('Could not fetch theme from content-service:', e);
    }
  }
  return getTheme();
}

export async function saveTheme(theme: ThemeConfig): Promise<{ success: boolean; syncedToApi: boolean; theme: ThemeConfig }> {
  let syncedToApi = false;
  try {
    localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save theme locally:', e);
  }

  try {
    const currentShell = getGlobalShell();
    currentShell.theme = theme;
    localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(currentShell));
  } catch {}

  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/shell/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });
      if (res.ok) {
        syncedToApi = true;
      }
    } catch (e) {
      console.warn('Could not save theme via dedicated endpoint:', e);
    }
  }

  return {
    success: true,
    syncedToApi,
    theme,
  };
}

export async function fetchPromoBar(): Promise<PromoBarConfig> {
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/shell/promo-bar`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch promo-bar from content-service:', e);
    }
  }
  return getGlobalShell().promo_bar;
}

export async function savePromoBar(promo: PromoBarConfig): Promise<void> {
  const currentShell = getGlobalShell();
  currentShell.promo_bar = promo;
  try {
    localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(currentShell));
  } catch (e) {
    console.error('Failed to save promo bar locally:', e);
  }

  if (CONTENT_API_URL) {
    try {
      await fetch(`${CONTENT_API_URL}/cms/shell/promo-bar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promo),
      });
    } catch (e) {
      console.warn('Could not save promo bar via dedicated endpoint:', e);
    }
  }
}

export interface SaveHeaderResponse {
  success: boolean;
  syncedToApi: boolean;
  header: HeaderConfig;
  message: string;
}

export async function fetchHeader(): Promise<HeaderConfig> {
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/shell/header`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        const currentShell = getGlobalShell();
        currentShell.header = data;
        try {
          localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(currentShell));
        } catch {}
        return data;
      }
    } catch (e) {
      console.warn('Could not fetch header from content-service:', e);
    }
  }
  return getGlobalShell().header;
}

export async function saveHeader(header: HeaderConfig): Promise<SaveHeaderResponse> {
  const currentShell = getGlobalShell();
  currentShell.header = header;
  try {
    localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(currentShell));
  } catch (e) {
    console.error('Failed to save header locally:', e);
  }

  let syncedToApi = false;
  let message = 'Header configuration saved locally to browser storage';

  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/shell/header`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(header),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        syncedToApi = true;
        message = 'Header configuration saved and synced to content-service API';
      } else {
        // Fallback to full shell update endpoint
        const shellRes = await fetch(`${CONTENT_API_URL}/cms/shell`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentShell),
          signal: AbortSignal.timeout(8000),
        });
        if (shellRes.ok) {
          syncedToApi = true;
          message = 'Header configuration saved and synced to content-service API';
        } else {
          message = `Header saved locally (content-service API returned ${res.status})`;
        }
      }
    } catch (e: any) {
      console.warn('Could not save header via dedicated endpoint:', e);
      message = 'Header saved locally (backend service unreachable)';
    }
  }

  return {
    success: true,
    syncedToApi,
    header,
    message,
  };
}

export async function fetchFooter(): Promise<FooterConfig> {
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/shell/footer`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch footer from content-service:', e);
    }
  }
  return getGlobalShell().footer;
}

export async function saveFooter(footer: FooterConfig): Promise<void> {
  const currentShell = getGlobalShell();
  currentShell.footer = footer;
  try {
    localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(currentShell));
  } catch (e) {
    console.error('Failed to save footer locally:', e);
  }

  if (CONTENT_API_URL) {
    try {
      await fetch(`${CONTENT_API_URL}/cms/shell/footer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footer),
      });
    } catch (e) {
      console.warn('Could not save footer via dedicated endpoint:', e);
    }
  }
}

export function syncProductPagesWithCatalog(existingPages: CMSPage[], products: Product[]): CMSPage[] {
  const pages = [...existingPages];

  for (const prod of products) {
    const expectedId = `page_product_${prod.id}`;
    const expectedSlug = `/products/${prod.id}`;

    const existingIndex = pages.findIndex(
      (p) => p.page_type === 'product' && (p.id === expectedId || p.slug === expectedSlug)
    );

    if (existingIndex >= 0) {
      const existing = pages[existingIndex];
      pages[existingIndex] = {
        ...existing,
        title: existing.title || `${prod.name} (PDP)`,
        slug: expectedSlug,
      };
    } else {
      pages.push(generateProductPage(prod));
    }
  }

  // Remove any obsolete universal fallback PDP template
  const cleanedPages = pages.filter((p) => p.id !== 'page_product_default' && p.slug !== '/products/:id');

  try {
    localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(cleanedPages));
  } catch (e) {
    console.warn('Failed to cache synced CMS pages in storage:', e);
  }

  return cleanedPages;
}

export function getCmsPages(): CMSPage[] {
  try {
    const raw = localStorage.getItem(STORAGE_PAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return syncProductPagesWithCatalog(parsed, SEED_CATALOG_PRODUCTS);
      }
    }
  } catch (e) {
    console.warn('Failed to read CMS pages from storage, using default:', e);
  }
  return DEFAULT_CMS_PAGES;
}

export async function fetchCmsPages(): Promise<CMSPage[]> {
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/pages?limit=100`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          try {
            localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(data.items));
          } catch {}
          return data.items;
        }
      }
    } catch (e) {
      console.warn('Could not fetch CMS pages from content-service, using cached:', e);
    }
  }
  return getCmsPages();
}

export function getCmsPage(id: string): CMSPage | undefined {
  const pages = getCmsPages();
  return pages.find((p) => p.id === id);
}

export async function fetchCmsPage(id: string): Promise<CMSPage | undefined> {
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/pages/${id}`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn(`Could not fetch CMS page #${id} from content-service:`, e);
    }
  }
  return getCmsPage(id);
}

export async function saveCmsPage(page: CMSPage): Promise<void> {
  const pages = getCmsPages();
  const index = pages.findIndex((p) => p.id === page.id);
  const updatedPage = { ...page, updated_at: new Date().toISOString() };
  if (index >= 0) {
    pages[index] = updatedPage;
  } else {
    pages.push(updatedPage);
  }
  try {
    localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(pages));
  } catch (e) {
    console.error('Failed to save CMS page:', e);
  }

  if (CONTENT_API_URL) {
    try {
      const patchRes = await fetch(`${CONTENT_API_URL}/cms/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      });
      if (patchRes.status === 404) {
        await fetch(`${CONTENT_API_URL}/cms/pages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(page),
        });
      }
    } catch (e) {
      console.warn(`Could not sync CMS page #${page.id} to content-service:`, e);
    }
  }
}

export async function createCmsPage(pageData: Omit<CMSPage, 'id' | 'updated_at'>): Promise<CMSPage> {
  let createdPage: CMSPage = {
    ...pageData,
    id: `page_${Date.now()}`,
    updated_at: new Date().toISOString(),
  };

  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      if (res.ok) {
        createdPage = await res.json();
      }
    } catch (e) {
      console.warn('Could not create CMS page on content-service, saving locally:', e);
    }
  }

  const pages = getCmsPages();
  pages.push(createdPage);
  try {
    localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(pages));
  } catch (e) {
    console.error('Failed to save created CMS page locally:', e);
  }
  return createdPage;
}

export async function deleteCmsPage(id: string): Promise<boolean> {
  const pages = getCmsPages();
  const filtered = pages.filter((p) => p.id !== id);
  if (filtered.length !== pages.length) {
    try {
      localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete CMS page locally:', e);
    }
  }

  if (CONTENT_API_URL) {
    try {
      await fetch(`${CONTENT_API_URL}/cms/pages/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn(`Could not delete CMS page #${id} on content-service:`, e);
    }
  }
  return true;
}

export async function resetCmsDefaults(): Promise<{ shell: GlobalShellConfig; pages: CMSPage[] }> {
  try {
    localStorage.removeItem(STORAGE_SHELL_KEY);
    localStorage.removeItem(STORAGE_PAGES_KEY);
  } catch (e) {
    console.warn('Failed to reset CMS keys in localStorage:', e);
  }

  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/cms/reset-defaults`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        return {
          shell: data.shell,
          pages: data.pages,
        };
      }
    } catch (e) {
      console.warn('Could not reset CMS defaults on content-service:', e);
    }
  }

  return {
    shell: DEFAULT_GLOBAL_SHELL,
    pages: DEFAULT_CMS_PAGES,
  };
}

