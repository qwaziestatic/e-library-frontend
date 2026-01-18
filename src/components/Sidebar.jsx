import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Book, Users, ClipboardList, Tags, Shield, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menu = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Books', path: '/books', icon: Book },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Borrows', path: '/borrows', icon: ClipboardList },
    { name: 'Genres', path: '/genres', icon: Tags },
  ];

  if (user?.role === 'admin') menu.push({ name: 'Staff', path: '/staff', icon: Shield });

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">LibManager</h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">{user?.role}: {user?.name}</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <Link key={item.path} to={item.path} className={`flex items-center gap-3 p-3 rounded-xl transition ${location.pathname === item.path ? 'bg-blue-600 shadow-lg shadow-blue-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <item.icon size={20}/> {item.name}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="p-6 border-t border-slate-800 text-red-400 flex items-center gap-3 hover:bg-red-900/10"><LogOut size={20}/> Logout</button>
    </div>
  );
}
