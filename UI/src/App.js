import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Layout from './components/Layout/Layout';
import LiveOrders from './pages/LiveOrders';
import MenuManagement from './pages/MenuManagement';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || 'orders';
  });
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // Save active page to localStorage whenever it changes
  const handlePageChange = (page) => {
    setActivePage(page);
    localStorage.setItem('activePage', page);
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('order_id', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
  };

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching menu items:', error);
    } else {
      setMenuItems(data || []);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'orders':
        return <LiveOrders orders={orders} onOrderUpdate={fetchOrders} menuItems={menuItems} />;
      case 'menu':
        return <MenuManagement menuItems={menuItems} onMenuUpdate={fetchMenuItems} />;
      case 'analytics':
        return <Analytics orders={orders} menuItems={menuItems} />;
      default:
        return <LiveOrders orders={orders} onOrderUpdate={fetchOrders} menuItems={menuItems} />;
    }
  };

  return (
    <div className="App">
      <Layout activePage={activePage} onPageChange={handlePageChange}>
        {renderPage()}
      </Layout>
    </div>
  );
}

export default App;