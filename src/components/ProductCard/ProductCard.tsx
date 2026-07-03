import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { ProductWithVariants } from '../../types';
import { useCart } from '../../stores/CartContext';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: ProductWithVariants;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add with first available variant
    const firstAvailableSize = product.sizes.find((s) => s.stock > 0);
    const firstColor = product.colors[0];

    if (firstAvailableSize && firstColor) {
      addItem(product, firstColor, firstAvailableSize.name, 1);
    }
  };

  const canQuickAdd = product.sizes.some((s) => s.stock > 0);

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.cardLink}>
        <div className={styles.cardImageWrapper}>
          <img src={product.images[0]} alt={product.title} className={styles.cardImage} loading="lazy" />
        </div>

        <div className={styles.cardContent}>
          <span className={styles.cardCategory}>{product.category}</span>
          <h3 className={styles.cardTitle}>{product.title}</h3>

          <div className={styles.cardFooter}>
            <div className={styles.cardPriceWrapper}>
              {product.originalPrice && (
                <span className={styles.cardOriginalPrice}>${product.originalPrice.toFixed(2)}</span>
              )}
              <span className={styles.cardPrice}>${product.price.toFixed(2)}</span>
            </div>

            {canQuickAdd && (
              <button
                onClick={handleQuickAdd}
                className={styles.cardAddButton}
                aria-label="Add to cart"
                title="Quick add to cart"
              >
                <Plus className={styles.cardAddIcon} />
              </button>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
