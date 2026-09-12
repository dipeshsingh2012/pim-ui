export interface LaneItem {
  id: string;
  product_id?: string | null;
  title: string;
  subtitle?: string | null;
  image_url: string;
  target_url: string;
  badge?: string | null;
  price?: string | null;
  sort_order: number;
}

export interface ContentLane {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  lane_type: 'category_lane' | 'product_lane';
  placement: 'homepage' | 'discovery' | 'all';
  card_style: 'circular' | 'standard_card';
  has_navigation_arrows: boolean;
  status: 'active' | 'draft' | 'archived';
  sort_order: number;
  items: LaneItem[];
  created_at?: string;
  updated_at?: string;
}

export type LaneFormValues = Omit<ContentLane, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};
