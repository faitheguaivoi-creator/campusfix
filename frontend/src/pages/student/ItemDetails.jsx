import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Send } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { LOST_FOUND_STATUSES, formatDate } from '../../utils/constants';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ message: '', contact_detail: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/lost-found/${id}`)
      .then((res) => setItem(res.data.data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  const sendContact = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.post(`/lost-found/${id}/contacts`, contactForm);
      setSent(true);
      setShowContact(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send request.');
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status) => {
    if (!confirm(`Mark this item as ${status}?`)) return;
    await api.patch(`/lost-found/${id}/status`, { status });
    const res = await api.get(`/lost-found/${id}`);
    setItem(res.data.data);
  };

  if (loading) return <Spinner />;
  if (!item) return <div className="text-center py-12 text-gray-500">Item not found.</div>;

  const s = LOST_FOUND_STATUSES[item.status] || { label: item.status, color: 'gray' };
  const isMine = item.poster?.is_mine;
  const isLost = item.type === 'lost';

  return (
    <div>
      <button onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full max-h-96 object-cover" />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image provided</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                  isLost ? 'bg-lincoln-500 text-white' : 'bg-green-600 text-white'
                }`}>
                  {isLost ? 'LOST' : 'FOUND'}
                </span>
                <Badge color={s.color}>{s.label}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
              <p className="text-xs text-gray-400 mt-1">{item.reference_no}</p>

              <p className="text-sm text-gray-700 mt-4 whitespace-pre-line leading-relaxed">
                {item.description}
              </p>

              {item.identifying_info && (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-medium text-amber-800 mb-1">
                    Identifying information
                  </p>
                  <p className="text-sm text-amber-900">{item.identifying_info}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} /> {formatDate(item.date_occurred)}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} /> {item.location?.name}
                </div>
                <div>{item.category?.name}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Posted by</h3>
            <p className="text-sm text-gray-700">{item.poster?.name}</p>
            <p className="text-xs text-gray-400 mt-1">CampusFix user</p>
          </div>

          {!isMine && item.status === 'active' && (
            <button
              onClick={() => setShowContact(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-lincoln-500 text-white font-medium hover:bg-lincoln-600"
            >
              <Send size={16} /> {isLost ? 'I found this item' : 'This might be mine'}
            </button>
          )}

          {sent && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
              Your request has been sent. The poster will be notified.
            </div>
          )}

          {isMine && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
              <h3 className="font-semibold text-gray-900 mb-2">Manage</h3>
              {item.status === 'active' && (
                <button onClick={() => updateStatus('matched')}
                  className="w-full py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100">
                  Mark as Matched
                </button>
              )}
              {['active', 'matched'].includes(item.status) && (
                <button onClick={() => updateStatus('returned')}
                  className="w-full py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100">
                  Mark as Returned
                </button>
              )}
              {item.status !== 'closed' && (
                <button onClick={() => updateStatus('closed')}
                  className="w-full py-2 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100">
                  Close Listing
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showContact && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {isLost ? 'I found this item' : 'This might be mine'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Your message will be sent to the poster. They will decide whether to respond.
            </p>

            {error && (
              <div className="mb-3 p-3 rounded-lg bg-lincoln-50 border border-lincoln-200 text-lincoln-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={sendContact} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  required rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Explain why you think this is your item, or how you found it."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How should they reach you? (optional)
                </label>
                <input
                  value={contactForm.contact_detail}
                  onChange={(e) => setContactForm({ ...contactForm, contact_detail: e.target.value })}
                  placeholder="e.g. campus email or a time/place to meet"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lincoln-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowContact(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={sending}
                  className="px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600 disabled:opacity-60">
                  {sending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}