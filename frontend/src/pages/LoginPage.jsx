import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../App';
import LoadingIndicator from '../components/LoadingIndicator'; // <-- Import loader

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State loading form
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Mulai loading
    try {
      const response = await axiosInstance.post('/login', { email, password });
      const token = response.data.token;
      if (token) {
        login(token);
        navigate(from, { replace: true });
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.errors
                       ? Object.values(err.response.data.errors).flat().join(' ')
                       : 'Login failed. Please check credentials.';
      setError(errorMsg);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div style={{ paddingTop: '5vh' }}>
      {/* Tampilkan overlay loader jika isLoading */}
      {isLoading && <LoadingIndicator message="Logging in..." />}
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
      <form onSubmit={handleSubmit} style={{ filter: isLoading ? 'blur(1px)' : 'none' }}> {/* Optional: blur form saat loading */}
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email' disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete='current-password' disabled={isLoading} />
        </div>
        <button type="submit" disabled={isLoading}>
          Login
        </button>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;