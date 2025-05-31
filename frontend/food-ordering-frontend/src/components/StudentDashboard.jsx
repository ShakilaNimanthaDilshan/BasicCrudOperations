import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Access Denied. Please login.');
      return;
    }

    const fetchUserData = async () => {
      const res = await fetch('http://localhost:5000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.user.role === 'student') {
        setUser(data.user);
      } else {
        setMessage('Unauthorized');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (message) return <p>{message}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user.username}</p>
      <p>Email: {user.email}</p>

      <button onClick={handleLogout} style={{ marginTop: '10px' }}>Logout</button>

      <h3>🍽️ Available Foods</h3>
      
    </div>
  );
}

export default StudentDashboard;
