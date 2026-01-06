"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageCircle,
  Star,
  X,
  MapPin,
  Calendar,
  Award,
  Send,
  Image as ImageIcon,
  Package,
  CreditCard,
  Lock,
  Sparkles,
} from "lucide-react";
import { getListings, type Listing } from "@/lib/listings-store";
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
  description?: string;
  imageUrl: string;
  photos?: string[];
  sellerName: string;
  sellerAvatar: string;
  likes: number;
  isUserListing?: boolean;
}

// =============================================
// DUMMY DATA (same as homepage)
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
    description: "Iconic Chanel Classic Flap bag in medium size, crafted from luxurious caviar leather with signature diamond quilting. Features gold-tone hardware, the iconic CC turn-lock closure, and burgundy leather interior. Comes with authenticity card, dust bag, and original box. This timeless piece has been meticulously maintained and shows minimal signs of wear.",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&h=1600&fit=crop",
    ],
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
    description: "The legendary Dior Bar Jacket, a symbol of the New Look revolution. This exquisite piece features a nipped waist, padded hips, and the signature peplum silhouette. Crafted from a premium wool-silk blend with full silk lining. A true collector's piece in exceptional condition.",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop",
    ],
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
    description: "The ultimate symbol of luxury - an authentic Hermès Birkin 30 in Gold Togo leather with palladium hardware. This highly sought-after bag features the signature saddle stitching, turn-lock closure, and comes with clochette, lock, keys, dust bag, and box. Certificate of authenticity included.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&h=1600&fit=crop",
    ],
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
    description: "A breathtaking Valentino Haute Couture gown in the house's signature red. This floor-length silk creation features delicate hand-sewn embellishments, a dramatic train, and impeccable construction. Worn once for a gala event. Includes garment bag and authenticity documentation.",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=1600&fit=crop",
    ],
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
    description: "The iconic Christian Louboutin So Kate pump in black patent leather. Features the signature 120mm stiletto heel and pointed toe. The famous red sole shows light wear. Size EU 38. Includes dust bags and original box.",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&h=1600&fit=crop",
    ],
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
    description: "Gucci GG Marmont mini bag in dusty pink velvet with the iconic chevron pattern and antique gold-toned Double G hardware. Features a chain strap that can be worn as a shoulder bag or crossbody. Pristine interior with minimal use.",
    imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&h=1600&fit=crop",
    ],
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
    description: "Stunning Balmain blazer in white tweed with gold-tone lion head buttons and intricate embellishments. Features the brand's signature structured shoulders and nipped waist. Fully lined in silk. A statement piece for any wardrobe.",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop",
    ],
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
    description: "The Givenchy Antigona in medium size, crafted from smooth black calfskin leather. Features silver-tone hardware, signature envelope flap, and structured silhouette. Includes removable shoulder strap, dust bag, and authenticity cards.",
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&h=1600&fit=crop",
    ],
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
    description: "The revolutionary Saint Laurent Le Smoking jacket that changed women's fashion forever. Impeccably tailored in grain de poudre wool with satin lapels. Features a single-button closure and flap pockets. A timeless investment piece.",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=1600&fit=crop",
    ],
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
    description: "A magnificent Oscar de la Renta evening gown featuring the designer's signature romantic floral print. Hand-painted silk organza with delicate ruffle details and a sweeping train. Perfect for red carpet events or formal occasions.",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=1600&fit=crop",
    ],
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
    description: "The coveted Prada Re-Edition 2005 shoulder bag in black nylon with the iconic triangle logo plaque. Features a detachable pouch and adjustable strap. This modern classic is in pristine condition with all original packaging.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&h=1600&fit=crop",
    ],
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
    description: "Luxurious Versace silk blouse featuring the iconic Medusa head print in gold on black. Made from 100% Italian silk with mother-of-pearl buttons. A bold statement piece that exemplifies Versace's glamorous aesthetic.",
    imageUrl: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1200&h=1600&fit=crop",
    ],
    sellerName: "Francesca",
    sellerAvatar: "https://images.unsplash.com/photo-1546961342-ea5f71b193f3?w=100&h=100&fit=crop",
    likes: 189,
  },
];

// Condition labels mapping
const conditionLabels: Record<string, string> = {
  new_with_tags: "New with Tags",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};

// Seller reviews data
interface Review {
  id: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  productTitle: string;
}

interface SellerProfile {
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  memberSince: string;
  verified: boolean;
  totalSales: number;
  responseTime: string;
  bio: string;
  reviews: Review[];
}

// Mock seller profiles
const SELLER_PROFILES: Record<string, SellerProfile> = {
  Alexandra: {
    name: "Alexandra",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 127,
    location: "Paris, France",
    memberSince: "March 2021",
    verified: true,
    totalSales: 89,
    responseTime: "Within 1 hour",
    bio: "Passionate collector of vintage haute couture. Each piece in my collection has been carefully curated and authenticated. I specialize in Chanel, Dior, and Hermès classics.",
    reviews: [
      { id: "r1", buyerName: "Marie", buyerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop", rating: 5, comment: "Absolutely stunning piece! Exactly as described, beautifully packaged. Alexandra was a pleasure to work with.", date: "2 weeks ago", productTitle: "Chanel Tweed Jacket" },
      { id: "r2", buyerName: "Sophie", buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop", rating: 5, comment: "The bag exceeded my expectations. Impeccable condition and fast shipping. Highly recommend!", date: "1 month ago", productTitle: "Hermès Kelly 28" },
      { id: "r3", buyerName: "Charlotte", buyerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop", rating: 5, comment: "Professional seller with exquisite taste. Will definitely buy again.", date: "2 months ago", productTitle: "Dior Saddle Bag" },
    ],
  },
  Margaux: {
    name: "Margaux",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    rating: 4.8,
    reviewCount: 84,
    location: "Monaco",
    memberSince: "July 2020",
    verified: true,
    totalSales: 156,
    responseTime: "Within 2 hours",
    bio: "Former fashion editor with a curated collection of runway pieces. Specializing in archival designer pieces and rare finds from the fashion capitals.",
    reviews: [
      { id: "r1", buyerName: "Elena", buyerAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=50&h=50&fit=crop", rating: 5, comment: "The Dior jacket is even more beautiful in person. Margaux's expertise shows in every detail.", date: "1 week ago", productTitle: "Dior Bar Jacket" },
      { id: "r2", buyerName: "Victoria", buyerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop", rating: 5, comment: "Exceptional quality and service. A true professional.", date: "3 weeks ago", productTitle: "Valentino Gown" },
    ],
  },
  Isabelle: {
    name: "Isabelle",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    rating: 5.0,
    reviewCount: 203,
    location: "Geneva, Switzerland",
    memberSince: "January 2019",
    verified: true,
    totalSales: 312,
    responseTime: "Within 30 minutes",
    bio: "Luxury bag specialist with over 15 years of experience in the haute couture market. Every piece comes with full authentication documentation.",
    reviews: [
      { id: "r1", buyerName: "Anastasia", buyerAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop", rating: 5, comment: "My dream Birkin finally found! Isabelle made the entire process seamless. Impeccable service.", date: "3 days ago", productTitle: "Hermès Birkin 30" },
      { id: "r2", buyerName: "Natalia", buyerAvatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop", rating: 5, comment: "The authentication process gave me complete peace of mind. True expert!", date: "2 weeks ago", productTitle: "Hermès Kelly 32" },
      { id: "r3", buyerName: "Gabrielle", buyerAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=50&h=50&fit=crop", rating: 5, comment: "Outstanding seller. The bag was pristine and shipping was incredibly secure.", date: "1 month ago", productTitle: "Chanel Boy Bag" },
    ],
  },
};

// Get default seller profile for unknown sellers
const getSellerProfile = (sellerName: string, sellerAvatar: string): SellerProfile => {
  if (SELLER_PROFILES[sellerName]) {
    return SELLER_PROFILES[sellerName];
  }
  return {
    name: sellerName,
    avatar: sellerAvatar,
    rating: 4.7,
    reviewCount: 23,
    location: "New York, USA",
    memberSince: "2023",
    verified: true,
    totalSales: 15,
    responseTime: "Within 24 hours",
    bio: "Passionate about luxury fashion and sustainable style.",
    reviews: [
      { id: "r1", buyerName: "Guest", buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop", rating: 5, comment: "Great seller, smooth transaction!", date: "1 week ago", productTitle: "Designer Item" },
    ],
  };
};

// =============================================
// COMPONENTS
// =============================================

function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-sand-100">
        <img
          src={images[currentIndex]}
          alt="Product"
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-charcoal-800 hover:bg-white transition-colors shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-charcoal-800 hover:bg-white transition-colors shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-charcoal-900/70 backdrop-blur-sm rounded-full text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-charcoal-900"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================
// SELLER PROFILE MODAL
// =============================================
interface SellerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerProfile;
  sellerListings: Product[];
  onProductClick: (productId: string) => void;
}

function SellerProfileModal({ isOpen, onClose, seller, sellerListings, onProductClick }: SellerProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "reviews">("listings");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-4 sm:inset-8 lg:inset-16 bg-cream-50 rounded-3xl overflow-hidden flex flex-col animate-fade-up shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-cream-50 border-b border-cream-300 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl font-semibold text-charcoal-900">Seller Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sand-100 text-charcoal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Header */}
          <div className="p-6 bg-gradient-to-br from-sand-100 to-cream-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="font-display text-2xl font-semibold text-charcoal-900">
                    {seller.name}
                  </h3>
                  {seller.verified && (
                    <span className="px-2 py-0.5 bg-sage-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-charcoal-700/70 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {seller.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since {seller.memberSince}
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(seller.rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-cream-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium text-charcoal-900">{seller.rating}</span>
                  <span className="text-charcoal-700/60">({seller.reviewCount} reviews)</span>
                </div>

                <p className="text-charcoal-700/80 max-w-xl">{seller.bio}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-semibold text-charcoal-900">
                  {seller.totalSales}
                </div>
                <div className="text-xs text-charcoal-700/60 mt-1">Total Sales</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-semibold text-charcoal-900">
                  {seller.rating}
                </div>
                <div className="text-xs text-charcoal-700/60 mt-1">Rating</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="font-display text-lg font-semibold text-charcoal-900">
                  {seller.responseTime}
                </div>
                <div className="text-xs text-charcoal-700/60 mt-1">Response Time</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-cream-300 px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("listings")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "listings"
                    ? "border-charcoal-900 text-charcoal-900"
                    : "border-transparent text-charcoal-700/60 hover:text-charcoal-900"
                }`}
              >
                Listings ({sellerListings.length})
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "reviews"
                    ? "border-charcoal-900 text-charcoal-900"
                    : "border-transparent text-charcoal-700/60 hover:text-charcoal-900"
                }`}
              >
                Reviews ({seller.reviews.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "listings" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {sellerListings.map((listing) => (
                  <button
                    key={listing.id}
                    onClick={() => {
                      onProductClick(listing.id);
                      onClose();
                    }}
                    className="text-left group"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-sand-100 mb-2">
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-sm font-medium text-charcoal-800 line-clamp-1">
                      {listing.title}
                    </h4>
                    <p className="text-sm font-semibold text-charcoal-900">
                      ${listing.price.toLocaleString()}
                    </p>
                  </button>
                ))}
                {sellerListings.length === 0 && (
                  <div className="col-span-full text-center py-12 text-charcoal-700/60">
                    No active listings at the moment.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                {seller.reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-sand-100 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.buyerAvatar}
                        alt={review.buyerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-charcoal-900">{review.buyerName}</span>
                          <span className="text-xs text-charcoal-700/60">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= review.rating
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-cream-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-charcoal-700/80 mb-2">{review.comment}</p>
                        <p className="text-xs text-charcoal-700/50">
                          Purchased: {review.productTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// CHAT BOX COMPONENT
// =============================================
interface ChatMessage {
  id: string;
  senderId: "user" | "seller";
  text: string;
  timestamp: Date;
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  sellerAvatar: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
}

function ChatBox({ isOpen, onClose, sellerName, sellerAvatar, productTitle, productImage, productPrice }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "seller",
      text: `Hello! Thank you for your interest in the ${productTitle}. How can I help you today?`,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate seller response after a short delay
    setTimeout(() => {
      const responses = [
        "Thank you for your message! I'll get back to you shortly.",
        "Great question! Let me provide more details about this piece.",
        "I appreciate your interest. This is indeed a special piece from my collection.",
        "I'd be happy to provide more photos or information. What would you like to know?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const sellerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: "seller",
        text: randomResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sellerMessage]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-charcoal-900/30 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-cream-50 shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-charcoal-900 text-cream-50 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Chat with Seller</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={sellerAvatar}
              alt={sellerName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-cream-50/20"
            />
            <div>
              <p className="font-medium">{sellerName}</p>
              <p className="text-xs text-cream-200/70 flex items-center gap-1">
                <span className="w-2 h-2 bg-sage-500 rounded-full"></span>
                Usually responds within 1 hour
              </p>
            </div>
          </div>
        </div>

        {/* Product Context */}
        <div className="px-4 py-3 bg-sand-100 border-b border-cream-300">
          <div className="flex items-center gap-3">
            <img
              src={productImage}
              alt={productTitle}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal-800 truncate">{productTitle}</p>
              <p className="text-sm font-semibold text-charcoal-900">${productPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.senderId === "user"
                    ? "bg-charcoal-900 text-cream-50 rounded-2xl rounded-br-md"
                    : "bg-sand-200 text-charcoal-800 rounded-2xl rounded-bl-md"
                } px-4 py-2.5`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === "user" ? "text-cream-200/60" : "text-charcoal-700/50"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-2 border-t border-cream-300 overflow-x-auto">
          <div className="flex gap-2">
            {[
              "Is this still available?",
              "Can you share more photos?",
              "What's the lowest price?",
              "Can I see the authenticity card?",
            ].map((reply, i) => (
              <button
                key={i}
                onClick={() => setNewMessage(reply)}
                className="shrink-0 px-3 py-1.5 bg-sand-100 text-charcoal-700 text-xs font-medium rounded-full hover:bg-sand-200 transition-colors whitespace-nowrap"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-cream-300 bg-cream-50">
          <div className="flex items-end gap-2">
            <button className="p-2.5 text-charcoal-700/50 hover:text-charcoal-700 transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-2.5 bg-sand-100 border border-cream-300 rounded-2xl text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 resize-none"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-2.5 rounded-full transition-colors ${
                newMessage.trim()
                  ? "bg-charcoal-900 text-cream-50 hover:bg-charcoal-800"
                  : "bg-cream-300 text-charcoal-700/50"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================
// CHECKOUT MODAL
// =============================================
interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productImage: string;
  productPrice: number;
  productBrand: string;
  sellerName: string;
}

function CheckoutModal({ isOpen, onClose, productTitle, productImage, productPrice, productBrand, sellerName }: CheckoutModalProps) {
  const [step, setStep] = useState<"shipping-method" | "shipping-details" | "payment" | "success">("shipping-method");
  const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup" | null>(null);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = shippingMethod === "delivery" ? 45 : 0;
  const insuranceCost = 25;
  const totalPrice = productPrice + shippingCost + insuranceCost;

  const updateShipping = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const isShippingValid = () => {
    return (
      shippingDetails.firstName &&
      shippingDetails.lastName &&
      shippingDetails.email &&
      shippingDetails.address &&
      shippingDetails.city &&
      shippingDetails.state &&
      shippingDetails.zipCode
    );
  };

  const handleContinue = () => {
    if (step === "shipping-method" && shippingMethod) {
      if (shippingMethod === "delivery") {
        setStep("shipping-details");
      } else {
        setStep("payment");
      }
    } else if (step === "shipping-details" && isShippingValid()) {
      setStep("payment");
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep("success");
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setStep("shipping-method");
      setShippingMethod(null);
      setShippingDetails({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      });
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="absolute inset-4 sm:inset-8 md:inset-y-8 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-cream-50 rounded-3xl overflow-hidden flex flex-col animate-fade-up shadow-2xl">
        {/* Success State */}
        {step === "success" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-sage-500 rounded-full flex items-center justify-center mb-6 animate-fade-up">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-charcoal-900 mb-2 animate-fade-up stagger-1">
              Order Confirmed!
            </h2>
            <p className="text-charcoal-700/70 mb-2 animate-fade-up stagger-2">
              Thank you for your purchase.
            </p>
            <p className="text-sm text-charcoal-700/60 mb-8 animate-fade-up stagger-2">
              Order #VTL{Date.now().toString().slice(-8)}
            </p>
            <div className="w-full max-w-sm p-4 bg-sand-100 rounded-2xl mb-8 animate-fade-up stagger-3">
              <div className="flex items-center gap-4">
                <img
                  src={productImage}
                  alt={productTitle}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-charcoal-800 line-clamp-1">{productTitle}</p>
                  <p className="text-xs text-charcoal-700/60">{productBrand}</p>
                  <p className="text-sm font-semibold text-charcoal-900 mt-1">${totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-charcoal-700/60 mb-6 animate-fade-up stagger-4">
              {shippingMethod === "delivery" 
                ? "You'll receive a confirmation email with tracking details shortly."
                : `Pickup details will be coordinated with ${sellerName}.`}
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-charcoal-900 text-cream-50 font-medium rounded-full hover:bg-charcoal-800 transition-colors animate-fade-up stagger-4"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-cream-50 border-b border-cream-300 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {step !== "shipping-method" && (
                  <button
                    onClick={() => setStep(step === "payment" && shippingMethod === "delivery" ? "shipping-details" : "shipping-method")}
                    className="p-1.5 rounded-full hover:bg-sand-100 text-charcoal-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="font-display text-xl font-semibold text-charcoal-900">
                  {step === "shipping-method" && "Checkout"}
                  {step === "shipping-details" && "Shipping Details"}
                  {step === "payment" && "Payment"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-sand-100 text-charcoal-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-3 bg-sand-50 border-b border-cream-300">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${step === "shipping-method" ? "bg-charcoal-900" : "bg-sage-500"}`} />
                <div className={`w-8 h-0.5 ${step !== "shipping-method" ? "bg-sage-500" : "bg-cream-300"}`} />
                {shippingMethod === "delivery" && (
                  <>
                    <div className={`w-2.5 h-2.5 rounded-full ${step === "shipping-details" ? "bg-charcoal-900" : step === "payment" ? "bg-sage-500" : "bg-cream-300"}`} />
                    <div className={`w-8 h-0.5 ${step === "payment" ? "bg-sage-500" : "bg-cream-300"}`} />
                  </>
                )}
                <div className={`w-2.5 h-2.5 rounded-full ${step === "payment" ? "bg-charcoal-900" : "bg-cream-300"}`} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Shipping Method Step */}
              {step === "shipping-method" && (
                <div className="space-y-6">
                  {/* Product Summary */}
                  <div className="flex items-center gap-4 p-4 bg-sand-100 rounded-2xl">
                    <img
                      src={productImage}
                      alt={productTitle}
                      className="w-20 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-charcoal-700/60 mb-1">{productBrand}</p>
                      <p className="font-medium text-charcoal-800 line-clamp-2">{productTitle}</p>
                      <p className="text-lg font-semibold text-charcoal-900 mt-1">${productPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div>
                    <h3 className="font-medium text-charcoal-900 mb-3">How would you like to receive your item?</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShippingMethod("delivery")}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                          shippingMethod === "delivery"
                            ? "border-charcoal-900 bg-charcoal-900/5"
                            : "border-cream-300 hover:border-charcoal-800"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            shippingMethod === "delivery" ? "bg-charcoal-900 text-cream-50" : "bg-sand-200 text-charcoal-700"
                          }`}>
                            <Truck className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-charcoal-900">Insured Delivery</span>
                              <span className="font-medium text-charcoal-900">$45</span>
                            </div>
                            <p className="text-sm text-charcoal-700/60 mt-1">
                              White-glove shipping with full insurance. Delivered in 3-5 business days.
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setShippingMethod("pickup")}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                          shippingMethod === "pickup"
                            ? "border-charcoal-900 bg-charcoal-900/5"
                            : "border-cream-300 hover:border-charcoal-800"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            shippingMethod === "pickup" ? "bg-charcoal-900 text-cream-50" : "bg-sand-200 text-charcoal-700"
                          }`}>
                            <Package className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-charcoal-900">Arrange Pickup</span>
                              <span className="font-medium text-sage-600">Free</span>
                            </div>
                            <p className="text-sm text-charcoal-700/60 mt-1">
                              Coordinate directly with {sellerName} for local pickup.
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-6 pt-4 text-xs text-charcoal-700/60">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-sage-600" />
                      Authenticated
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-sage-600" />
                      Secure Payment
                    </span>
                  </div>
                </div>
              )}

              {/* Shipping Details Step */}
              {step === "shipping-details" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-800 mb-1.5">First Name *</label>
                      <input
                        type="text"
                        value={shippingDetails.firstName}
                        onChange={(e) => updateShipping("firstName", e.target.value)}
                        className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-800 mb-1.5">Last Name *</label>
                      <input
                        type="text"
                        value={shippingDetails.lastName}
                        onChange={(e) => updateShipping("lastName", e.target.value)}
                        className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-800 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={shippingDetails.email}
                      onChange={(e) => updateShipping("email", e.target.value)}
                      className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-800 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={shippingDetails.phone}
                      onChange={(e) => updateShipping("phone", e.target.value)}
                      placeholder="For delivery updates"
                      className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-800 mb-1.5">Address *</label>
                    <input
                      type="text"
                      value={shippingDetails.address}
                      onChange={(e) => updateShipping("address", e.target.value)}
                      className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-800 mb-1.5">Apartment, suite, etc.</label>
                    <input
                      type="text"
                      value={shippingDetails.apartment}
                      onChange={(e) => updateShipping("apartment", e.target.value)}
                      className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-800 mb-1.5">City *</label>
                      <input
                        type="text"
                        value={shippingDetails.city}
                        onChange={(e) => updateShipping("city", e.target.value)}
                        className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-800 mb-1.5">State *</label>
                      <input
                        type="text"
                        value={shippingDetails.state}
                        onChange={(e) => updateShipping("state", e.target.value)}
                        className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-800 mb-1.5">ZIP Code *</label>
                      <input
                        type="text"
                        value={shippingDetails.zipCode}
                        onChange={(e) => updateShipping("zipCode", e.target.value)}
                        className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-800 mb-1.5">Country</label>
                      <select
                        value={shippingDetails.country}
                        onChange={(e) => updateShipping("country", e.target.value)}
                        className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 transition-colors"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>France</option>
                        <option>Germany</option>
                        <option>Italy</option>
                        <option>Switzerland</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {step === "payment" && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="p-4 bg-sand-100 rounded-2xl space-y-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={productImage}
                        alt={productTitle}
                        className="w-16 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-charcoal-700/60">{productBrand}</p>
                        <p className="font-medium text-charcoal-800 line-clamp-1">{productTitle}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-cream-300 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-700/70">Subtotal</span>
                        <span className="text-charcoal-800">${productPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-700/70">
                          {shippingMethod === "delivery" ? "Insured Shipping" : "Pickup"}
                        </span>
                        <span className="text-charcoal-800">
                          {shippingCost === 0 ? "Free" : `$${shippingCost}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-700/70">Authentication & Insurance</span>
                        <span className="text-charcoal-800">${insuranceCost}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-cream-300">
                        <span className="text-charcoal-900">Total</span>
                        <span className="text-charcoal-900">${totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Summary */}
                  {shippingMethod === "delivery" && (
                    <div className="p-4 bg-sand-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-charcoal-800">Shipping to</span>
                        <button 
                          onClick={() => setStep("shipping-details")}
                          className="text-xs text-terracotta-500 hover:text-terracotta-600"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-charcoal-700/70">
                        {shippingDetails.firstName} {shippingDetails.lastName}<br />
                        {shippingDetails.address}{shippingDetails.apartment && `, ${shippingDetails.apartment}`}<br />
                        {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}
                      </p>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium text-charcoal-900 mb-3">Payment Method</h3>
                    <div className="p-4 border-2 border-charcoal-900 bg-charcoal-900/5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-charcoal-900 text-cream-50 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-charcoal-900">Credit or Debit Card</span>
                          <p className="text-xs text-charcoal-700/60">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Details (Mock) */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-800 mb-1.5">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal-800 mb-1.5">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal-800 mb-1.5">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-charcoal-700/60 pt-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {step !== "success" && (
              <div className="sticky bottom-0 bg-cream-50 border-t border-cream-300 p-4">
                {step === "payment" ? (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full py-4 bg-charcoal-900 text-cream-50 font-medium rounded-full hover:bg-charcoal-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-cream-50/30 border-t-cream-50 rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Place Order · ${totalPrice.toLocaleString()}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleContinue}
                    disabled={
                      (step === "shipping-method" && !shippingMethod) ||
                      (step === "shipping-details" && !isShippingValid())
                    }
                    className={`w-full py-4 rounded-full font-medium transition-colors ${
                      (step === "shipping-method" && shippingMethod) ||
                      (step === "shipping-details" && isShippingValid())
                        ? "bg-charcoal-900 text-cream-50 hover:bg-charcoal-800"
                        : "bg-cream-300 text-charcoal-700/50 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// =============================================
// MAIN PAGE
// =============================================
export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [sellerListings, setSellerListings] = useState<Product[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Check if product is in favorites
  useEffect(() => {
    const productId = params.id as string;
    setLiked(isFavorite(productId));
  }, [params.id]);

  useEffect(() => {
    const productId = params.id as string;
    
    // First check dummy products
    let foundProduct = DUMMY_PRODUCTS.find((p) => p.id === productId);
    
    // If not found in dummy, check user listings
    if (!foundProduct) {
      const userListings = getListings();
      const userListing = userListings.find((l) => l.id === productId);
      if (userListing) {
        foundProduct = {
          id: userListing.id,
          title: userListing.title,
          price: userListing.price,
          size: userListing.size,
          brand: userListing.brand || "Unknown",
          color: userListing.color || "Multi",
          condition: conditionLabels[userListing.condition] || userListing.condition,
          category: userListing.category,
          description: userListing.description,
          imageUrl: userListing.photos[0] || "",
          photos: userListing.photos,
          sellerName: userListing.sellerName,
          sellerAvatar: userListing.sellerAvatar,
          likes: userListing.likes,
          isUserListing: true,
        };
      }
    }

    setProduct(foundProduct || null);
    setIsLoading(false);
  }, [params.id]);

  const handleViewProfile = () => {
    if (!product) return;
    
    // Get seller profile
    const profile = getSellerProfile(product.sellerName, product.sellerAvatar);
    setSellerProfile(profile);
    
    // Get all listings from this seller
    const listings = DUMMY_PRODUCTS.filter(
      (p) => p.sellerName === product.sellerName
    );
    setSellerListings(listings);
    
    setShowSellerModal(true);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-4">
        <h1 className="font-display text-2xl font-semibold text-charcoal-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-charcoal-700/70 mb-6">
          This piece may have been sold or removed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-charcoal-900 text-cream-50 font-medium rounded-full hover:bg-charcoal-800 transition-colors"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  const images = product.photos || [product.imageUrl];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-lg border-b border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-charcoal-700 hover:text-charcoal-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Back</span>
            </button>
            
            <Link href="/" className="font-display text-xl font-semibold text-charcoal-900">
              vintly
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!product) return;
                  const isNowFavorite = toggleFavorite({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    brand: product.brand,
                    imageUrl: images[0],
                    size: product.size,
                    condition: product.condition,
                  });
                  setLiked(isNowFavorite);
                  window.dispatchEvent(new Event("favoritesUpdated"));
                }}
                className={`p-2.5 rounded-full transition-colors ${
                  liked
                    ? "bg-terracotta-500 text-white"
                    : "bg-sand-100 text-charcoal-700 hover:bg-sand-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              </button>
              <button className="p-2.5 rounded-full bg-sand-100 text-charcoal-700 hover:bg-sand-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div>
            <ImageGallery images={images} />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isUserListing && (
                <span className="px-3 py-1 bg-sage-500 text-white text-xs font-medium rounded-full">
                  Your Listing
                </span>
              )}
              <span className="px-3 py-1 bg-sand-200 text-charcoal-800 text-xs font-medium rounded-full">
                {product.condition}
              </span>
              <span className="px-3 py-1 bg-terracotta-500/10 text-terracotta-600 text-xs font-medium rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Authenticated
              </span>
            </div>

            {/* Title & Brand */}
            <div>
              <p className="text-sm text-charcoal-700/70 mb-1">{product.brand}</p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal-900">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-charcoal-900">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-sm text-charcoal-700/60">
                + insured shipping
              </span>
            </div>

            {/* Quick Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-sand-100 rounded-2xl">
              <div>
                <span className="text-xs text-charcoal-700/60 uppercase tracking-wide">Size</span>
                <p className="font-medium text-charcoal-900">{product.size}</p>
              </div>
              <div>
                <span className="text-xs text-charcoal-700/60 uppercase tracking-wide">Color</span>
                <p className="font-medium text-charcoal-900">{product.color}</p>
              </div>
              <div>
                <span className="text-xs text-charcoal-700/60 uppercase tracking-wide">Category</span>
                <p className="font-medium text-charcoal-900 capitalize">{product.category}</p>
              </div>
              <div>
                <span className="text-xs text-charcoal-700/60 uppercase tracking-wide">Condition</span>
                <p className="font-medium text-charcoal-900">{product.condition}</p>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-medium text-charcoal-900 mb-2">Description</h3>
                <p className="text-charcoal-700/80 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={() => setShowCheckout(true)}
                className="flex-1 py-4 bg-charcoal-900 text-cream-50 font-medium rounded-full hover:bg-charcoal-800 transition-colors"
              >
                Acquire Now
              </button>
              <button 
                onClick={() => setShowChat(true)}
                className="flex-1 py-4 border-2 border-charcoal-900 text-charcoal-900 font-medium rounded-full hover:bg-charcoal-900 hover:text-cream-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Seller
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-cream-300">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-sage-500/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-sage-600" />
                </div>
                <p className="text-xs text-charcoal-700/70">Authenticated</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-sage-500/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-sage-600" />
                </div>
                <p className="text-xs text-charcoal-700/70">Insured Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-sage-500/10 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-sage-600" />
                </div>
                <p className="text-xs text-charcoal-700/70">Easy Returns</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="p-4 bg-sand-100 rounded-2xl">
              <div className="flex items-center gap-4">
                <img
                  src={product.sellerAvatar}
                  alt={product.sellerName}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-cream-300"
                />
                <div className="flex-1">
                  <p className="font-medium text-charcoal-900">{product.sellerName}</p>
                  <div className="flex items-center gap-1 text-sm text-charcoal-700/70">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>4.9</span>
                    <span>·</span>
                    <span>Verified Seller</span>
                  </div>
                </div>
                <button 
                  onClick={handleViewProfile}
                  className="px-4 py-2 border border-charcoal-900 text-charcoal-900 text-sm font-medium rounded-full hover:bg-charcoal-900 hover:text-cream-50 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-2 text-sm text-charcoal-700/70">
              <Heart className="w-4 h-4" />
              <span>{product.likes} collectors have saved this piece</span>
            </div>
          </div>
        </div>
      </main>

      {/* Seller Profile Modal */}
      {sellerProfile && (
        <SellerProfileModal
          isOpen={showSellerModal}
          onClose={() => setShowSellerModal(false)}
          seller={sellerProfile}
          sellerListings={sellerListings}
          onProductClick={handleProductClick}
        />
      )}

      {/* Chat Box */}
      {product && (
        <ChatBox
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          sellerName={product.sellerName}
          sellerAvatar={product.sellerAvatar}
          productTitle={product.title}
          productImage={images[0]}
          productPrice={product.price}
        />
      )}

      {/* Checkout Modal */}
      {product && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          productTitle={product.title}
          productImage={images[0]}
          productPrice={product.price}
          productBrand={product.brand}
          sellerName={product.sellerName}
        />
      )}
    </div>
  );
}

