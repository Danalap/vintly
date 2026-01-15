import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo user ID - in production, this would come from authenticated session
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";
const DEMO_USERNAME = "demo_seller";

// Ensure demo profile exists
async function ensureDemoProfile() {
  // Check if demo profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", DEMO_USER_ID)
    .single();

  if (!existingProfile) {
    // Create demo profile - this will fail if auth.users doesn't have this ID
    // For demo purposes, we'll handle the error gracefully
    console.log("Demo profile doesn't exist - products will be created with available user");
  }

  return existingProfile;
}

// Upload base64 image to Supabase Storage
async function uploadImage(
  base64Image: string,
  productId: string,
  index: number
): Promise<string | null> {
  try {
    // Extract base64 data
    const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      console.error("Invalid base64 image format");
      return null;
    }

    const imageType = matches[1];
    const base64Data = matches[2];
    
    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Generate unique filename
    const fileName = `${productId}/${index}_${Date.now()}.${imageType}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, bytes, {
        contentType: `image/${imageType}`,
        upsert: true,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let query = supabase
      .from("products")
      .select(`
        *,
        images (url, order_index)
      `)
      .eq("status", "available")
      .order("created_at", { ascending: false });

    // Apply filters
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (size) {
      query = query.eq("size", size);
    }
    if (minPrice) {
      query = query.gte("price", parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price", parseFloat(maxPrice));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data || [] });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      category,
      size,
      condition,
      brand,
      color,
      shippingWeight,
      photos,
      sellerId, // Optional - for when we have real auth
    } = body;

    // Validate required fields
    if (!title || !price || !category || !size || !condition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For demo: use provided sellerId or try to get first available profile
    let effectiveSellerId = sellerId;
    
    if (!effectiveSellerId) {
      // Try to get any existing profile for demo
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);
      
      if (profiles && profiles.length > 0) {
        effectiveSellerId = profiles[0].id;
      } else {
        // No profiles exist - return error with helpful message
        return NextResponse.json(
          { 
            error: "No seller profile found. Please create a user account first.",
            details: "The products table requires a valid seller_id that references the profiles table." 
          },
          { status: 400 }
        );
      }
    }

    // Map category values to match database enum
    const categoryMap: Record<string, string> = {
      gowns: "dresses",
      suits: "other",
      watches: "accessories",
      // Direct mappings
      tops: "tops",
      bottoms: "bottoms",
      dresses: "dresses",
      outerwear: "outerwear",
      shoes: "shoes",
      accessories: "accessories",
      bags: "bags",
      jewelry: "jewelry",
      activewear: "activewear",
      swimwear: "swimwear",
      other: "other",
    };

    // Map size values to match database enum
    const sizeMap: Record<string, string> = {
      "One Size": "ONE_SIZE",
      XXS: "XXS",
      XS: "XS",
      S: "S",
      M: "M",
      L: "L",
      XL: "XL",
      XXL: "XXL",
      XXXL: "XXXL",
    };

    // Map condition values  
    const conditionMap: Record<string, string> = {
      new_with_tags: "new_with_tags",
      like_new: "like_new",
      good: "good",
      fair: "fair",
    };

    // 1. Create the product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        seller_id: effectiveSellerId,
        title,
        description: description || null,
        price: parseFloat(price),
        category: categoryMap[category] || "other",
        size: sizeMap[size] || size,
        condition: conditionMap[condition] || condition,
        brand: brand || null,
        color: color || null,
        status: "available",
        shipping_weight: shippingWeight || "medium",
      })
      .select()
      .single();

    if (productError) {
      console.error("Error creating product:", productError);
      return NextResponse.json(
        { error: productError.message, details: productError },
        { status: 500 }
      );
    }

    // 2. Upload images and create image records
    const uploadedImageUrls: string[] = [];
    
    if (photos && photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        if (photo.startsWith("data:")) {
          // Upload base64 image
          const uploadedUrl = await uploadImage(photo, product.id, i);
          if (uploadedUrl) {
            uploadedImageUrls.push(uploadedUrl);
          }
        } else {
          // Already a URL
          uploadedImageUrls.push(photo);
        }
      }

      // 3. Create image records
      if (uploadedImageUrls.length > 0) {
        const imageRecords = uploadedImageUrls.map((url, index) => ({
          product_id: product.id,
          url,
          order_index: index,
        }));

        const { error: imagesError } = await supabase
          .from("images")
          .insert(imageRecords);

        if (imagesError) {
          console.error("Error creating image records:", imagesError);
          // Continue - product was created successfully
        }
      }
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        images: uploadedImageUrls.map((url, i) => ({ url, order_index: i })),
      },
    });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

