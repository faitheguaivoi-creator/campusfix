import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import { extractErrors } from '../../utils/errors';


export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', category_id: '', location_id: '',
    department_id: '', semester: '',
    priority: 'medium', is_anonymous: false,
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/complaint-categories'),
      api.get('/locations'),
      api.get('/departments'),
    ]).then(([c, l, d]) => {
      setCategories(c.data.data);
      setLocations(l.data.data);
      setDepartments(d.data.data);
    }).catch((err) => console.error('Meta load failed:', err));
  }, []);

  const selectedDept = departments.find((d) => String(d.id) === String(form.department_id));
  const semesterOptions = selectedDept
    ? Array.from({ length: selectedDept.max_semesters }, (_, i) => i + 1)
    : [];

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'is_anonymous') fd.append(k, v ? '1' : '0');
      else if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
    });
    if (image) fd.append('image', image);

    try {
      const res = await api.post('/complaints', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(res.data.data);
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Complaint submitted successfully</h2>
          <p className="text-sm text-gray-500 mt-2">
            Save this reference number to track your complaint at any time.
          </p>

          <div className="mt-6 p-4 rounded-lg bg-lincoln-50 border border-lincoln-200">
            <p className="text-xs text-lincoln-700 uppercase tracking-wide font-medium">
              Your tracking reference
            </p>
            <p className="text-3xl font-bold text-lincoln-700 tracking-wider mt-1">
              {success.tracking_reference}
            </p>
          </div>

          {success.is_anonymous && (
            <p className="text-xs text-gray-500 mt-4">
              This complaint was submitted <strong>anonymously</strong>. Your name will not appear in
              the complaint anywhere in the system.
            </p>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate('/student/complaints')}
              className="px-5 py-2.5 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600"
            >
              View My Complaints
            </button>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Report a Campus Problem"
        subtitle="Tell us what is broken or not working. We will get it fixed."
      />

      {errors.general && (
        <div className="mb-4 p-3 rounded-lg bg-lincoln-50 border border-lincoln-200 text-lincoln-700 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Broken ceiling fan in Main Hall"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          />
          {errors.title && <p className="text-xs text-lincoln-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required rows={4} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the problem. Include details that would help maintenance staff."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          />
          {errors.description && <p className="text-xs text-lincoln-600 mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              required value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
            >
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <p className="text-xs text-lincoln-600 mt-1">{errors.category_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <select
              required value={form.location_id}
              onChange={(e) => setForm({ ...form, location_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
            >
              <option value="">Select a location</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            {errors.location_id && <p className="text-xs text-lincoln-600 mt-1">{errors.location_id}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department (optional)
            </label>
            <select
              value={form.department_id}
              onChange={(e) =>
                setForm({ ...form, department_id: e.target.value, semester: '' })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
            >
              <option value="">Not department-specific</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {errors.department_id && <p className="text-xs text-lincoln-600 mt-1">{errors.department_id}</p>}
          </div>

          {selectedDept && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester (optional)
              </label>
              <select
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
              >
                <option value="">Not specific</option>
                {semesterOptions.map((n) => (
                  <option key={n} value={n}>Semester {n}</option>
                ))}
              </select>
              {errors.semester && <p className="text-xs text-lincoln-600 mt-1">{errors.semester}</p>}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lincoln-500"
          >
            <option value="low">Low — minor issue</option>
            <option value="medium">Medium — needs attention</option>
            <option value="high">High — affecting daily activities</option>
            <option value="urgent">Urgent — safety risk or blocking use</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
          <input
            type="file" accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-lincoln-50 file:text-lincoln-700 file:font-medium hover:file:bg-lincoln-100"
          />
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP. Max 2 MB.</p>
        </div>

        <div className="p-4 rounded-lg bg-lincoln-50 border border-lincoln-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_anonymous}
              onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
              className="mt-1 w-4 h-4 accent-lincoln-500"
            />
            <div>
              <p className="font-medium text-gray-900">Submit this complaint anonymously</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Your name will not be displayed with this complaint.
              </p>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit" disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
}