import React from 'react';
import { Menu } from 'lucide-react';

const AppBar = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <div className="app-bar">
      <button 
        className="menu-toggle"
        onClick={onToggleSidebar}
      >
        <Menu size={24} />
      </button>
      <h1>Food Ordering Dashboard</h1>
      <div></div> {/* Spacer for flex layout */}
    </div>
  );
};

export default AppBar;