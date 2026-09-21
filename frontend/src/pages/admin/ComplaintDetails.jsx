import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, UserX, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
  COMPLAINT_STATUSES, COMPLAINT_PRIORITIES, formatDateTime, titleCase,
} from '../../utils/constants';

export default function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAssign, setShowAssign] = useState(false);
  const [assignForm, setAssignForm] = useState({ assigned_to: '', admin_remarks: '' });

  const [showStatus, setShowStatus] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: '', message: '' });

  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);

  const load = () => {
    api.get(`/admin/complaints/${id}`)
      .then((res) => setC(res.data.data))
      .catch(() => setC(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/admin/staff').then((r) => setStaff(r.data.data));
  }, [id]);

  const assign = async (e) => {
    e.preventDefault();
    await api.patch(`/admin/complaints/${id}/assign`, assignForm);
    setShowAssign(false);
    setAssignForm({ assigned_to: '', admin_remarks: '' });
    load();
  };

  const changeStatus = async (e) => {
    e.preventDefault();
    await api.patch(`/admin/complaints/${id}/status`, statusForm);
    setShowStatus(false);
    setStatusForm({ status: '', message: '' });
    load();
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await api.post(`/admin/complaints/${id}/updates`, { message: comment });
      setComment('');
      load();
    } finally {
      setPosting(false);
    }
  };

  const deleteComplaint = async () => {
    if (!confirm('Delete this complaint permanently? This cannot be undone.')) return;
    await api.delete(`/admin/complaints/${id}`);
    navigate('/admin/complaints');
  };

  if (loading) return <Spinner />;
  if (!c) return <div className="text-center py-12 text-gray-500">Complaint not found.</div>;

  const s = COMPLAINT_STATUSES[c.status] || { label: c.status, color: 'gray' };
  const p = COMPLAINT_PRIORITIES[c.priority] || { label: c.priority, color: 'gray' };

  return (
    <div>
      <button onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-400">{c.tracking_reference}</p>
                <h1 className="text-xl font-bold text-gray-900 mt-1">{c.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={s.color}>{s.label}</Badge>
                <Badge color={p.color}>{p.label}</Badge>
              </div>
            </div>

            {c.is_anonymous && (
              <div className="mb-3 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-lincoln-50 text-lincoln-700 border border-lincoln-200">
                <UserX size={12} /> Anonymous submission
              </div>
            )}

            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed mt-3">
              {c.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Category</p>
                <p className="text-gray-800">{c.category?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Location</p>
                <p className="text-gray-800">{c.location?.name}</p>
              </div>
              {c.department?.name && (
                <>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Department</p>
                    <p className="text-gray-800">{c.department.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Semester</p>
                    <p className="text-gray-800">{c.semester ? `Semester ${c.semester}` : '—'}</p>
                  </div>
                </>
              )}
            </div>

            {c.image_url && (
              <img src={c.image_url} alt="Complaint attachment"
                className="mt-4 rounded-lg border border-gray-200 max-h-96 w-full object-cover" />
            )}
          </div>

          <form onSubmit={postComment} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add a comment / progress note</label>
            <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Internal or public note about this complaint..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500" />
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={posting || !comment.trim()}
                className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600 disabled:opacity-60">
                {posting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setShowAssign(true)}
                className="w-full py-2 rounded-lg bg-lincoln-50 text-lincoln-700 text-sm font-medium hover:bg-lincoln-100">
                {c.assignee ? 'Reassign' : 'Assign to Staff'}
              </button>
              <button onClick={() => setShowStatus(true)}
                className="w-full py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100">
                Change Status
              </button>
              <button onClick={deleteComplaint}
                className="w-full py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 inline-flex items-center justify-center gap-2">
                <Trash2 size={14} /> Delete Complaint
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Reporter</h3>
            <p className="text-sm text-gray-800 flex items-center gap-2">
              {c.reporter?.anonymous ? <UserX size={14} className="text-gray-500" /> : <User size={14} className="text-gray-500" />}
              {c.reporter?.name}
            </p>
            {c.reporter?.anonymous && (
              <p className="text-xs text-gray-400 mt-1">Identity hidden by anonymity policy</p>
            )}
          </div>

          {c.assignee && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Assigned Staff</h3>
              <p className="text-sm text-gray-800">{c.assignee.name}</p>
              {c.assignee.specialty && <p className="text-xs text-gray-500 mt-0.5">{c.assignee.specialty}</p>}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(c.updates || []).length === 0 ? (
                <p className="text-sm text-gray-500">No updates yet.</p>
              ) : (
                c.updates.map((u) => (
                  <div key={u.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-lincoln-500 mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800">{u.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {u.author?.name} · {formatDateTime(u.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign modal */}
      <Modal open={showAssign} onClose={() => setShowAssign(false)} title="Assign Complaint">
        <form onSubmit={assign} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff *</label>
            <select required value={assignForm.assigned_to}
              onChange={(e) => setAssignForm({ ...assignForm, assigned_to: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Choose a staff member</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.specialty ? `— ${s.specialty}` : ''} ({s.active_total} active)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (optional)</label>
            <textarea rows={3} value={assignForm.admin_remarks}
              onChange={(e) => setAssignForm({ ...assignForm, admin_remarks: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAssign(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
              Assign
            </button>
          </div>
        </form>
      </Modal>

      {/* Status modal */}
      <Modal open={showStatus} onClose={() => setShowStatus(false)} title="Change Status">
        <form onSubmit={changeStatus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Status *</label>
            <select required value={statusForm.status}
              onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Choose new status</option>
              {Object.entries(COMPLAINT_STATUSES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea rows={3} value={statusForm.message}
              onChange={(e) => setStatusForm({ ...statusForm, message: e.target.value })}
              placeholder="Reason or details visible in the timeline."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowStatus(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
              Update Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}