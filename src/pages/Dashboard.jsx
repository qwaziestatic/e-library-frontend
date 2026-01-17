import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Book, Users, ClipboardCheck, Clock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ books: 0, members: 0, borrows: 0, overdue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, members, records] = await Promise.all([
          api.get('/books'),
          api.get('/members'),
          api.get('/borrow-records')
        ]);
        setStats({
          books: books.data.length,
          members: members.data.length,
          borrows: records.data.filter(r => !r.returnDate).length,
          overdue: records.data.filter(r => !r.returnDate && new Date(r.dueDate) < new Date()).length
        });
      } catch (err) { console.error("Error fetching stats:", err); }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Library Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Books" val={stats.books} icon={Book} color="text-blue-600" bg="bg-blue-100" />
        <StatCard label="Members" val={stats.members} icon={Users} color="text-green-600" bg="bg-green-100" />
        <StatCard label="Active Borrows" val={stats.borrows} icon={ClipboardCheck} color="text-orange-600" bg="bg-orange-100" />
        <StatCard label="Overdue Books" val={stats.overdue} icon={Clock} color="text-red-600" bg="bg-red-100" />
      </div>
    </div>
  );
}

function StatCard({ label, val, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className={`${bg} ${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <p className="text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{val}</p>
    </div>
  );
}