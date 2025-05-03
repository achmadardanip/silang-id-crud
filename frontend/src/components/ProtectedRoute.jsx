import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App'; // Sesuaikan path jika perlu
import LoadingIndicator from './LoadingIndicator'; // <-- Import loader

const ProtectedRoute = ({ children }) => {
  const { authToken, isLoading } = useContext(AuthContext); // isLoading dari App context
  const location = useLocation();

  // Gunakan isLoading dari App context untuk loading awal cek auth
  if (isLoading) {
    return <LoadingIndicator />; // <-- Loader saat cek auth
  }

  if (!authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;