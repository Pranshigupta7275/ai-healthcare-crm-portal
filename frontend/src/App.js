import React from 'react';
import './components/Layout.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import InteractionsList from './pages/InteractionsList';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
        
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold tracking-wide text-center text-sky-400">HCP CRM</h2>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className={({ isActive }) => `block px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/chat" className={({ isActive }) => `block px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                  AI Chat
                </NavLink>
              </li>
              <li>
                <NavLink to="/interactions" className={({ isActive }) => `block px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                  Interaction List
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shadow-sm z-0">
            <h1 className="text-xl font-semibold text-slate-800">Medical Representative Portal</h1>
          </header>
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/interactions" element={<InteractionsList />} />
            </Routes>
          </main>
        </div>

      </div>
    </Router>
  );
}

export default App;