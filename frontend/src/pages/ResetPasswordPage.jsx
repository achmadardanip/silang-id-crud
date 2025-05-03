import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import LoadingIndicator from '../components/LoadingIndicator'; // <-- Import loader

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(''); // Mungkin perlu email
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // State loading form

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    if (password !== passwordConfirmation) {
        setErrors({ password_confirmation: ['Passwords do not match.'] });
        return;
    }
    setIsLoading(true); // Mulai loading
    try {
      const response = await axiosInstance.post('/reset-password', { token, email, password, password_confirmation: passwordConfirmation });
      setMessage(response.data.message || 'Password has been reset successfully!');
      // setTimeout(() => navigate('/login'), 3000); // Optional redirect
    } catch (err) {
      console.error("Reset password error:", err);
      if (err.response?.data?.errors) {
            setErrors(err.response.data.errors);
      } else {
            setErrors({ general: [err.response?.data?.message || 'Failed to reset password. Link might be invalid/expired.'] });
      }
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div style={{ paddingTop: '5vh' }}>
      {isLoading && <LoadingIndicator message="Resetting password..." />}
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
        <h2>Reset Your Password</h2>
        {message && <p className="success-message">{message}</p>}
        {errors.general && <p className="error-message">{errors.general.join(', ')}</p>}
        <div>
           <label htmlFor="email">Email:</label>
           <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="Enter email associated with reset" disabled={isLoading} />
           {errors.email && <p className="error-message">{errors.email.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="password">New Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" disabled={isLoading} />
           {errors.password && <p className="error-message">{errors.password.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="password_confirmation">Confirm New Password:</label>
          <input type="password" id="password_confirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={8} autoComplete="new-password" disabled={isLoading} />
           {errors.password_confirmation && <p className="error-message">{errors.password_confirmation.join(', ')}</p>}
        </div>
        <button type="submit" disabled={isLoading}>
          Reset Password
        </button>
        <p>
             <Link to="/login">Back to Login</Link>
         </p>
      </form>
    </div>
  );
};

export default ResetPasswordPage;