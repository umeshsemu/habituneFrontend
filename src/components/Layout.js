import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatUI from './ChatUI';

/**
 * Layout HOC - Persistent sidebar with ChatUI (25%) 
 * and dynamic content area (75%) that changes with routes
 */
const Layout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Sidebar - ChatUI (25%) - ALWAYS VISIBLE */}
      <aside className="w-1/3 h-full border-r border-gray-300 shadow-lg flex-shrink-0">
        <ChatUI />
      </aside>
      
      {/* Right Main Area (75%) - CHANGES WITH ROUTES */}
      <main className="w-2/3 h-full flex-grow overflow-hidden">
        <Outlet /> {/* This is where route components render */}
      </main>
    </div>
  );
};

export default Layout;