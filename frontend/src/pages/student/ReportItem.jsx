import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import { extractErrors } from '../../utils/errors';

export default function ReportItem() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const type = params.get('type') === 'found' ? 'found' : 'lost';

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    type,
    title: '',
    description: '',
    category_id: '',
    location_id: '',
    date_occurred: new Date().toISOString().slice(0, 10),
    identifying_info: '',
    contact_preference: 'in_app',
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/lost-found-categories'), api.get('/locations')])
      .then(([c, l]) => { setCategories(c.data.data); setLocations(l.data.data); });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);

    try {
      const res = await api.post(`/lost-found/${type}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/student/lost-found/${res.data.data.id}`);
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setLoading(false);
    }
  };

  const isLost = type === 'lost';

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title={isLost ? 'Report a Lost Item' : 'Report a Found Item'}
        subtitle={
          isLost
            ? 'Tell us what you lost so others can help you find it.'
            : 'Help someone reunite with their belongings.'
        }
      />

      {errors.general && (
        <div className="mb-4 p-3 rounded-lg bg-lincoln-50 border border-lincoln-200 text-lincoln-700 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, type: 'lost' })}
            className={`py-2.5 rounded-lg text-sm font-medium border transition ${
              form.type === 'lost'
                ? 'bg-lincoln-500 text-white border-lincoln-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            I lost an item
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, type: 'found' })}
            className={`py-2.5 rounded-lg text-sm font-medium border transition ${
              form.type === 'found'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            I found an item
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item name *
          </label>
          <input
            required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Black Lenovo laptop backpack"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          />
          {errors.title && <p className="text-xs text-lincoln-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required rows={3} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the item and the circumstances."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          />
          {errors.description && <p className="text-xs text-lincoln-600 mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select required value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500">
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <p className="text-xs text-lincoln-600 mt-1">{errors.category_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <select required value={form.location_id}
              onChange={(e) => setForm({ ...form, location_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500">
              <option value="">Select a location</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            {errors.location_id && <p className="text-xs text-lincoln-600 mt-1">{errors.location_id}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isLost ? 'Date lost *' : 'Date found *'}
          </label>
          <input
            type="date" required value={form.date_occurred}
            onChange={(e) => setForm({ ...form, date_occurred: e.target.value })}
            max={new Date().toISOString().slice(0, 10)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          />
          {errors.date_occurred && <p className="text-xs text-lincoln-600 mt-1">{errors.date_occurred}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional identifying information
          </label>
          <textarea
            rows={2} value={form.identifying_info}
            onChange={(e) => setForm({ ...form, identifying_info: e.target.value })}
            placeholder="Colour, marks, serial number, distinguishing features..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            This helps verify ownership when someone contacts you.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
          <input
            type="file" accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-lincoln-50 file:text-lincoln-700 file:font-medium hover:file:bg-lincoln-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600 disabled:opacity-60">
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
}