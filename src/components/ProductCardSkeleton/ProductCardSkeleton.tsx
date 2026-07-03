import styles from './ProductCardSkeleton.module.scss';

function ProductCardSkeleton() {
  return (
    <article className={styles.card}>
      <div className={styles.image} />

      <div className={styles.content}>
        <div className={styles.category} />
        <div className={styles.title} />
        <div className={styles.price} />
      </div>
    </article>
  );
}

export default ProductCardSkeleton;