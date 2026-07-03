# Design Decisions

## State Management: Context API vs. Zustand/Redux

**Decision**: Used React Context API with a custom `CartProvider` instead of a third-party state management library like Zustand or Redux.

**Alternatives Considered**:
1. **Zustand**: Lightweight, minimal boilerplate, excellent for small-to-medium apps. Would have been a great fit for this scope.
2. **Redux Toolkit**: Overkill for a single cart state, but familiar to many developers and offers great devtools.
3. **React Context + useReducer**: More boilerplate than needed for this case.

**Rationale**:
- The cart state is the only truly global state in this application
- The state shape is simple (array of items with basic CRUD operations)
- No complex side effects, middleware, or time-travel debugging needs
- Using Context keeps dependencies minimal and demonstrates understanding of React's built-in tools
- The localStorage persistence is handled cleanly with a custom `useLocalStorage` hook, decoupled from state management

With more time, I would migrate to Zustand if we added more global state (user auth, wishlist, recently viewed) or needed better performance for frequent updates.

## CSS Architecture: SCSS Modules vs. CSS-in-JS

**Decision**: Used SCSS modules with CSS custom properties, as required by the spec.

**Approach**:
- `_variables.scss` and `_mixins.scss` for design tokens and utilities
- CSS custom properties (`:root` variables) for easy access in component modules
- Scoped class names via `.module.scss` files prevent conflicts

**What I'd Change With More Time**:
- The CSS-in-JS warning during build suggests I'd benefit from configuring the Sass modern API in Vite
- Some responsive styles are handled via media queries in modules; I'd consider consolidating breakpoint logic
- I'd add more robust theming via CSS custom properties (light/dark mode support)

## Variant Data Strategy

**Challenge**: The Fake Store API doesn't provide variant data (colors, sizes, stock levels).

**Solution**: Generated mock variants client-side in `data/mockVariants.ts` with:
- Category-aware color/size presets
- Randomized stock levels to demonstrate sold-out and low-stock states
- Random sale prices to show discount UI
- Multiple images via Picsum for the gallery

**Trade-off**: This approach is deterministic for each product ID but doesn't persist across page reloads (the random stock values recalculate). A production app would have real backend data.

## Deep Linking Implementation

**Approach**: Used `URLSearchParams` with React Router's `useSearchParams` hook to sync selected color/size to the URL.

- Allows sharing direct links to specific variants
- URL updates don't cause scroll jumps (using `replace: true`)
- Initial state reads from URL, defaulting to first available if not specified

## What I'd Clean Up With More Time

1. **Loading states**: Would add skeleton placeholders instead of just spinners
2. **Error handling**: Would add retry buttons and more graceful fallbacks
3. **Accessibility**: Would audit with axe-core and add more ARIA labels, especially for the image gallery and variant selection
4. **Testing**: Would add unit tests for the variant selector logic (sold-out state, quantity cap) and cart calculations
5. **Performance**: Would add image preloading for thumbnails and consider virtualization for long product lists
6. **Animation**: Would add smooth transitions for cart drawer and variant state changes
