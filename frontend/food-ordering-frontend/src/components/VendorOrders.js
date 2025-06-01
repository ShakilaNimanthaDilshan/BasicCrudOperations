import React, { useEffect, useState } from 'react';

function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/orders/vendor', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setMessage(data.message || 'Failed to fetch orders.');
        }
      } catch (error) {
        setMessage('Server error.');
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch (error) {
      alert('Error updating order.');
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (message) return <p>{message}</p>;

  return (
    <div>
      <h2>📦 Incoming Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id} style={{ marginBottom: '15px' }}>
              <strong>{order.menuItemId.name}</strong> - Rs.{order.menuItemId.price}<br />
              Ordered by: {order.studentId.username} ({order.studentId.email})<br />
              Hostel: {order.hostel} <br />
              Status: <strong>{order.status}</strong><br />

              {order.status === 'pending' && (
                <button onClick={() => updateOrderStatus(order._id, 'accepted')}>Accept</button>
              )}
              {order.status === 'accepted' && (
                <button onClick={() => updateOrderStatus(order._id, 'delivered')}>Mark as Delivered</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VendorOrders;
