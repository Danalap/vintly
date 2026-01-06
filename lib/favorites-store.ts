// Favorites Store - manages saved/liked products with localStorage persistence

export interface FavoriteProduct {
  id: string;
  title: string;
  price: number;
  brand: string;
  imageUrl: string;
  size: string;
  condition: string;
  savedAt: number;
}

const STORAGE_KEY = "vintly_favorites";

// Get all favorites from localStorage
export function getFavorites(): FavoriteProduct[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
}

// Add a product to favorites
export function addFavorite(product: Omit<FavoriteProduct, "savedAt">): void {
  const favorites = getFavorites();
  
  // Check if already exists
  if (favorites.some((f) => f.id === product.id)) {
    return;
  }
  
  const newFavorite: FavoriteProduct = {
    ...product,
    savedAt: Date.now(),
  };
  
  favorites.unshift(newFavorite);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Remove a product from favorites
export function removeFavorite(productId: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter((f) => f.id !== productId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Check if a product is in favorites
export function isFavorite(productId: string): boolean {
  const favorites = getFavorites();
  return favorites.some((f) => f.id === productId);
}

// Toggle favorite status
export function toggleFavorite(product: Omit<FavoriteProduct, "savedAt">): boolean {
  if (isFavorite(product.id)) {
    removeFavorite(product.id);
    return false;
  } else {
    addFavorite(product);
    return true;
  }
}

// Get favorites count
export function getFavoritesCount(): number {
  return getFavorites().length;
}

