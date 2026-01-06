// =============================================
// LISTINGS STORE - Local Storage Persistence
// =============================================

export interface Listing {
  id: string;
  photos: string[];
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  brand: string;
  color: string;
  price: number;
  shippingWeight: string;
  // Shipping settings
  allowPickup: boolean;
  allowDelivery: boolean;
  shippingIncluded: boolean;
  pickupLocation: string;
  status: "available" | "sold" | "draft";
  createdAt: string;
  // Simulated seller info
  sellerName: string;
  sellerAvatar: string;
  likes: number;
}

const STORAGE_KEY = "vintly_listings";

// Generate a unique ID
export function generateId(): string {
  return `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get all listings from localStorage
export function getListings(): Listing[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading listings from localStorage:", error);
    return [];
  }
}

// Save a new listing
export function saveListing(listing: Omit<Listing, "id" | "createdAt" | "status" | "sellerName" | "sellerAvatar" | "likes">): Listing {
  const newListing: Listing = {
    ...listing,
    id: generateId(),
    status: "available",
    createdAt: new Date().toISOString(),
    // Simulated seller info (would come from auth in real app)
    sellerName: "You",
    sellerAvatar: "",
    likes: 0,
  };

  const listings = getListings();
  listings.unshift(newListing); // Add to beginning
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  } catch (error) {
    console.error("Error saving listing to localStorage:", error);
  }

  return newListing;
}

// Update a listing
export function updateListing(id: string, updates: Partial<Listing>): Listing | null {
  const listings = getListings();
  const index = listings.findIndex((l) => l.id === id);
  
  if (index === -1) return null;

  listings[index] = { ...listings[index], ...updates };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  } catch (error) {
    console.error("Error updating listing in localStorage:", error);
  }

  return listings[index];
}

// Delete a listing
export function deleteListing(id: string): boolean {
  const listings = getListings();
  const filtered = listings.filter((l) => l.id !== id);
  
  if (filtered.length === listings.length) return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting listing from localStorage:", error);
    return false;
  }

  return true;
}

// Get a single listing by ID
export function getListing(id: string): Listing | null {
  const listings = getListings();
  return listings.find((l) => l.id === id) || null;
}

// Clear all listings (for testing)
export function clearAllListings(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}


