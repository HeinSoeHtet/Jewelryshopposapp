import { Outlet } from 'react-router';
import { Layout } from './Layout';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
}
