import { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CartItem, ColorVariant, ProductWithVariants } from '../types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: ProductWithVariants, color: ColorVariant, size: string, quantity: number) => void;
  removeItem: (productId: number, color: string, size: string) => void;
  updateQuantity: (productId: number, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'mini-ecommerce-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>(STORAGE_KEY, []);
  const [isOpen, setIsOpen] = useLocalStorage<boolean>('mini-ecommerce-cart-open', false);

  // Calculate derived state
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const addItem = useCallback(
    (product: ProductWithVariants, color: ColorVariant, size: string, quantity: number) => {
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.productId === product.id && item.color.name === color.name && item.size === size
        );

        if (existingIndex > -1) {
          // Update quantity for existing item
          const newItems = [...prevItems];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
          return newItems;
        }

        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          productTitle: product.title,
          productImage: product.image,
          color,
          size,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity,
        };
        return [...prevItems, newItem];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (productId: number, color: string, size: string) => {
      setItems((prevItems) =>
        prevItems.filter((item) => !(item.productId === productId && item.color.name === color && item.size === size))
      );
    },
    [setItems]
  );

  const updateQuantity = useCallback(
    (productId: number, color: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, color, size);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId && item.color.name === color && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    },
    [setItems, removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const openCart = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeCart = useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [setIsOpen]);

  const value: CartContextType = {
    items,
    isOpen,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
