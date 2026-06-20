import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin, CreditCard, ShoppingBag, ArrowLeft, Check } from 'lucide-react';

const PlaceOrderScreen = () => {
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    cartSubtotal,
    shippingPrice,
    taxPrice,
    totalPrice,
    createOrder,
    userInfo
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=placeorder');
      return;
    }
    if (!shippingAddress.address) {
      navigate('/shipping');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [userInfo, shippingAddress, cartItems, navigate]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    const result = await createOrder({
      orderItems: cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: cartSubtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    setLoading(false);

    if (result.success) {
      navigate(`/order/${result.order._id}`);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <CheckoutSteps step1 step2 step3 step4 />
      
      <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-family-title)', marginBottom: '0.5rem' }}>
        Review <span className="gradient-text">Order</span>
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Order Details Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 2 }}>
          {/* Shipping */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-accent-light)' }}>
              <MapPin size={18} /> Shipping Destination
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          {/* Payment Method */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-accent-light)' }}>
              <CreditCard size={18} /> Selected Payment Method
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              <strong>Method: </strong>
              {paymentMethod}
            </p>
          </div>

          {/* Items */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-accent-light)' }}>
              <ShoppingBag size={18} /> Order Items
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <Link to={`/product/${item._id}`} style={{ fontWeight: '500', fontSize: '0.95rem' }}>
                      {item.name}
                    </Link>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    {item.qty} x ${item.price.toFixed(2)} = <b>${(item.qty * item.price).toFixed(2)}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Summary Column */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
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
              <span>${shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tax (8%)</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Order Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-accent-light)', fontFamily: 'var(--font-family-title)' }}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
            >
              {loading ? 'Processing Order...' : (
                <>
                  <Check size={18} /> Place Order
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/payment')}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <ArrowLeft size={16} /> Edit Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
