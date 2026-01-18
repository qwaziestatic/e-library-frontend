import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check specific instructions credentials
    if (username === 'admin' && password === 'admin123') {
      login('mock-token', { name: 'System Admin', role: 'admin', email: 'admin@library.com' });
      navigate('/dashboard');
    } else if (username === 'librarian' && password === 'librarian123') {
      login('mock-token', { name: 'Staff Librarian', role: 'librarian', email: 'staff@library.com' });
      navigate('/dashboard');
    } else {
      alert("Invalid! Use: admin/admin123 or librarian/librarian123");
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
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Username</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input type="text" placeholder="admin" className="w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setUsername(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input type="password" placeholder="admin123" className="w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">Enter Dashboard</button>
        </form>
      </div>
    </div>
  );
}
