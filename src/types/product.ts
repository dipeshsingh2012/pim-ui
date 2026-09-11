export interface ProductVariant {
  id?: string;
  size: string;
  weight_grams?: number;
  price: number;
  compare_at_price?: number | null;
  sku?: string;
  available?: boolean;
}

export interface ProductImage {
  position?: number;
  src: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  brand: string;
  sku: string;
  category: string;
  price: number;
  compare_at_price?: number | null;
  status: 'active' | 'draft' | 'archived';
  in_stock: boolean;
  badge?: string | null;
  rating: number;
  review_count: number;
  tax_category: string;

  // Physical Dimensions & Clearances
  width_cm: number;
  height_cm: number;
  depth_cm: number;
  weight_kg?: number | null;
  top_clearance_cm: number;
  side_clearance_cm: number;
  rear_clearance_cm: number;

  // Specialty Coffee Terroir & Craft
  roast_level?: string | null;
  process_method?: string | null;
  estate_name?: string | null;
  region?: string | null;
  elevation_m?: number | null;
  varietal?: string | null;
  resting_period_days?: number | null;
  acidity?: string | null;
  bitterness?: string | null;
  body?: string | null;
  best_enjoyed?: string | null;

  // Media & Description
  image_url?: string | null;
  cutout_url?: string | null;
  description?: string | null;

  // Rich Collections
  taste_notes?: string[] | null;
  recommended_brew_methods?: string[] | null;
  variants?: ProductVariant[] | null;
  images?: ProductImage[] | null;

  // Legacy compatibility
  taste_notes_json?: string | null;
  specs_json?: string | null;
}

export interface CatalogFacets {
  categories: string[];
  brands: string[];
  roast_levels: string[];
  process_methods: string[];
  estates: string[];
  min_price: number;
  max_price: number;
  total_products: number;
}

export type ProductFormValues = Omit<Product, 'rating' | 'review_count'>;
