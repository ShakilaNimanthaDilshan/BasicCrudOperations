import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import VendorDashboard from './components/VendorDashboard';
import StudentDashboard from './components/StudentDashboard';
import MenuManager from './components/MenuManager';
import VendorOrders from './components/VendorOrders'; // ✅ Import the new component

function App() {
  return (
    <Router>
      <nav>
        <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard/vendor" element={<VendorDashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/vendor/menu" element={<MenuManager />} />
        <Route path="/dashboard/vendor/orders" element={<VendorOrders />} /> {/* ✅ New route */}
      </Routes>
    </Router>
  );
}

export default App;
