import React, { useState } from 'react';
import AppBar from './AppBar';
import SideDrawer from './SideDrawer';

const Layout = ({ children, activePage, onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <SideDrawer 
        isOpen={isSidebarOpen}
        activePage={activePage}
        onPageChange={onPageChange}
      />
      
      <div className={`layout-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <AppBar 
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;