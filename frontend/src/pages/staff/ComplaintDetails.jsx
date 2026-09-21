import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, UserX, User } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
  COMPLAINT_STATUSES, COMPLAINT_PRIORITIES, formatDateTime,
} from '../../utils/constants';

export default function StaffComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: '', message: '' });
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);

  const load = () => {
    api.get(`/staff/complaints/${id}`)
      .then((res) => setC(res.data.data))
      .catch(() => setC(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const changeStatus = async (e) => {
    e.preventDefault();
    await api.patch(`/staff/complaints/${id}/status`, statusForm);
    setShowStatus(false);
    setStatusForm({ status: '', message: '' });
    load();
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await api.post(`/staff/complaints/${id}/updates`, { message: comment });
      setComment('');
      load();
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!c) return <div className="text-center py-12 text-gray-500">Complaint not found or not assigned to you.</div>;

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
                <p className="text-gray-800 flex items-center gap-1.5">
                  <MapPin size={12} /> {c.location?.name}
                </p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Add a progress note</label>
            <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="What have you done or observed so far?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500" />
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={posting || !comment.trim()}
                className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600 disabled:opacity-60">
                {posting ? 'Posting...' : 'Post Note'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
            <button onClick={() => setShowStatus(true)}
              className="w-full py-2 rounded-lg bg-lincoln-50 text-lincoln-700 text-sm font-medium hover:bg-lincoln-100">
              Update Status
            </button>
            {c.status === 'in_progress' && (
              <button
                onClick={() => { setStatusForm({ status: 'resolved', message: 'Marked as resolved.' }); setShowStatus(true); }}
                className="w-full mt-2 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100">
                Mark as Resolved
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Reporter</h3>
            <p className="text-sm text-gray-800 flex items-center gap-2">
              {c.reporter?.anonymous
                ? <><UserX size={14} className="text-gray-500" /> {c.reporter.name}</>
                : <><User size={14} className="text-gray-500" /> {c.reporter?.name}</>}
            </p>
            {c.reporter?.anonymous && (
              <p className="text-xs text-gray-400 mt-1">Identity hidden by anonymity policy</p>
            )}
          </div>

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

      <Modal open={showStatus} onClose={() => setShowStatus(false)} title="Update Status">
        <form onSubmit={changeStatus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Status *</label>
            <select required value={statusForm.status}
              onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Choose new status</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progress message (optional)</label>
            <textarea rows={3} value={statusForm.message}
              onChange={(e) => setStatusForm({ ...statusForm, message: e.target.value })}
              placeholder="What did you do? Any parts needed?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowStatus(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}