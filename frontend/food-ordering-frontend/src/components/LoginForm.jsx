import React, { useState } from 'react';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem('token', data.token);
      setError('');
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {!user ? (
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
          <button type="submit">Login</button>
        </form>
      ) : (
        <p>Welcome, {user.username}!</p>
      )}
      <p style={{ color: 'red' }}>{error}</p>
    </div>
  );
}

export default LoginForm;
