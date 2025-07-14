import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Directly check for the token in localStorage. This is a synchronous check.
  const token = localStorage.getItem('token');

  // The 'loading' state is for the initial check when the app first loads.
  // We must wait for this to finish before making any routing decisions.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  // After the initial load, if a user object exists OR a valid token is in storage,
  // the user is considered authenticated.
  // The token check handles the split-second after login before the user state is updated.
  if (user || (token && token !== 'undefined')) {
    return children;
  }

  // If we are done loading and there is no user and no token, redirect to login.
  return <Navigate to="/login" />;
};

export default PrivateRoute;