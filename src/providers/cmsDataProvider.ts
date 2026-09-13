import {
  GlobalShellConfig,
  PromoBarConfig,
  HeaderConfig,
  FooterConfig,
  CMSPage,
  PageSection,
  SectionType,
} from '../types/cms';
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
export const DEFAULT_CMS_PAGES: CMSPage[] = [
  {
    id: 'page_home',
    page_type: 'home',
    title: 'Storefront Flagship Homepage',
    slug: '/',
    description: 'Main flagship storefront landing experience featuring hero banner, origin lanes, and curated collections.',
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
        id: 'sec_home_product_lane',
        type: 'product_lane',
        title: 'Featured Roaster Harvests',
        subtitle: 'Direct trade anaerobic lots and competition roast profiles',
        is_active: true,
        sort_order: 3,
        config: {
          filter_badge: 'NANO LOT',
          card_style: 'slider',
          limit: 6,
        },
      },
      {
        id: 'sec_home_promo_callout',
        type: 'promo_callout',
        title: 'CounterCheck™ Guarantee Highlight',
        subtitle: 'Dimension fitment guarantee callout',
        is_active: true,
        sort_order: 4,
        config: {
          headline: 'Guaranteed Kitchen Fit Before You Buy',
          body: 'Never return an espresso machine that does not clear your kitchen cabinets. CounterCheck™ calculates machine height, top water-reservoir clearance, and portafilter swing radius in real-time.',
          badge: 'PATENTED FIT TECH',
          button_text: 'Launch CounterCheck™ Finder',
          button_url: '#/discovery',
          image_url:
            'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
          layout: 'image_right',
        },
      },
      {
        id: 'sec_home_product_grid',
        type: 'product_grid',
        title: 'Verified Bestsellers & Espresso Gear',
        subtitle: 'Flagship equipment with 3-year roastery warranty and complimentary dial-in session',
        is_active: true,
        sort_order: 5,
        config: {
          columns: 3,
          limit: 6,
          show_quick_add: true,
        },
      },
      {
        id: 'sec_home_testimonials',
        type: 'testimonials',
        title: 'Devotee Reviews & Barista Feedback',
        subtitle: 'What coffee champions and home baristas say about our roasts',
        is_active: true,
        sort_order: 6,
        config: {
          testimonials: [
            {
              id: 'test_1',
              author: 'Elena Rostova',
              role: 'National Barista Finalist 2025',
              avatar_url:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              rating: 5,
              quote:
                'The Mooleh Manay Excelsa is a revelation. The carbonic maceration preserves vibrant berry acidity while delivering deep body and delicate floral jasmine aromatics.',
              verified_purchase: true,
            },
            {
              id: 'test_2',
              author: 'Marcus Vance',
              role: 'Home Barista Devotee',
              avatar_url:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              rating: 5,
              quote:
                'CounterCheck™ saved me from purchasing an espresso machine that would have hit my under-cabinet lighting. The machine fit with millimeter accuracy, and the coffee is world-class.',
              verified_purchase: true,
            },
            {
              id: 'test_3',
              author: 'Dr. Sarah Lin',
              role: 'Specialty Coffee Roaster',
              avatar_url:
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
              rating: 5,
              quote:
                'Hiljhil sets the bar for ethical sourcing in specialty coffee. Transparent farm pricing, zero defects, and roast consistency that never falters across seasonal harvests.',
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
    title: 'Whole Bean Coffees Collection (PLP)',
    slug: '/coffees',
    description: 'Category listing page for single origins, espresso blends, and seasonal harvest releases.',
    is_published: true,
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: 'sec_coll_hero',
        type: 'hero_banner',
        title: 'Coffees Collection Banner',
        subtitle: 'Collection header banner for coffees',
        is_active: true,
        sort_order: 1,
        config: {
          headline: 'Single Origin & Producer Series Harvests',
          subheadline:
            'From the high-altitude volcanic soils of Guji to the mist-shrouded hills of Coorg. Direct trade, single-farm traceability.',
          badge: 'CROP HARVEST 2026',
          primary_cta_text: 'Shop All Beans',
          primary_cta_url: '#/coffees',
          background_image:
            'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=1600&auto=format&fit=crop&q=80',
          overlay_opacity: 60,
          text_align: 'left',
        },
      },
      {
        id: 'sec_coll_grid',
        type: 'category_grid',
        title: 'Explore by Roast Profile',
        subtitle: 'Choose your ideal flavor profile',
        is_active: true,
        sort_order: 2,
        config: {
          columns: 4,
          categories: [
            {
              id: 'cat_light',
              title: 'Light-Medium Terroir Roasts',
              image_url:
                'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop&q=80',
              url: '#/coffees?roast=light',
              badge: 'FLORAL & BRIGHT',
            },
            {
              id: 'cat_medium',
              title: 'House & Balanced Roasts',
              image_url:
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&q=80',
              url: '#/coffees?roast=medium',
              badge: 'CHOCOLATE & CARAMEL',
            },
            {
              id: 'cat_anaerobic',
              title: 'Anaerobic Nano-Lots',
              image_url:
                'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400&h=300&fit=crop&q=80',
              url: '#/coffees?process=anaerobic',
              badge: 'WINE & TROPICAL',
            },
            {
              id: 'cat_decaf',
              title: 'Mountain Water Decaf',
              image_url:
                'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=300&fit=crop&q=80',
              url: '#/coffees?category=decaf',
              badge: 'CHEMICAL FREE',
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
  {
    id: 'page_product_detail',
    page_type: 'product',
    title: 'Mooleh Manay Excelsa Product Showcase (PDP)',
    slug: '/products/mooleh-manay-excelsa',
    description: 'Product detail showcase featuring terroir specs, roast development curve, and brew guidelines.',
    is_published: true,
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: 'sec_pdp_hero',
        type: 'hero_banner',
        title: 'Single Origin Lot Product Hero',
        subtitle: 'Harvest details and cupping scores',
        is_active: true,
        sort_order: 1,
        config: {
          headline: 'Mooleh Manay Carbonic Maceration Excelsa',
          subheadline:
            'Rare single-estate nano lot from Coorg, Karnataka. Vibrant notes of dark cherry, elderflower, and dark chocolate liqueur.',
          badge: 'CUPPING SCORE: 88.5',
          primary_cta_text: 'Order Roasted Beans ($24)',
          primary_cta_url: '#/products/mooleh-manay-excelsa',
          background_image:
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&auto=format&fit=crop&q=85',
          overlay_opacity: 65,
          text_align: 'left',
        },
      },
      {
        id: 'sec_pdp_callout',
        type: 'promo_callout',
        title: 'Fermentation & Roasting Profile',
        subtitle: 'Technical cupping notes',
        is_active: true,
        sort_order: 2,
        config: {
          headline: 'Experimental 96-Hour Carbonic Maceration',
          body: 'Sealed stainless fermentation tanks with CO2 purging allow enzymatic breakdown of mucilage sugars, magnifying stonefruit esters without vinegary acetic development.',
          badge: 'PROCESS METHOD',
          button_text: 'Download Roast Curve PDF',
          button_url: '#/about',
          image_url:
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
          layout: 'image_right',
        },
      },
      {
        id: 'sec_pdp_lane',
        type: 'product_lane',
        title: 'Recommended Equipment Pairing',
        subtitle: 'Dialed in precision grinders and brewers for this roast',
        is_active: true,
        sort_order: 3,
        config: {
          filter_category: 'grinder',
          card_style: 'slider',
          limit: 4,
        },
      },
    ],
  },
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

export function getCmsPages(): CMSPage[] {
  try {
    const raw = localStorage.getItem(STORAGE_PAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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

