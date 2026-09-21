import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import {
  COMPLAINT_STATUSES, COMPLAINT_PRIORITIES, formatDateTime, titleCase,
} from '../../utils/constants';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);

  const load = () => {
    api.get(`/complaints/${id}`)
      .then((res) => setC(res.data.data))
      .catch(() => setC(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await api.post(`/complaints/${id}/updates`, { message: comment });
      setComment('');
      load();
    } finally {
      setPosting(false);
    }
  };

  const cancel = async () => {
    if (!confirm('Cancel this complaint? This cannot be undone.')) return;
    await api.delete(`/complaints/${id}`);
    navigate('/student/complaints');
  };

  if (loading) return <Spinner />;
  if (!c) return <div className="text-center py-12 text-gray-500">Complaint not found.</div>;

  const s = COMPLAINT_STATUSES[c.status] || { label: c.status, color: 'gray' };
  const p = COMPLAINT_PRIORITIES[c.priority] || { label: c.priority, color: 'gray' };
  const canCancel = ['submitted', 'under_review'].includes(c.status);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
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
                Submitted anonymously
              </div>
            )}

            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed mt-3">
              {c.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} /> {formatDateTime(c.created_at)}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} /> {c.location?.name}
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare size={14} /> {c.category?.name}
              </div>
            </div>

            {c.image_url && (
              <img
                src={c.image_url} alt="Complaint attachment"
                className="mt-4 rounded-lg border border-gray-200 max-h-96 w-full object-cover"
              />
            )}
          </div>

          {/* Comment form (only while not resolved/closed) */}
          {!['resolved', 'closed'].includes(c.status) && (
            <form onSubmit={postComment} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add a comment</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Provide more details or ask a question..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit" disabled={posting || !comment.trim()}
                  className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600 disabled:opacity-60"
                >
                  {posting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Status Timeline</h3>
            <div className="space-y-3">
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

          {c.assignee && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Assigned Staff</h3>
              <p className="text-sm text-gray-700">{c.assignee.name}</p>
              {c.assignee.specialty && (
                <p className="text-xs text-gray-500 mt-0.5">{c.assignee.specialty}</p>
              )}
            </div>
          )}

          {canCancel && (
            <button
              onClick={cancel}
              className="w-full py-2.5 rounded-lg border border-lincoln-200 text-lincoln-700 text-sm font-medium hover:bg-lincoln-50"
            >
              Cancel Complaint
            </button>
          )}
        </div>
      </div>
    </div>
  );
}