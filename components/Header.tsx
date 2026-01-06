"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Trash2,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Store,
  Package,
} from "lucide-react";
import { getFavorites, removeFavorite, type FavoriteProduct } from "@/lib/favorites-store";
import { getCurrentUser, signOut, type User as UserType } from "@/lib/user-store";

// =============================================
// FAVORITES MODAL
// =============================================
interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteProduct[];
  onRemove: (id: string) => void;
  onProductClick: (id: string) => void;
}

function FavoritesModal({ isOpen, onClose, favorites, onRemove, onProductClick }: FavoritesModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/30 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-20 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-96 max-h-[70vh] bg-cream-50 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-cream-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-terracotta-500 fill-terracotta-500" />
            <h3 className="font-display text-lg font-semibold text-charcoal-900">
              Saved Items
            </h3>
            <span className="px-2 py-0.5 bg-sand-200 text-charcoal-700 text-xs font-medium rounded-full">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sand-100 text-charcoal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-sand-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-charcoal-700/30" />
              </div>
              <p className="font-medium text-charcoal-800 mb-1">No saved items yet</p>
              <p className="text-sm text-charcoal-700/60">
                Click the heart on any piece to save it for later.
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-sand-100 transition-colors group"
                >
                  <button
                    onClick={() => {
                      onProductClick(item.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-charcoal-700/60 mb-0.5">{item.brand}</p>
                      <p className="text-sm font-medium text-charcoal-800 line-clamp-2">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-charcoal-900">
                          ${item.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-charcoal-700/50">•</span>
                        <span className="text-xs text-charcoal-700/60">{item.size}</span>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 rounded-full text-charcoal-700/40 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="px-5 py-3 border-t border-cream-300 bg-sand-50">
            <Link
              href="/"
              onClick={onClose}
              className="block w-full py-2.5 bg-charcoal-900 text-cream-50 text-sm font-medium text-center rounded-full hover:bg-charcoal-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

// =============================================
// HEADER COMPONENT
// =============================================
export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [user, setUser] = useState<UserType | null>(null);

  // Load favorites and user on mount and listen for changes
  useEffect(() => {
    const loadFavorites = () => {
      setFavorites(getFavorites());
    };

    const loadUser = () => {
      setUser(getCurrentUser());
    };

    loadFavorites();
    loadUser();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vintly_favorites") {
        loadFavorites();
      }
      if (e.key === "vintly_user_session") {
        loadUser();
      }
    };

    // Custom events for same-tab updates
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    const handleUserAuthChanged = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    window.addEventListener("userAuthChanged", handleUserAuthChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
      window.removeEventListener("userAuthChanged", handleUserAuthChanged);
    };
  }, []);

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
    // Dispatch event for other components
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const handleProductClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-50/80 backdrop-blur-lg border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl sm:text-3xl font-semibold text-charcoal-900 tracking-tight">
              vintly
            </span>
            <span className="hidden sm:inline-block text-xs text-terracotta-500 font-medium bg-terracotta-500/10 px-2 py-0.5 rounded-full">
              couture
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-700/50 group-focus-within:text-charcoal-800 transition-colors" />
              <input
                type="text"
                placeholder="Search Chanel, Dior, Hermès..."
                className="w-full pl-11 pr-4 py-2.5 bg-sand-100 border border-transparent rounded-full text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/browse"
              className="text-charcoal-700 hover:text-charcoal-900 text-sm font-medium transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="text-charcoal-700 hover:text-charcoal-900 text-sm font-medium transition-colors"
            >
              Sell
            </Link>
            <button 
              onClick={() => setShowFavorites(true)}
              className="relative p-2 text-charcoal-700 hover:text-charcoal-900 transition-colors"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? "fill-terracotta-500 text-terracotta-500" : ""}`} />
              {favorites.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-terracotta-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
            </button>
            <button className="relative p-2 text-charcoal-700 hover:text-charcoal-900 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            
            {/* User Menu / Sign In */}
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-sand-100 transition-colors"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=C4A484&color=1a1a1a`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown className={`w-4 h-4 text-charcoal-700 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-cream-50 rounded-2xl shadow-xl border border-cream-200 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-cream-200">
                        <p className="font-medium text-charcoal-900">{user.name}</p>
                        <p className="text-sm text-charcoal-700/60 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/seller"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full px-4 py-2.5 text-left text-sm text-charcoal-700 hover:bg-sand-100 flex items-center gap-3"
                        >
                          <Store className="w-4 h-4" />
                          Seller Dashboard
                        </Link>
                        <button className="w-full px-4 py-2.5 text-left text-sm text-charcoal-700 hover:bg-sand-100 flex items-center gap-3">
                          <User className="w-4 h-4" />
                          My Profile
                        </button>
                        <button className="w-full px-4 py-2.5 text-left text-sm text-charcoal-700 hover:bg-sand-100 flex items-center gap-3">
                          <Package className="w-4 h-4" />
                          My Purchases
                        </button>
                        <button className="w-full px-4 py-2.5 text-left text-sm text-charcoal-700 hover:bg-sand-100 flex items-center gap-3">
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                      </div>
                      <div className="border-t border-cream-200 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="ml-2 px-5 py-2 bg-charcoal-900 text-cream-50 text-sm font-medium rounded-full hover:bg-charcoal-800 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setShowFavorites(true)}
              className="relative p-2 text-charcoal-700"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? "fill-terracotta-500 text-terracotta-500" : ""}`} />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-700/50" />
              <input
                type="text"
                placeholder="Search Chanel, Dior, Hermès..."
                className="w-full pl-11 pr-4 py-3 bg-sand-100 rounded-xl text-sm text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/browse"
                className="py-3 text-charcoal-700 text-left font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/sell"
                className="py-3 text-charcoal-700 text-left font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sell
              </Link>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowFavorites(true);
                }}
                className="py-3 text-charcoal-700 text-left font-medium flex items-center gap-2"
              >
                Favorites
                {favorites.length > 0 && (
                  <span className="px-2 py-0.5 bg-terracotta-500 text-white text-xs font-medium rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>
              
              {user ? (
                <div className="mt-2 p-3 bg-sand-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=C4A484&color=1a1a1a`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-charcoal-900">{user.name}</p>
                      <p className="text-xs text-charcoal-700/60">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/seller"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 text-charcoal-900 text-sm font-medium text-center rounded-lg bg-cream-50 hover:bg-white mb-2 flex items-center justify-center gap-2"
                  >
                    <Store className="w-4 h-4" />
                    Seller Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-red-600 text-sm font-medium text-center rounded-lg hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 py-3 bg-charcoal-900 text-cream-50 font-medium rounded-xl text-center block"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
        onRemove={handleRemoveFavorite}
        onProductClick={handleProductClick}
      />
    </header>
  );
}
