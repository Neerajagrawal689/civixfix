import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';

import LandingPage from './components/pages/LandingPage';
import ReportIssueForm from './components/issues/ReportIssueForm';
import MyIssues from './components/issues/MyIssues';
import IssueDetails from './components/issues/IssueDetails';
import OfficerDashboard from './components/issues/OfficerDashboard';
import LiveAlerts from './components/layout/LiveAlerts';
import Profile from './components/profile/Profile';
import NoticeBoard from './components/pages/NoticeBoard';
import LostAndFound from './components/pages/LostAndFound';
import StaffDashboard from './components/pages/StaffDashboard';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Wrapper (prevent logged-in users from seeing landing/login pages)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Admin/Officer Route Wrapper
const OfficerRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  if (role !== 'OFFICER' && role !== 'DEPT_HEAD') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <>
    <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', borderRadius: '12px' } }} />
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="report" element={<ReportIssueForm />} />
        <Route path="my-issues" element={<MyIssues />} />
        <Route path="notices" element={<NoticeBoard />} />
        <Route path="lost-found" element={<LostAndFound />} />
        <Route path="official-dashboard" element={<OfficerRoute><OfficerDashboard /></OfficerRoute>} />
        <Route path="staff-dashboard" element={<StaffDashboard />} />
        <Route path="issues/:id" element={<IssueDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
    <LiveAlerts />
    </>
  );
}

export default App;
