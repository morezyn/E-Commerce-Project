import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ShieldCheck, Plus, Trash2, Edit3, DollarSign, ShoppingBag, UserCheck, X } from 'lucide-react';

const AdminDashboardScreen = () => {
  const { userInfo, API_URL, showToast } = useContext(StoreContext);
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  // Dashboard Stats States
  const [stats, setStats] = useState({ totalSales: 0, orderCount: 0, userCount: 0 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit / Add Form State
  const [editingProduct, setEditingProduct] = useState(null); // null means list view, non-null is the product object we're editing
  const [formFields, setFormFields] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: ''
  });

  const fetchData = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      // 1. Fetch products
      const resProducts = await fetch(`${API_URL}/api/products`);
      const dataProducts = await resProducts.json();
      setProducts(dataProducts);

      // 2. Fetch orders (Admin)
      const resOrders = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const dataOrders = await resOrders.json();

      // 3. Fetch users (Admin)
      const resUsers = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const dataUsers = await resUsers.json();

      // Calculate stats
      const paidOrders = dataOrders.filter(o => o.isPaid);
      const totalSales = paidOrders.reduce((acc, o) => acc + o.totalPrice, 0);

      setStats({
        totalSales,
        orderCount: dataOrders.length,
        userCount: dataUsers.length
      });

    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_URL]);

  const handleCreateProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Create product failed');

      showToast('Template product created! Editing now.');
      handleStartEdit(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setFormFields({
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'countInStock' ? Number(value) : value
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(formFields)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update product failed');

      showToast('Product updated successfully!');
      setEditingProduct(null);
      fetchData(); // Reload list
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Delete product failed');

      showToast('Product deleted successfully');
      fetchData(); // Reload list
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '250px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div className="skeleton" style={{ height: '100px' }} />
          <div className="skeleton" style={{ height: '100px' }} />
          <div className="skeleton" style={{ height: '100px' }} />
        </div>
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-family-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={28} className="gradient-text" style={{ color: 'var(--color-accent)' }} /> Admin <span className="gradient-text">Console</span>
        </h1>

        {!editingProduct && (
          <button onClick={handleCreateProduct} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
            <Plus size={18} /> Add New Product
          </button>
        )}
      </div>

      {/* Metrics Row */}
      {!editingProduct && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Sales Metric */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <DollarSign size={28} style={{ color: 'var(--color-accent-light)' }} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Revenue</span>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                ${stats.totalSales.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* Orders Metric */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <ShoppingBag size={28} style={{ color: 'var(--color-secondary)' }} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Orders</span>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {stats.orderCount}
              </h2>
            </div>
          </div>

          {/* Users Metric */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <UserCheck size={28} style={{ color: '#4ade80' }} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Registered Users</span>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {stats.userCount}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Main Panel */}
      {editingProduct ? (
        /* Edit Form Panel */
        <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%', position: 'relative' }}>
          <button
            onClick={handleCancelEdit}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
            title="Cancel"
          >
            <X size={22} />
          </button>

          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-title)', marginBottom: '2rem' }}>
            Edit Product: <span className="gradient-text">{editingProduct.name}</span>
          </h2>

          <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="prod-name">Product Name</label>
              <input
                id="prod-name"
                type="text"
                name="name"
                value={formFields.name}
                onChange={handleFormFieldChange}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="prod-price">Price ($)</label>
                <input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  name="price"
                  value={formFields.price}
                  onChange={handleFormFieldChange}
                  className="form-input"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-stock">Stock Count</label>
                <input
                  id="prod-stock"
                  type="number"
                  name="countInStock"
                  value={formFields.countInStock}
                  onChange={handleFormFieldChange}
                  className="form-input"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prod-image">Image URL</label>
              <input
                id="prod-image"
                type="text"
                name="image"
                value={formFields.image}
                onChange={handleFormFieldChange}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="prod-brand">Brand</label>
                <input
                  id="prod-brand"
                  type="text"
                  name="brand"
                  value={formFields.brand}
                  onChange={handleFormFieldChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-category">Category</label>
                <input
                  id="prod-category"
                  type="text"
                  name="category"
                  value={formFields.category}
                  onChange={handleFormFieldChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prod-desc">Description</label>
              <textarea
                id="prod-desc"
                name="description"
                value={formFields.description}
                onChange={handleFormFieldChange}
                className="form-input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Products List Panel */
        <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Image</th>
                <th style={{ padding: '1rem 0.5rem' }}>ID</th>
                <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                <th style={{ padding: '1rem 0.5rem' }}>Price</th>
                <th style={{ padding: '1rem 0.5rem' }}>Stock</th>
                <th style={{ padding: '1rem 0.5rem' }}>Category</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {product._id}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    ${product.price.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className={product.countInStock > 0 ? 'badge badge-success' : 'badge badge-danger'} style={{ fontSize: '0.7rem' }}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                    {product.category}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="btn btn-secondary btn-icon"
                        title="Edit Product"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn btn-danger btn-icon"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
