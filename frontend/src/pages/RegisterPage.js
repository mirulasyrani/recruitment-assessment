import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/', { replace: true }); // Navigate to dashboard
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        toast.error(<div><p>{message}</p><pre className="text-xs whitespace-pre-wrap">{errors}</pre></div>, { autoClose: 7000 });
      } else {
        toast.error(message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-600 block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input name="fullName" autoComplete="name" onChange={handleChange} required className="w-full p-3 pl-10 border border-gray-300 rounded-lg" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-600 block mb-2">Username</label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input name="username" autoComplete="username" onChange={handleChange} required className="w-full p-3 pl-10 border border-gray-300 rounded-lg" placeholder="johndoe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-600 block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" autoComplete="email" onChange={handleChange} required className="w-full p-3 pl-10 border border-gray-300 rounded-lg" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-600 block mb-2">Password</label>
              <div className="relative">
                 <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input type="password" name="password" autoComplete="new-password" onChange={handleChange} required className="w-full p-3 pl-10 border border-gray-300 rounded-lg" placeholder="••••••••" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.</p>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
              {loading ? 'Registering...' : 'Register'}
              {!loading && <UserPlus />}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;