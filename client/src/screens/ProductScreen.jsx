import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ArrowLeft, Star, ShoppingCart, Shield, Truck, RotateCcw } from 'lucide-react';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, API_URL, showToast, userInfo } = useContext(StoreContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, API_URL]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} style={{ display: 'inline-block', position: 'relative', width: '16px', height: '16px' }}>
            <Star size={16} stroke="#475569" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
              <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={16} stroke="#475569" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '120px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="skeleton" style={{ height: '450px', borderRadius: '12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="skeleton" style={{ height: '40px', width: '80%' }} />
            <div className="skeleton" style={{ height: '24px', width: '40%' }} />
            <div className="skeleton" style={{ height: '100px', width: '100%' }} />
            <div className="skeleton" style={{ height: '60px', width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back Button */}
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Product Image */}
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', borderRadius: 'var(--border-radius-lg)' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'cover',
              borderRadius: 'var(--border-radius-md)'
            }}
          />
        </div>

        {/* Product Content details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>{product.brand}</span>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-family-title)' }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>{renderStars(product.rating)}</div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {product.rating} / 5.0 ({product.numReviews} user reviews)
              </span>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)' }} />

          <div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {product.description}
            </p>
          </div>

          {/* Pricing & Stock Card */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Price</span>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-family-title)' }}>
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Availability</span>
              <span className={product.countInStock > 0 ? 'badge badge-success' : 'badge badge-danger'}>
                {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out Of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="qty-select" style={{ color: 'var(--text-secondary)' }}>Quantity</label>
                <select
                  id="qty-select"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="form-input"
                  style={{ width: '80px', padding: '0.4rem 0.6rem' }}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1} style={{ background: 'var(--bg-secondary)', color: 'white' }}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {userInfo && userInfo.role === 'seller' ? (
              <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Sellers cannot purchase products (merchant mode).
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem' }}
              >
                <ShoppingCart size={20} /> Add To Shopping Cart
              </button>
            )}
          </div>

          {/* Assurances */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center', marginTop: '0.5rem' }}>
            <div className="glass-card" style={{ padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <Truck size={20} style={{ color: 'var(--color-accent-light)' }} />
              <span style={{ fontWeight: '600' }}>Free Shipping</span>
              <span style={{ color: 'var(--text-muted)' }}>Orders over $150</span>
            </div>
            <div className="glass-card" style={{ padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <RotateCcw size={20} style={{ color: 'var(--color-accent-light)' }} />
              <span style={{ fontWeight: '600' }}>Easy Return</span>
              <span style={{ color: 'var(--text-muted)' }}>Within 30 days</span>
            </div>
            <div className="glass-card" style={{ padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <Shield size={20} style={{ color: 'var(--color-accent-light)' }} />
              <span style={{ fontWeight: '600' }}>Secure Pay</span>
              <span style={{ color: 'var(--text-muted)' }}>SSL Encrypted</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
