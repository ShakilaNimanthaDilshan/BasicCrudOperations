import React, { useState, useEffect, useCallback } from 'react';

function MenuManager() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchMenu = useCallback(async () => {
    const res = await fetch('http://localhost:5000/api/menu', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setMenu(data);
    }
  }, [token]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate price is a number
    if (isNaN(parseFloat(form.price))) {
      setError('Price must be a number');
      return;
    }

    setError('');

    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:5000/api/menu/${editId}`
      : 'http://localhost:5000/api/menu';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });

    if (res.ok) {
      setForm({ name: '', description: '', price: '' });
      setEditId(null);
      fetchMenu();
    } else {
      const data = await res.json();
      setError(data.message || 'Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price.toString() });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this item?')) return;

    const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchMenu();
  };

  return (
    <div>
      <h2>Manage Menu</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        /><br />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">{editId ? 'Update' : 'Add'} Item</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: '', description: '', price: '' });
              setError('');
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Your Menu Items</h3>
      <ul>
        {menu.map((item) => (
          <li key={item._id}>
            <strong>{item.name}</strong> - Rs.{item.price.toFixed(2)}
            <br />
            <small>{item.description}</small>
            <br />
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuManager;
