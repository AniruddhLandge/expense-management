import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddExpense from './pages/AddExpense.jsx';
import History from './pages/History.jsx';
import Reports from './pages/Reports.jsx';
import CreateGroup from "./pages/CreateGroup.jsx";
import Groups from "./pages/Groups.jsx";
import AddGroupExpense from "./pages/AddGroupExpense.jsx";   // ✅ Un-comment
import GroupInfo from "./pages/GroupInfo.jsx";               // ✅ Un-comment            

import { isLoggedIn } from './services/authService.js';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={isLoggedIn() ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/add"
            element={isLoggedIn() ? <AddExpense /> : <Navigate to="/" />}
          />
          <Route
            path="/history"
            element={isLoggedIn() ? <History /> : <Navigate to="/" />}
          />
          <Route
            path="/reports"
            element={isLoggedIn() ? <Reports /> : <Navigate to="/" />}
          />
          <Route
            path="/create-group"
            element={isLoggedIn() ? <CreateGroup /> : <Navigate to="/" />}
          />
          <Route
            path="/groups"
            element={isLoggedIn() ? <Groups /> : <Navigate to="/" />}
          />

          {/* ✅ Add these two routes */}
          <Route
            path="/add-expense/:groupId"
            element={isLoggedIn() ? <AddGroupExpense /> : <Navigate to="/" />}
          />
          <Route
            path="/group-info/:groupId"
            element={isLoggedIn() ? <GroupInfo /> : <Navigate to="/" />}
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
