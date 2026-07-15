import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>HCP CRM</h2>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/chat">AI Chat</Link></li>
            <li><Link to="/interactions">Interaction List</Link></li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        {/* HEADER */}
        <header className="header">
          <h1>Medical Representative Portal</h1>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="page-content">
          {/* Outlet is where the individual pages will render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;