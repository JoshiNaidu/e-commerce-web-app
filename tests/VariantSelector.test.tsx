import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VariantSelector } from '../src/components/VariantSelector/VariantSelector';
import type { ProductWithVariants } from '../src/types';

const mockProduct: ProductWithVariants = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A test product',
  category: 'clothing',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.5, count: 100 },
  brand: 'Test Brand',
  colors: [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
  ],
  sizes: [
    { name: 'S', stock: 5 },
    { name: 'M', stock: 2 },
    { name: 'L', stock: 0 },
  ],
  images: ['https://example.com/image.jpg'],
};

describe('VariantSelector', () => {
  const defaultProps = {
    product: mockProduct,
    selectedColor: mockProduct.colors[0],
    selectedSize: mockProduct.sizes[0],
    quantity: 1,
    onColorChange: vi.fn(),
    onSizeChange: vi.fn(),
    onQuantityChange: vi.fn(),
  };

  it('renders all color options', () => {
    render(<VariantSelector {...defaultProps} />);
    const colorButtons = screen.getAllByRole('button', { name: /select/i });
    expect(colorButtons.length).toBeGreaterThan(0);
  });

  it('renders all size options', () => {
    render(<VariantSelector {...defaultProps} />);

    expect(screen.getByRole('button', { name: /S.*5 available/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /M.*2 available/i })).toBeInTheDocument();
  });

  it('disables sold-out size button', () => {
    render(<VariantSelector {...defaultProps} />);

    const soldOutBtn = screen.getByRole('button', { name: /L.*sold out/i });
    expect(soldOutBtn).toBeDisabled();
  });

  it('shows low stock indicator for sizes with low stock', () => {
    render(<VariantSelector {...defaultProps} />);

    const lowStockBtn = screen.getByRole('button', { name: /M.*2 available/i });
    expect(lowStockBtn).toBeInTheDocument();
  });

  it('calls onColorChange when a color is clicked', () => {
    const onColorChange = vi.fn();
    render(<VariantSelector {...defaultProps} onColorChange={onColorChange} />);

    const whiteBtn = screen.getByRole('button', { name: 'Select White' });
    fireEvent.click(whiteBtn);

    expect(onColorChange).toHaveBeenCalledWith(mockProduct.colors[1]);
  });

  it('calls onSizeChange when a size is clicked', () => {
    const onSizeChange = vi.fn();
    render(<VariantSelector {...defaultProps} onSizeChange={onSizeChange} />);

    const mBtn = screen.getByRole('button', { name: /M.*2 available/i });
    fireEvent.click(mBtn);

    expect(onSizeChange).toHaveBeenCalledWith(mockProduct.sizes[1]);
  });

  it('does not call onSizeChange when sold-out size is clicked', () => {
    const onSizeChange = vi.fn();
    render(<VariantSelector {...defaultProps} onSizeChange={onSizeChange} />);

    const soldOutBtn = screen.getByRole('button', { name: /L.*sold out/i });
    fireEvent.click(soldOutBtn);

    expect(onSizeChange).not.toHaveBeenCalled();
  });

  it('renders quantity picker when size is selected with stock', () => {
    render(<VariantSelector {...defaultProps} />);

    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
  });

  it('calls onQuantityChange when increase button is clicked', () => {
    const onQuantityChange = vi.fn();
    render(<VariantSelector {...defaultProps} onQuantityChange={onQuantityChange} />);

    const increaseBtn = screen.getByLabelText('Increase quantity');
    fireEvent.click(increaseBtn);

    expect(onQuantityChange).toHaveBeenCalledWith(2);
  });

  it('calls onQuantityChange when decrease button is clicked', () => {
    const onQuantityChange = vi.fn();
    render(<VariantSelector {...defaultProps} quantity={2} onQuantityChange={onQuantityChange} />);

    const decreaseBtn = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decreaseBtn);

    expect(onQuantityChange).toHaveBeenCalledWith(1);
  });

  it('does not decrease quantity below 1', () => {
    const onQuantityChange = vi.fn();
    render(<VariantSelector {...defaultProps} quantity={1} onQuantityChange={onQuantityChange} />);

    const decreaseBtn = screen.getByLabelText('Decrease quantity');
    expect(decreaseBtn).toBeDisabled();
  });

  it('does not increase quantity beyond max stock', () => {
    const onQuantityChange = vi.fn();
    render(
      <VariantSelector
        {...defaultProps}
        selectedSize={mockProduct.sizes[1]}
        quantity={2}
        onQuantityChange={onQuantityChange}
      />
    );

    const increaseBtn = screen.getByLabelText('Increase quantity');
    expect(increaseBtn).toBeDisabled();
  });

  it('shows stock message for in-stock items', () => {
    render(<VariantSelector {...defaultProps} />);

    expect(screen.getByText(/5 in stock/i)).toBeInTheDocument();
  });

  it('shows low stock warning for low-stock items', () => {
    render(
      <VariantSelector
        {...defaultProps}
        selectedSize={mockProduct.sizes[1]}
      />
    );

    expect(screen.getByText(/Only 2 left/i)).toBeInTheDocument();
  });

  it('does not show quantity picker for sold-out items', () => {
    render(
      <VariantSelector
        {...defaultProps}
        selectedSize={mockProduct.sizes[2]}
      />
    );

    expect(screen.queryByLabelText('Quantity')).not.toBeInTheDocument();
  });

  it('displays selected color name', () => {
    render(<VariantSelector {...defaultProps} />);

    expect(screen.getByText('Black')).toBeInTheDocument();
  });

  it('displays selected size name', () => {
    render(<VariantSelector {...defaultProps} />);

    const sizeLabels = screen.getAllByText('S');
    expect(sizeLabels.length).toBeGreaterThan(0);
  });

  it('updates quantity via input field', () => {
    const onQuantityChange = vi.fn();
    render(<VariantSelector {...defaultProps} onQuantityChange={onQuantityChange} />);

    const input = screen.getByLabelText('Quantity') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '3' } });

    expect(onQuantityChange).toHaveBeenCalledWith(3);
  });

  it('ignores invalid quantity input', () => {
    const onQuantityChange = vi.fn();
    render(<VariantSelector {...defaultProps} onQuantityChange={onQuantityChange} />);

    const input = screen.getByLabelText('Quantity') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(onQuantityChange).not.toHaveBeenCalled();
  });

  it('ignores quantity input above max', () => {
    const onQuantityChange = vi.fn();
    render(<VariantSelector {...defaultProps} onQuantityChange={onQuantityChange} />);

    const input = screen.getByLabelText('Quantity') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10' } });

    expect(onQuantityChange).not.toHaveBeenCalled();
  });
});
