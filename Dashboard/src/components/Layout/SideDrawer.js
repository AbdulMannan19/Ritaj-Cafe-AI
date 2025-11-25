import React from 'react';
import { ShoppingCart, Menu as MenuIcon, BarChart3 } from 'lucide-react';

const SideDrawer = ({ isOpen, activePage, onPageChange }) => {
  const navItems = [
    {
      id: 'orders',
      label: 'Live Orders',
      icon: ShoppingCart
    },
    {
      id: 'menu',
      label: 'Menu Management',
      icon: MenuIcon
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3
    }
  ];

  return (
    <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SideDrawer;