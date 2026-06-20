import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, ShoppingBag, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { cartItems, userInfo, logoutUser } = useContext(StoreContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="glass-nav">
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingBag size={28} className="gradient-text" style={{ color: 'var(--color-accent)' }} />
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            fontFamily: 'var(--font-family-title)',
            letterSpacing: '-0.03em',
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            NovaShop
          </span>
        </Link>

        {/* Action Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Cart Icon */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingCart size={22} style={{ transition: 'color 0.2s' }} />
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: 'var(--color-secondary)',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
                animation: 'fadeIn 0.2s ease-in'
              }}>
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {userInfo ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  transition: 'background 0.2s'
                }}
              >
                <UserIcon size={18} style={{ color: 'var(--color-accent-light)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{userInfo.name}</span>
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 99
                    }}
                  />
                  <div
                    className="glass-card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      width: '200px',
                      padding: '0.5rem 0',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}
                  >
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        padding: '0.75rem 1.25rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background 0.2s'
                      }}
                    >
                      <UserIcon size={16} />
                      Profile & Orders
                    </Link>

                    {userInfo.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'background 0.2s',
                          color: 'var(--color-accent-light)'
                        }}
                      >
                        <ShieldCheck size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)', margin: '0.25rem 0' }} />

                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      style={{
                        padding: '0.75rem 1.25rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#f87171',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%'
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
