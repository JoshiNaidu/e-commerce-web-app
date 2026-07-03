import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../stores/CartContext';
import styles from './CartDrawer.module.scss';

interface CartDrawerProps {
  onClose?: () => void;
}

export function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  const handleClose = () => {
    closeCart();
    onClose?.();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`} role="dialog" aria-modal="true">
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>
            Your Cart {itemCount > 0 && `(${itemCount})`}
          </h2>
          <button onClick={handleClose} className={styles.drawerClose} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        <div className={styles.drawerContent}>
          {items.length === 0 ? (
            <div className={styles.drawerEmpty}>
              <ShoppingBag className={styles.drawerEmptyIcon} />
              <h3 className={styles.drawerEmptyTitle}>Your cart is empty</h3>
              <p className={styles.drawerEmptyText}>Add items to get started</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div key={`${item.productId}-${item.color.name}-${item.size}`} className={styles.drawerItem}>
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className={styles.drawerItemImage}
                  />
                  <div className={styles.drawerItemDetails}>
                    <span className={styles.drawerItemTitle}>{item.productTitle}</span>
                    <span className={styles.drawerItemVariant}>
                      {item.color.name} / {item.size}
                    </span>
                    <div className={styles.drawerItemActions}>
                      <div className={styles.drawerItemPrice}>
                        {item.originalPrice ? (
                          <div className={styles.drawerItemPriceSale}>
                            <span className={styles.drawerItemOriginalPrice}>
                              ${item.originalPrice.toFixed(2)}
                            </span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          `$${item.price.toFixed(2)}`
                        )}
                      </div>
                      <div className={styles.drawerQuantity}>
                        <button
                          className={styles.drawerQuantityBtn}
                          onClick={() => updateQuantity(item.productId, item.color.name, item.size, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.drawerQuantityValue}>{item.quantity}</span>
                        <button
                          className={styles.drawerQuantityBtn}
                          onClick={() => updateQuantity(item.productId, item.color.name, item.size, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      className={styles.drawerItemRemove}
                      onClick={() => removeItem(item.productId, item.color.name, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.drawerSummary}>
              <div className={styles.drawerSummaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.drawerSummaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={`${styles.drawerSummaryRow} ${styles.drawerSummaryRowTotal}`}>
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button className={styles.drawerCheckout}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}
