import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState(''); // This will be 'admin' or 'librarian'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Attempt a REAL login to the backend to get a valid JWT
      // Note: NestJS usually expects an 'email'. If your backend uses 'username', change 'email' to 'username'.
      const response = await api.post('/auth/login', {
        email: identifier, 
        password: password
      });

      // 2. If successful, save the REAL token and user data
      // This token will now be accepted by the backend for /books and /stats
      const { access_token, user } = response.data;
      login(access_token, user);
      
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      
      // 3. Fallback Error Message
      if (err.response?.status === 401) {
        setError("Invalid credentials. Use admin/admin123 or librarian/librarian123");
      } else {
        setError("Cannot connect to backend. Ensure the Vercel Environment Variable is correct.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 transform transition-all">
        
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-blue-600" size={30} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">E-Library</h2>
          <p className="text-slate-500 mt-2">Management System Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 text-sm animate-pulse">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username / Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="e.g. admin" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
