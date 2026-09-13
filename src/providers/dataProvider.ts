import type { DataProvider } from '@refinedev/core';
import type { Product } from '../types/product';

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

export const FALLBACK_PIM_PRODUCTS: Product[] = [];
export const FALLBACK_LANES: any[] = [];

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
      } catch (e) {
        console.error(`Could not reach ${resource} at ${baseUrl}:`, e);
      }
    }

    return {
      data: [],
      total: 0,
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
      } catch (e) {
        console.error(`Could not reach ${resource} #${id} at ${baseUrl}:`, e);
      }
    }
    throw new Error(`Item #${id} not found in ${resource}`);
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
    categories: [],
    brands: [],
    roast_levels: [],
    process_methods: [],
    estates: [],
    min_price: 0,
    max_price: 0,
    total_products: 0,
  };
}

export async function publishProduct(id: string): Promise<import('../types/product').Product> {
  if (CATALOG_API_URL) {
    const res = await fetch(`${CATALOG_API_URL}/products/${id}/publish`, { method: 'POST', signal: AbortSignal.timeout(10000) });
    if (res.ok) return await res.json();
  }
  throw new Error(`Failed to publish product #${id}`);
}

export async function archiveProduct(id: string): Promise<import('../types/product').Product> {
  if (CATALOG_API_URL) {
    const res = await fetch(`${CATALOG_API_URL}/products/${id}/archive`, { method: 'POST', signal: AbortSignal.timeout(10000) });
    if (res.ok) return await res.json();
  }
  throw new Error(`Failed to archive product #${id}`);
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
  return [];
}
