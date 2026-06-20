import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(StoreContext);

  // Helper function to render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} style={{ position: 'relative', display: 'inline-block', width: '14px', height: '14px' }}>
            <Star size={14} stroke="#475569" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={14} stroke="#475569" />);
      }
    }
    return stars;
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      padding: '1rem',
      borderRadius: 'var(--border-radius-md)'
    }}>
      {/* Product Image Container */}
      <Link to={`/product/${product._id}`} style={{
        display: 'block',
        position: 'relative',
        paddingTop: '75%', // 4:3 Aspect Ratio
        overflow: 'hidden',
        borderRadius: 'var(--border-radius-sm)',
        marginBottom: '1rem',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {product.countInStock === 0 && (
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#cbd5e1',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '600'
          }}>
            OUT OF STOCK
          </span>
        )}
      </Link>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          fontWeight: '600',
          letterSpacing: '0.05em',
          marginBottom: '0.25rem'
        }}>
          {product.category}
        </span>
        
        <Link to={`/product/${product._id}`} style={{ marginBottom: '0.5rem' }}>
          <h3 style={{
            fontSize: '1rem',
            color: 'var(--text-primary)',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.8rem',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent-light)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            {product.name}
          </h3>
        </Link>

        {/* Stars and reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {renderStars(product.rating)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ({product.numReviews})
          </span>
        </div>

        {/* Bottom Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto'
        }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            fontFamily: 'var(--font-family-title)',
            color: 'var(--text-primary)'
          }}>
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.countInStock === 0}
            className="btn btn-primary"
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              minWidth: '38px',
              height: '38px'
            }}
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
