import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // This is a synchronous check for the token.
  const token = localStorage.getItem('token');

  // Wait for the initial authentication check to complete.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If a user object exists OR a valid token is in storage, the user is authenticated.
  // The token check handles the race condition immediately after login.
  if (user || (token && token !== 'undefined')) {
    return children;
  }

  // If not loading and no user/token, redirect to login.
  return <Navigate to="/login" />;
};

export default PrivateRoute;