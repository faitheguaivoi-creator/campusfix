import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Search, Users, Wrench,
  MapPin, Tag, LogOut, Menu, ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';

const MENU = {
  student: [
    { label: 'Dashboard',       path: '/student/dashboard',       icon: LayoutDashboard },
    { label: 'My Complaints',   path: '/student/complaints',      icon: FileText },
    { label: 'Report Problem',  path: '/student/complaints/new',  icon: FileText },
    { label: 'Track Complaint', path: '/track-complaint',         icon: Search },
    { label: 'Lost & Found',    path: '/student/lost-found',      icon: Search },
    { label: 'My Reports',      path: '/student/my-reports',      icon: FileText },
  ],
  admin: [
    { label: 'Dashboard',    path: '/admin/dashboard',  icon: LayoutDashboard },
    { label: 'Complaints',   path: '/admin/complaints', icon: FileText },
    { label: 'Lost & Found', path: '/admin/lost-found', icon: Search },
    { label: 'Users',        path: '/admin/users',      icon: Users },
    { label: 'Staff',        path: '/admin/staff',      icon: Wrench },
    { label: 'Categories',   path: '/admin/categories', icon: Tag },
    { label: 'Locations',    path: '/admin/locations',  icon: MapPin },
  ],
  staff: [
    { label: 'Dashboard',      path: '/staff/dashboard',  icon: LayoutDashboard },
    { label: 'My Assignments', path: '/staff/complaints', icon: FileText },
  ],
};

const ROLE_LABEL = {
  student: 'Student',
  admin:   'Administrator',
  staff:   'Maintenance',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = MENU[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="bg-lincoln-500 text-white px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-white text-lincoln-600 flex items-center justify-center font-bold text-lg">
              CF
            </div>
            <div className="min-w-0">
              <p className="font-bold text-lg leading-tight">CampusFix</p>
              <p className="text-xs text-white/80 truncate">Lincoln College</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {menu.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                  active
                    ? 'bg-lincoln-50 text-lincoln-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon size={18} className={active ? 'text-lincoln-600' : 'text-gray-400'} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="text-lincoln-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-lincoln-100 text-lincoln-700 flex items-center justify-center font-semibold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{ROLE_LABEL[user?.role]}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-lincoln-600 hover:bg-lincoln-50 rounded-lg transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-lincoln-500 text-white px-4 py-3 flex items-center justify-between shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu size={22} />
          </button>
          <span className="font-semibold">CampusFix</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-gray-200 bg-white px-4 py-3 text-center">
          <p className="text-xs text-gray-400">
            CampusFix — Lincoln College of Science, Management & Technology
          </p>
        </footer>
      </div>
    </div>
  );
}