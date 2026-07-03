import { Minus, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ColorVariant, SizeVariant, StockStatus, ProductWithVariants } from '../../types';
import styles from './VariantSelector.module.scss';

interface VariantSelectorProps {
  product: ProductWithVariants;
  selectedColor: ColorVariant | null;
  selectedSize: SizeVariant | null;
  quantity: number;
  onColorChange: (color: ColorVariant) => void;
  onSizeChange: (size: SizeVariant) => void;
  onQuantityChange: (quantity: number) => void;
}

function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'sold-out';
  if (stock <= 3) return 'low-stock';
  return 'in-stock';
}

export function VariantSelector({
  product,
  selectedColor,
  selectedSize,
  quantity,
  onColorChange,
  onSizeChange,
  onQuantityChange,
}: VariantSelectorProps) {
  const maxQuantity = selectedSize?.stock ?? 0;
  const currentStockStatus = selectedSize ? getStockStatus(selectedSize.stock) : null;

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      onQuantityChange(value);
    }
  };

  return (
    <div className={styles.selector}>
      {/* Color selection */}
      <div className={styles.selectorGroup}>
        <span className={styles.selectorLabel}>
          Color: <span className={styles.selectorLabelValue}>{selectedColor?.name || 'Select a color'}</span>
        </span>
        <div className={styles.selectorOptions}>
          {product.colors.map((color) => (
            <button
              key={color.name}
              type="button"
              className={`${styles.selectorColorBtn} ${
                selectedColor?.name === color.name ? styles.selectorColorBtnSelected : ''
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => onColorChange(color)}
              aria-label={`Select ${color.name}`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Size selection */}
      <div className={styles.selectorGroup}>
        <span className={styles.selectorLabel}>
          Size: <span className={styles.selectorLabelValue}>{selectedSize?.name || 'Select a size'}</span>
        </span>
        <div className={styles.selectorOptions}>
          {product.sizes.map((size) => {
            const stockStatus = getStockStatus(size.stock);
            const isSelected = selectedSize?.name === size.name;

            return (
              <button
                key={size.name}
                type="button"
                disabled={stockStatus === 'sold-out'}
                className={`${styles.selectorSizeBtn}
                  ${isSelected ? styles.selectorSizeBtnSelected : ''}
                  ${stockStatus === 'low-stock' ? styles.selectorSizeBtnLowStock : ''}
                  ${stockStatus === 'sold-out' ? styles.selectorSizeBtnSoldOut : ''}
                `}
                onClick={() => stockStatus !== 'sold-out' && onSizeChange(size)}
                aria-label={`${size.name} ${stockStatus === 'sold-out' ? 'sold out' : `${size.stock} available`}`}
              >
                <span className={styles.selectorSizeName}>{size.name}</span>
                {stockStatus !== 'sold-out' && (
                  <span className={styles.selectorSizeStock}>
                    {stockStatus === 'low-stock' ? `${size.stock} left` : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {currentStockStatus && (
          <div
            className={`${styles.selectorStockMessage} ${
              currentStockStatus === 'low-stock' ? styles.selectorStockMessageWarning : ''
            }`}
          >
            {currentStockStatus === 'in-stock' && selectedSize && (
              <>
                <CheckCircle size={14} />
                {selectedSize.stock} in stock
              </>
            )}
            {currentStockStatus === 'low-stock' && selectedSize && (
              <>
                <AlertTriangle size={14} />
                Only {selectedSize.stock} left - order soon!
              </>
            )}
          </div>
        )}
      </div>

      {/* Quantity picker */}
      {selectedSize && currentStockStatus !== 'sold-out' && (
        <div className={styles.quantityPicker}>
          <span className={styles.quantityPickerLabel}>Quantity:</span>
          <div className={styles.quantityPickerControls}>
            <button
              type="button"
              className={styles.quantityPickerBtn}
              onClick={handleQuantityDecrease}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              className={styles.quantityPickerInput}
              value={quantity}
              onChange={handleQuantityInput}
              min={1}
              max={maxQuantity}
              aria-label="Quantity"
            />
            <button
              type="button"
              className={styles.quantityPickerBtn}
              onClick={handleQuantityIncrease}
              disabled={quantity >= maxQuantity}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
