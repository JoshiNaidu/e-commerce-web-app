// Product types from FakeStore API
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Extended product with variants (we generate these since FakeStore doesn't have them)
export interface ColorVariant {
  name: string;
  hex: string;
}

export interface SizeVariant {
  name: string;
  stock: number; // 0 = sold out, 1-3 = low stock, 4+ = in stock
}

export interface ProductVariant {
  color: ColorVariant;
  size: SizeVariant;
  price: number;
  originalPrice?: number;
}

export interface ProductWithVariants extends Product {
  brand: string;
  colors: ColorVariant[];
  sizes: SizeVariant[];
  images: string[];
  originalPrice?: number;
}

// Cart types
export interface CartItem {
  productId: number;
  productTitle: string;
  productImage: string;
  color: ColorVariant;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// UI state types
export type StockStatus = 'in-stock' | 'low-stock' | 'sold-out';
