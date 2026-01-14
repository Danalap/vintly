"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  X,
  Grid3X3,
  LayoutGrid,
  ArrowUpDown,
} from "lucide-react";
import Header from "@/components/Header";
import { getListings, deleteListing, type Listing } from "@/lib/listings-store";
import { isFavorite, toggleFavorite } from "@/lib/favorites-store";

// =============================================
// TYPES
// =============================================
interface Product {
  id: string;
  title: string;
  price: number;
  size: string;
  brand: string;
  color: string;
  condition: string;
  category: string;
  imageUrl: string;
  sellerName: string;
  sellerAvatar: string;
  likes: number;
  isUserListing?: boolean;
}

// =============================================
// DUMMY DATA
// =============================================
const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Chanel Classic Flap Bag Medium Caviar",
    price: 4850,
    size: "One Size",
    brand: "Chanel",
    color: "Black",
    condition: "Like New",
    category: "bags",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    sellerName: "Alexandra",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    likes: 342,
  },
  {
    id: "2",
    title: "Dior Bar Jacket Wool Silk Blend",
    price: 2890,
    size: "S",
    brand: "Dior",
    color: "Navy",
    condition: "Excellent",
    category: "outerwear",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    sellerName: "Margaux",
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    likes: 189,
  },
  {
    id: "3",
    title: "Hermès Birkin 30 Togo Leather",
    price: 12500,
    size: "One Size",
    brand: "Hermès",
    color: "Gold",
    condition: "Excellent",
    category: "bags",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    sellerName: "Isabelle",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    likes: 567,
  },
  {
    id: "4",
    title: "Valentino Haute Couture Gown Silk",
    price: 8900,
    size: "XS",
    brand: "Valentino",
    color: "Red",
    condition: "Like New",
    category: "dresses",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
    sellerName: "Victoria",
    sellerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    likes: 423,
  },
  {
    id: "5",
    title: "Louboutin So Kate 120mm Patent",
    price: 595,
    size: "M",
    brand: "Christian Louboutin",
    color: "Black",
    condition: "Good",
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop",
    sellerName: "Camille",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    likes: 234,
  },
  {
    id: "6",
    title: "Gucci GG Marmont Velvet Mini Bag",
    price: 1290,
    size: "One Size",
    brand: "Gucci",
    color: "Pink",
    condition: "Excellent",
    category: "bags",
    imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=800&fit=crop",
    sellerName: "Sophie",
    sellerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    likes: 178,
  },
  {
    id: "7",
    title: "Balmain Embellished Tweed Blazer",
    price: 2450,
    size: "S",
    brand: "Balmain",
    color: "White",
    condition: "Like New",
    category: "outerwear",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    sellerName: "Anastasia",
    sellerAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    likes: 156,
  },
  {
    id: "8",
    title: "Givenchy Antigona Medium Leather",
    price: 1650,
    size: "One Size",
    brand: "Givenchy",
    color: "Black",
    condition: "Excellent",
    category: "bags",
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop",
    sellerName: "Natalia",
    sellerAvatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
    likes: 198,
  },
  {
    id: "9",
    title: "Saint Laurent Le Smoking Jacket",
    price: 3200,
    size: "M",
    brand: "Saint Laurent",
    color: "Black",
    condition: "Like New",
    category: "outerwear",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    sellerName: "Elena",
    sellerAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop",
    likes: 267,
  },
  {
    id: "10",
    title: "Oscar de la Renta Floral Gown",
    price: 5400,
    size: "S",
    brand: "Oscar de la Renta",
    color: "Multi",
    condition: "Excellent",
    category: "dresses",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
    sellerName: "Gabrielle",
    sellerAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
    likes: 312,
  },
  {
    id: "11",
    title: "Prada Re-Edition 2005 Nylon Bag",
    price: 890,
    size: "One Size",
    brand: "Prada",
    color: "Black",
    condition: "Like New",
    category: "bags",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    sellerName: "Chiara",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    likes: 145,
  },
  {
    id: "12",
    title: "Versace Medusa Head Silk Blouse",
    price: 1100,
    size: "M",
    brand: "Versace",
    color: "Gold",
    condition: "Excellent",
    category: "tops",
    imageUrl: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop",
    sellerName: "Francesca",
    sellerAvatar: "https://images.unsplash.com/photo-1546961342-ea5f71b193f3?w=100&h=100&fit=crop",
    likes: 189,
  },
];

const SIZES = ["XS", "S", "M", "L", "XL", "One Size"];
const COLORS = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Red", hex: "#DC143C" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Beige", hex: "#d4c4a8" },
  { name: "Multi", hex: "linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6)" },
];
const BRANDS = ["Chanel", "Dior", "Hermès", "Valentino", "Christian Louboutin", "Gucci", "Balmain", "Givenchy", "Saint Laurent", "Oscar de la Renta", "Prada", "Versace"];
const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "bags", label: "Handbags" },
  { value: "dresses", label: "Dresses & Gowns" },
  { value: "outerwear", label: "Outerwear" },
  { value: "tops", label: "Tops & Blouses" },
  { value: "shoes", label: "Shoes" },
  { value: "jewelry", label: "Jewelry" },
  { value: "accessories", label: "Accessories" },
];
const CONDITIONS = ["New with Tags", "Like New", "Excellent", "Good"];
const PRICE_RANGES = [
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000 - $3,000", min: 1000, max: 3000 },
  { label: "$3,000 - $5,000", min: 3000, max: 5000 },
  { label: "$5,000+", min: 5000, max: Infinity },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

// =============================================
// COMPONENTS
// =============================================

interface FilterSidebarProps {
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  selectedSizes: string[];
  onSizeChange: (sizes: string[]) => void;
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  selectedConditions: string[];
  onConditionChange: (conditions: string[]) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriceRange: { min: number; max: number } | null;
  onPriceRangeChange: (range: { min: number; max: number } | null) => void;
  onClearAll: () => void;
}

function FilterSidebar({
  selectedBrands,
  onBrandChange,
  selectedSizes,
  onSizeChange,
  selectedColors,
  onColorChange,
  selectedConditions,
  onConditionChange,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  onClearAll,
}: FilterSidebarProps) {
  const [brandOpen, setBrandOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(true);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizeChange(selectedSizes.filter((s) => s !== size));
    } else {
      onSizeChange([...selectedSizes, size]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorChange(selectedColors.filter((c) => c !== color));
    } else {
      onColorChange([...selectedColors, color]);
    }
  };

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      onConditionChange(selectedConditions.filter((c) => c !== condition));
    } else {
      onConditionChange([...selectedConditions, condition]);
    }
  };

  const activeFilterCount = 
    selectedBrands.length + 
    selectedSizes.length + 
    selectedColors.length + 
    selectedConditions.length + 
    (selectedCategory !== "all" ? 1 : 0) + 
    (selectedPriceRange ? 1 : 0);

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-24 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-charcoal-900">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-charcoal-900 text-cream-50 text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </h3>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-terracotta-500 hover:text-terracotta-600 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="border-t border-cream-300 pt-4">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="font-medium text-charcoal-800">Category</span>
            <ChevronDown
              className={`w-4 h-4 text-charcoal-700 transition-transform ${
                categoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {categoryOpen && (
            <div className="mt-2 space-y-1 animate-fade-in">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                  className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-charcoal-900 text-cream-50"
                      : "text-charcoal-700 hover:bg-sand-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Designer Filter */}
        <div className="border-t border-cream-300 pt-4">
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="font-medium text-charcoal-800">Designer</span>
            <ChevronDown
              className={`w-4 h-4 text-charcoal-700 transition-transform ${
                brandOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {brandOpen && (
            <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`filter-chip px-3 py-1.5 border rounded-full text-xs font-medium transition-all ${
                    selectedBrands.includes(brand)
                      ? "border-charcoal-900 bg-charcoal-900 text-cream-50"
                      : "border-cream-300 text-charcoal-700 hover:border-charcoal-800"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Size Filter */}
        <div className="border-t border-cream-300 pt-4">
          <button
            onClick={() => setSizeOpen(!sizeOpen)}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="font-medium text-charcoal-800">Size</span>
            <ChevronDown
              className={`w-4 h-4 text-charcoal-700 transition-transform ${
                sizeOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {sizeOpen && (
            <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`filter-chip px-4 py-2 border rounded-full text-sm font-medium transition-all ${
                    selectedSizes.includes(size)
                      ? "border-charcoal-900 bg-charcoal-900 text-cream-50"
                      : "border-cream-300 text-charcoal-700 hover:border-charcoal-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className="border-t border-cream-300 pt-4">
          <button
            onClick={() => setColorOpen(!colorOpen)}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="font-medium text-charcoal-800">Color</span>
            <ChevronDown
              className={`w-4 h-4 text-charcoal-700 transition-transform ${
                colorOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {colorOpen && (
            <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`filter-chip flex items-center gap-2 px-3 py-2 border rounded-full text-sm font-medium transition-all ${
                    selectedColors.includes(color.name)
                      ? "border-charcoal-900 bg-charcoal-900/5"
                      : "border-cream-300 text-charcoal-700 hover:border-charcoal-800"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-cream-400"
                    style={{ background: color.hex }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Condition Filter */}
        <div className="border-t border-cream-300 pt-4">
          <button
            onClick={() => setConditionOpen(!conditionOpen)}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="font-medium text-charcoal-800">Condition</span>
            <ChevronDown
              className={`w-4 h-4 text-charcoal-700 transition-transform ${
                conditionOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {conditionOpen && (
            <div className="mt-3 space-y-2 animate-fade-in">
              {CONDITIONS.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(condition)}
                    onChange={() => toggleCondition(condition)}
                    className="w-4 h-4 rounded border-cream-400 text-charcoal-900 focus:ring-charcoal-900"
                  />
                  <span className="text-sm text-charcoal-700">{condition}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="border-t border-cream-300 pt-4">
          <button
            onClick={() => setPriceOpen(!priceOpen)}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="font-medium text-charcoal-800">Price</span>
            <ChevronDown
              className={`w-4 h-4 text-charcoal-700 transition-transform ${
                priceOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {priceOpen && (
            <div className="mt-3 space-y-2 animate-fade-in">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    if (
                      selectedPriceRange?.min === range.min &&
                      selectedPriceRange?.max === range.max
                    ) {
                      onPriceRangeChange(null);
                    } else {
                      onPriceRangeChange(range);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    selectedPriceRange?.min === range.min &&
                    selectedPriceRange?.max === range.max
                      ? "bg-charcoal-900 text-cream-50"
                      : "text-charcoal-700 hover:bg-sand-100"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function ProductCard({ 
  product, 
  index, 
  onDelete 
}: { 
  product: Product; 
  index: number;
  onDelete?: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLiked(isFavorite(product.id));
  }, [product.id]);

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFavorite = toggleFavorite({
      id: product.id,
      title: product.title,
      price: product.price,
      brand: product.brand,
      imageUrl: product.imageUrl,
      size: product.size,
      condition: product.condition,
    });
    setLiked(isNowFavorite);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <div
      onClick={handleCardClick}
      className="product-card group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-sand-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="product-image w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sand-200">
            <span className="text-4xl">👜</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              liked
                ? "bg-terracotta-500 text-white"
                : "bg-white/90 text-charcoal-700 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          </button>
          {product.isUserListing && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Delete this listing?")) {
                  onDelete(product.id);
                }
              }}
              className="p-2.5 rounded-full backdrop-blur-md bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isUserListing && (
            <span className="px-2.5 py-1 bg-sage-500 text-white backdrop-blur-md rounded-full text-xs font-medium">
              Your Listing
            </span>
          )}
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-medium text-charcoal-800">
            {product.condition}
          </span>
        </div>

        <button className="absolute bottom-3 left-3 right-3 py-2.5 bg-white/95 backdrop-blur-md rounded-xl text-sm font-medium text-charcoal-900 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hidden sm:block">
          Quick View
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-charcoal-800 line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-700/60">{product.brand}</span>
          <span className="text-charcoal-700/30">•</span>
          <span className="text-xs text-charcoal-700/60">Size {product.size}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-charcoal-900">${product.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// Helper to convert condition codes to display names
const conditionLabels: Record<string, string> = {
  new_with_tags: "New with Tags",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};

// Convert a Listing to a Product for display
function listingToProduct(listing: Listing): Product {
  return {
    id: listing.id,
    title: listing.title,
    price: listing.price,
    size: listing.size,
    brand: listing.brand || "No Brand",
    color: listing.color || "Multi",
    condition: conditionLabels[listing.condition] || listing.condition,
    category: listing.category,
    imageUrl: listing.photos[0] || "",
    sellerName: listing.sellerName,
    sellerAvatar: listing.sellerAvatar,
    likes: listing.likes,
    isUserListing: true,
  };
}

// =============================================
// MAIN BROWSE PAGE
// =============================================
export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [userListings, setUserListings] = useState<Product[]>([]);

  // Load user listings
  useEffect(() => {
    const listings = getListings();
    setUserListings(listings.map(listingToProduct));
  }, []);

  // Combine user listings with dummy products
  const allProducts = useMemo(() => {
    return [...userListings, ...DUMMY_PRODUCTS];
  }, [userListings]);

  // Handle delete listing
  const handleDeleteListing = (id: string) => {
    deleteListing(id);
    setUserListings((prev) => prev.filter((p) => p.id !== id));
  };

  // Clear all filters
  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedConditions([]);
    setSelectedCategory("all");
    setSelectedPriceRange(null);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !product.title.toLowerCase().includes(query) &&
          !product.brand.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0 && !selectedColors.includes(product.color)) {
        return false;
      }

      // Condition filter
      if (selectedConditions.length > 0 && !selectedConditions.includes(product.condition)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (selectedPriceRange) {
        if (product.price < selectedPriceRange.min || product.price > selectedPriceRange.max) {
          return false;
        }
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.likes - a.likes);
        break;
      default:
        // newest - keep original order (user listings first)
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedBrands, selectedSizes, selectedColors, selectedConditions, selectedCategory, selectedPriceRange, sortBy]);

  const activeFilterCount = 
    selectedBrands.length + 
    selectedSizes.length + 
    selectedColors.length + 
    selectedConditions.length + 
    (selectedCategory !== "all" ? 1 : 0) + 
    (selectedPriceRange ? 1 : 0);

  return (
    <main className="min-h-screen bg-cream-50">
      <Header />

      {/* Page Header */}
      <div className="pt-24 sm:pt-28 pb-6 bg-gradient-to-b from-sand-100 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal-900">
            Browse Collection
          </h1>
          <p className="mt-2 text-charcoal-700/70">
            Discover authenticated haute couture from the world&apos;s finest fashion houses
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-700/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by designer, style, or keyword..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-cream-300 rounded-full text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 focus:ring-1 focus:ring-charcoal-800 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-sand-100"
                >
                  <X className="w-4 h-4 text-charcoal-700" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-charcoal-700/70">
            <span className="font-medium text-charcoal-900">{filteredProducts.length}</span> pieces found
          </p>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-cream-300 rounded-full text-sm font-medium text-charcoal-800"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-charcoal-900 text-cream-50 text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-cream-300 rounded-full text-sm font-medium text-charcoal-800 focus:outline-none focus:border-charcoal-800 cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-700/50 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedBrands={selectedBrands}
              onBrandChange={setSelectedBrands}
              selectedSizes={selectedSizes}
              onSizeChange={setSelectedSizes}
              selectedColors={selectedColors}
              onColorChange={setSelectedColors}
              selectedConditions={selectedConditions}
              onConditionChange={setSelectedConditions}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={setSelectedPriceRange}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-sand-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-charcoal-700/40" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal-800">
                  No items found
                </h3>
                <p className="mt-2 text-charcoal-700/60">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-4 text-terracotta-500 font-medium hover:text-terracotta-600"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    onDelete={product.isUserListing ? handleDeleteListing : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-cream-50 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-cream-50 px-6 py-4 border-b border-cream-300 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-charcoal-900">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-charcoal-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <FilterSidebar
                selectedBrands={selectedBrands}
                onBrandChange={setSelectedBrands}
                selectedSizes={selectedSizes}
                onSizeChange={setSelectedSizes}
                selectedColors={selectedColors}
                onColorChange={setSelectedColors}
                selectedConditions={selectedConditions}
                onConditionChange={setSelectedConditions}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedPriceRange={selectedPriceRange}
                onPriceRangeChange={setSelectedPriceRange}
                onClearAll={handleClearAll}
              />
            </div>

            <div className="sticky bottom-0 bg-cream-50 px-6 py-4 border-t border-cream-300 flex gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 py-3 border-2 border-charcoal-900 text-charcoal-900 font-medium rounded-xl"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-charcoal-900 text-cream-50 font-medium rounded-xl"
              >
                Show {filteredProducts.length} Items
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}











