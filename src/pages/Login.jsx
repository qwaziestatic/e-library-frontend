import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState(''); // Can be 'admin' or 'librarian'
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Check for Admin Credentials
    if (identifier === 'admin' && password === 'admin123') {
      login('mock-admin-token', { role: 'admin', name: 'System Admin' });
      navigate('/dashboard');
      return;
    }

    // 2. Check for Librarian Credentials
    if (identifier === 'librarian' && password === 'librarian123') {
      login('mock-librarian-token', { role: 'librarian', name: 'Library Staff' });
      navigate('/dashboard');
      return;
    }

    // 3. Fallback: If neither match
    alert("Invalid credentials. Please use: \nAdmin: admin / admin123 \nLibrarian: librarian / librarian123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-blue-600" size={30} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">LibManager</h2>
          <p className="text-slate-500 mt-2">Enter credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="admin or librarian" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition transform active:scale-95 shadow-lg shadow-blue-200">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}