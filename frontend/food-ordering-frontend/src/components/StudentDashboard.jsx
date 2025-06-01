import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [hostel, setHostel] = useState('Coral Beauty'); // default hostel
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Access Denied. Please login.');
      setLoading(false);
      return;
    }

    const fetchUserAndMenus = async () => {
      try {
        const userRes = await fetch('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();

        if (!userRes.ok || userData.user.role !== 'student') {
          setMessage('Unauthorized');
          setLoading(false);
          return;
        }

        setUser(userData.user);

        const menuRes = await fetch('http://localhost:5000/api/menu/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenu(menuData);
        } else {
          const errorData = await menuRes.json();
          console.log('Menu fetch error:', errorData);
          setMessage(errorData.message || 'Failed to fetch menus.');
        }
      } catch (error) {
        setMessage('Server error. Try again later.');
      }

      setLoading(false);
    };

    fetchUserAndMenus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const placeOrder = async (item) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menuItemId: item._id,
          vendorId: item.vendorId._id,
          hostel,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Order placed successfully!');
      } else {
        alert(data.message || 'Order failed.');
      }
    } catch (error) {
      alert('Server error while placing order.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (message) return <p>{message}</p>;

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user?.username}</p>
      <p>Email: {user?.email}</p>

      <button onClick={handleLogout} style={{ marginTop: '10px' }}>Logout</button>

      <h3>🍽️ Available Foods</h3>

      {menu.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        <ul>
          {menu.map(item => (
            <li key={item._id}>
              <strong>{item.name}</strong> - Rs.{item.price}<br />
              {item.description}<br />
              <small>Vendor: {item.vendorId?.username || 'Unknown'}</small><br />

              <select onChange={(e) => setHostel(e.target.value)} value={hostel}>
                <option>Coral Beauty</option>
                <option>Silver Tips</option>
                <option>Blue Sappeare</option>
                <option>Catelia</option>
              </select>

              <button onClick={() => placeOrder(item)} style={{ marginLeft: '10px' }}>
                Place Order
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentDashboard;
