import React, { useEffect, useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

const HomeScreen = () => {
  const { products, loadingProducts, fetchProducts } = useContext(StoreContext);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Wearables', 'Accessories'];

  useEffect(() => {
    fetchProducts(keyword, category);
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(keyword, category);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero Section */}
      <section className="glass-card" style={{
        position: 'relative',
        padding: '4rem 2rem',
        borderRadius: 'var(--border-radius-lg)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1rem',
        overflow: 'hidden'
      }}>
        {/* Animated Glow Backdrops */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.2)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(236, 72, 153, 0.15)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '50px', border: '1px solid var(--border-glass)', fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-accent-light)' }}>
          <Sparkles size={14} /> NEW SEASON ARRIVALS
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          lineHeight: '1.15',
          maxWidth: '800px',
          fontFamily: 'var(--font-family-title)'
        }}>
          Elevate Your Digital Space with <span className="gradient-text">Premium Tech</span>
        </h1>
        
        <p style={{
          color: 'var(--text-secondary)',
          maxWidth: '550px',
          fontSize: '1.05rem',
          lineHeight: '1.6'
        }}>
          Explore our collection of handpicked, high-performance gears designed for creators, developers, and tech enthusiasts.
        </p>
      </section>

      {/* Filter / Search Bar */}
      <section style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Categories Tab */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--border-radius-sm)',
          padding: '0.25rem'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: category === cat ? 'var(--gradient-accent)' : 'transparent',
                color: category === cat ? '#fff' : 'var(--text-secondary)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search premium gear..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
            Search
          </button>
        </form>
      </section>

      {/* Product Grid */}
      <section>
        {loadingProducts ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card" style={{ height: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="skeleton" style={{ flexGrow: 1, height: '200px' }} />
                <div className="skeleton" style={{ height: '20px', width: '60%' }} />
                <div className="skeleton" style={{ height: '16px', width: '40%' }} />
                <div className="skeleton" style={{ height: '38px', width: '100%' }} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-card" style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <h3>No Products Found</h3>
            <p style={{ marginTop: '0.5rem' }}>Try clearing filters or search for another keyword.</p>
          </div>
        ) : (
          <div className="animate-slide-up" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {products.map((product) => (
              <div key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeScreen;
