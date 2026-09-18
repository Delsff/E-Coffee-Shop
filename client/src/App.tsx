import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { MOCK_PRODUCT } from './data/mockProducts';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { FilterBar } from './components/FilterBar';
import { AuthModal } from './components/AuthModal';
import type { Product } from './types';
import { API_URL } from './config';
function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSeacrQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedRoast, setSelectedRoast] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const origins = useMemo(() => Array.from(new Set(MOCK_PRODUCT.map((p) => p.origin))), [products]);
  const roast = useMemo(
    () => Array.from(new Set(MOCK_PRODUCT.map((p) => p.roastLevel))),
    [products],
  );
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCT.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavorProfile.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesOrigin = selectedOrigin ? product.origin === selectedOrigin : true;
      const matchesRoast = selectedRoast ? product.roastLevel === selectedRoast : true;
      return matchesSearch && matchesRoast && matchesOrigin;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'score-desc') return b.score - a.score;
      return 0;
    });
  }, [searchQuery, selectedOrigin, selectedRoast, sortBy]);
  const handleResetFilters = () => {
    setSeacrQuery('');
    setSelectedOrigin('');
    setSelectedRoast('');
    setSortBy('default');
  };
  return (
    <div className='min-h-screen bg-stone-950 text-stone-100 font-sans'>
      <Header onOpenCart={() => setIsCartOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <FilterBar
          searchQuery={searchQuery}
          setSeacrQuery={setSeacrQuery}
          selectedOrigin={selectedOrigin}
          setSelectedOrigin={setSelectedOrigin}
          selectedRoast={selectedRoast}
          setSelectedRoast={setSelectedRoast}
          sortBy={sortBy}
          setSortBy={setSortBy}
          origins={origins}
          roasts={roast}
          onReset={handleResetFilters}
        />
        {loading ? (
          <div className='text-center py-20 text-stone-400'>Loading fresh coffee beans...</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8'>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default App;
