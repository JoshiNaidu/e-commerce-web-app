import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/ProductCard';
import styles from './HomePage.module.scss';

export function HomePage() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading} role="status" aria-live="polite">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error} role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Shop Our Collection</h1>
        <p className={styles.pageSubtitle}>Discover the latest products at great prices</p>
      </header>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
