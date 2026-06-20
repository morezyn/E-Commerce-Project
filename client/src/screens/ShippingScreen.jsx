import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { Home, MapPin, Globe, Compass, ArrowRight } from 'lucide-react';

const ShippingScreen = () => {
  const { shippingAddress, setShippingAddress, userInfo } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
    }
  }, [userInfo, navigate]);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <CheckoutSteps step1 step2 />
      
      <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--border-radius-lg)' }}>
        <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-family-title)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Shipping <span className="gradient-text">Details</span>
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <div style={{ position: 'relative' }}>
              <Home size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="address"
                type="text"
                placeholder="123 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* City */}
          <div className="form-group">
            <label htmlFor="city">City</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="city"
                type="text"
                placeholder="San Francisco"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Postal Code */}
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <div style={{ position: 'relative' }}>
              <Compass size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="postalCode"
                type="text"
                placeholder="94103"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Country */}
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <div style={{ position: 'relative' }}>
              <Globe size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="country"
                type="text"
                placeholder="United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            Continue to Payment <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;
