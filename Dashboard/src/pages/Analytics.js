import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const Analytics = ({ orders, menuItems }) => {
  const analytics = useMemo(() => {
    // Calculate popular items
    const itemCounts = {};
    const dailyRevenue = {};
    const categoryRevenue = {};
    let totalRevenue = 0;
    let totalOrders = orders.length;

    orders.forEach(order => {
      // Count items by ID
      if (order.items) {
        Object.entries(order.items).forEach(([itemId, quantity]) => {
          itemCounts[itemId] = (itemCounts[itemId] || 0) + quantity;
        });
      }

      // Calculate revenue - handle both string and number formats
      const orderAmount = typeof order.total_amount === 'string' 
        ? parseFloat(order.total_amount) 
        : (order.total_amount || 0);
      totalRevenue += orderAmount;

      // Daily revenue - use order_date if available
      let orderDate;
      if (order.order_date) {
        orderDate = new Date(order.order_date);
      } else {
        orderDate = new Date(); // fallback to today
      }
      
      const dateKey = orderDate.toDateString();
      dailyRevenue[dateKey] = (dailyRevenue[dateKey] || 0) + orderAmount;

      // Category revenue
      if (order.items) {
        Object.entries(order.items).forEach(([itemId, quantity]) => {
          const menuItem = menuItems.find(item => item.item_id === parseInt(itemId));
          if (menuItem) {
            const category = menuItem.category;
            const itemRevenue = quantity * parseFloat(menuItem.price);
            categoryRevenue[category] = (categoryRevenue[category] || 0) + itemRevenue;
          }
        });
      }
    });

    // Top 10 popular items
    const popularItems = Object.entries(itemCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([itemId, count]) => {
        const menuItem = menuItems.find(item => item.item_id === parseInt(itemId));
        return { 
          id: itemId,
          name: menuItem ? menuItem.name : `Item #${itemId}`, 
          count 
        };
      });

    // Daily revenue chart data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    const dailyRevenueData = last7Days.map(date => ({
      date: new Date(date).toLocaleDateString(),
      revenue: dailyRevenue[date] || 0
    }));

    // Category revenue pie chart data
    const categoryData = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      name: category,
      value: revenue
    }));

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      popularItems,
      dailyRevenueData,
      categoryData
    };
  }, [orders, menuItems]);

  const COLORS = [
    '#4ade80', // Green
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#f97316', // Orange
    '#eab308', // Yellow
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#6366f1', // Indigo
    '#10b981'  // Emerald
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h2>Analytics & Insights</h2>
      </div>
      
      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{analytics.totalRevenue.toFixed(2)} AED</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.averageOrderValue.toFixed(2)} AED</div>
          <div className="stat-label">Average Order Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{menuItems.filter(item => item.is_available).length}</div>
          <div className="stat-label">Available Items</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Popular Items */}
        <div className="card">
          <h3 style={{ color: '#4ade80', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Most Popular Items</h3>
          {analytics.popularItems.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.popularItems}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fill: '#ccc', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#ccc' }} />
                <Bar dataKey="count" isAnimationActive={false}>
                  {analytics.popularItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No order data available yet.</p>
          )}
        </div>

        {/* Daily Revenue Trend */}
        <div className="card">
          <h3 style={{ color: '#4ade80', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Daily Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fill: '#ccc' }} />
              <YAxis tick={{ fill: '#ccc' }} />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)} AED`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: '#2a2a2a', 
                  border: '1px solid #4ade80',
                  borderRadius: '4px',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Revenue - Full Width */}
      <div className="card">
        <h3 style={{ color: '#4ade80', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Revenue by Category</h3>
        {analytics.categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={analytics.categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value.toFixed(2)} AED`}
                contentStyle={{ 
                  backgroundColor: '#2a2a2a', 
                  border: '1px solid #4ade80',
                  borderRadius: '4px',
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No revenue data available yet.</p>
        )}
      </div>

      {/* Top Items Table */}
      <div className="card">
        <h3 style={{ color: '#4ade80', marginBottom: '1rem' }}>Popular Items Details</h3>
        {analytics.popularItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Item Name</th>
                <th>Orders</th>
                <th>Category</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {analytics.popularItems.map((item, index) => {
                const menuItem = menuItems.find(mi => mi.item_id === parseInt(item.id));
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.count}</td>
                    <td>{menuItem?.category || 'Unknown'}</td>
                    <td style={{ color: '#4ade80' }}>{menuItem?.price || 'N/A'} AED</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No order data available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
