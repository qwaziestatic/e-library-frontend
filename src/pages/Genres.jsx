import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [name, setName] = useState('');

  const fetchGenres = async () => {
    const res = await api.get('/genres');
    setGenres(res.data);
  };

  useEffect(() => { fetchGenres(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/genres', { name });
    setName('');
    fetchGenres();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this genre?")) {
      await api.delete(`/genres/${id}`);
      fetchGenres();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Book Genres</h1>
      <form onSubmit={handleAdd} className="mb-8 flex gap-2">
        <input 
          className="border p-2 rounded-lg w-64 outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="New Genre (e.g. Fiction)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18}/> Add
        </button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {genres.map(g => (
          <div key={g.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
            <div className="flex items-center gap-2"><Tag size={16} className="text-blue-500"/> {g.name}</div>
            <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}