import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { extractErrors } from '../../utils/errors';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', matric_no: '', department: '',
    password: '', password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await register(form);
      navigate('/student/dashboard');
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-lincoln-500 text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded bg-white text-lincoln-600 flex items-center justify-center font-bold text-lg">
            CF
          </div>
          <div>
            <p className="font-bold text-xl leading-tight">CampusFix</p>
            <p className="text-xs text-white/80">Lincoln College</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight">Join CampusFix.</h2>
          <p className="mt-4 text-white/80 text-sm max-w-md">
            Create your Lincoln College student account to report problems,
            track their progress, and reconnect with lost belongings.
          </p>
        </div>

        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} Lincoln College
        </p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded bg-lincoln-500 text-white flex items-center justify-center font-bold">
              CF
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">CampusFix</p>
              <p className="text-xs text-gray-500">Lincoln College</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Students only. Staff accounts are created by the administrator.</p>

          {errors.general && (
            <div className="mt-4 p-3 rounded-lg bg-lincoln-50 border border-lincoln-200 text-lincoln-700 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                required value={form.name} onChange={update('name')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-lincoln-500 focus:border-transparent"
              />
              {errors.name && <p className="text-xs text-lincoln-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" required value={form.email} onChange={update('email')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-lincoln-500 focus:border-transparent"
              />
              {errors.email && <p className="text-xs text-lincoln-600 mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matric No.</label>
                <input
                  value={form.matric_no} onChange={update('matric_no')}
                  placeholder="LCSMT/0001"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-lincoln-500 focus:border-transparent"
                />
                {errors.matric_no && <p className="text-xs text-lincoln-600 mt-1">{errors.matric_no}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  value={form.department} onChange={update('department')}
                  placeholder="CSE"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-lincoln-500 focus:border-transparent"
                />
                {errors.department && <p className="text-xs text-lincoln-600 mt-1">{errors.department}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" required value={form.password} onChange={update('password')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-lincoln-500 focus:border-transparent"
              />
              {errors.password && <p className="text-xs text-lincoln-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password" required value={form.password_confirmation} onChange={update('password_confirmation')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-lincoln-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-lincoln-500 text-white font-medium hover:bg-lincoln-600 disabled:opacity-60 transition"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-lincoln-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}