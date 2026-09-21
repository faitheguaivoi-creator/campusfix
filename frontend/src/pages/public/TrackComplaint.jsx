import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import Badge from '../../components/ui/Badge';
import {
  COMPLAINT_STATUSES, COMPLAINT_PRIORITIES, formatDateTime,
} from '../../utils/constants';


export default function TrackComplaint() {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const track = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await api.get(`/complaints/track/${reference.trim().toUpperCase()}`);
      setResult(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not find a complaint with that reference number.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-lincoln-500 text-white flex items-center justify-center font-bold">
              CF
            </div>
            <span className="font-bold text-gray-900">CampusFix</span>
          </Link>
          <Link to="/login" className="text-sm text-lincoln-600 hover:underline">
            Sign in
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track your complaint</h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter the reference number you received when you submitted your complaint.
          </p>
        </div>

        <form onSubmit={track} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complaint Reference Number
          </label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="CFX-XXXXXX"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-lg tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-lincoln-500"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full mt-4 py-3 rounded-lg bg-lincoln-500 text-white font-medium hover:bg-lincoln-600 disabled:opacity-60"
          >
            {loading ? 'Searching...' : 'Track Complaint'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-lincoln-50 border border-lincoln-200 text-lincoln-700 text-sm text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400">{result.tracking_reference}</p>
                <h2 className="text-lg font-bold text-gray-900 mt-1">{result.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={COMPLAINT_STATUSES[result.status]?.color || 'gray'}>
                  {COMPLAINT_STATUSES[result.status]?.label || result.status}
                </Badge>
                <Badge color={COMPLAINT_PRIORITIES[result.priority]?.color || 'gray'}>
                  {COMPLAINT_PRIORITIES[result.priority]?.label || result.priority}
                </Badge>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-gray-500">Category</dt>
              <dd className="text-gray-900">{result.category}</dd>
              <dt className="text-gray-500">Location</dt>
              <dd className="text-gray-900">{result.location}</dd>
              <dt className="text-gray-500">Submitted</dt>
              <dd className="text-gray-900">{formatDateTime(result.submitted_at)}</dd>
              {result.is_anonymous && (
                <>
                  <dt className="text-gray-500">Submitted by</dt>
                  <dd className="text-gray-900">Anonymous Student</dd>
                </>
              )}
            </dl>

            {result.updates?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Progress Updates</h3>
                <div className="space-y-3">
                  {result.updates.map((u, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-lincoln-500 mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-800">{u.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(u.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}