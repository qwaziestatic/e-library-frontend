/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Users, ClipboardList, Tags, Shield, LogOut, Library } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const menu = [
    ['Dashboard', '/dashboard', LayoutDashboard], ['Books', '/books', BookOpen],
    ['Members', '/members', Users], ['Borrowing', '/borrows', ClipboardList], ['Genres', '/genres', Tags],
  ];
  if (user?.role === 'admin') menu.push(['Staff', '/staff', Shield]);
  return <aside className="sidebar">
    <div className="brand"><Library size={23} /><span>Libra<span>ry</span></span></div>
    <div className="user-chip"><div className="avatar">{(user?.username || user?.email || 'U')[0].toUpperCase()}</div><div><strong>{user?.username || 'Librarian'}</strong><small>{user?.role || 'staff'}</small></div></div>
    <nav>{menu.map(([name, path, Icon]) => <Link key={path} to={path} className={location.pathname === path ? 'active' : ''}><Icon size={19} />{name}</Link>)}</nav>
    <button className="logout" onClick={logout}><LogOut size={18} />Sign out</button>
  </aside>;
}
