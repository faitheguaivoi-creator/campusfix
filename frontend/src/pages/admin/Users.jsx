import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { extractErrors } from '../../utils/errors';


const ROLES = { student: 'Student', staff: 'Maintenance', admin: 'Administrator' };

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: '', search: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && p.append(k, v));
    api.get(`/admin/users?${p}`)
      .then((res) => setRows(res.data.data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters.role]);

  const create = async (e) => {
    e.preventDefault();
    setErrors({});
    const form = new FormData(e.target);
    try {
      await api.post('/admin/users', Object.fromEntries(form));
      setShowCreate(false);
      load();
    } catch (err) {
      setErrors(extractErrors(err));
    }
  };

  const update = async (e) => {
    e.preventDefault();
    setErrors({});
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form);
    payload.is_active = form.get('is_active') === 'on';
    try {
      await api.put(`/admin/users/${edit.id}`, payload);
      setEdit(null);
      load();
    } catch (err) {
      setErrors(extractErrors(err));
    }
  };

  const remove = async (u) => {
    if (!confirm(`Deactivate ${u.name}?`)) return;
    await api.delete(`/admin/users/${u.id}`);
    load();
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900">{r.name}</p>
          <p className="text-xs text-gray-400">{r.email}</p>
        </div>
      ),
    },
    { key: 'role', label: 'Role', render: (r) => ROLES[r.role] || r.role },
    { key: 'department', label: 'Department', render: (r) => r.department || '—' },
    { key: 'matric_no', label: 'Matric', render: (r) => r.matric_no || '—' },
    {
      key: 'is_active',
      label: 'Status',
      render: (r) => (
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
          r.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {r.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => setEdit(r)} className="text-xs text-lincoln-600 hover:underline">Edit</button>
          <button onClick={() => remove(r)} className="text-xs text-red-600 hover:underline">Deactivate</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="All system users"
        actions={
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
            <Plus size={16} /> New User
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search name, email, matric..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All roles</option>
          {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <Table columns={columns} rows={rows} loading={loading} empty="No users match your filters." />
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create User">
        <form onSubmit={create} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input name="password" type="text" required minLength={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select name="role" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="student">Student</option>
              <option value="staff">Maintenance</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty (for staff)</label>
            <input name="specialty" placeholder="e.g. Electrical" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          {errors.general && <p className="text-sm text-lincoln-600">{errors.general}</p>}
          {errors.email && <p className="text-sm text-lincoln-600">{errors.email}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={`Edit ${edit?.name || ''}`}>
        {edit && (
          <form onSubmit={update} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input name="name" defaultValue={edit.name} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" defaultValue={edit.email} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" defaultValue={edit.role} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <input name="specialty" defaultValue={edit.specialty || ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="is_active" defaultChecked={edit.is_active} className="accent-lincoln-500" />
              Active
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEdit(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
              <button type="submit"
                className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}