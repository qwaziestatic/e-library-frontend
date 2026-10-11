import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowUpRight, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import api, { getApiErrorMessage } from '../api/axios';
import { ErrorMessage, PageHeader } from '../components/ui';

export default function Dashboard() {
  const [data, setData] = useState({ books: [], members: [], records: [], overdue: [], popular: [] });
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([api.get('/books'), api.get('/members'), api.get('/borrow-records'), api.get('/borrow-records/reports/overdue'), api.get('/borrow-records/reports/popular-genres')]).then(([books, members, records, overdue, popular]) => setData({ books: books.data, members: members.data, records: records.data, overdue: overdue.data, popular: popular.data })).catch(e => setError(getApiErrorMessage(e, 'Unable to load dashboard.'))); }, []);
  const active = data.records.filter(r => !r.return_date).length;
  return <div className="page-shell"><PageHeader eyebrow="Overview" title="Good morning, librarian" description="A clear view of what is happening in your library today." action={<Link className="button button-primary" to="/borrows">Manage borrowing <ArrowUpRight size={16} /></Link>} /><ErrorMessage message={error} />
    <div className="stat-grid"><Stat icon={BookOpen} label="Total books" value={data.books.length} /><Stat icon={Users} label="Active members" value={data.members.length} /><Stat icon={Clock} label="Active borrows" value={active} /><Stat icon={AlertTriangle} label="Overdue" value={data.overdue.length} danger /></div>
    <div className="report-grid"><section className="card report-card"><div className="flex items-center justify-between"><h2>Overdue returns</h2><Link className="text-blue-600 text-sm font-bold" to="/borrows">View all</Link></div>{data.overdue.length ? data.overdue.slice(0, 5).map(r => <div className="list-row" key={r.id}><span><strong>{r.book?.title || `Book #${r.book_id}`}</strong><small className="block text-slate-500">{r.member?.name || 'Member'} · due {formatDate(r.due_date)}</small></span><span className="badge badge-red">Overdue</span></div>) : <p className="empty-state">No overdue books. Great work!</p>}</section>
      <section className="card report-card"><h2><TrendingUp size={17} className="inline mr-2 text-blue-600" />Popular genres</h2>{data.popular.length ? data.popular.slice(0, 6).map((g, i) => <div className="list-row" key={g.genre_id || g.id || i}><span>{g.genre_name || g.name || 'Unknown genre'}</span><strong>{g.borrow_count ?? g.count ?? 0}</strong></div>) : <p className="empty-state">No borrowing data yet.</p>}</section></div>
  </div>;
}
/* eslint-disable-next-line no-unused-vars */
function Stat({ icon: Icon, label, value, danger }) { return <div className="card stat-card"><Icon size={20} className={danger ? 'text-red-500' : 'text-blue-600'} /><p>{label}</p><strong className={danger ? 'text-red-600' : ''}>{value}</strong></div>; }
function formatDate(value) { return value ? new Date(value).toLocaleDateString() : '—'; }
