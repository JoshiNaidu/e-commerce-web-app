import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import ProductCardSkeleton from '../../components/ProductCardSkeleton';
import styles from './HomePage.module.scss';

function HomePage() {
  const { products, loading, error } = useProducts();

if (loading) {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Shop Our Collection</h1>
        <p className={styles.pageSubtitle}>
          Discover the latest products at great prices
        </p>
      </header>

      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
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
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
