import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

const CartScreen = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    cartSubtotal,
    shippingPrice,
    taxPrice,
    totalPrice
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/login?redirect=shipping');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-family-title)' }}>
        Shopping <span className="gradient-text">Cart</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <ShoppingCart size={48} style={{ color: 'var(--text-muted)' }} />
          <div>
            <h2>Your cart is currently empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Add items from the store to populate your shopping cart.
            </p>
          </div>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 2 }}>
            {cartItems.map((item) => (
              <div key={item._id} className="glass-card animate-slide-up" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                padding: '1rem'
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                
                <div style={{ flexGrow: 1, minWidth: '200px' }}>
                  <Link to={`/product/${item._id}`} style={{
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent-light)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                    {item.name}
                  </Link>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Brand: {item.brand}
                  </p>
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: '700', minWidth: '80px' }}>
                  ${item.price.toFixed(2)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <select
                    value={item.qty}
                    onChange={(e) => addToCart(item, Number(e.target.value))}
                    className="form-input"
                    style={{ width: '70px', padding: '0.4rem' }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1} style={{ background: 'var(--bg-secondary)', color: 'white' }}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn btn-danger btn-icon"
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary sidebar */}
          <div className="glass-card" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'sticky',
            top: '100px'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-title)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span>
                  {shippingPrice === 0 ? (
                    <span style={{ color: 'var(--color-accent-light)', fontWeight: '600' }}>FREE</span>
                  ) : (
                    `$${shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tax (8%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              {shippingPrice > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-accent-light)', marginTop: '0.25rem' }}>
                  💡 Add <b>${(150 - cartSubtotal).toFixed(2)}</b> more to qualify for Free Shipping!
                </p>
              )}
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Est. Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-accent-light)', fontFamily: 'var(--font-family-title)' }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
