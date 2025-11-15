import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-800 py-3 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-primary font-bold text-xl">Smart Expense</h1>

      <div className="flex space-x-4">
        <Link to="/dashboard" className="text-gray-300 hover:text-primary">Dashboard</Link>
        <Link to="/add" className="text-gray-300 hover:text-primary">Add</Link>
        <Link to="/reports" className="text-gray-300 hover:text-primary">Reports</Link>
        <Link to="/history" className="text-gray-300 hover:text-primary">History</Link>
          <Link to="/create-group" className="font-bold text-blue-400">
        + Create Group
      </Link>
          <Link to="/groups" className="font-bold text-blue-400">
        Groups Details
      </Link>

        {/* Logout Button */}
        {isLoggedIn() && (
          <button onClick={handleLogout} className="text-red-400 hover:text-red-200">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
