export interface Listing {
  listing_id: string;
  user_id: string;
  item_name: string;
  price: number;
  details?: string;
  is_sold?: boolean;
  location?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  created_at: Date;
}
