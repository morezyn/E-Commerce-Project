import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';

const PaymentScreen = () => {
  const { shippingAddress, paymentMethod, setPaymentMethod, userInfo } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=payment');
      return;
    }
    // If shipping address doesn't exist, redirect back
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [userInfo, shippingAddress, navigate]);

  const [method, setMethod] = useState(paymentMethod || 'PayPal');

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentMethod(method);
    navigate('/placeorder');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <CheckoutSteps step1 step2 step3 />
      
      <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--border-radius-lg)' }}>
        <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-family-title)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Payment <span className="gradient-text">Method</span>
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '0.5rem' }}>
            Select your preferred method of payment:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* PayPal Method */}
            <label
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                padding: '1.25rem',
                border: method === 'PayPal' ? '1px solid var(--color-accent)' : '1px solid var(--border-glass)',
                background: method === 'PayPal' ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-glass)',
                transition: 'all 0.2s'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                checked={method === 'PayPal'}
                onChange={(e) => setMethod(e.target.value)}
                style={{ cursor: 'pointer', accentColor: 'var(--color-accent)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600' }}>PayPal or Credit Card</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay securely using PayPal or international credit cards</span>
              </div>
            </label>

            {/* Stripe / Mock Method */}
            <label
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                padding: '1.25rem',
                border: method === 'Stripe' ? '1px solid var(--color-accent)' : '1px solid var(--border-glass)',
                background: method === 'Stripe' ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-glass)',
                transition: 'all 0.2s'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Stripe"
                checked={method === 'Stripe'}
                onChange={(e) => setMethod(e.target.value)}
                style={{ cursor: 'pointer', accentColor: 'var(--color-accent)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600' }}>Stripe (Direct Card Pay)</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure payment processing powered by Stripe</span>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/shipping')}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
