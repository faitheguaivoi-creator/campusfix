import { useEffect, useState } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { LOST_FOUND_STATUSES, formatDate } from '../../utils/constants';

export default function AdminLostFound() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ type: '', status: '', category_id: '', search: '' });
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    api.get('/lost-found-categories').then((r) => setCategories(r.data.data));
  }, []);

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && p.append(k, v));
    api.get(`/admin/lost-found?${p}`)
      .then((res) => setRows(res.data.data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters.type, filters.status, filters.category_id]);

  const changeStatus = async (item, status) => {
    await api.patch(`/admin/lost-found/${item.id}/status`, { status });
    load();
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${item.title}" permanently?`)) return;
    await api.delete(`/admin/lost-found/${item.id}`);
    load();
  };

  const columns = [
    {
      key: 'title',
      label: 'Item',
      render: (r) => (
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate max-w-md">{r.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {r.reference_no} · {r.category?.name}
          </p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (r) => (
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
          r.type === 'lost' ? 'bg-lincoln-50 text-lincoln-700' : 'bg-green-50 text-green-700'
        }`}>
          {r.type.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (r) => (
        <span className="text-sm text-gray-600">
          {r.location?.name}
          {r.department?.name ? ` · ${r.department.name}` : ''}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const s = LOST_FOUND_STATUSES[r.status] || { label: r.status, color: 'gray' };
        return <Badge color={s.color}>{s.label}</Badge>;
      },
    },
    {
      key: 'poster',
      label: 'Posted By',
      render: (r) => <span className="text-sm text-gray-700">{r.poster?.name}</span>,
    },
    {
      key: 'date_occurred',
      label: 'Date',
      render: (r) => <span className="text-xs text-gray-500">{formatDate(r.date_occurred)}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setEdit(r)} className="text-xs text-lincoln-600 hover:underline">
            Manage
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
      <PageHeader title="Lost & Found Moderation" subtitle="Review, change status, or remove listings." />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Search title..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {Object.entries(LOST_FOUND_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <Table columns={columns} rows={rows} loading={loading} empty="No items match your filters." />
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.title || ''}>
        {edit && (
          <div className="space-y-4">
            <img src={edit.image_url} alt="" className="w-full h-40 object-cover rounded-lg" />
            <p className="text-sm text-gray-700 whitespace-pre-line">{edit.description}</p>
            {edit.identifying_info && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded">
                {edit.identifying_info}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {['active', 'matched', 'returned', 'closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => changeStatus(edit, st).then(() => setEdit(null))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    edit.status === st
                      ? 'bg-lincoln-500 text-white border-lincoln-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {LOST_FOUND_STATUSES[st].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}