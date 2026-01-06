"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  LogOut,
  Search,
  ChevronDown,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  AlertTriangle,
  Star,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import {
  isAdminLoggedIn,
  adminLogout,
  getDashboardStats,
  MOCK_ORDERS,
  MOCK_SELLERS,
  type Order,
  type Seller,
  type DashboardStats,
} from "@/lib/admin-store";

// =============================================
// SIDEBAR
// =============================================
interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag, badge: 12 },
    { id: "sellers", label: "Sellers", icon: Users, badge: 5 },
    { id: "listings", label: "Listings", icon: Package },
  ];

  return (
    <aside className="w-64 bg-charcoal-900 text-cream-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-charcoal-800">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold text-cream-50">
            vintly
          </span>
          <span className="text-xs bg-terracotta-500 text-white px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
              activeTab === tab.id
                ? "bg-cream-50 text-charcoal-900"
                : "text-cream-200 hover:bg-charcoal-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </div>
            {tab.badge && (
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  activeTab === tab.id
                    ? "bg-terracotta-500 text-white"
                    : "bg-charcoal-700 text-cream-200"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-charcoal-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-cream-200 hover:bg-charcoal-800 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

// =============================================
// DASHBOARD TAB
// =============================================
function DashboardTab({ stats }: { stats: DashboardStats }) {
  const statCards = [
    {
      label: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`,
      change: "+12.5%",
      positive: true,
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      change: "+8.2%",
      positive: true,
      icon: ShoppingBag,
    },
    {
      label: "Active Sellers",
      value: stats.activeSellers,
      change: "+3",
      positive: true,
      icon: Users,
    },
    {
      label: "Active Listings",
      value: stats.activeListings,
      change: "-5",
      positive: false,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-cream-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-sand-100 rounded-xl flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-charcoal-700" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.positive ? "text-sage-600" : "text-red-500"
                }`}
              >
                {stat.positive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-charcoal-900">{stat.value}</p>
            <p className="text-sm text-charcoal-700/60 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-charcoal-900">
                {stats.pendingOrders} Pending Orders
              </h3>
              <p className="text-sm text-charcoal-700/70 mt-1">
                Orders awaiting confirmation or shipment
              </p>
              <button className="mt-3 text-sm font-medium text-amber-600 hover:text-amber-700">
                Review Orders →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-charcoal-900">
                {stats.pendingVerifications} Pending Verifications
              </h3>
              <p className="text-sm text-charcoal-700/70 mt-1">
                New sellers waiting for approval
              </p>
              <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
                Review Sellers →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-charcoal-900">
            Recent Orders
          </h3>
          <button className="text-sm text-terracotta-500 hover:text-terracotta-600 font-medium">
            View All
          </button>
        </div>
        <div className="divide-y divide-cream-200">
          {MOCK_ORDERS.slice(0, 4).map((order) => (
            <div key={order.id} className="px-6 py-4 flex items-center gap-4">
              <img
                src={order.productImage}
                alt={order.productTitle}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal-900 truncate">
                  {order.productTitle}
                </p>
                <p className="text-xs text-charcoal-700/60">
                  {order.buyerName} • {order.orderNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-charcoal-900">
                  ${order.productPrice.toLocaleString()}
                </p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================
// STATUS BADGE
// =============================================
function StatusBadge({ status }: { status: Order["status"] | Seller["status"] }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-sage-100 text-sage-700",
    cancelled: "bg-red-100 text-red-700",
    active: "bg-sage-100 text-sage-700",
    suspended: "bg-red-100 text-red-700",
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

// =============================================
// ORDERS TAB
// =============================================
function OrdersTab() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.buyerName.toLowerCase().includes(query) ||
        order.productTitle.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-700/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-cream-300 rounded-xl text-sm text-charcoal-800 focus:outline-none focus:border-charcoal-800"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-50 border-b border-cream-200">
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-sand-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.productImage}
                        alt={order.productTitle}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-charcoal-900 line-clamp-1 max-w-[200px]">
                          {order.productTitle}
                        </p>
                        <p className="text-xs text-charcoal-700/60">{order.orderNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-charcoal-900">{order.buyerName}</p>
                    <p className="text-xs text-charcoal-700/60">{order.buyerEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-charcoal-900">{order.sellerName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-charcoal-900">
                      ${order.productPrice.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-charcoal-700/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-sand-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-charcoal-700/50" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-charcoal-700/60">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================
// SELLERS TAB
// =============================================
function SellersTab() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSellers = MOCK_SELLERS.filter((seller) => {
    if (statusFilter !== "all" && seller.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        seller.name.toLowerCase().includes(query) ||
        seller.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-700/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sellers..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-cream-300 rounded-xl text-sm text-charcoal-800 focus:outline-none focus:border-charcoal-800"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSellers.map((seller) => (
          <div
            key={seller.id}
            className="bg-white rounded-2xl border border-cream-200 p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-charcoal-900">{seller.name}</h3>
                    {seller.verified && (
                      <CheckCircle className="w-4 h-4 text-sage-500" />
                    )}
                  </div>
                  <p className="text-xs text-charcoal-700/60">{seller.email}</p>
                </div>
              </div>
              <StatusBadge status={seller.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-charcoal-700/60">Total Sales</p>
                <p className="font-semibold text-charcoal-900">{seller.totalSales}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal-700/60">Revenue</p>
                <p className="font-semibold text-charcoal-900">
                  ${(seller.totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-xs text-charcoal-700/60">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-charcoal-900">
                    {seller.rating || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-charcoal-700/60">Listings</p>
                <p className="font-semibold text-charcoal-900">{seller.activeListings}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-charcoal-700/60 mb-4">
              <MapPin className="w-3.5 h-3.5" />
              {seller.location}
              <span className="mx-1">•</span>
              <Calendar className="w-3.5 h-3.5" />
              Joined {seller.joinedAt}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-sand-100 text-charcoal-800 text-sm font-medium rounded-lg hover:bg-sand-200 transition-colors">
                View Profile
              </button>
              {seller.status === "pending" && (
                <button className="flex-1 py-2 bg-sage-500 text-white text-sm font-medium rounded-lg hover:bg-sage-600 transition-colors">
                  Approve
                </button>
              )}
              {seller.status === "active" && (
                <button className="flex-1 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors">
                  Suspend
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSellers.length === 0 && (
        <div className="py-12 text-center bg-white rounded-2xl border border-cream-200">
          <p className="text-charcoal-700/60">No sellers found</p>
        </div>
      )}
    </div>
  );
}

// =============================================
// LISTINGS TAB
// =============================================
function ListingsTab() {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-sand-100 rounded-2xl flex items-center justify-center">
        <Package className="w-8 h-8 text-charcoal-700/40" />
      </div>
      <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2">
        Listings Management
      </h3>
      <p className="text-charcoal-700/60 max-w-md mx-auto">
        View and manage all product listings, including authentication status, pricing, and visibility.
      </p>
      <button className="mt-6 px-6 py-2.5 bg-charcoal-900 text-cream-50 font-medium rounded-xl hover:bg-charcoal-800 transition-colors">
        Coming Soon
      </button>
    </div>
  );
}

// =============================================
// MAIN ADMIN PAGE
// =============================================
export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Check if admin is logged in
    if (!isAdminLoggedIn()) {
      router.push("/admin/login");
      return;
    }

    // Load stats
    setStats(getDashboardStats());
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-charcoal-900 capitalize">
            {activeTab === "dashboard" ? "Dashboard Overview" : activeTab}
          </h1>
          <p className="text-charcoal-700/60 mt-1">
            {activeTab === "dashboard" && "Welcome back! Here's what's happening today."}
            {activeTab === "orders" && "Manage and track all customer orders."}
            {activeTab === "sellers" && "Review and manage seller accounts."}
            {activeTab === "listings" && "Manage product listings and authentication."}
          </p>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && stats && <DashboardTab stats={stats} />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "sellers" && <SellersTab />}
        {activeTab === "listings" && <ListingsTab />}
      </main>
    </div>
  );
}






