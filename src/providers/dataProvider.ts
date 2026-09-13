import type { DataProvider } from '@refinedev/core';

const DEFAULT_CATALOG_URL = 'https://product-catalog-service-518971663061.us-central1.run.app';
const DEFAULT_CONTENT_URL = 'https://content-service-518971663061.us-central1.run.app';

function normalizeApiUrl(rawUrl: string | undefined, defaultUrl: string): string {
  const url = rawUrl && rawUrl.trim() !== '' ? rawUrl.trim() : defaultUrl;
  const cleaned = url.replace(/\/+$/, '');
  return cleaned.endsWith('/api/v1') ? cleaned : `${cleaned}/api/v1`;
}

export const CATALOG_API_URL = normalizeApiUrl(import.meta.env.VITE_CATALOG_API_URL, DEFAULT_CATALOG_URL);
export const CONTENT_API_URL = normalizeApiUrl(import.meta.env.VITE_CONTENT_API_URL, DEFAULT_CONTENT_URL);
export const API_URL = CATALOG_API_URL; // Backwards compatibility alias

const FALLBACK_PIM_PRODUCTS: any[] = [
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

const FALLBACK_LANES: any[] = [
  {
    id: 'lane_curated_roasts',
    title: 'Featured Roaster Harvests',
    lane_type: 'circular_cards',
    placement: 'homepage',
    is_active: true,
    priority: 1,
    products: FALLBACK_PIM_PRODUCTS.map((p) => p.id),
  },
  {
    id: 'lane_space_fit_gear',
    title: 'CounterCheck™ Verified Gear',
    lane_type: 'product_rail',
    placement: 'discovery',
    is_active: true,
    priority: 2,
    products: FALLBACK_PIM_PRODUCTS.filter((p) => p.category === 'espresso_machine').map((p) => p.id),
  },
];

export function resolveResourcePath(resource: string): { baseUrl: string; endpoint: string } {
  if (resource === 'lanes' || resource === 'content_lanes' || resource === 'menus') {
    return { baseUrl: CONTENT_API_URL, endpoint: resource };
  }
  if (resource === 'pages' || resource === 'cms_pages' || resource === 'cms/pages') {
    return { baseUrl: CONTENT_API_URL, endpoint: 'cms/pages' };
  }
  if (resource === 'cms/shell' || resource === 'shell' || resource === 'cms_shell') {
    return { baseUrl: CONTENT_API_URL, endpoint: 'cms/shell' };
  }
  if (resource.startsWith('cms/')) {
    return { baseUrl: CONTENT_API_URL, endpoint: resource };
  }
  return { baseUrl: CATALOG_API_URL, endpoint: resource };
}

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters }) => {
    const current = pagination?.currentPage ?? (pagination as any)?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 50;
    const offset = (current - 1) * pageSize;
    const { baseUrl, endpoint } = resolveResourcePath(resource);

    const params = new URLSearchParams();
    params.set('offset', String(offset));
    params.set('limit', String(pageSize));

    if (filters) {
      for (const filter of filters) {
        if ('field' in filter && filter.value !== undefined && filter.value !== null && filter.value !== '') {
          const val = String(filter.value);
          if (filter.field === 'q' || filter.field === 'search') {
            params.set('q', val);
          } else if (filter.field === 'category') {
            params.set('category', val);
          } else if (filter.field === 'status') {
            params.set('status', val);
          } else if (filter.field === 'brand') {
            params.set('brand', val);
          } else if (filter.field === 'roast_level') {
            params.set('roast_level', val);
          } else if (filter.field === 'process_method') {
            params.set('process_method', val);
          } else if (filter.field === 'estate_name') {
            params.set('estate_name', val);
          } else if (filter.field === 'placement') {
            params.set('placement', val);
          } else if (filter.field === 'lane_type') {
            params.set('lane_type', val);
          }
        }
      }
    }

    if (baseUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(`${baseUrl}/${endpoint}?${params.toString()}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          const json = await response.json();
          return {
            data: json.items ?? [],
            total: json.total ?? 0,
          };
        }
      } catch {
        console.warn(`Could not reach ${resource} at ${baseUrl}, using offline fallback`);
      }
    }

    const fallbackItems = resource === 'products' ? FALLBACK_PIM_PRODUCTS : FALLBACK_LANES;
    return {
      data: fallbackItems,
      total: fallbackItems.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const { baseUrl, endpoint } = resolveResourcePath(resource);
    if (baseUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(`${baseUrl}/${endpoint}/${id}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          return { data };
        }
      } catch {
        console.warn(`Could not reach ${resource} #${id} at ${baseUrl}, using fallback`);
      }
    }
    const fallbackList = resource === 'products' ? FALLBACK_PIM_PRODUCTS : FALLBACK_LANES;
    const item = fallbackList.find((x) => String(x.id) === String(id)) || fallbackList[0];
    return { data: item };
  },

  create: async ({ resource, variables }) => {
    const { baseUrl, endpoint } = resolveResourcePath(resource);
    if (baseUrl) {
      try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variables),
        });

        if (response.ok) {
          const data = await response.json();
          return { data };
        }
      } catch {
        console.warn(`Could not create ${resource} on backend, returning local representation`);
      }
    }

    const data = { id: `item_${Date.now()}`, ...(variables as any) };
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const { baseUrl, endpoint } = resolveResourcePath(resource);
    if (baseUrl) {
      try {
        const response = await fetch(`${baseUrl}/${endpoint}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variables),
        });

        if (response.ok) {
          const data = await response.json();
          return { data };
        }
      } catch {
        console.warn(`Could not update ${resource} #${id} on backend, returning local representation`);
      }
    }

    const data = { id, ...(variables as any) };
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const { baseUrl, endpoint } = resolveResourcePath(resource);
    if (baseUrl) {
      try {
        await fetch(`${baseUrl}/${endpoint}/${id}`, {
          method: 'DELETE',
        });
      } catch {
        console.warn(`Could not delete ${resource} #${id} on backend`);
      }
    }

    return { data: { id } as any };
  },

  getApiUrl: () => CATALOG_API_URL,
};

export async function getCatalogFacets(): Promise<import('../types/product').CatalogFacets> {
  if (CATALOG_API_URL) {
    try {
      const res = await fetch(`${CATALOG_API_URL}/products/facets`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) return await res.json();
    } catch {
      // Fall through
    }
  }
  return {
    categories: ['coffee_beans', 'espresso_machine', 'grinder', 'cafe_menu'],
    brands: ['Artisan Roasters', 'Breville', "De'Longhi"],
    roast_levels: ['Light', 'Medium Light', 'Medium', 'Medium Dark', 'Dark Espresso'],
    process_methods: ['Washed', 'Natural', 'Pulp Sun-Dried', 'Honey'],
    estates: ['Shakiso Highlands', 'Kalledevarapura Estate'],
    min_price: 22.0,
    max_price: 1199.95,
    total_products: 3,
  };
}

export async function publishProduct(id: string): Promise<import('../types/product').Product> {
  if (CATALOG_API_URL) {
    try {
      const res = await fetch(`${CATALOG_API_URL}/products/${id}/publish`, { method: 'POST', signal: AbortSignal.timeout(10000) });
      if (res.ok) return await res.json();
    } catch {
      // Fall through
    }
  }
  const item = FALLBACK_PIM_PRODUCTS.find((p) => p.id === id) || FALLBACK_PIM_PRODUCTS[0];
  return { ...item, status: 'active' };
}

export async function archiveProduct(id: string): Promise<import('../types/product').Product> {
  if (CATALOG_API_URL) {
    try {
      const res = await fetch(`${CATALOG_API_URL}/products/${id}/archive`, { method: 'POST', signal: AbortSignal.timeout(10000) });
      if (res.ok) return await res.json();
    } catch {
      // Fall through
    }
  }
  const item = FALLBACK_PIM_PRODUCTS.find((p) => p.id === id) || FALLBACK_PIM_PRODUCTS[0];
  return { ...item, status: 'archived' };
}

export async function searchByDimensions(params: {
  max_height_cm?: number;
  max_width_cm?: number;
  max_depth_cm?: number;
  category?: string;
  exclude_id?: string;
}): Promise<import('../types/product').Product[]> {
  if (CATALOG_API_URL) {
    try {
      const q = new URLSearchParams();
      if (params.max_height_cm) q.set('max_height_cm', String(params.max_height_cm));
      if (params.max_width_cm) q.set('max_width_cm', String(params.max_width_cm));
      if (params.max_depth_cm) q.set('max_depth_cm', String(params.max_depth_cm));
      if (params.category) q.set('category', params.category);
      if (params.exclude_id) q.set('exclude_id', params.exclude_id);

      const res = await fetch(`${CATALOG_API_URL}/products/search/by-dimensions?${q.toString()}`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) return await res.json();
    } catch {
      // Fall through
    }
  }
  return FALLBACK_PIM_PRODUCTS.filter((p) => {
    if (params.category && p.category !== params.category) return false;
    if (params.max_height_cm && p.height_cm > params.max_height_cm) return false;
    if (params.exclude_id && p.id === params.exclude_id) return false;
    return true;
  });
}
