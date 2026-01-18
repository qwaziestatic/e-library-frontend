import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lock, User, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calling the REAL backend for a REAL token
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert("Login Failed: Make sure you use a valid email/password registered in the backend database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 text-center">LibManager</h2>
          <p className="text-slate-500 mt-2 text-center text-sm uppercase tracking-widest">Personnel Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" placeholder="Email" className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center">
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
