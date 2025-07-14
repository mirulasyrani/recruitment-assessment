import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/authContext';
import { Loader2 } from 'lucide-react';

import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// This new component contains all the routing logic.
const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Show a loading spinner while the app is checking for a user session.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <DashboardPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={<LoginPage />} 
      />
      <Route 
        path="/register" 
        element={<RegisterPage />} 
      />
      {/* Add a catch-all redirect for any other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-slate-100 min-h-screen text-slate-800">
          <Header />
          <main className="container mx-auto p-4">
            <AppRoutes />
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;