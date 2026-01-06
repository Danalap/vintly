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
const PRICE_RANGES = [
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000 - $3,000", min: 1000, max: 3000 },
  { label: "$3,000 - $5,000", min: 3000, max: 5000 },
  { label: "$5,000+", min: 5000, max: Infinity },
];

// =============================================
// COMPONENTS
// ==============================================

function HeroSection() {
  return (
    <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-sand-100" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A1A1A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-terracotta-500 font-medium mb-4 opacity-0 animate-fade-up">
            The Haute Couture Resale Destination
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal-900 leading-tight tracking-tight opacity-0 animate-fade-up stagger-1">
            Where Runway Meets
            <br />
            <span className="text-terracotta-500">Second Life.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-charcoal-700/70 max-w-xl mx-auto opacity-0 animate-fade-up stagger-2">
            Curated haute couture and rare designer pieces from the world's most prestigious fashion houses. Authenticated. Exceptional. Sustainable.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center opacity-0 animate-fade-up stagger-3">
            <button className="px-8 py-3.5 bg-charcoal-900 text-cream-50 font-medium rounded-full hover:bg-charcoal-800 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Explore Collection
            </button>
            <Link
              href="/sell"
              className="px-8 py-3.5 bg-transparent border-2 border-charcoal-900 text-charcoal-900 font-medium rounded-full hover:bg-charcoal-900 hover:text-cream-50 transition-all text-center"
            >
              Consign Your Pieces
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto opacity-0 animate-fade-up stagger-4">
          {[
            { value: "2k+", label: "Couture Pieces" },
            { value: "100%", label: "Authenticated" },
            { value: "Top 30", label: "Fashion Houses" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-2xl sm:text-3xl font-semibold text-charcoal-900">
                {stat.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-charcoal-700/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FilterSidebarProps {
  selectedSizes: string[];
  onSizeChange: (sizes: string[]) => void;
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  selectedPriceRange: { min: number; max: number } | null;
  onPriceRangeChange: (range: { min: number; max: number } | null) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
}

function FilterSidebar({
  selectedSizes,
  onSizeChange,
  selectedColors,
  onColorChange,
  selectedBrands,
  onBrandChange,
  selectedPriceRange,
  onPriceRangeChange,
  maxPrice,
  onMaxPriceChange,
}: FilterSidebarProps) {
  const [brandOpen, setBrandOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(true);

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

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-charcoal-900">Filters</h3>
          <button
            onClick={() => {
              onSizeChange([]);
              onColorChange([]);
              onBrandChange([]);
              onPriceRangeChange(null);
              onMaxPriceChange(50000);
            }}
            className="text-sm text-terracotta-500 hover:text-terracotta-600 font-medium"
          >
            Clear all
          </button>
        </div>

        {/* Brand Filter */}
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
                  className={`filter-chip px-3 py-1.5 border rounded-full text-xs font-medium ${
                    selectedBrands.includes(brand)
                      ? "active"
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
                  className={`filter-chip px-4 py-2 border rounded-full text-sm font-medium ${
                    selectedSizes.includes(size)
                      ? "active"
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
                  className={`filter-chip flex items-center gap-2 px-3 py-2 border rounded-full text-sm font-medium ${
                    selectedColors.includes(color.name)
                      ? "active"
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
            <div className="mt-3 space-y-4 animate-fade-in">
              {/* Quick Price Ranges */}
              <div className="flex flex-wrap gap-2">
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
                    className={`filter-chip px-3 py-1.5 border rounded-full text-xs font-medium ${
                      selectedPriceRange?.min === range.min &&
                      selectedPriceRange?.max === range.max
                        ? "active"
                        : "border-cream-300 text-charcoal-700 hover:border-charcoal-800"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Price Slider */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-charcoal-700/70">Max Price</span>
                  <span className="text-sm font-medium text-charcoal-800">${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => {
                    onMaxPriceChange(Number(e.target.value));
                    onPriceRangeChange(null);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSizes: string[];
  onSizeChange: (sizes: string[]) => void;
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  selectedPriceRange: { min: number; max: number } | null;
  onPriceRangeChange: (range: { min: number; max: number } | null) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  resultCount: number;
}

function MobileFilterModal({
  isOpen,
  onClose,
  selectedSizes,
  onSizeChange,
  selectedColors,
  onColorChange,
  selectedBrands,
  onBrandChange,
  selectedPriceRange,
  onPriceRangeChange,
  maxPrice,
  onMaxPriceChange,
  resultCount,
}: MobileFilterModalProps) {
  if (!isOpen) return null;

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

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-cream-50 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-cream-50 px-6 py-4 border-b border-cream-300 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-charcoal-900">Filters</h3>
          <button onClick={onClose} className="p-2 text-charcoal-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Designer */}
          <div>
            <h4 className="font-medium text-charcoal-800 mb-3">Designer</h4>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`filter-chip px-4 py-2 border rounded-full text-sm font-medium ${
                    selectedBrands.includes(brand)
                      ? "active"
                      : "border-cream-300 text-charcoal-700"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h4 className="font-medium text-charcoal-800 mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`filter-chip px-5 py-2.5 border rounded-full text-sm font-medium ${
                    selectedSizes.includes(size)
                      ? "active"
                      : "border-cream-300 text-charcoal-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h4 className="font-medium text-charcoal-800 mb-3">Color</h4>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`filter-chip flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium ${
                    selectedColors.includes(color.name)
                      ? "active"
                      : "border-cream-300 text-charcoal-700"
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
          </div>

          {/* Price */}
          <div>
            <h4 className="font-medium text-charcoal-800 mb-3">Price</h4>
            <div className="flex flex-wrap gap-2 mb-4">
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
                  className={`filter-chip px-4 py-2 border rounded-full text-sm font-medium ${
                    selectedPriceRange?.min === range.min &&
                    selectedPriceRange?.max === range.max
                      ? "active"
                      : "border-cream-300 text-charcoal-700"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-charcoal-700/70">Max Price</span>
                <span className="text-sm font-medium text-charcoal-800">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={maxPrice}
                onChange={(e) => {
                  onMaxPriceChange(Number(e.target.value));
                  onPriceRangeChange(null);
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-cream-50 px-6 py-4 border-t border-cream-300 flex gap-3">
          <button
            onClick={() => {
              onSizeChange([]);
              onColorChange([]);
              onBrandChange([]);
              onPriceRangeChange(null);
              onMaxPriceChange(50000);
            }}
            className="flex-1 py-3 border-2 border-charcoal-900 text-charcoal-900 font-medium rounded-xl"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-charcoal-900 text-cream-50 font-medium rounded-xl"
          >
            Show {resultCount} Items
          </button>
        </div>
      </div>
    </div>
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

  // Check if product is in favorites on mount
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
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <div
      onClick={handleCardClick}
      className={`product-card group opacity-0 animate-fade-up stagger-${(index % 8) + 1} cursor-pointer`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-sand-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="product-image w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sand-200">
            <span className="text-4xl">👕</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Actions */}
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
          {/* Delete button for user listings */}
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

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {/* Your Listing Badge */}
          {product.isUserListing && (
            <span className="px-2.5 py-1 bg-sage-500 text-white backdrop-blur-md rounded-full text-xs font-medium">
              Your Listing
            </span>
          )}
          {/* Condition Badge */}
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-medium text-charcoal-800">
            {product.condition}
          </span>
        </div>

        {/* Quick Buy - Mobile */}
        <button className="absolute bottom-3 left-3 right-3 py-2.5 bg-white/95 backdrop-blur-md rounded-xl text-sm font-medium text-charcoal-900 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hidden sm:block">
          Quick View
        </button>
      </div>

      {/* Content */}
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
          <span className="text-lg font-semibold text-charcoal-900">${product.price}</span>
          <div className="flex items-center gap-1.5">
            {product.sellerAvatar && (
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-cream-300"
              />
            )}
            <span className="text-xs text-charcoal-700/70">{product.sellerName}</span>
          </div>
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

function ProductGrid() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [userListings, setUserListings] = useState<Product[]>([]);

  // Load user listings from localStorage on mount
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

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0 && !selectedColors.includes(product.color)) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price range filter
      if (selectedPriceRange) {
        if (
          product.price < selectedPriceRange.min ||
          product.price > selectedPriceRange.max
        ) {
          return false;
        }
      } else if (product.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [selectedSizes, selectedPriceRange, maxPrice]);

  const activeFilterCount =
    selectedSizes.length + selectedColors.length + selectedBrands.length + (selectedPriceRange ? 1 : 0) + (maxPrice < 50000 ? 1 : 0);

  return (
    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal-900">
              Haute Couture Collection
            </h2>
            <p className="mt-1 text-sm text-charcoal-700/60">
              {filteredProducts.length} items available
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-sand-100 rounded-full text-sm font-medium text-charcoal-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-charcoal-900 text-cream-50 text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedSizes={selectedSizes}
              onSizeChange={setSelectedSizes}
              selectedColors={selectedColors}
              onColorChange={setSelectedColors}
              selectedBrands={selectedBrands}
              onBrandChange={setSelectedBrands}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={setSelectedPriceRange}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
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
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={() => {
                    setSelectedSizes([]);
                    setSelectedPriceRange(null);
                    setMaxPrice(200);
                  }}
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
      <MobileFilterModal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        selectedSizes={selectedSizes}
        onSizeChange={setSelectedSizes}
        selectedColors={selectedColors}
        onColorChange={setSelectedColors}
        selectedBrands={selectedBrands}
        onBrandChange={setSelectedBrands}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={setSelectedPriceRange}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        resultCount={filteredProducts.length}
      />
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-semibold text-cream-50">vintly</span>
            <p className="mt-3 text-sm text-cream-200/60 max-w-xs">
              The premier destination for pre-owned haute couture. Where exceptional craftsmanship finds its next chapter.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-cream-50 mb-4">Collections</h4>
            <ul className="space-y-3 text-sm text-cream-200/60">
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  All Pieces
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  Gowns & Dresses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  Handbags
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  Jewelry & Accessories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-cream-50 mb-4">Consignment</h4>
            <ul className="space-y-3 text-sm text-cream-200/60">
              <li>
                <Link href="/sell" className="hover:text-cream-50 transition-colors">
                  Submit Your Piece
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  Authentication Process
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  Pricing Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-cream-50 mb-4">About</h4>
            <ul className="space-y-3 text-sm text-cream-200/60">
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream-50 transition-colors">
                  White Glove Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream-100/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream-200/40">© 2024 Vintly. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-cream-200/40">
            <a href="#" className="hover:text-cream-50 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-cream-50 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// =============================================
// MAIN PAGE
// =============================================
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ProductGrid />
      <Footer />
    </main>
  );
}

