import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function VendorDashboard() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Access Denied. Please login.');
      setLoading(false);
      return;
    }

    const fetchUserAndMenu = async () => {
      try {
        const userRes = await fetch('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();

        if (!userRes.ok || userData.user.role !== 'vendor') {
          setMessage('Unauthorized');
          setLoading(false);
          return;
        }

        setUser(userData.user);

        const menuRes = await fetch('http://localhost:5000/api/menu', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenu(menuData);
        } else {
          const errorData = await menuRes.json();
          setMessage(errorData.message || 'Failed to fetch menu.');
        }
      } catch (error) {
        setMessage('Server error. Try again later.');
      }
      setLoading(false);
    };

    fetchUserAndMenu();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (message) return <p>{message}</p>;

  return (
    <div>
      <h2>Vendor Dashboard</h2>
      <p>Welcome, {user?.username}</p>
      <p>Email: {user?.email}</p>

      <button onClick={handleLogout} style={{ marginTop: '10px' }}>Logout</button>

      <h3>📋 My Menu</h3>
      {menu.length === 0 ? (
        <p>No menu items yet.</p>
      ) : (
        <ul>
          {menu.map(item => (
            <li key={item._id}>
              <strong>{item.name}</strong> - ${item.price}<br />
              {item.description}
            </li>
          ))}
        </ul>
      )}

      <Link to="/dashboard/vendor/menu">Manage Menu</Link>
    </div>
  );
}

export default VendorDashboard;
