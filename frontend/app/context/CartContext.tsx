import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// 1. Define the shape of a Cart Item (Matching your MongoDB data)
export interface CartItem {
  _id: string;
  name: string;
  price: number | string;
  imageUrl?: string[];
  category?: string;
  condition?: string;
  quantity: number; // The cart specifically needs to track this!
}

// 2. Define the tools this context will provide to the rest of the app
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
}

// 3. Create the Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Create the Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- MEMORY: Load cart from browser storage on first load ---
  useEffect(() => {
    const savedCart = localStorage.getItem("value-village-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data");
      }
    }
    setIsLoaded(true);
  }, []);

  // --- MEMORY: Save to browser storage whenever the cart changes ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("value-village-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // --- ACTION: Add an item (or increase quantity if it exists) ---
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === product._id);
      
      if (existingItem) {
        // If it's already in the cart, just add 1 to the quantity
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      // If it's new, add it with a starting quantity of 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // --- ACTION: Remove an item completely ---
  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  // --- ACTION: Update quantity (+ or - buttons) ---
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id); // If quantity drops below 1, just remove it
      return;
    }
    setCartItems(prev => prev.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // --- ACTION: Empty the cart (useful for after checkout) ---
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 5. Create a Custom Hook so you don't have to import useContext everywhere
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}