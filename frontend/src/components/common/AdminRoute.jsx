import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = () => {
  const { user } = useAuth();
  
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <Outlet />;
};

export default AdminRoute;