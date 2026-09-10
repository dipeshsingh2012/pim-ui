import type { DataProvider } from '@refinedev/core';

export const API_URL = import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:8001/api/v1';

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters }) => {
    const current = pagination?.currentPage ?? (pagination as any)?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 50;
    const offset = (current - 1) * pageSize;

    const params = new URLSearchParams();
    params.set('offset', String(offset));
    params.set('limit', String(pageSize));

    if (filters) {
      for (const filter of filters) {
        if ('field' in filter && filter.value !== undefined && filter.value !== null && filter.value !== '') {
          if (filter.field === 'q' || filter.field === 'search') {
            params.set('q', String(filter.value));
          } else if (filter.field === 'category') {
            params.set('category', String(filter.value));
          } else if (filter.field === 'status') {
            params.set('status', String(filter.value));
          } else if (filter.field === 'brand') {
            params.set('brand', String(filter.value));
          }
        }
      }
    }

    const response = await fetch(`${API_URL}/${resource}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
    }

    const json = await response.json();
    return {
      data: json.items ?? [],
      total: json.total ?? 0,
    };
  },

  getOne: async ({ resource, id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource} #${id}: ${response.statusText}`);
    }
    const data = await response.json();
    return { data };
  },

  create: async ({ resource, variables }) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variables),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(err.detail || `Failed to create ${resource}`);
    }

    const data = await response.json();
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variables),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(err.detail || `Failed to update ${resource} #${id}`);
    }

    const data = await response.json();
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${resource} #${id}`);
    }

    return { data: { id } as any };
  },

  getApiUrl: () => API_URL,
};
