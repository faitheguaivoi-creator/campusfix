import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import NotFound from './pages/public/NotFound';


import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import TrackComplaint from './pages/public/TrackComplaint';

import StudentDashboard from './pages/student/Dashboard';
import Complaints from './pages/student/Complaints';
import SubmitComplaint from './pages/student/SubmitComplaint';
import ComplaintDetails from './pages/student/ComplaintDetails';
import LostFound from './pages/student/LostFound';
import ReportItem from './pages/student/ReportItem';
import ItemDetails from './pages/student/ItemDetails';
import MyReports from './pages/student/MyReports';

import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminComplaintDetails from './pages/admin/ComplaintDetails';
import AdminLostFound from './pages/admin/LostFound';
import AdminUsers from './pages/admin/Users';
import AdminStaff from './pages/admin/Staff';
import AdminCategories from './pages/admin/Categories';
import AdminLocations from './pages/admin/Locations';

import StaffDashboard from './pages/staff/Dashboard';
import StaffComplaints from './pages/staff/Complaints';
import StaffComplaintDetails from './pages/staff/ComplaintDetails';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Landing />;
  return <Navigate to={`/${user.role}/dashboard`} replace />;
}

function RoleShell({ roles }) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/track-complaint" element={<TrackComplaint />} />

      {/* Student */}
      <Route element={<RoleShell roles={['student']} />}>
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/complaints" element={<Complaints />} />
        <Route path="/student/complaints/new" element={<SubmitComplaint />} />
        <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/student/lost-found" element={<LostFound />} />
        <Route path="/student/lost-found/new" element={<ReportItem />} />
        <Route path="/student/lost-found/:id" element={<ItemDetails />} />
        <Route path="/student/my-reports" element={<MyReports />} />
      </Route>

      {/* Admin */}
      <Route element={<RoleShell roles={['admin']} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} />
        <Route path="/admin/lost-found" element={<AdminLostFound />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/locations" element={<AdminLocations />} />
      </Route>

      {/* Staff */}
      <Route element={<RoleShell roles={['staff']} />}>
        <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/complaints" element={<StaffComplaints />} />
        <Route path="/staff/complaints/:id" element={<StaffComplaintDetails />} />
      </Route>

<Route path="*" element={<NotFound />} />    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}