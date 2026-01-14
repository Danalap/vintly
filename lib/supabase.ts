import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Profile {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  rating: number;
  rating_count: number;
  stripe_connect_id: string | null;
  is_seller: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  size: string;
  condition: string;
  brand: string | null;
  color: string | null;
  status: "draft" | "available" | "sold" | "archived";
  shipping_weight: "small" | "medium" | "large";
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  product_id: string;
  seller_id: string;
  item_price: number;
  shipping_cost: number;
  platform_fee: number;
  total_amount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
  tracking_number: string | null;
  shipping_address: object;
  created_at: string;
  updated_at: string;
}












