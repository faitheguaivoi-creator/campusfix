import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { extractErrors } from '../../utils/errors';


const TYPES = ['academic', 'hostel', 'administrative', 'library', 'sports', 'cafeteria', 'other'];

export default function AdminLocations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});

  const load = () => {
    setLoading(true);
    api.get('/admin/locations')
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    const payload = Object.fromEntries(new FormData(e.target));
    try {
      if (edit) await api.put(`/admin/locations/${edit.id}`, payload);
      else await api.post('/admin/locations', payload);
      setShow(false);
      setEdit(null);
      load();
    } catch (err) {
      setErrors(extractErrors(err));
    }
  };

  const remove = async (row) => {
    if (!confirm(`Delete location "${row.name}"?`)) return;
    try {
      await api.delete(`/admin/locations/${row.id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete.');
    }
  };

  const columns = [
    { key: 'name', label: 'Location' },
    { key: 'building', label: 'Building', render: (r) => r.building || '—' },
    { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{r.type}</span> },
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
        title="Locations"
        subtitle="Campus locations available in forms"
        actions={
          <button onClick={() => { setEdit(null); setShow(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
            <Plus size={16} /> New Location
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <Table columns={columns} rows={rows} loading={loading} empty="No locations yet." />
      </div>

      <Modal open={show} onClose={() => { setShow(false); setEdit(null); }}
        title={edit ? `Edit ${edit.name}` : 'New Location'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" required defaultValue={edit?.name || ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
            <input name="building" defaultValue={edit?.building || ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select name="type" required defaultValue={edit?.type || 'other'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
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