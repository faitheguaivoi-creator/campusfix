import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { COMPLAINT_STATUSES, COMPLAINT_PRIORITIES, formatDate } from '../../utils/constants';


export default function StaffDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/staff/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div className="text-center py-12 text-gray-500">Could not load dashboard.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Here are the complaints assigned to you.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Assigned" value={data.assigned_total} icon={FileText}      color="bg-lincoln-500" />
        <StatCard label="Pending"        value={data.pending}        icon={Clock}         color="bg-amber-500" />
        <StatCard label="In Progress"    value={data.in_progress}    icon={AlertCircle}   color="bg-indigo-500" />
        <StatCard label="Resolved"       value={data.resolved}       icon={CheckCircle}   color="bg-green-500" />
        <StatCard label="Urgent"         value={data.urgent}         icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Assignments</h2>
          <Link to="/staff/complaints" className="text-sm text-lincoln-600 hover:underline">
            View all
          </Link>
        </div>

        {!data.recent || data.recent.length === 0 ? (
          <EmptyState
            title="No complaints assigned yet"
            message="When the administrator assigns a complaint to you, it will appear here."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {data.recent.map((c) => {
              const s = COMPLAINT_STATUSES[c.status] || { label: c.status, color: 'gray' };
              const p = COMPLAINT_PRIORITIES[c.priority] || { label: c.priority, color: 'gray' };
              return (
                <Link
                  key={c.id}
                  to={`/staff/complaints/${c.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-medium text-gray-900 truncate">{c.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {c.tracking_reference} · {c.location?.name} · {formatDate(c.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge color={s.color}>{s.label}</Badge>
                    <Badge color={p.color}>{p.label}</Badge>
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