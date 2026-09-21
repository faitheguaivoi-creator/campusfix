import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import {
  COMPLAINT_STATUSES, COMPLAINT_PRIORITIES, formatDate,
} from '../../utils/constants';


export default function AdminComplaints() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0 });
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [filters, setFilters] = useState({
    status: '', priority: '', category_id: '', location_id: '', assigned_to: '', search: '',
  });

  useEffect(() => {
    Promise.all([
      api.get('/complaint-categories'),
      api.get('/locations'),
      api.get('/admin/staff'),
    ]).then(([c, l, s]) => {
      setCategories(c.data.data);
      setLocations(l.data.data);
      setStaff(s.data.data);
    });
  }, []);

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && p.append(k, v));
    api.get(`/admin/complaints?${p}`)
      .then((res) => { setRows(res.data.data); setMeta(res.data.meta); })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [
    filters.status, filters.priority, filters.category_id,
    filters.location_id, filters.assigned_to,
  ]);

  const columns = [
    {
      key: 'title',
      label: 'Complaint',
      render: (r) => (
        <Link to={`/admin/complaints/${r.id}`} className="block hover:text-lincoln-600">
          <p className="font-medium text-gray-900 truncate max-w-md">{r.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {r.tracking_reference} · {r.category?.name}
          </p>
        </Link>
      ),
    },
    {
      key: 'reporter',
      label: 'Reporter',
      render: (r) => (
        <div>
          <p className="text-sm text-gray-700">{r.reporter?.name}</p>
          {r.reporter?.anonymous && (
            <span className="text-xs text-gray-400">Anonymous</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        const s = COMPLAINT_STATUSES[r.status] || { label: r.status, color: 'gray' };
        return <Badge color={s.color}>{s.label}</Badge>;
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (r) => {
        const p = COMPLAINT_PRIORITIES[r.priority] || { label: r.priority, color: 'gray' };
        return <Badge color={p.color}>{p.label}</Badge>;
      },
    },
    {
      key: 'assignee',
      label: 'Assigned To',
      render: (r) => r.assignee?.name || <span className="text-gray-400 text-xs">—</span>,
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (r) => <span className="text-xs text-gray-500">{formatDate(r.created_at)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="All Complaints"
        subtitle={`${meta.total} total · searchable and filterable`}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              placeholder="Search title or reference..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500"
            />
          </div>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {Object.entries(COMPLAINT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All priorities</option>
            {Object.entries(COMPLAINT_PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filters.assigned_to} onChange={(e) => setFilters({ ...filters, assigned_to: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All staff</option>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <Table columns={columns} rows={rows} loading={loading} empty="No complaints match your filters." />
      </div>
    </div>
  );
}