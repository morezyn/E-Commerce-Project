import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const StoreProvider = ({ children }) => {
  // State initialization
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem('shippingAddress');
    return saved ? JSON.parse(saved) : { address: '', city: '', postalCode: '', country: '' };
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const saved = localStorage.getItem('paymentMethod');
    return saved ? JSON.parse(saved) : 'PayPal';
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState(null);

  // Custom Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
  }, [paymentMethod]);

  // Fetch all products
  const fetchProducts = async (keyword = '', category = 'All') => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      let url = `${API_URL}/api/products?keyword=${keyword}`;
      if (category && category !== 'All') {
        url += `&category=${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setErrorProducts(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);

      if (existItem) {
        showToast(`Updated ${product.name} quantity to ${qty}`);
        return prevItems.map((x) =>
          x._id === existItem._id ? { ...x, qty } : x
        );
      } else {
        showToast(`Added ${product.name} to cart`);
        return [...prevItems, { ...product, qty }];
      }
    });
  };

  const removeFromCart = (id) => {
    const item = cartItems.find((x) => x._id === id);
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
    if (item) {
      showToast(`Removed ${item.name} from cart`, 'error');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Auth Operations
  const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      setUserInfo(data);
      showToast(`Welcome back, ${data.name}!`);
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const registerUser = async (name, email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setUserInfo(data);
      showToast(`Account created! Welcome, ${data.name}.`);
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update failed');

      setUserInfo(data);
      showToast('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logoutUser = () => {
    setUserInfo(null);
    clearCart();
    setShippingAddress({ address: '', city: '', postalCode: '', country: '' });
    setPaymentMethod('PayPal');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    showToast('Logged out successfully');
  };

  // Order Operations
  const createOrder = async (order) => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to place order');

      clearCart();
      showToast('Order placed successfully!');
      return { success: true, order: data };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const getOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load order');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const payOrder = async (orderId, paymentResult = {}) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(paymentResult),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Payment failed');
      showToast('Order payment simulated successfully!');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deliverOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to mark as delivered');
      showToast('Order marked as delivered!');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to cancel order');
      showToast('Order cancelled successfully!');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const getMyOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load order history');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Helper values for calculations
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = cartSubtotal > 150 ? 0 : 15;
  const taxPrice = Number((0.08 * cartSubtotal).toFixed(2));
  const totalPrice = Number((cartSubtotal + shippingPrice + taxPrice).toFixed(2));

  return (
    <StoreContext.Provider
      value={{
        userInfo,
        cartItems,
        shippingAddress,
        paymentMethod,
        products,
        loadingProducts,
        errorProducts,
        toast,
        cartSubtotal,
        shippingPrice,
        taxPrice,
        totalPrice,
        showToast,
        setShippingAddress,
        setPaymentMethod,
        fetchProducts,
        addToCart,
        removeFromCart,
        clearCart,
        loginUser,
        registerUser,
        updateUserProfile,
        logoutUser,
        createOrder,
        getOrderDetails,
        payOrder,
        deliverOrder,
        cancelOrder,
        getMyOrders,
        API_URL,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
