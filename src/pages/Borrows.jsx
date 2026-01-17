import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ClipboardCheck, RotateCcw, AlertTriangle } from 'lucide-react';

export default function Borrows() {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    const res = await api.get('/borrow-records');
    setRecords(res.data);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleReturn = async (id) => {
    await api.patch(`/borrow-records/${id}/return`);
    fetchRecords();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Active Borrows & Returns</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Member</th>
              <th className="p-4">Book</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => {
              const isOverdue = !record.returnDate && new Date(record.dueDate) < new Date();
              return (
                <tr key={record.id} className="border-b">
                  <td className="p-4 font-medium">{record.member?.name}</td>
                  <td className="p-4">{record.book?.title}</td>
                  <td className={`p-4 ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                    {new Date(record.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {record.returnDate ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Returned</span>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {isOverdue ? 'Overdue' : 'Borrowed'}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {!record.returnDate && (
                      <button onClick={() => handleReturn(record.id)} className="text-blue-600 hover:underline flex items-center gap-1 justify-end ml-auto">
                        <RotateCcw size={16}/> Return Book
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}