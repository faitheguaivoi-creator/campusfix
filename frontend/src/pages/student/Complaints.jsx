import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import {
  COMPLAINT_STATUSES, COMPLAINT_PRIORITIES, formatDate, titleCase,
} from '../../utils/constants';

export default function Complaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    api.get(`/complaints?${params}`)
      .then((res) => setItems(res.data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters.status, filters.priority]);

  const onSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div>
      <PageHeader
        title="My Complaints"
        subtitle="All complaints you have submitted"
        actions={
          <Link to="/student/complaints/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600 transition">
            <Plus size={16} /> New Complaint
          </Link>
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          >
            <option value="">All statuses</option>
            {Object.entries(COMPLAINT_STATUSES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          >
            <option value="">All priorities</option>
            {Object.entries(COMPLAINT_PRIORITIES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState
            title="No complaints found"
            message="Try changing your filters or submit a new complaint."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((c) => {
              const s = COMPLAINT_STATUSES[c.status] || { label: c.status, color: 'gray' };
              const p = COMPLAINT_PRIORITIES[c.priority] || { label: c.priority, color: 'gray' };
              return (
                <Link
                  key={c.id}
                  to={`/student/complaints/${c.id}`}
                  className="block p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-medium text-gray-900 truncate">{c.title}</p>
                        {c.is_anonymous && (
                          <span className="text-xs px-2 py-0.5 rounded bg-lincoln-50 text-lincoln-700 border border-lincoln-200">
                            Anonymous
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {c.tracking_reference} · {c.category?.name} · {formatDate(c.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge color={s.color}>{s.label}</Badge>
                      <Badge color={p.color}>{p.label}</Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}