import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { extractErrors } from '../../utils/errors';


export default function AdminCategories() {
  const [tab, setTab] = useState('complaint');
  const [complaintCats, setComplaintCats] = useState([]);
  const [lfCats, setLfCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/complaint-categories'),
      api.get('/admin/lost-found-categories'),
    ]).then(([a, b]) => {
      setComplaintCats(a.data.data);
      setLfCats(b.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const endpoint = tab === 'complaint' ? '/admin/complaint-categories' : '/admin/lost-found-categories';
  const rows = tab === 'complaint' ? complaintCats : lfCats;

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    const payload = Object.fromEntries(new FormData(e.target));
    try {
      if (edit) await api.put(`${endpoint}/${edit.id}`, payload);
      else await api.post(endpoint, payload);
      setShow(false);
      setEdit(null);
      load();
    } catch (err) {
      setErrors(extractErrors(err));
    }
  };

  const remove = async (row) => {
    if (!confirm(`Delete category "${row.name}"?`)) return;
    try {
      await api.delete(`${endpoint}/${row.id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete.');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'usage',
      label: 'Usage',
      render: (r) => `${r.complaints_count ?? r.items_count ?? 0} items`,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (r) => (
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
          r.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {r.is_active ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => { setEdit(r); setShow(true); }} className="text-xs text-lincoln-600 hover:underline">
            Edit
          </button>
          <button onClick={() => remove(r)} className="text-xs text-red-600 hover:underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Manage complaint and lost-and-found categories"
        actions={
          <button onClick={() => { setEdit(null); setShow(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
            <Plus size={16} /> New Category
          </button>
        }
      />

      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {[
          { key: 'complaint', label: 'Complaint Categories' },
          { key: 'lostfound', label: 'Lost & Found Categories' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              tab === t.key ? 'border-lincoln-500 text-lincoln-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <Table columns={columns} rows={rows} loading={loading} empty="No categories yet." />
      </div>

      <Modal open={show} onClose={() => { setShow(false); setEdit(null); }}
        title={edit ? `Edit ${edit.name}` : 'New Category'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" required defaultValue={edit?.name || ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input name="description" defaultValue={edit?.description || ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          {errors.name && <p className="text-sm text-lincoln-600">{errors.name}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShow(false); setEdit(null); }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
              {edit ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}