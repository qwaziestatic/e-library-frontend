import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Book, 
  Users, 
  ClipboardList, 
  Tags, 
  ShieldCheck, 
  LogOut,
  UserCircle 
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation Menu Items
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Books', path: '/books', icon: Book },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Borrows', path: '/borrows', icon: ClipboardList },
    { name: 'Genres', path: '/genres', icon: Tags },
    { name: 'Staff', path: '/staff', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800 shadow-2xl z-50">
      
      {/* 1. App Logo/Title */}
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Book className="text-blue-500" size={28} />
          LibManager
        </h1>
      </div>

      {/* 2. User Profile Info */}
      <div className="p-6 bg-slate-800/50 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <UserCircle size={24} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate uppercase tracking-wide">
              {user?.role || 'Guest'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.name || 'Please Login'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon 
                size={20} 
                className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} 
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 4. Logout Section */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors duration-200 font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}