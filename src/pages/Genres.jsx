import { useContext, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import api, { getApiErrorMessage } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Button, ErrorMessage, Field, Modal, PageHeader } from '../components/ui';
export default function Genres() {
  const { user } = useContext(AuthContext);
  const [genres, setGenres] = useState([]); const [form, setForm] = useState(null); const [error, setError] = useState('');
  const load = async () => { try { setGenres((await api.get('/genres')).data); } catch (e) { setError(getApiErrorMessage(e, 'Unable to load genres.')); } }; useEffect(() => { load(); }, []);
  const save = async e => { e.preventDefault(); try { if (form.id) await api.patch(`/genres/${form.id}`, { name: form.name }); else await api.post('/genres', { name: form.name }); setForm(null); load(); } catch (e) { setError(getApiErrorMessage(e, 'Unable to save genre.')); } };
  const remove = async id => { if (!window.confirm('Delete this genre?')) return; try { await api.delete(`/genres/${id}`); load(); } catch (e) { setError(getApiErrorMessage(e, 'Unable to delete genre.')); } };
  return <div className="page-shell"><PageHeader eyebrow="Catalog settings" title="Genres" description="Organize your collection." action={user?.role === 'admin' && <Button onClick={() => setForm({ name: '' })}><Plus size={17} /> Add genre</Button>} /><ErrorMessage message={error} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{genres.map(g => <div className="card p-5 flex items-center justify-between" key={g.id}><div className="flex items-center gap-3"><Tag size={18} className="text-blue-600" /><strong>{g.name}</strong></div>{user?.role === 'admin' && <div><button className="button button-ghost" onClick={() => setForm(g)}><Pencil size={16} /></button><button className="button button-danger" onClick={() => remove(g.id)}><Trash2 size={16} /></button></div>}</div>)}</div>{!genres.length && <div className="card empty-state">No genres yet.</div>}{form && <Modal title={form.id ? 'Edit genre' : 'Add genre'} onClose={() => setForm(null)}><form onSubmit={save}><Field label="Genre name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><div className="form-actions"><Button variant="ghost" type="button" onClick={() => setForm(null)}>Cancel</Button><Button type="submit">Save genre</Button></div></form></Modal>}</div>;
}
