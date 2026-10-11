import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { getApiErrorMessage } from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard');
    } catch (requestError) {
      setError(
        requestError.message?.includes('did not contain')
          ? 'The server returned an invalid login response.'
          : getApiErrorMessage(requestError, 'Invalid email or password.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-blue-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">LibManager</h2>
          <p className="text-slate-500 mt-2">Sign in to access the system</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input id="email" type="email" autoComplete="email" placeholder="admin@library.com" className="w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input id="password" type="password" autoComplete="current-password" placeholder="Password" className="w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
