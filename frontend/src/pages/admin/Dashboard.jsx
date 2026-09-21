import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, Clock, CheckCircle, AlertCircle, Wrench,
  Search, PackageCheck, ShieldAlert,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { COMPLAINT_STATUSES, titleCase, formatDate } from '../../utils/constants';


const STATUS_COLORS = {
  submitted:    '#9CA3AF',
  under_review: '#F59E0B',
  assigned:     '#3B82F6',
  in_progress:  '#6366F1',
  resolved:     '#16A34A',
  closed:       '#6B7280',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div className="text-center py-12 text-gray-500">Could not load dashboard.</div>;

  const statusChart = (data.complaints_by_status || []).map((s) => ({
    name: titleCase(s.status),
    value: s.total,
    status: s.status,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administrator Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          System-wide overview of complaints, lost items, and users.
        </p>
      </div>

      {/* Headline cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students"     value={data.total_students}     icon={Users}         color="bg-lincoln-500" />
        <StatCard label="Maintenance Staff"  value={data.total_staff}        icon={Wrench}        color="bg-indigo-500" />
        <StatCard label="Total Complaints"   value={data.total_complaints}   icon={FileText}      color="bg-lincoln-600" />
        <StatCard label="Anonymous"          value={data.anonymous_complaints} icon={ShieldAlert} color="bg-gray-700" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending"      value={data.pending_complaints}     icon={Clock}       color="bg-amber-500" />
        <StatCard label="In Progress"  value={data.in_progress_complaints} icon={AlertCircle} color="bg-indigo-500" />
        <StatCard label="Resolved"     value={data.resolved_complaints}    icon={CheckCircle} color="bg-green-500" />
        <StatCard label="Urgent"       value={data.urgent_complaints}      icon={AlertCircle} color="bg-lincoln-500" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Lost Items"     value={data.lost_items}     icon={Search}       color="bg-lincoln-500" />
        <StatCard label="Found Items"    value={data.found_items}    icon={Search}       color="bg-green-500" />
        <StatCard label="Returned Items" value={data.returned_items} icon={PackageCheck} color="bg-emerald-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Complaints by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusChart.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.status] || '#9CA3AF'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Complaints by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.complaints_by_category}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#E01E26" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {data.complaints_by_department?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Complaints by Department</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.complaints_by_department}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#C8191F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent complaints */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Complaints</h3>
          <Link to="/admin/complaints" className="text-sm text-lincoln-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {data.recent_complaints?.map((c) => {
            const s = COMPLAINT_STATUSES[c.status] || { label: c.status, color: 'gray' };
            return (
              <Link
                key={c.id}
                to={`/admin/complaints/${c.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="min-w-0 pr-3">
                  <p className="font-medium text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {c.tracking_reference} · {c.reporter?.name} · {formatDate(c.created_at)}
                  </p>
                </div>
                <Badge color={s.color}>{s.label}</Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}