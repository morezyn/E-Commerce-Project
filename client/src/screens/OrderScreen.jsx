import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { MapPin, CreditCard, ShoppingBag, DollarSign, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

const OrderScreen = () => {
  const { id } = useParams();
  const { getOrderDetails, payOrder, deliverOrder, userInfo, showToast } = useContext(StoreContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [delivering, setDelivering] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrderDetails(id);
      setOrder(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePaymentSimulation = async () => {
    setPaying(true);
    try {
      const updatedOrder = await payOrder(id);
      setOrder(updatedOrder);
      showToast('Payment simulated successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPaying(false);
    }
  };

  const handleDeliverSimulation = async () => {
    setDelivering(true);
    try {
      const updatedOrder = await deliverOrder(id);
      setOrder(updatedOrder);
      showToast('Order delivered successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDelivering(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="skeleton" style={{ height: '50px', width: '250px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="skeleton" style={{ height: '120px' }} />
            <div className="skeleton" style={{ height: '120px' }} />
            <div className="skeleton" style={{ height: '200px' }} />
          </div>
          <div className="skeleton" style={{ height: '350px' }} />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Order Not Found</h2>
        <Link to="/" style={{ color: 'var(--color-accent-light)', textDecoration: 'underline' }}>Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ORDER REFERENCE</span>
        <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-family-title)', wordBreak: 'break-all' }}>
          ID: <span style={{ color: 'var(--color-accent-light)' }}>{order._id}</span>
        </h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Order Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 2 }}>
          {/* Shipping */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent-light)' }}>
              <MapPin size={18} /> Shipping Destination
            </h3>
            <p><strong>Name: </strong>{order.user.name}</p>
            <p><strong>Email: </strong>{order.user.email}</p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <div style={{ marginTop: '0.5rem' }}>
              {order.isDelivered ? (
                <div className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="badge badge-danger">Not Yet Shipped / Delivered</div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent-light)' }}>
              <CreditCard size={18} /> Payment Information
            </h3>
            <p><strong>Method: </strong>{order.paymentMethod}</p>
            <div style={{ marginTop: '0.5rem' }}>
              {order.isPaid ? (
                <div className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="badge badge-danger">Payment Pending</div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-accent-light)' }}>
              <ShoppingBag size={18} /> Ordered Products
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.orderItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <Link to={`/product/${item.product}`} style={{ fontWeight: '500', fontSize: '0.95rem' }}>
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

        {/* Pricing Summary */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-title)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
            Payment Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping Fees</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Amount Paid</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-accent-light)', fontFamily: 'var(--font-family-title)' }}>
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {/* Pay Simulation Button */}
            {!order.isPaid && (
              <button
                onClick={handlePaymentSimulation}
                disabled={paying}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {paying ? 'Simulating PayPal...' : (
                  <>
                    <DollarSign size={18} /> Simulate PayPal Payment
                  </>
                )}
              </button>
            )}

            {/* Admin Deliver Button */}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                onClick={handleDeliverSimulation}
                disabled={delivering}
                className="btn"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#4ade80'
                }}
              >
                {delivering ? 'Updating delivery...' : (
                  <>
                    <CheckCircle2 size={18} /> Mark Order As Shipped / Delivered
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
