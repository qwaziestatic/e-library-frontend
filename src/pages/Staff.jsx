import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserPlus, Trash2, Mail, ShieldAlert, X } from 'lucide-react';

export default function Staff() {
  const { user } = useContext(AuthContext);
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'librarian' });

  const isAdmin = user?.role === 'admin';

  const fetchStaff = async () => {
    try {
      const res = await api.get('/staff');
      setStaffList(res.data);
    } catch (err) { console.error("Error fetching staff:", err); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/staff', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'librarian' });
      fetchStaff();
    } catch (err) { alert("Error adding staff member."); }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Only Admins can delete staff.");
    if (confirm("Permanently remove this staff member?")) {
      await api.delete(`/staff/${id}`);
      fetchStaff();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Accounts</h1>
          <p className="text-slate-500 text-sm">Manage administrative and library personnel</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg shadow-blue-200"
          >
            <UserPlus size={18}/> Register Staff
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl mb-6 flex items-center gap-3">
          <ShieldAlert size={20}/>
          <p className="text-sm font-medium">View-only mode: Only Admins can create or delete staff accounts.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((person) => (
          <div key={person.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                <ShieldCheck size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                person.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {person.role}
              </span>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-800">{person.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                <Mail size={14}/> {person.email}
              </div>
            </div>

            {isAdmin && (
              <button 
                onClick={() => handleDelete(person.id)}
                className="mt-6 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg transition border border-transparent hover:border-red-100"
              >
                <Trash2 size={16}/> Remove Account
              </button>
            )}
          </div>
        ))}
      </div>

      {/* REGISTRATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button type="button" onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"><X size={24}/></button>
            <h2 className="text-2xl font-bold mb-6">New Staff Member</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                <input required className="w-full mt-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <input type="email" required className="w-full mt-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <input type="password" required className="w-full mt-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1">System Role</label>
                <select className="w-full mt-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="librarian">Librarian (Limited Access)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Create Account</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}