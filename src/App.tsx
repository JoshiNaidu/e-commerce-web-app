import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './stores/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
              </Routes>
            </Suspense>
          </main>
          <CartDrawer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
