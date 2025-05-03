import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import LoadingIndicator from '../components/LoadingIndicator'; // <-- Import loader

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State loading form

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true); // Mulai loading
    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent! Check your email.');
    } catch (err) {
       console.error("Forgot password error:", err);
       const errorMsg = err.response?.data?.message || err.response?.data?.errors
                        ? Object.values(err.response.data.errors).flat().join(' ')
                        : 'Failed to send reset link. Please try again.';
       setError(errorMsg);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div style={{ paddingTop: '5vh' }}>
       {isLoading && <LoadingIndicator message="Sending link..." />}
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
        <h2>Forgot Password</h2>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email' disabled={isLoading}/>
        </div>
        <button type="submit" disabled={isLoading}>
          Send Password Reset Link
        </button>
        <p>
             Remembered your password? <Link to="/login">Login</Link>
         </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;