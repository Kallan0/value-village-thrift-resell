import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of a product based on your dummy data
export interface Product {
  _id: string;
  name: string;
  emoji: string;
  meta: string;
  priceNow: number;
  priceWas: number;
  savePercentage: number;
  badge?: { type: 'hot' | 'thrift' | 'new' | 'drop' | 'low'; text: string };
  seller?: string;
}

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Adds the item if it's not there, removes it if it is!
  const toggleWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item._id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}