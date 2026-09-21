import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-lincoln-500 text-white flex items-center justify-center font-bold text-2xl mb-5">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="text-sm text-gray-500 mt-2">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-lincoln-500 text-white text-sm font-medium hover:bg-lincoln-600">
            <Home size={16} /> Go home
          </Link>
          <Link to="/track-complaint"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-white">
            <Search size={16} /> Track a complaint
          </Link>
        </div>
      </div>
    </div>
  );
}