// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    sickleType: '',
    mobile: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can add basic validation here if needed

    // Save to localStorage
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('userInfo', JSON.stringify(formData));

    // Redirect to homepage
    navigate('/home');
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="age" placeholder="Age" type="number" onChange={handleChange} required />
        <input name="gender" placeholder="Gender" onChange={handleChange} required />
        <input name="sickleType" placeholder="Sickle Type (optional)" onChange={handleChange} />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />

        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '400px', margin: 'auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  button: { padding: '10px', background: '#008080', color: 'white', border: 'none', cursor: 'pointer' },
};

export default LoginPage;
