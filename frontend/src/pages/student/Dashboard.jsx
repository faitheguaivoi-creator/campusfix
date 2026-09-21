import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, Search, Plus } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { COMPLAINT_STATUSES, formatDate } from '../../utils/constants';


export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/complaints/stats'),
      api.get('/complaints?per_page=5'),
      api.get('/my/lost-found'),
    ])
      .then(([s, c, lf]) => {
        const base = s.data.data;
        const items = lf.data.data || [];
        setStats({
          ...base,
          lost: items.filter((i) => i.type === 'lost').length,
          found: items.filter((i) => i.type === 'found').length,
        });
        setRecent(c.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here is a summary of your activity on CampusFix.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Complaints"  value={stats?.total}       icon={FileText}     color="bg-lincoln-500" />
        <StatCard label="Pending"           value={stats?.pending}     icon={Clock}        color="bg-amber-500" />
        <StatCard label="In Progress"       value={stats?.in_progress} icon={AlertCircle}  color="bg-indigo-500" />
        <StatCard label="Resolved"          value={stats?.resolved}    icon={CheckCircle}  color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link to="/student/complaints/new"
          className="flex items-center gap-3 p-4 rounded-xl bg-lincoln-500 text-white hover:bg-lincoln-600 transition shadow-sm">
          <Plus size={20} />
          <span className="font-medium">Report a Problem</span>
        </Link>
        <Link to="/student/lost-found/new?type=lost"
          className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-lincoln-300 hover:bg-lincoln-50/30 transition">
          <Search size={20} className="text-lincoln-500" />
          <span className="font-medium">Report Lost Item</span>
        </Link>
        <Link to="/student/lost-found/new?type=found"
          className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-lincoln-300 hover:bg-lincoln-50/30 transition">
          <Search size={20} className="text-lincoln-500" />
          <span className="font-medium">Report Found Item</span>
        </Link>
        <Link to="/student/lost-found"
          className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-lincoln-300 hover:bg-lincoln-50/30 transition">
          <Search size={20} className="text-lincoln-500" />
          <span className="font-medium">View Lost &amp; Found</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Complaints</h2>
            <Link to="/student/complaints" className="text-sm text-lincoln-600 hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="No complaints yet"
              message="Report your first campus problem using the button above."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {recent.map((c) => {
                const s = COMPLAINT_STATUSES[c.status] || { label: c.status, color: 'gray' };
                return (
                  <Link
                    key={c.id}
                    to={`/student/complaints/${c.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-medium text-gray-900 truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.tracking_reference} · {formatDate(c.created_at)}
                      </p>
                    </div>
                    <Badge color={s.color}>{s.label}</Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Lost &amp; Found</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-700">{stats?.lost ?? 0}</p>
              <p className="text-xs text-blue-600 mt-1">Lost Items</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <p className="text-2xl font-bold text-green-700">{stats?.found ?? 0}</p>
              <p className="text-xs text-green-600 mt-1">Found Items</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Link to="/student/my-reports" className="text-sm text-lincoln-600 hover:underline">
              Manage my reports →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}