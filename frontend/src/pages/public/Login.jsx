import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { extractErrors } from '../../utils/errors';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-lincoln-500 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded bg-white text-lincoln-600 flex items-center justify-center font-bold text-lg">
              CF
            </div>
            <div>
              <p className="font-bold text-xl leading-tight">CampusFix</p>
              <p className="text-xs text-white/80">Lincoln College</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Report campus problems.<br />
            Find what was lost.<br />
            Stay anonymous if you choose.
          </h2>
          <p className="mt-4 text-white/80 text-sm max-w-md">
            The official complaint and lost-and-found system for Lincoln College
            of Science, Management & Technology.
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

          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your CampusFix account</p>

          {errors.general && (
            <div className="mt-4 p-3 rounded-lg bg-lincoln-50 border border-lincoln-200 text-lincoln-700 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@campusfix.test"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-lincoln-500 focus:border-transparent"
              />
              {errors.email && <p className="text-xs text-lincoln-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-lincoln-500 focus:border-transparent"
              />
              {errors.password && <p className="text-xs text-lincoln-600 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-lincoln-500 text-white font-medium hover:bg-lincoln-600 disabled:opacity-60 transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-lincoln-600 font-medium hover:underline">
              Register
            </Link>
          </p>

          <div className="mt-6 p-3 rounded-lg bg-gray-100 text-xs text-gray-600">
            <p className="font-semibold text-gray-700 mb-1">Demo accounts (password: <code>password</code>)</p>
            <p>admin@campusfix.test · Administrator</p>
            <p>electrical@campusfix.test · Maintenance</p>
            <p>student1@campusfix.test · Student</p>
          </div>
        </div>
      </div>
    </div>
  );
}