import type { ColorVariant, SizeVariant, ProductWithVariants, Product } from '../types';

// Color palettes for different product categories
const colorPalettes: Record<string, ColorVariant[]> = {
  clothing: [
    { name: 'Black', hex: '#1a1a2e' },
    { name: 'Navy', hex: '#1e3a5f' },
    { name: 'White', hex: '#f8fafc' },
    { name: 'Gray', hex: '#64748b' },
  ],
  electronics: [
    { name: 'Space Gray', hex: '#4a5568' },
    { name: 'Silver', hex: '#e2e8f0' },
    { name: 'Gold', hex: '#d4a574' },
  ],
  jewelry: [
    { name: 'Gold', hex: '#d4a574' },
    { name: 'Silver', hex: '#c0c0c0' },
    { name: 'Rose Gold', hex: '#b76e79' },
  ],
  default: [
    { name: 'Default', hex: '#64748b' },
  ],
};

// Size options based on category
const sizeOptions: Record<string, SizeVariant[]> = {
  clothing: [
    { name: 'XS', stock: 5 },
    { name: 'S', stock: 8 },
    { name: 'M', stock: 10 },
    { name: 'L', stock: 3 },
    { name: 'XL', stock: 0 },
  ],
  electronics: [
    { name: 'Standard', stock: 15 },
  ],
  jewelry: [
    { name: 'Small', stock: 4 },
    { name: 'Medium', stock: 6 },
    { name: 'Large', stock: 2 },
  ],
  default: [
    { name: 'One Size', stock: 10 },
  ],
};

// Brand names for mock data
const brands = [
  'Urban Essentials',
  'TechPro',
  'Luxe Collection',
  'Everyday Wear',
  'Premium Goods',
  'Modern Classic',
  'Artisan Craft',
  'Style Studio',
];

// Generate mock variant data for a product
export function generateProductVariants(product: Product): ProductWithVariants {
  const category = product.category.toLowerCase();

  // Determine which category to use
  let variantCategory = 'default';
  if (category.includes('clothing') || category.includes("men's") || category.includes("women's")) {
    variantCategory = 'clothing';
  } else if (category.includes('electronics') || category.includes('tech')) {
    variantCategory = 'electronics';
  } else if (category.includes('jewel')) {
    variantCategory = 'jewelry';
  }

  // Randomly vary stock levels to show different states
  const sizes = sizeOptions[variantCategory].map(size => ({
    ...size,
    stock: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : size.stock, // Some random low stock
  }));

  // Randomly apply sale price
  const hasSale = Math.random() > 0.7;
  const saleMultiplier = hasSale ? 0.8 + Math.random() * 0.15 : 1;

  // Generate multiple image URLs (using placeholder variations)
  const images = [
    product.image,
    `https://picsum.photos/seed/${product.id}-1/400/500`,
    `https://picsum.photos/seed/${product.id}-2/400/500`,
  ];

  return {
    ...product,
    brand: brands[product.id % brands.length],
    colors: colorPalettes[variantCategory],
    sizes,
    images,
    price: hasSale ? Math.round(product.price * saleMultiplier * 100) / 100 : product.price,
    originalPrice: hasSale ? product.price : undefined,
  };
}
