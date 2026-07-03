import { useState, useEffect } from 'react';
import type { Product, ProductWithVariants } from '../types';
import { generateProductVariants } from '../data/mockVariants';

const API_URL = 'https://fakestoreapi.com/products';

interface UseProductsResult {
  products: ProductWithVariants[];
  loading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data: Product[] = await response.json();

        if (isMounted) {
          // Transform products to include variants
          const transformedProducts = data.map(generateProductVariants);
          setProducts(transformedProducts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}

export function useProduct(id: number | string | undefined): {
  product: ProductWithVariants | null;
  loading: boolean;
  error: string | null;
} {
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data: Product = await response.json();

        if (isMounted) {
          setProduct(generateProductVariants(data));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
}
