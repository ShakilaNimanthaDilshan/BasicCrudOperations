import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Step 1

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ Step 2

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
    localStorage.setItem('token', data.token);
    setError('');

    // Redirect based on role here:
    if (data.user.role === 'vendor') {
      navigate('/dashboard/vendor');
    } else if (data.user.role === 'student') {
      navigate('/dashboard/student');
    } else {
      navigate('/'); // fallback if role missing
    }
  } else {
    setError(data.message || 'Login failed');
  }
};


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Login</button>
      </form>
      <p style={{ color: 'red' }}>{error}</p>
    </div>
  );
}

export default LoginForm;
