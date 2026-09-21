import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/staff')
      .then((r) => setStaff(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Maintenance Staff"
        subtitle={`${staff.length} staff member${staff.length === 1 ? '' : 's'}`}
      />

      {staff.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <EmptyState
            title="No maintenance staff yet"
            message="Create maintenance staff accounts from the Users page."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-lincoln-50 text-lincoln-700 flex items-center justify-center font-bold">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {s.specialty || 'Maintenance'}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-500 mb-4">
                <p className="flex items-center gap-2"><Mail size={12} /> {s.email}</p>
                {s.phone && <p className="flex items-center gap-2"><Phone size={12} /> {s.phone}</p>}
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{s.assigned_total}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-600">{s.active_total}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{s.resolved_total}</p>
                  <p className="text-xs text-gray-500">Resolved</p>
                </div>
              </div>

              <Link
                to={`/admin/complaints?assigned_to=${s.id}`}
                className="mt-4 inline-flex items-center gap-1 text-sm text-lincoln-600 hover:underline"
              >
                <Wrench size={14} /> View assignments
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}