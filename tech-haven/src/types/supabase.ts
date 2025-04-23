export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          stock: number;
          images: string[];
          specs: Record<string, unknown>;
          is_featured: boolean;
          discount_percent?: number;
          brand: string;
          sku: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          stock: number;
          images?: string[];
          specs?: Record<string, unknown>;
          is_featured?: boolean;
          discount_percent?: number;
          brand: string;
          sku: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string;
          price?: number;
          category_id?: string;
          stock?: number;
          images?: string[];
          specs?: Record<string, unknown>;
          is_featured?: boolean;
          discount_percent?: number;
          brand?: string;
          sku?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          parent_id?: string;
          image?: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          parent_id?: string;
          image?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          parent_id?: string;
          image?: string;
        };
      };
      pc_builds: {
        Row: {
          id: string;
          created_at: string;
          user_id?: string;
          name: string;
          components: Record<string, string>;
          total_price: number;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string;
          name: string;
          components: Record<string, string>;
          total_price: number;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          name?: string;
          components?: Record<string, string>;
          total_price?: number;
          is_public?: boolean;
        };
      };
      promotions: {
        Row: {
          id: string;
          name: string;
          code: string;
          discount_percent: number;
          discount_amount?: number;
          start_date: string;
          end_date: string;
          is_active: boolean;
          applies_to: string[];
          min_purchase?: number;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          discount_percent: number;
          discount_amount?: number;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          applies_to?: string[];
          min_purchase?: number;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          discount_percent?: number;
          discount_amount?: number;
          start_date?: string;
          end_date?: string;
          is_active?: boolean;
          applies_to?: string[];
          min_purchase?: number;
        };
      };
      bundles: {
        Row: {
          id: string;
          name: string;
          description: string;
          products: string[];
          total_price: number;
          discounted_price: number;
          is_active: boolean;
          image?: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          products: string[];
          total_price: number;
          discounted_price: number;
          is_active?: boolean;
          image?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          products?: string[];
          total_price?: number;
          discounted_price?: number;
          is_active?: boolean;
          image?: string;
        };
      };
    };
  };
};