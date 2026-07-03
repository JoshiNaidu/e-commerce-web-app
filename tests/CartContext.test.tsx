import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../src/stores/CartContext';
import type { ProductWithVariants } from '../src/types';

const mockProduct: ProductWithVariants = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  originalPrice: 39.99,
  description: 'A test product',
  category: 'clothing',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.5, count: 100 },
  brand: 'Test Brand',
  colors: [{ name: 'Black', hex: '#000000' }],
  sizes: [{ name: 'M', stock: 5 }],
  images: ['https://example.com/image.jpg'],
};

const mockProduct2: ProductWithVariants = {
  id: 2,
  title: 'Second Product',
  price: 49.99,
  description: 'Another test product',
  category: 'clothing',
  image: 'https://example.com/image2.jpg',
  rating: { rate: 4.0, count: 50 },
  brand: 'Test Brand',
  colors: [{ name: 'White', hex: '#FFFFFF' }],
  sizes: [{ name: 'L', stock: 3 }],
  images: ['https://example.com/image2.jpg'],
};

function TestComponent() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  } = useCart();

  return (
    <div>
      <span data-testid="item-count">{itemCount}</span>
      <span data-testid="subtotal">{subtotal}</span>
      <span data-testid="is-open">{isOpen ? 'true' : 'false'}</span>
      <span data-testid="items-length">{items.length}</span>
      <button
        data-testid="add-item"
        onClick={() => addItem(mockProduct, mockProduct.colors[0], 'M', 1)}
      >
        Add Item
      </button>
      <button
        data-testid="add-item-2"
        onClick={() => addItem(mockProduct2, mockProduct2.colors[0], 'L', 1)}
      >
        Add Second Item
      </button>
      <button
        data-testid="add-same-item"
        onClick={() => addItem(mockProduct, mockProduct.colors[0], 'M', 2)}
      >
        Add More of Same
      </button>
      <button
        data-testid="remove-item"
        onClick={() => removeItem(1, 'Black', 'M')}
      >
        Remove Item
      </button>
      <button
        data-testid="update-quantity"
        onClick={() => updateQuantity(1, 'Black', 'M', 3)}
      >
        Update Quantity
      </button>
      <button
        data-testid="update-to-zero"
        onClick={() => updateQuantity(1, 'Black', 'M', 0)}
      >
        Update to Zero
      </button>
      <button data-testid="clear-cart" onClick={clearCart}>
        Clear Cart
      </button>
      <button data-testid="open-cart" onClick={openCart}>
        Open Cart
      </button>
      <button data-testid="close-cart" onClick={closeCart}>
        Close Cart
      </button>
      <button data-testid="toggle-cart" onClick={toggleCart}>
        Toggle Cart
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('addItem', () => {
    it('adds a new item to the cart', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('1');
        expect(screen.getByTestId('items-length').textContent).toBe('1');
        expect(screen.getByTestId('subtotal').textContent).toBe('29.99');
      });
    });

    it('updates quantity when adding the same item again', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-same-item'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('3');
        expect(screen.getByTestId('items-length').textContent).toBe('1');
      });
    });

    it('adds different items separately', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-item-2'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('2');
        expect(screen.getByTestId('items-length').textContent).toBe('2');
        expect(screen.getByTestId('subtotal').textContent).toBe('79.98');
      });
    });
  });

  describe('removeItem', () => {
    it('removes an item from the cart', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('remove-item'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('0');
        expect(screen.getByTestId('items-length').textContent).toBe('0');
      });
    });

    it('does nothing when removing non-existent item', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('remove-item'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('0');
      });
    });
  });

  describe('updateQuantity', () => {
    it('updates the quantity of an item', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('update-quantity'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('3');
        expect(screen.getByTestId('subtotal').textContent).toBe('89.97');
      });
    });

    it('removes item when quantity is set to 0', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('update-to-zero'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('0');
        expect(screen.getByTestId('items-length').textContent).toBe('0');
      });
    });

    it('does nothing when updating non-existent item', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('update-quantity'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('0');
      });
    });
  });

  describe('clearCart', () => {
    it('clears all items from the cart', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-item-2'));
      fireEvent.click(screen.getByTestId('clear-cart'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('0');
        expect(screen.getByTestId('items-length').textContent).toBe('0');
        expect(screen.getByTestId('subtotal').textContent).toBe('0');
      });
    });
  });

  describe('cart state', () => {
    it('calculates item count correctly', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-same-item'));

      await waitFor(() => {
        expect(screen.getByTestId('item-count').textContent).toBe('3');
      });
    });

    it('calculates subtotal correctly', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('add-item'));
      fireEvent.click(screen.getByTestId('add-item-2'));

      await waitFor(() => {
        expect(screen.getByTestId('subtotal').textContent).toBe('79.98');
      });
    });
  });

  describe('cart drawer state', () => {
    it('starts closed', () => {
      renderWithProvider();
      expect(screen.getByTestId('is-open').textContent).toBe('false');
    });

    it('opens the cart', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('open-cart'));

      await waitFor(() => {
        expect(screen.getByTestId('is-open').textContent).toBe('true');
      });
    });

    it('closes the cart', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('open-cart'));
      fireEvent.click(screen.getByTestId('close-cart'));

      await waitFor(() => {
        expect(screen.getByTestId('is-open').textContent).toBe('false');
      });
    });

    it('toggles the cart', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('toggle-cart'));

      await waitFor(() => {
        expect(screen.getByTestId('is-open').textContent).toBe('true');
      });

      fireEvent.click(screen.getByTestId('toggle-cart'));

      await waitFor(() => {
        expect(screen.getByTestId('is-open').textContent).toBe('false');
      });
    });
  });
});
