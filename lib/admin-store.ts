// Admin Store - manages admin authentication and data

const ADMIN_SESSION_KEY = "vintly_admin_session";
const ADMIN_CREDENTIALS = {
  email: "admin@vintly.com",
  password: "admin123",
};

// Check if admin is logged in
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

// Admin login
export function adminLogin(email: string, password: string): boolean {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }
  return false;
}

// Admin logout
export function adminLogout(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// Mock Orders Data
export interface Order {
  id: string;
  orderNumber: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingMethod: "delivery" | "pickup";
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_1",
    orderNumber: "VTL-20240115-001",
    productTitle: "Chanel Classic Flap Bag Medium Caviar",
    productImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
    productPrice: 4850,
    buyerName: "Emily Thompson",
    buyerEmail: "emily@example.com",
    sellerName: "Alexandra",
    status: "shipped",
    shippingMethod: "delivery",
    shippingAddress: "123 Park Avenue, New York, NY 10001",
    trackingNumber: "1Z999AA10123456784",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "ord_2",
    orderNumber: "VTL-20240114-002",
    productTitle: "Hermès Birkin 30 Togo Leather",
    productImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop",
    productPrice: 12500,
    buyerName: "Sarah Mitchell",
    buyerEmail: "sarah@example.com",
    sellerName: "Isabelle",
    status: "confirmed",
    shippingMethod: "delivery",
    shippingAddress: "456 Luxury Lane, Beverly Hills, CA 90210",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
  },
  {
    id: "ord_3",
    orderNumber: "VTL-20240113-003",
    productTitle: "Dior Bar Jacket Wool Silk Blend",
    productImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop",
    productPrice: 2890,
    buyerName: "Jessica Wang",
    buyerEmail: "jessica@example.com",
    sellerName: "Margaux",
    status: "delivered",
    shippingMethod: "delivery",
    shippingAddress: "789 Fashion Street, Miami, FL 33101",
    trackingNumber: "1Z999AA10123456785",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-17T11:30:00Z",
  },
  {
    id: "ord_4",
    orderNumber: "VTL-20240112-004",
    productTitle: "Valentino Haute Couture Gown Silk",
    productImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=200&fit=crop",
    productPrice: 8900,
    buyerName: "Amanda Roberts",
    buyerEmail: "amanda@example.com",
    sellerName: "Victoria",
    status: "pending",
    shippingMethod: "pickup",
    createdAt: "2024-01-12T18:00:00Z",
    updatedAt: "2024-01-12T18:00:00Z",
  },
  {
    id: "ord_5",
    orderNumber: "VTL-20240111-005",
    productTitle: "Louboutin So Kate 120mm Patent",
    productImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop",
    productPrice: 595,
    buyerName: "Nicole Davis",
    buyerEmail: "nicole@example.com",
    sellerName: "Camille",
    status: "cancelled",
    shippingMethod: "delivery",
    shippingAddress: "321 Style Ave, Chicago, IL 60601",
    createdAt: "2024-01-11T12:30:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
];

// Mock Sellers Data
export interface Seller {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "pending" | "suspended";
  rating: number;
  totalSales: number;
  totalRevenue: number;
  joinedAt: string;
  location: string;
  verified: boolean;
  activeListings: number;
}

export const MOCK_SELLERS: Seller[] = [
  {
    id: "sel_1",
    name: "Alexandra",
    email: "alexandra@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "active",
    rating: 4.9,
    totalSales: 89,
    totalRevenue: 245000,
    joinedAt: "2021-03-15",
    location: "Paris, France",
    verified: true,
    activeListings: 12,
  },
  {
    id: "sel_2",
    name: "Margaux",
    email: "margaux@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "active",
    rating: 4.8,
    totalSales: 156,
    totalRevenue: 389000,
    joinedAt: "2020-07-22",
    location: "Monaco",
    verified: true,
    activeListings: 8,
  },
  {
    id: "sel_3",
    name: "Isabelle",
    email: "isabelle@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    status: "active",
    rating: 5.0,
    totalSales: 312,
    totalRevenue: 1250000,
    joinedAt: "2019-01-10",
    location: "Geneva, Switzerland",
    verified: true,
    activeListings: 24,
  },
  {
    id: "sel_4",
    name: "Victoria",
    email: "victoria@example.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    status: "pending",
    rating: 0,
    totalSales: 0,
    totalRevenue: 0,
    joinedAt: "2024-01-10",
    location: "London, UK",
    verified: false,
    activeListings: 3,
  },
  {
    id: "sel_5",
    name: "Camille",
    email: "camille@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    status: "suspended",
    rating: 3.2,
    totalSales: 15,
    totalRevenue: 12000,
    joinedAt: "2023-06-01",
    location: "Milan, Italy",
    verified: true,
    activeListings: 0,
  },
];

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeSellers: number;
  activeListings: number;
  pendingOrders: number;
  pendingVerifications: number;
}

export function getDashboardStats(): DashboardStats {
  return {
    totalRevenue: 1896000,
    totalOrders: 572,
    activeSellers: 48,
    activeListings: 156,
    pendingOrders: 12,
    pendingVerifications: 5,
  };
}











