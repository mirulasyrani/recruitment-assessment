import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/authContext'; // ✅ No useAuth here

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

// ✅ Move useAuth into a child component, after AuthProvider is mounted
function AppContent() {
  const { user } = require('./context/authContext').useAuth();

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800">
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
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
  );
}

export default App;
