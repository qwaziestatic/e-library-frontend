import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Plus, Trash2, BookOpen, X } from 'lucide-react';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', genreId: '', totalCopies: 1 });

  const fetchData = async () => {
    const [b, g] = await Promise.all([api.get('/books'), api.get('/genres')]);
    setBooks(b.data);
    setGenres(g.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', { ...newBook, copiesAvailable: newBook.totalCopies });
      setShowModal(false);
      fetchData();
    } catch (err) { alert("Error adding book"); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Book Inventory</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-200">
          <Plus size={18}/> Add New Book
        </button>
      </div>

      <input 
        placeholder="Search books..." 
        className="w-full p-3 border rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500" 
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b font-semibold">
            <tr><th className="p-4 text-slate-600">Title</th><th className="p-4 text-slate-600">Genre</th><th className="p-4 text-slate-600">Stock</th><th className="p-4 text-right text-slate-600">Actions</th></tr>
          </thead>
          <tbody>
            {books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map(book => (
              <tr key={book.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 font-medium">{book.title} <br/><span className="text-xs text-slate-400">{book.author}</span></td>
                <td className="p-4 text-sm text-slate-500 uppercase">{book.genre?.name}</td>
                <td className="p-4 text-sm font-bold">{book.copiesAvailable} / {book.totalCopies}</td>
                <td className="p-4 text-right">
                  <button onClick={async () => { await api.delete(`/books/${book.id}`); fetchData(); }} className="text-red-500"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD BOOK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddBook} className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button type="button" onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
            <h2 className="text-xl font-bold mb-6">Add New Book</h2>
            <div className="space-y-4">
              <input placeholder="Title" required className="w-full p-2 border rounded" onChange={e => setNewBook({...newBook, title: e.target.value})} />
              <input placeholder="Author" required className="w-full p-2 border rounded" onChange={e => setNewBook({...newBook, author: e.target.value})} />
              <input placeholder="ISBN" required className="w-full p-2 border rounded" onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
              <select required className="w-full p-2 border rounded" onChange={e => setNewBook({...newBook, genreId: e.target.value})}>
                <option value="">Select Genre</option>
                {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <input type="number" placeholder="Total Copies" className="w-full p-2 border rounded" onChange={e => setNewBook({...newBook, totalCopies: parseInt(e.target.value)})} />
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4">Save Book</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}