import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider, StoreContext } from './context/StoreContext';
import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Toast Container Component
const ToastNotification = () => {
  const { toast } = useContext(StoreContext);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderRadius: 'var(--border-radius-md)',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(8px)',
      border: isError ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
      boxShadow: isError ? '0 8px 30px rgba(239, 68, 68, 0.2)' : '0 8px 30px rgba(99, 102, 241, 0.2)',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      color: '#fff',
      maxWidth: '350px'
    }}>
      {isError ? (
        <AlertCircle size={20} style={{ color: '#f87171', flexShrink: 0 }} />
      ) : (
        <CheckCircle2 size={20} style={{ color: 'var(--color-accent-light)', flexShrink: 0 }} />
      )}
      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{toast.message}</span>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(7, 10, 16, 0.8)',
        borderTop: '1px solid var(--border-glass)',
        padding: '2.5rem 2rem',
        marginTop: 'auto',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-family-title)', color: '#fff' }}>
            NovaShop
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '500px', lineHeight: '1.5' }}>
            The ultimate hardware setup shop. Handpicked premium components, keyboard kits, smart wear, and desktop accessories.
          </p>
          <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)', width: '100%', margin: '1rem 0' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} NovaShop Inc. All rights reserved. Built with Vite, React, Express, and MongoDB.
          </p>
        </div>
      </footer>

      {/* Toast Alert popup */}
      <ToastNotification />
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
}

export default App;
