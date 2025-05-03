import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import LoadingIndicator from '../components/LoadingIndicator'; // <-- Import loader

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State loading form
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: ['Passwords do not match.'] });
      return;
    }
    setIsLoading(true); // Mulai loading
    try {
      const emailToLower = email.toLowerCase();
      await axiosInstance.post('/register', { name, emailToLower, password, password_confirmation: passwordConfirmation });
      setSuccessMessage('Registration successful! You can now log in.');
      // Optionally clear form
      // setName(''); setEmail(''); setPassword(''); setPasswordConfirmation('');
      // setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: [err.response?.data?.message || 'Registration failed. Please try again.'] });
      }
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div style={{ paddingTop: '5vh' }}>
      {isLoading && <LoadingIndicator message="Registering..." />}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <img
          src="https://www.silang.id/wp-content/uploads/2024/05/Horizontal-Logo.png"
          alt="Silang.id Logo"
          style={{ maxWidth: '250px', height: 'auto', marginBottom: '10px' }} // Atur ukuran logo
        />
        <h2 style={{ margin: 0, fontSize: '1.2em', color: '#444' }}>
          Silang.id Admin Portal
        </h2>
      </div>
      <form onSubmit={handleSubmit} style={{ filter: isLoading ? 'blur(1px)' : 'none' }}>
        <h2>Register New User</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.general && <p className="error-message">{errors.general.join(', ')}</p>}
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading}/>
          {errors.name && <p className="error-message">{errors.name.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email' disabled={isLoading}/>
           {errors.email && <p className="error-message">{errors.email.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete='new-password' disabled={isLoading}/>
           {errors.password && <p className="error-message">{errors.password.join(', ')}</p>}
        </div>
         <div>
          <label htmlFor="password_confirmation">Confirm Password:</label>
          <input type="password" id="password_confirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={8} autoComplete='new-password' disabled={isLoading}/>
           {errors.password_confirmation && <p className="error-message">{errors.password_confirmation.join(', ')}</p>}
        </div>
        <button type="submit" disabled={isLoading}>
             Register
        </button>
         <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default RegisterPage;