import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // This is a synchronous check for the token right from the browser's storage.
  const token = localStorage.getItem('token');

  // First, we must wait for the initial authentication check to complete.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  // After loading, if a user object exists OR a valid token is in storage,
  // the user is considered authenticated.
  // The `token` check is what solves the race condition immediately after login.
  if (user || (token && token !== 'undefined')) {
    return children;
  }

  // If we are done loading and there is NO user and NO token, redirect to login.
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;