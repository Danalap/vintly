// =============================================
// SUPABASE PRODUCTS SERVICE
// =============================================
import { supabase } from "./supabase";

export interface SupabaseProduct {
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
  // Joined data
  images?: { url: string; order_index: number }[];
  seller?: {
    username: string;
    avatar_url: string | null;
    rating: number;
  };
}

export interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  category: string;
  size: string;
  condition: string;
  brand?: string;
  color?: string;
  shipping_weight: string;
  photos: string[]; // base64 or URLs
}

// Upload image to Supabase Storage
export async function uploadProductImage(
  base64Image: string,
  productId: string,
  index: number
): Promise<string | null> {
  try {
    // Convert base64 to blob
    const base64Data = base64Image.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    // Generate unique filename
    const fileName = `${productId}/${index}_${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadProductImage:", error);
    return null;
  }
}

// Create a new product with images
export async function createProduct(
  input: CreateProductInput,
  sellerId: string
): Promise<{ success: boolean; product?: SupabaseProduct; error?: string }> {
  try {
    // 1. Create the product record first
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        seller_id: sellerId,
        title: input.title,
        description: input.description || null,
        price: input.price,
        category: input.category,
        size: input.size,
        condition: input.condition,
        brand: input.brand || null,
        color: input.color || null,
        status: "available",
        shipping_weight: input.shipping_weight,
      })
      .select()
      .single();

    if (productError) {
      console.error("Error creating product:", productError);
      return { success: false, error: productError.message };
    }

    // 2. Upload images and create image records
    const imageUrls: string[] = [];
    for (let i = 0; i < input.photos.length; i++) {
      const photo = input.photos[i];
      
      // Check if it's a base64 image or URL
      if (photo.startsWith("data:")) {
        const uploadedUrl = await uploadProductImage(photo, product.id, i);
        if (uploadedUrl) {
          imageUrls.push(uploadedUrl);
        }
      } else {
        // Already a URL
        imageUrls.push(photo);
      }
    }

    // 3. Create image records in the images table
    if (imageUrls.length > 0) {
      const imageRecords = imageUrls.map((url, index) => ({
        product_id: product.id,
        url,
        order_index: index,
      }));

      const { error: imagesError } = await supabase
        .from("images")
        .insert(imageRecords);

      if (imagesError) {
        console.error("Error creating image records:", imagesError);
        // Product was created, but images failed - still return success
      }
    }

    return {
      success: true,
      product: { ...product, images: imageUrls.map((url, i) => ({ url, order_index: i })) },
    };
  } catch (error) {
    console.error("Error in createProduct:", error);
    return { success: false, error: "Failed to create product" };
  }
}

// Get all available products
export async function getProducts(filters?: {
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  condition?: string;
}): Promise<SupabaseProduct[]> {
  try {
    let query = supabase
      .from("products")
      .select(`
        *,
        images (url, order_index),
        seller:profiles!seller_id (username, avatar_url, rating)
      `)
      .eq("status", "available")
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.size) {
      query = query.eq("size", filters.size);
    }
    if (filters?.minPrice) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters?.brand) {
      query = query.eq("brand", filters.brand);
    }
    if (filters?.condition) {
      query = query.eq("condition", filters.condition);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
}

// Get a single product by ID
export async function getProduct(id: string): Promise<SupabaseProduct | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        images (url, order_index),
        seller:profiles!seller_id (username, avatar_url, rating)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }

    // Increment view count
    await supabase
      .from("products")
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq("id", id);

    return data;
  } catch (error) {
    console.error("Error in getProduct:", error);
    return null;
  }
}

// Get products by seller
export async function getSellerProducts(sellerId: string): Promise<SupabaseProduct[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        images (url, order_index)
      `)
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching seller products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getSellerProducts:", error);
    return [];
  }
}

// Delete a product
export async function deleteProduct(id: string, sellerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("seller_id", sellerId);

    if (error) {
      console.error("Error deleting product:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return false;
  }
}

// Update product status
export async function updateProductStatus(
  id: string,
  status: "available" | "sold" | "archived"
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("products")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating product status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateProductStatus:", error);
    return false;
  }
}

