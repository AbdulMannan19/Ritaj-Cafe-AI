import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Clock, Phone, MapPin, User } from 'lucide-react';

const LiveOrders = ({ orders, onOrderUpdate, menuItems }) => {
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
      setUpdatingStatus(null);
      return;
    }
    
    // Send WhatsApp notification for ON_ROUTE and DELIVERED statuses
    if (newStatus === 'ON_ROUTE' || newStatus === 'DELIVERED') {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://tortoise-working-naturally.ngrok-free.app';
        const response = await fetch(`${apiUrl}/chat/notify-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId }),
        });
        
        if (!response.ok) {
          console.error('Failed to send notification');
        }
      } catch (err) {
        console.error('Error sending notification:', err);
      }
    }
    
    onOrderUpdate();
    setUpdatingStatus(null);
  };

  const formatItems = (items) => {
    if (!items) return 'No items';
    return Object.entries(items)
      .map(([itemId, quantity]) => {
        const menuItem = menuItems.find(item => item.item_id === parseInt(itemId));
        const itemName = menuItem ? menuItem.name : `Item #${itemId}`;
        return `${itemName} (${quantity})`;
      })
      .join(', ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'preparing': return 'status-preparing';
      case 'on_route': return 'status-on_route';
      case 'delivered': return 'status-delivered';
      default: return 'status-preparing';
    }
  };

  const activeOrders = orders.filter(order => 
    order.status !== 'DELIVERED'
  );

  const completedOrders = orders.filter(order => 
    order.status === 'DELIVERED'
  );

  return (
    <div>
      <div className="page-header">
        <h2>Live Orders ({activeOrders.length} active)</h2>
      </div>
      
      <div className="grid grid-2">
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#4ade80' }}>Active Orders</h3>
          {activeOrders.length === 0 ? (
            <div className="card">
              <p>No active orders at the moment.</p>
            </div>
          ) : (
            activeOrders.map(order => (
              <div key={order.order_id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#4ade80' }}>Order #{order.order_id}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <Phone size={16} />
                      <span>{order.customer_phone_number}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {order.status || 'PENDING'}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Items:</strong> {formatItems(order.items)}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Total:</strong> <span style={{ color: '#4ade80' }}>{order.total_amount} AED</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} />
                    <span>{order.delivery_address}</span>
                  </div>
                  {order.order_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Clock size={16} />
                      <span>{formatDate(order.order_date)}</span>
                    </div>
                  )}
                  {order.courier_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} />
                      <span>{order.courier_name} - {order.courier_phone_number}</span>
                    </div>
                  )}
                </div>

                {order.special_requests && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Special Requests:</strong> {order.special_requests}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {order.status === 'PREPARING' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => updateOrderStatus(order.order_id, 'ON_ROUTE')}
                      disabled={updatingStatus === order.order_id}
                    >
                      {updatingStatus === order.order_id ? 'Updating...' : 'Mark On Route'}
                    </button>
                  )}
                  {order.status === 'ON_ROUTE' && (
                    <button
                      className="btn btn-success"
                      onClick={() => updateOrderStatus(order.order_id, 'DELIVERED')}
                      disabled={updatingStatus === order.order_id}
                    >
                      {updatingStatus === order.order_id ? 'Updating...' : 'Mark Delivered'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem', color: '#4ade80' }}>Recent Completed Orders</h3>
          {completedOrders.slice(0, 5).map(order => (
            <div key={order.order_id} className="card" style={{ opacity: 0.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#4ade80' }}>Order #{order.order_id}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} />
                    <span>{order.customer_phone_number}</span>
                  </div>
                </div>
                <span className="status-badge status-delivered">DELIVERED</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Total:</strong> <span style={{ color: '#4ade80' }}>{order.total_amount} AED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveOrders;