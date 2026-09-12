import {
  GlobalShellConfig,
  CMSPage,
  PageSection,
  SectionType,
} from '../types/cms';

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
    show_spatial_finder: true,
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
        badge: 'SPATIAL 3D',
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
    description: 'Main flagship storefront landing experience featuring hero banner, origin lanes, and spatial discovery.',
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
          secondary_cta_text: 'CounterCheck™ Spatial Finder',
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
        subtitle: 'Spatial dimension fitment guarantee callout',
        is_active: true,
        sort_order: 4,
        config: {
          headline: 'Guaranteed Kitchen Fit Before You Buy',
          body: 'Never return an espresso machine that does not clear your kitchen cabinets. CounterCheck™ calculates machine height, top water-reservoir clearance, and portafilter swing radius in real-time.',
          badge: 'PATENTED SPATIAL TECH',
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
    id: 'page_discovery',
    page_type: 'discovery',
    title: 'CounterCheck™ Spatial Fitment Discovery',
    slug: '/discovery',
    description: 'Spatial dimension verification workbench and under-cabinet clearance finder.',
    is_published: true,
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: 'sec_disc_hero',
        type: 'hero_banner',
        title: 'Discovery Experience Hero',
        subtitle: 'Dimensional clearance hero',
        is_active: true,
        sort_order: 1,
        config: {
          headline: 'Precision Spatial Clearance Engine',
          subheadline:
            'Measure your kitchen counter space once. Discover premium espresso gear guaranteed to fit under your cabinets with full reservoir access.',
          badge: 'PATENTED FITMENT TECH',
          primary_cta_text: 'Enter Kitchen Dimensions',
          primary_cta_url: '#/discovery',
          background_image:
            'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=1600&auto=format&fit=crop&q=85',
          overlay_opacity: 70,
          text_align: 'center',
        },
      },
      {
        id: 'sec_disc_lane',
        type: 'product_lane',
        title: 'CounterCheck™ Verified Slim Machines',
        subtitle: 'Under 35cm total height for tight overhead cabinets',
        is_active: true,
        sort_order: 2,
        config: {
          filter_category: 'espresso_machine',
          card_style: 'slider',
          limit: 6,
        },
      },
      {
        id: 'sec_disc_callout',
        type: 'promo_callout',
        title: 'How CounterCheck™ Spatial Verification Works',
        subtitle: '3-point measurement explanation',
        is_active: true,
        sort_order: 3,
        config: {
          headline: '3-Point Counter Clearance Guarantee',
          body: 'Every machine in our catalog has been 3D scanned in our roastery test lab. We measure operational clearances for top hopper lids, side steam wand reach, and front portafilter insertion.',
          badge: 'VERIFIED TOLERANCE',
          button_text: 'Read Fitment Whitepaper',
          button_url: '#/about',
          image_url:
            'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80',
          layout: 'image_left',
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
// Provider Operations with Local Storage Sync
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

export function saveGlobalShell(config: GlobalShellConfig): void {
  try {
    localStorage.setItem(STORAGE_SHELL_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save global shell to storage:', e);
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

export function getCmsPage(id: string): CMSPage | undefined {
  const pages = getCmsPages();
  return pages.find((p) => p.id === id);
}

export function saveCmsPage(page: CMSPage): void {
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
}

export function createCmsPage(pageData: Omit<CMSPage, 'id' | 'updated_at'>): CMSPage {
  const pages = getCmsPages();
  const newPage: CMSPage = {
    ...pageData,
    id: `page_${Date.now()}`,
    updated_at: new Date().toISOString(),
  };
  pages.push(newPage);
  try {
    localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(pages));
  } catch (e) {
    console.error('Failed to create CMS page:', e);
  }
  return newPage;
}

export function deleteCmsPage(id: string): boolean {
  const pages = getCmsPages();
  const filtered = pages.filter((p) => p.id !== id);
  if (filtered.length !== pages.length) {
    try {
      localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete CMS page:', e);
    }
  }
  return false;
}

export function resetCmsDefaults(): { shell: GlobalShellConfig; pages: CMSPage[] } {
  try {
    localStorage.removeItem(STORAGE_SHELL_KEY);
    localStorage.removeItem(STORAGE_PAGES_KEY);
  } catch (e) {
    console.warn('Failed to reset CMS keys in localStorage:', e);
  }
  return {
    shell: DEFAULT_GLOBAL_SHELL,
    pages: DEFAULT_CMS_PAGES,
  };
}

