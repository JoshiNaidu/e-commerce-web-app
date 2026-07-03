import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../stores/CartContext';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const prevScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll !== prevScroll.current) {
        setScrolled(currentScroll > 10);
        prevScroll.current = currentScroll;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo}>
          <ShoppingBag className={styles.navbarLogoIcon} />
          <span>ShopNow</span>
        </Link>

        <button onClick={openCart} className={styles.navbarCartButton} aria-label="Open cart">
          <ShoppingBag className={styles.navbarCartIcon} />
          {itemCount > 0 && <span className={styles.navbarBadge}>{itemCount}</span>}
        </button>
      </div>
      <div className={styles.navbarShadow} />
    </nav>
  );
}
