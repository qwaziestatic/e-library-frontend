import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Search, X } from 'lucide-react';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', genreId: '', totalCopies: 1 });

  const fetchData = async () => {
    try {
      const [b, g] = await Promise.all([api.get('/books'), api.get('/genres')]);
      setBooks(b.data);
      setGenres(g.data);
    } catch (e) { console.error("Database connection failed"); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/books', { ...newBook, copiesAvailable: newBook.totalCopies });
    setShowModal(false);
    fetchData();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Book Inventory</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Plus size={20}/> Add Book</button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-slate-400" size={20}/>
        <input placeholder="Search title or author..." className="w-full pl-10 p-3 border rounded-xl" onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b font-bold">
            <tr><th className="p-4">Book Details</th><th className="p-4">Genre</th><th className="p-4">Available</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map(book => (
              <tr key={book.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-semibold">{book.title}<br/><span className="text-xs text-slate-400">{book.author}</span></td>
                <td className="p-4 uppercase text-xs font-bold text-blue-500">{book.genre?.name || 'N/A'}</td>
                <td className="p-4 font-bold">{book.copiesAvailable} / {book.totalCopies}</td>
                <td className="p-4 text-right">
                  <button onClick={async () => { await api.delete(`/books/${book.id}`); fetchData(); }} className="text-red-500 p-2 rounded-lg hover:bg-red-50"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAdd} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button type="button" onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-slate-400"><X size={24}/></button>
            <h2 className="text-2xl font-bold mb-6">Register New Book</h2>
            <div className="space-y-4">
              <input placeholder="Book Title" required className="w-full p-3 border rounded-xl" onChange={e => setNewBook({...newBook, title: e.target.value})} />
              <input placeholder="Author Name" required className="w-full p-3 border rounded-xl" onChange={e => setNewBook({...newBook, author: e.target.value})} />
              <input placeholder="ISBN" required className="w-full p-3 border rounded-xl" onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
              <select required className="w-full p-3 border rounded-xl bg-white" onChange={e => setNewBook({...newBook, genreId: e.target.value})}>
                <option value="">Select Genre</option>
                {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <input type="number" placeholder="Total Copies" className="w-full p-3 border rounded-xl" onChange={e => setNewBook({...newBook, totalCopies: parseInt(e.target.value)})} />
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 shadow-lg shadow-blue-200">Save to Inventory</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
