import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { LOST_FOUND_STATUSES, CONTACT_STATUSES, formatDate } from '../../utils/constants';


export default function MyReports() {
  const [tab, setTab] = useState('items');
  const [items, setItems] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/my/lost-found'),
      api.get('/my/received-requests'),
      api.get('/my/contact-requests'),
    ]).then(([i, r, s]) => {
      setItems(i.data.data);
      setReceived(r.data.data);
      setSent(s.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const updateContact = async (id, status) => {
    await api.patch(`/contacts/${id}`, { status });
    const r = await api.get('/my/received-requests');
    setReceived(r.data.data);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="My Reports"
        subtitle="Your Lost & Found activity"
        actions={
          <Link to="/student/lost-found/new?type=lost"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
            <Plus size={16} /> New Report
          </Link>
        }
      />

      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {[
          { key: 'items',    label: `My Items (${items.length})` },
          { key: 'received', label: `Received (${received.length})` },
          { key: 'sent',     label: `Sent (${sent.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              tab === t.key
                ? 'border-lincoln-500 text-lincoln-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'items' && (
        items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <EmptyState title="No reports yet" message="Start by reporting a lost or found item." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const s = LOST_FOUND_STATUSES[item.status] || { label: item.status, color: 'gray' };
              return (
                <Link key={item.id} to={`/student/lost-found/${item.id}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-lincoln-200 transition overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-gray-100" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        item.type === 'lost' ? 'bg-lincoln-50 text-lincoln-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {item.type.toUpperCase()}
                      </span>
                      <Badge color={s.color}>{s.label}</Badge>
                    </div>
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(item.date_occurred)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      )}

      {tab === 'received' && (
        received.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <EmptyState title="No received requests" message="People who contact you about your items will appear here." />
          </div>
        ) : (
          <div className="space-y-3">
            {received.map((c) => {
              const cs = CONTACT_STATUSES[c.status] || { label: c.status, color: 'gray' };
              return (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{c.item?.title}</p>
                      <p className="text-xs text-gray-400">
                        From: {c.sender?.name} · {formatDate(c.created_at)}
                      </p>
                    </div>
                    <Badge color={cs.color}>{cs.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{c.message}</p>
                  {c.contact_detail && (
                    <p className="text-xs text-gray-500 mb-3">
                      <strong>Contact:</strong> {c.contact_detail}
                    </p>
                  )}
                  {c.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateContact(c.id, 'accepted')}
                        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100">
                        Accept
                      </button>
                      <button onClick={() => updateContact(c.id, 'declined')}
                        className="px-3 py-1.5 rounded-lg bg-lincoln-50 text-lincoln-700 text-sm font-medium hover:bg-lincoln-100">
                        Decline
                      </button>
                    </div>
                  )}
                  {c.status === 'accepted' && (
                    <button onClick={() => updateContact(c.id, 'resolved')}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                      Mark Resolved
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {tab === 'sent' && (
        sent.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <EmptyState title="No sent requests" message="Requests you send about items will appear here." />
          </div>
        ) : (
          <div className="space-y-3">
            {sent.map((c) => {
              const cs = CONTACT_STATUSES[c.status] || { label: c.status, color: 'gray' };
              return (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{c.item?.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(c.created_at)}</p>
                    </div>
                    <Badge color={cs.color}>{cs.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{c.message}</p>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}