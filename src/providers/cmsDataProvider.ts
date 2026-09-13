import {
  GlobalShellConfig,
  PromoBarConfig,
  HeaderConfig,
  FooterConfig,
  CMSPage,
  PageSection,
  SectionType,
} from '../types/cms';
import type { Product } from '../types/product';
import { CONTENT_API_URL } from './dataProvider';

const STORAGE_SHELL_KEY = 'pim_cms_global_shell_v1';
const STORAGE_PAGES_KEY = 'pim_cms_pages_v1';

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
};

// ==========================================
// Default Seed Data: Pages & Section Layouts
// ==========================================
export const SEED_CATALOG_PRODUCTS: Product[] = [
  {
    id: 'prod_breville_barista_touch',
    name: 'Barista Touch Espresso Machine',
    brand: 'Breville',
    sku: 'BES880BSS',
    category: 'espresso_machine',
    price: 999.95,
    compare_at_price: 1199.95,
    status: 'active',
    in_stock: true,
    badge: 'FLAGSHIP GEAR',
    rating: 4.9,
    review_count: 142,
    tax_category: '8419',
    width_cm: 32.2,
    height_cm: 40.7,
    depth_cm: 32.2,
    weight_kg: 10.3,
    top_clearance_cm: 12.0,
    side_clearance_cm: 5.0,
    rear_clearance_cm: 5.0,
    image_url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80',
    description: 'Automated touchscreen espresso machine with integrated precision grinder.',
    taste_notes: ['Espresso', 'Microfoam', 'Touchscreen'],
  },
  {
    id: 'prod_artisan_guji',
    name: 'Ethiopian Guji Single Origin (250g)',
    brand: 'Artisan Roasters',
    sku: 'ETH-GUJ-250',
    category: 'coffee_beans',
    price: 22.0,
    compare_at_price: null,
    status: 'active',
    in_stock: true,
    badge: 'EXCLUSIVE HARVEST',
    rating: 5.0,
    review_count: 88,
    tax_category: '0901',
    width_cm: 10.0,
    height_cm: 20.0,
    depth_cm: 6.0,
    weight_kg: 0.25,
    top_clearance_cm: 0,
    side_clearance_cm: 0,
    rear_clearance_cm: 0,
    roast_level: 'Light Medium',
    process_method: 'Washed',
    estate_name: 'Shakiso Highlands',
    region: 'Oromia, Guji',
    elevation_m: 2100,
    varietal: 'Heirloom',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    description: 'Bergamot, candied peach, and jasmine blossoms in a sparkling cup.',
    taste_notes: ['Jasmine', 'Bergamot', 'Peach'],
  },
  {
    id: 'prod_delonghi_dedica',
    name: 'Dedica Deluxe Slim Espresso Machine',
    brand: "De'Longhi",
    sku: 'EC680M',
    category: 'espresso_machine',
    price: 299.95,
    compare_at_price: 349.95,
    status: 'active',
    in_stock: true,
    badge: 'BESTSELLER',
    rating: 4.6,
    review_count: 310,
    tax_category: '8419',
    width_cm: 14.9,
    height_cm: 30.5,
    depth_cm: 33.0,
    weight_kg: 4.2,
    top_clearance_cm: 5.0,
    side_clearance_cm: 3.0,
    rear_clearance_cm: 4.0,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-slim 6-inch wide manual espresso machine for tight counters.',
    taste_notes: ['Compact', '15-Bar Pump', 'Steam Wand'],
  },
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

export const DEFAULT_PRODUCT_PAGE: CMSPage = {
  id: 'page_product_default',
  page_type: 'product',
  title: 'Product Detail Page (PDP)',
  slug: '/products/:id',
  description: 'Universal product page layout template automatically rendered across all catalog items (espresso gear, whole bean coffees, accessories).',
  is_published: true,
  updated_at: new Date().toISOString(),
  sections: [
    {
      id: 'sec_pdp_overview',
      type: 'product_lane',
      title: 'Product Media Showcase & Specs',
      subtitle: 'High-res media carousel, buy box, and CounterCheck™ clearance metrics',
      is_active: true,
      sort_order: 1,
      config: {
        card_style: 'slider',
        display_count: 4,
        show_badges: true,
        enable_quick_add: true,
      },
    },
    {
      id: 'sec_pdp_pairing',
      type: 'product_lane',
      title: 'Recommended Roaster Pairings',
      subtitle: 'Fresh whole bean lots and precision companion tools',
      is_active: true,
      sort_order: 2,
      config: {
        filter_category: 'coffee_beans',
        card_style: 'slider',
        limit: 4,
      },
    },
    {
      id: 'sec_pdp_reviews',
      type: 'testimonials',
      title: 'Devotee Extraction Reviews',
      subtitle: 'Grind calibration notes and home barista feedback',
      is_active: true,
      sort_order: 3,
      config: {
        testimonials: [
          {
            id: 'pdp_test_1',
            author: 'Marcus V.',
            role: 'Verified Home Barista',
            rating: 5,
            quote: 'Extremely consistent extraction with zero channeling. The spatial tolerance matched my kitchen cabinet height exactly.',
          },
        ],
      },
    },
  ],
};

export const DEFAULT_CMS_PAGES: CMSPage[] = [
  {
    id: 'page_home',
    page_type: 'home',
    title: 'Flagship Homepage',
    slug: '/',
    description: 'Main flagship store landing experience featuring hero banner, origin lanes, and curated collections.',
    is_published: true,
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: 'sec_home_hero',
        type: 'hero_banner',
        title: 'Flagship Roastery Hero Banner',
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
  DEFAULT_PRODUCT_PAGE,
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
        };
        try {
          localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(config));
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

  // Ensure default fallback PDP template also exists
  if (!pages.some((p) => p.id === DEFAULT_PRODUCT_PAGE.id || p.slug === '/products/:id')) {
    pages.push(DEFAULT_PRODUCT_PAGE);
  }

  try {
    localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(pages));
  } catch (e) {
    console.warn('Failed to cache synced CMS pages in storage:', e);
  }

  return pages;
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

