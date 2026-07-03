# ShopNow - Mini E-Commerce

A mini e-commerce web application built with React 18, TypeScript, SCSS modules, and the Fake Store API.

## Features

- **Product Listing**: Responsive grid of products with quick-add functionality
- **Product Details**: Full product page with image gallery, variant selection, and stock indicators
- **Cart Management**: Slide-out cart drawer with quantity controls and bill summary
- **State Persistence**: Cart survives page refresh via localStorage
- **Deep Linking**: Product variants reflected in URL for shareable links
- **Responsive Design**: Optimized for mobile and desktop viewports

## Tech Stack

- **React 18** with hooks (no class components)
- **TypeScript** for type safety
- **SCSS Modules** for scoped, maintainable styles
- **Vite** for fast development and optimized builds
- **React Router v6** for client-side routing
- **localStorage** for cart persistence
- **Fake Store API** for product data

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd mini-ecommerce

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CartDrawer/       # Slide-out cart panel
│   ├── Navbar/           # Navigation with cart badge
│   ├── ProductCard/      # Product grid item with quick-add
│   └── VariantSelector/  # Color, size, and quantity picker
├── data/                 # Static data and mock variant generation
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useProducts.ts
├── pages/                # Route-level components
│   ├── HomePage/
│   └── ProductPage/
├── stores/               # Global state (Context API)
│   └── CartContext.tsx
├── styles/               # Global SCSS (variables, mixins, main)
├── types/                # TypeScript interfaces
├── App.tsx               # Root component with providers and router
├── main.tsx              # Entry point
└── index.scss            # Global styles entry
```

## Key Design Decisions

See [DECISIONS.md](./DECISIONS.md) for a detailed breakdown of architectural choices and trade-offs.

## Known Limitations

- Product variants (colors, sizes, stock) are generated client-side since the Fake Store API doesn't provide this data
- Checkout is a placeholder - no payment integration
- Images beyond the first are from Picsum since Fake Store API only provides one image per product

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check
