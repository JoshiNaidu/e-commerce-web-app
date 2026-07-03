import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../stores/CartContext';
import { VariantSelector } from '../../components/VariantSelector';
import type { ColorVariant, SizeVariant } from '../../types';
import styles from './ProductPage.module.scss';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { product, loading, error } = useProduct(id);
  const { addItem, openCart } = useCart();

  // Get initial variant from URL
  const initialColor = useMemo(() => {
    if (!product) return null;
    const colorName = searchParams.get('color');
    if (colorName) {
      const found = product.colors.find((c) => c.name.toLowerCase() === colorName.toLowerCase());
      if (found) return found;
    }
    const firstColor = product.colors[0];
    return firstColor || null;
  }, [product, searchParams]);

  const initialSize = useMemo(() => {
    if (!product) return null;
    const sizeName = searchParams.get('size');
    if (sizeName) {
      const found = product.sizes.find((s) => s.name.toLowerCase() === sizeName.toLowerCase());
      if (found && found.stock > 0) return found;
    }
    const firstAvailable = product.sizes.find((s) => s.stock > 0);
    return firstAvailable || null;
  }, [product, searchParams]);

  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Initialize selected variants when product loads
  useEffect(() => {
    if (product && !selectedColor && initialColor) {
      setSelectedColor(initialColor);
    }
    if (product && !selectedSize && initialSize) {
      setSelectedSize(initialSize);
    }
  }, [product, initialColor, initialSize, selectedColor, selectedSize]);

  // Update URL when variants change
  useEffect(() => {
    if (selectedColor || selectedSize) {
      const params = new URLSearchParams();
      if (selectedColor) params.set('color', selectedColor.name.toLowerCase());
      if (selectedSize) params.set('size', selectedSize.name.toLowerCase());
      setSearchParams(params, { replace: true });
    }
  }, [selectedColor, selectedSize, setSearchParams]);

  const handleColorChange = (color: ColorVariant) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size: SizeVariant) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) return;

    addItem(product, selectedColor, selectedSize.name, quantity);
    openCart();
  };

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

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

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h2>Product not found</h2>
          <Link to="/" className={styles.detailsBack}>
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = selectedSize?.stock === 0;
  const canAddToCart = selectedColor && selectedSize && !isSoldOut;

  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.galleryMain}>
            <img
              src={product.images[activeImageIndex]}
              alt={product.title}
              className={styles.galleryMainImage}
            />
          </div>
          <div className={styles.galleryThumbnails}>
            {product.images.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.galleryThumbnail} ${index === activeImageIndex ? styles.galleryThumbnailActive : ''}`}
                onClick={() => setActiveImageIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt="" className={styles.galleryThumbnailImage} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className={styles.details}>
          <Link to="/" className={styles.detailsBack}>
            <ArrowLeft size={16} />
            Back to products
          </Link>

          <span className={styles.detailsBrand}>{product.brand}</span>

          <h1 className={styles.detailsTitle}>{product.title}</h1>

          <div className={styles.detailsPriceSection}>
            <span className={styles.detailsPrice}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={styles.detailsOriginalPrice}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className={styles.detailsDescription}>{product.description}</p>

          <VariantSelector
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            quantity={quantity}
            onColorChange={handleColorChange}
            onSizeChange={handleSizeChange}
            onQuantityChange={handleQuantityChange}
          />

          <div className={styles.detailsAddToCart}>
            <button
              type="button"
              className={styles.detailsButton}
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={20} />
              {isSoldOut ? 'Sold Out' : canAddToCart ? 'Add to Cart' : 'Select Options'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
