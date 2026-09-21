import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { LOST_FOUND_STATUSES, formatDate } from '../../utils/constants';


export default function LostFound() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const type = params.get('type') || '';
  const category = params.get('category') || '';
  const location = params.get('location') || '';
  const search = params.get('search') || '';

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (type) p.append('type', type);
    if (category) p.append('category_id', category);
    if (location) p.append('location_id', location);
    if (search) p.append('search', search);

    api.get(`/lost-found?${p}`)
      .then((res) => setItems(res.data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [type, category, location]);
  useEffect(() => {
    Promise.all([api.get('/lost-found-categories'), api.get('/locations')])
      .then(([c, l]) => { setCategories(c.data.data); setLocations(l.data.data); });
  }, []);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  };

  return (
    <div>
      <PageHeader
        title="Lost &amp; Found"
        subtitle="Browse items reported lost or found on campus"
        actions={
          <Link to="/student/lost-found/new?type=lost"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
            <Plus size={16} /> Report Item
          </Link>
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => update('search', e.target.value)}
              onBlur={load}
              placeholder="Search items..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500"
            />
          </div>
          <select value={type} onChange={(e) => update('type', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500">
            <option value="">All types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select value={category} onChange={(e) => update('category', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={location} onChange={(e) => update('location', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500">
            <option value="">All locations</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <EmptyState
            title="No items found"
            message="Try changing your filters or check back later."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const s = LOST_FOUND_STATUSES[item.status] || { label: item.status, color: 'gray' };
            return (
              <Link
                key={item.id}
                to={`/student/lost-found/${item.id}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-lincoln-200 transition overflow-hidden"
              >
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title}
                    className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Search size={32} className="text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      item.type === 'lost'
                        ? 'bg-lincoln-50 text-lincoln-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {item.type === 'lost' ? 'LOST' : 'FOUND'}
                    </span>
                    <Badge color={s.color}>{s.label}</Badge>
                  </div>
                  <p className="font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.category?.name} · {formatDate(item.date_occurred)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    📍 {item.location?.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}