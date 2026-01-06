"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  BarChart3,
  Truck,
  MessageCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  MapPin,
  Star,
  Bell,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { getListings, deleteListing, type Listing } from "@/lib/listings-store";

// =============================================
// TYPES
// =============================================
interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerName: string;
  buyerAvatar: string;
  price: number;
  shippingCost: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  fulfillmentMethod: "pickup" | "delivery";
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatThread {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerName: string;
  buyerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: "seller" | "buyer";
    text: string;
    timestamp: string;
  }[];
}

interface Analytics {
  totalViews: number;
  totalLikes: number;
  totalSales: number;
  totalRevenue: number;
  viewsTrend: number; // percentage
  likesTrend: number;
  salesTrend: number;
  revenueTrend: number;
  topListings: {
    id: string;
    title: string;
    image: string;
    views: number;
    likes: number;
  }[];
  recentActivity: {
    type: "view" | "like" | "sale" | "message";
    listingTitle: string;
    timestamp: string;
  }[];
}

// =============================================
// MOCK DATA
// =============================================
const MOCK_ORDERS: Order[] = [
  {
    id: "ord_001",
    listingId: "1",
    listingTitle: "Chanel Classic Flap Bag",
    listingImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200",
    buyerName: "Emma Thompson",
    buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    price: 4500,
    shippingCost: 0,
    status: "shipped",
    fulfillmentMethod: "delivery",
    shippingAddress: "123 Fifth Ave, New York, NY 10001",
    trackingNumber: "1Z999AA10123456784",
    createdAt: "2026-01-03T10:00:00Z",
    updatedAt: "2026-01-04T14:30:00Z",
  },
  {
    id: "ord_002",
    listingId: "2",
    listingTitle: "Hermès Birkin 25",
    listingImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200",
    buyerName: "Sophia Martinez",
    buyerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    price: 12000,
    shippingCost: 50,
    status: "pending",
    fulfillmentMethod: "delivery",
    shippingAddress: "456 Park Ave, Los Angeles, CA 90001",
    createdAt: "2026-01-05T09:00:00Z",
    updatedAt: "2026-01-05T09:00:00Z",
  },
  {
    id: "ord_003",
    listingId: "3",
    listingTitle: "Valentino Gown",
    listingImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200",
    buyerName: "Isabella Chen",
    buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    price: 3200,
    shippingCost: 0,
    status: "confirmed",
    fulfillmentMethod: "pickup",
    createdAt: "2026-01-04T15:00:00Z",
    updatedAt: "2026-01-05T10:00:00Z",
  },
  {
    id: "ord_004",
    listingId: "4",
    listingTitle: "Dior Saddle Bag",
    listingImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200",
    buyerName: "Olivia Williams",
    buyerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    price: 2800,
    shippingCost: 25,
    status: "delivered",
    fulfillmentMethod: "delivery",
    shippingAddress: "789 Madison Ave, Chicago, IL 60601",
    trackingNumber: "1Z999AA10123456785",
    createdAt: "2025-12-28T11:00:00Z",
    updatedAt: "2026-01-02T16:00:00Z",
  },
];

const MOCK_CHATS: ChatThread[] = [
  {
    id: "chat_001",
    listingId: "1",
    listingTitle: "Chanel Classic Flap Bag",
    listingImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200",
    buyerName: "Emma Thompson",
    buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    lastMessage: "Thank you! I received the tracking number.",
    lastMessageTime: "2026-01-05T10:30:00Z",
    unreadCount: 0,
    messages: [
      { id: "m1", sender: "buyer", text: "Hi! Is this bag still available?", timestamp: "2026-01-03T09:00:00Z" },
      { id: "m2", sender: "seller", text: "Yes, it is! Would you like more photos?", timestamp: "2026-01-03T09:15:00Z" },
      { id: "m3", sender: "buyer", text: "That would be great, thank you!", timestamp: "2026-01-03T09:20:00Z" },
      { id: "m4", sender: "seller", text: "I've just shipped your order. Tracking: 1Z999AA10123456784", timestamp: "2026-01-04T14:30:00Z" },
      { id: "m5", sender: "buyer", text: "Thank you! I received the tracking number.", timestamp: "2026-01-05T10:30:00Z" },
    ],
  },
  {
    id: "chat_002",
    listingId: "5",
    listingTitle: "Gucci Dionysus Bag",
    listingImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200",
    buyerName: "Ava Johnson",
    buyerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
    lastMessage: "Is the price negotiable?",
    lastMessageTime: "2026-01-05T11:00:00Z",
    unreadCount: 2,
    messages: [
      { id: "m1", sender: "buyer", text: "Hello! I love this bag. Can you tell me more about its condition?", timestamp: "2026-01-05T10:00:00Z" },
      { id: "m2", sender: "buyer", text: "Is the price negotiable?", timestamp: "2026-01-05T11:00:00Z" },
    ],
  },
  {
    id: "chat_003",
    listingId: "3",
    listingTitle: "Valentino Gown",
    listingImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200",
    buyerName: "Isabella Chen",
    buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    lastMessage: "Perfect, I'll pick it up tomorrow at 3pm!",
    lastMessageTime: "2026-01-05T09:45:00Z",
    unreadCount: 0,
    messages: [
      { id: "m1", sender: "buyer", text: "Hi! I'd like to arrange a pickup for the gown.", timestamp: "2026-01-04T16:00:00Z" },
      { id: "m2", sender: "seller", text: "Of course! I'm available tomorrow between 2-6pm.", timestamp: "2026-01-04T16:30:00Z" },
      { id: "m3", sender: "buyer", text: "Perfect, I'll pick it up tomorrow at 3pm!", timestamp: "2026-01-05T09:45:00Z" },
    ],
  },
];

const MOCK_ANALYTICS: Analytics = {
  totalViews: 2847,
  totalLikes: 156,
  totalSales: 12,
  totalRevenue: 28500,
  viewsTrend: 23,
  likesTrend: 15,
  salesTrend: 8,
  revenueTrend: 12,
  topListings: [
    { id: "1", title: "Chanel Classic Flap Bag", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200", views: 523, likes: 45 },
    { id: "2", title: "Hermès Birkin 25", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200", views: 412, likes: 38 },
    { id: "3", title: "Valentino Gown", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200", views: 356, likes: 29 },
  ],
  recentActivity: [
    { type: "view", listingTitle: "Chanel Classic Flap Bag", timestamp: "2026-01-05T11:30:00Z" },
    { type: "like", listingTitle: "Hermès Birkin 25", timestamp: "2026-01-05T11:15:00Z" },
    { type: "message", listingTitle: "Gucci Dionysus Bag", timestamp: "2026-01-05T11:00:00Z" },
    { type: "view", listingTitle: "Valentino Gown", timestamp: "2026-01-05T10:45:00Z" },
    { type: "sale", listingTitle: "Dior Saddle Bag", timestamp: "2026-01-05T10:30:00Z" },
  ],
};

// =============================================
// COMPONENTS
// =============================================

type TabType = "listings" | "orders" | "analytics" | "shipping" | "messages";

function TabNav({ activeTab, onTabChange, unreadMessages }: { 
  activeTab: TabType; 
  onTabChange: (tab: TabType) => void;
  unreadMessages: number;
}) {
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "listings", label: "Listings", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "messages", label: "Messages", icon: MessageCircle },
  ];

  return (
    <div className="border-b border-cream-200 bg-white sticky top-16 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? "border-charcoal-900 text-charcoal-900"
                  : "border-transparent text-charcoal-700/60 hover:text-charcoal-900 hover:border-cream-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "messages" && unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ListingsTab({ listings, onDelete }: { listings: Listing[]; onDelete: (id: string) => void }) {
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
  
  const filteredListings = listings.filter((l) => {
    if (filter === "all") return true;
    return l.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-charcoal-900">My Listings</h2>
          <p className="text-sm text-charcoal-700/60">{listings.length} total items</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-sand-50 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:border-charcoal-800"
          >
            <option value="all">All Items</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
          <Link
            href="/sell"
            className="flex items-center gap-2 px-4 py-2 bg-charcoal-900 text-white text-sm font-medium rounded-lg hover:bg-charcoal-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Listing
          </Link>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-sand-50 rounded-2xl">
          <Package className="w-12 h-12 text-charcoal-700/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-charcoal-900 mb-2">No listings yet</h3>
          <p className="text-charcoal-700/60 mb-6">Start selling your haute couture pieces</p>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal-900 text-white font-medium rounded-full hover:bg-charcoal-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-cream-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-sand-100 shrink-0">
                {listing.photos[0] ? (
                  <img
                    src={listing.photos[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-charcoal-700/30" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-charcoal-900 truncate">{listing.title}</h3>
                    <p className="text-sm text-charcoal-700/60">{listing.brand} • Size {listing.size}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 ${
                      listing.status === "available"
                        ? "bg-emerald-100 text-emerald-700"
                        : listing.status === "sold"
                        ? "bg-charcoal-100 text-charcoal-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {listing.status === "available" ? "Active" : listing.status === "sold" ? "Sold" : "Draft"}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="font-semibold text-charcoal-900">${listing.price.toLocaleString()}</span>
                  <span className="text-charcoal-700/50 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {listing.likes}
                  </span>
                  <span className="text-charcoal-700/50 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {Math.floor(Math.random() * 200) + 50}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/product/${listing.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <button className="px-3 py-1.5 text-xs font-medium text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors flex items-center gap-1">
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "shipped": return "bg-violet-100 text-violet-700";
      case "delivered": return "bg-emerald-100 text-emerald-700";
      case "cancelled": return "bg-red-100 text-red-700";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return Clock;
      case "confirmed": return CheckCircle;
      case "shipped": return Truck;
      case "delivered": return CheckCircle;
      case "cancelled": return XCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-charcoal-900">Orders</h2>
          <p className="text-sm text-charcoal-700/60">{orders.length} total orders</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2 bg-sand-50 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:border-charcoal-800"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <div
              key={order.id}
              className="bg-white border border-cream-200 rounded-xl p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-sand-100 shrink-0">
                  <img
                    src={order.listingImage}
                    alt={order.listingTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-charcoal-900">{order.listingTitle}</h3>
                      <p className="text-sm text-charcoal-700/60">Order #{order.id}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 shrink-0 ${getStatusColor(order.status)}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {/* Buyer Info */}
                  <div className="mt-3 flex items-center gap-2">
                    <img
                      src={order.buyerAvatar}
                      alt={order.buyerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-charcoal-700">{order.buyerName}</span>
                    <span className="text-charcoal-300">•</span>
                    <span className="text-sm text-charcoal-700/60 flex items-center gap-1">
                      {order.fulfillmentMethod === "pickup" ? (
                        <><MapPin className="w-3.5 h-3.5" /> Pickup</>
                      ) : (
                        <><Truck className="w-3.5 h-3.5" /> Delivery</>
                      )}
                    </span>
                  </div>

                  {/* Price & Date */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-semibold text-charcoal-900">${order.price.toLocaleString()}</span>
                      {order.shippingCost > 0 && (
                        <span className="text-charcoal-700/60"> + ${order.shippingCost} shipping</span>
                      )}
                    </div>
                    <span className="text-xs text-charcoal-700/50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  {order.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors">
                        Confirm Order
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                  {order.status === "confirmed" && order.fulfillmentMethod === "delivery" && (
                    <div className="mt-3">
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        Mark as Shipped
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalyticsTab({ analytics }: { analytics: Analytics }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-charcoal-900">Analytics</h2>
        <p className="text-sm text-charcoal-700/60">Track your selling performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: analytics.totalViews.toLocaleString(), trend: analytics.viewsTrend, icon: Eye, color: "blue" },
          { label: "Total Likes", value: analytics.totalLikes.toLocaleString(), trend: analytics.likesTrend, icon: Heart, color: "rose" },
          { label: "Items Sold", value: analytics.totalSales.toLocaleString(), trend: analytics.salesTrend, icon: ShoppingBag, color: "emerald" },
          { label: "Total Revenue", value: `$${analytics.totalRevenue.toLocaleString()}`, trend: analytics.revenueTrend, icon: DollarSign, color: "amber" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-cream-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.color === "blue" ? "bg-blue-100 text-blue-600" :
                stat.color === "rose" ? "bg-rose-100 text-rose-600" :
                stat.color === "emerald" ? "bg-emerald-100 text-emerald-600" :
                "bg-amber-100 text-amber-600"
              }`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {stat.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <div className="text-2xl font-semibold text-charcoal-900">{stat.value}</div>
            <div className="text-sm text-charcoal-700/60">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top Listings & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Listings */}
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <h3 className="font-semibold text-charcoal-900 mb-4">Top Performing Listings</h3>
          <div className="space-y-3">
            {analytics.topListings.map((listing, index) => (
              <div key={listing.id} className="flex items-center gap-3">
                <span className="text-lg font-semibold text-charcoal-400 w-6">{index + 1}</span>
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-12 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-charcoal-900 truncate">{listing.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-charcoal-700/60">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {listing.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {listing.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <h3 className="font-semibold text-charcoal-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === "view" ? "bg-blue-100 text-blue-600" :
                  activity.type === "like" ? "bg-rose-100 text-rose-600" :
                  activity.type === "sale" ? "bg-emerald-100 text-emerald-600" :
                  "bg-violet-100 text-violet-600"
                }`}>
                  {activity.type === "view" && <Eye className="w-4 h-4" />}
                  {activity.type === "like" && <Heart className="w-4 h-4" />}
                  {activity.type === "sale" && <ShoppingBag className="w-4 h-4" />}
                  {activity.type === "message" && <MessageCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal-900">
                    {activity.type === "view" && "New view on "}
                    {activity.type === "like" && "New like on "}
                    {activity.type === "sale" && "Sale! "}
                    {activity.type === "message" && "New message about "}
                    <span className="font-medium">{activity.listingTitle}</span>
                  </p>
                  <p className="text-xs text-charcoal-700/50">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShippingTab({ orders }: { orders: Order[] }) {
  const shippingOrders = orders.filter((o) => 
    o.fulfillmentMethod === "delivery" && 
    ["confirmed", "shipped", "delivered"].includes(o.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-charcoal-900">Shipping & Fulfillment</h2>
        <p className="text-sm text-charcoal-700/60">Track and manage your shipments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-amber-700">
            {orders.filter((o) => o.status === "confirmed" && o.fulfillmentMethod === "delivery").length}
          </div>
          <div className="text-sm text-amber-600">Awaiting Shipment</div>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-violet-700">
            {orders.filter((o) => o.status === "shipped").length}
          </div>
          <div className="text-sm text-violet-600">In Transit</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-emerald-700">
            {orders.filter((o) => o.status === "delivered").length}
          </div>
          <div className="text-sm text-emerald-600">Delivered</div>
        </div>
      </div>

      {/* Shipping List */}
      <div className="space-y-4">
        {shippingOrders.length === 0 ? (
          <div className="text-center py-12 bg-sand-50 rounded-2xl">
            <Truck className="w-12 h-12 text-charcoal-700/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal-900 mb-2">No shipments yet</h3>
            <p className="text-charcoal-700/60">Orders requiring shipping will appear here</p>
          </div>
        ) : (
          shippingOrders.map((order) => (
            <div key={order.id} className="bg-white border border-cream-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <img
                  src={order.listingImage}
                  alt={order.listingTitle}
                  className="w-14 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-charcoal-900">{order.listingTitle}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === "confirmed" ? "bg-amber-100 text-amber-700" :
                      order.status === "shipped" ? "bg-violet-100 text-violet-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {order.status === "confirmed" ? "Ready to Ship" : 
                       order.status === "shipped" ? "In Transit" : "Delivered"}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-charcoal-700/60">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {order.shippingAddress}
                    </p>
                    {order.trackingNumber && (
                      <p className="mt-1 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        Tracking: <span className="font-mono text-charcoal-800">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>

                  {order.status === "confirmed" && (
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Truck className="w-4 h-4" />
                        Add Tracking & Ship
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MessagesTab({ chats, onSelectChat }: { chats: ChatThread[]; onSelectChat: (chat: ChatThread) => void }) {
  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-charcoal-900">Messages</h2>
          <p className="text-sm text-charcoal-700/60">
            {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-2">
        {chats.length === 0 ? (
          <div className="text-center py-12 bg-sand-50 rounded-2xl">
            <MessageCircle className="w-12 h-12 text-charcoal-700/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal-900 mb-2">No messages yet</h3>
            <p className="text-charcoal-700/60">When buyers contact you, their messages will appear here</p>
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-md ${
                chat.unreadCount > 0
                  ? "bg-terracotta-50 border-terracotta-200"
                  : "bg-white border-cream-200 hover:border-charcoal-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={chat.buyerAvatar}
                    alt={chat.buyerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-charcoal-900">{chat.buyerName}</h3>
                    <span className="text-xs text-charcoal-700/50 shrink-0">
                      {new Date(chat.lastMessageTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal-700/60 truncate">{chat.listingTitle}</p>
                  <p className={`text-sm truncate mt-1 ${
                    chat.unreadCount > 0 ? "text-charcoal-900 font-medium" : "text-charcoal-700/60"
                  }`}>
                    {chat.lastMessage}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-charcoal-400 shrink-0" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ChatView({ chat, onBack }: { chat: ChatThread; onBack: () => void }) {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full hover:bg-cream-100 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-charcoal-700" />
        </button>
        <img
          src={chat.buyerAvatar}
          alt={chat.buyerName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-medium text-charcoal-900">{chat.buyerName}</h3>
          <p className="text-xs text-charcoal-700/60">{chat.listingTitle}</p>
        </div>
        <Link
          href={`/product/${chat.listingId}`}
          className="px-3 py-1.5 text-xs font-medium text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Listing
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "seller" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                msg.sender === "seller"
                  ? "bg-charcoal-900 text-white rounded-br-md"
                  : "bg-cream-100 text-charcoal-900 rounded-bl-md"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === "seller" ? "text-white/60" : "text-charcoal-700/50"
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="pt-4 border-t border-cream-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 focus:bg-white transition-all"
          />
          <button
            disabled={!message.trim()}
            className="w-12 h-12 bg-charcoal-900 text-white rounded-xl flex items-center justify-center hover:bg-charcoal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MAIN PAGE
// =============================================
export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [chats] = useState<ChatThread[]>(MOCK_CHATS);
  const [analytics] = useState<Analytics>(MOCK_ANALYTICS);
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(null);

  const totalUnreadMessages = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  useEffect(() => {
    // Load listings from localStorage
    setListings(getListings());
  }, []);

  const handleDeleteListing = (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteListing(id);
      setListings(getListings());
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-lg border-b border-cream-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-charcoal-700 hover:text-charcoal-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Back to Shop</span>
            </Link>
            <h1 className="font-display text-xl font-semibold text-charcoal-900">
              Seller Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 rounded-full hover:bg-cream-100 flex items-center justify-center transition-colors">
                <Bell className="w-5 h-5 text-charcoal-700" />
                {totalUnreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalUnreadMessages}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <TabNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        unreadMessages={totalUnreadMessages}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "listings" && (
          <ListingsTab listings={listings} onDelete={handleDeleteListing} />
        )}
        {activeTab === "orders" && (
          <OrdersTab orders={orders} />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab analytics={analytics} />
        )}
        {activeTab === "shipping" && (
          <ShippingTab orders={orders} />
        )}
        {activeTab === "messages" && (
          selectedChat ? (
            <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />
          ) : (
            <MessagesTab chats={chats} onSelectChat={setSelectedChat} />
          )
        )}
      </main>
    </div>
  );
}






