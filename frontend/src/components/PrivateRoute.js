import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (user || (token && token !== 'undefined')) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
