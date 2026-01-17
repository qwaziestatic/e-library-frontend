import { useEffect, useState } from 'react';
import api from '../api/axios';
import { UserPlus, Search, Trash2, User } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setMembers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id) => {
    if (confirm("Remove this member?")) {
      await api.delete(`/members/${id}`);
      fetchMembers();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Library Members</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
          <UserPlus size={18}/> Register Member
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20}/>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Name</th>
              <th className="p-4 font-semibold text-slate-600">Email</th>
              <th className="p-4 font-semibold text-slate-600">Join Date</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map(member => (
              <tr key={member.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full"><User size={16}/></div>
                  <span className="font-medium">{member.name}</span>
                </td>
                <td className="p-4 text-slate-600">{member.email}</td>
                <td className="p-4 text-slate-500">{new Date(member.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}