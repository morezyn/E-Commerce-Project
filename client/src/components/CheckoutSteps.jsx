import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { label: 'Sign In', link: '/login', active: step1 },
    { label: 'Shipping', link: '/shipping', active: step2 },
    { label: 'Payment', link: '/payment', active: step3 },
    { label: 'Place Order', link: '/placeorder', active: step4 }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    }}>
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          {idx > 0 && (
            <div style={{
              height: '2px',
              width: '40px',
              background: steps[idx].active ? 'var(--color-accent)' : 'var(--bg-tertiary)',
              transition: 'background 0.3s'
            }} />
          )}
          
          {step.active ? (
            <Link
              to={step.link}
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--color-accent-light)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.1)'
              }}
            >
              {step.label}
            </Link>
          ) : (
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: '500',
                color: 'var(--text-muted)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                background: 'transparent',
                border: '1px solid var(--border-glass)'
              }}
            >
              {step.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
