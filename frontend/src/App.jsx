import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from './api/axiosInstance';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserCreatePage from './pages/UserCreatePage';
import UserEditPage from './pages/UserEditPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingIndicator from './components/LoadingIndicator'; // <-- Import loader

export const AuthContext = createContext(null);

function App() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state awal
  const navigate = useNavigate();
  const location = useLocation();

  const handleSetToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      setAuthToken(token);
    } else {
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    if (!authToken) return;
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      handleSetToken(null);
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (authToken) {
        setIsLoading(true); // Set loading sebelum fetch
        try {
          const response = await axiosInstance.get('/user');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          if (error.response && error.response.status === 401) {
            handleSetToken(null);
            if (!['/login', '/register', '/forgot-password'].includes(location.pathname)) {
              navigate('/login', { replace: true });
            }
          }
        } finally {
          setIsLoading(false); // Set loading selesai
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, navigate]);

  // Tampilkan loader jika state loading aplikasi aktif
  if (isLoading) {
    return <LoadingIndicator message="Loading application..." />; // <-- Loader awal
  }

  return (
    <AuthContext.Provider value={{ authToken, user, login: handleSetToken, logout: handleLogout, isLoading }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={authToken ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={authToken ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password-reset/:token" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <Layout>
                <UserCreatePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/edit/:userId"
          element={
            <ProtectedRoute>
              <Layout>
                <UserEditPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={authToken ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;