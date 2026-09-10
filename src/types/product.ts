export interface Product {
  id: string;
  name: string;
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
  width_cm: number;
  height_cm: number;
  depth_cm: number;
  weight_kg?: number | null;
  top_clearance_cm: number;
  side_clearance_cm: number;
  rear_clearance_cm: number;
  image_url?: string | null;
  cutout_url?: string | null;
  description?: string | null;
  taste_notes_json?: string | null;
  specs_json?: string | null;
}

export type ProductFormValues = Omit<Product, 'rating' | 'review_count'>;
