/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentQR from './pages/student/QR';
import StudentMeals from './pages/student/Meals';
import StudentFines from './pages/student/Fines';
import StudentProfile from './pages/student/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminScan from './pages/admin/Scan';
import AdminStudents from './pages/admin/Students';
import AdminMealLog from './pages/admin/MealLog';
import AdminFines from './pages/admin/Fines';
import AdminStaff from './pages/admin/Staff';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/qr" element={<ProtectedRoute allowedRoles={['student']}><StudentQR /></ProtectedRoute>} />
          <Route path="/student/meals" element={<ProtectedRoute allowedRoles={['student']}><StudentMeals /></ProtectedRoute>} />
          <Route path="/student/fines" element={<ProtectedRoute allowedRoles={['student']}><StudentFines /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/scan" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminScan /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminStudents /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminMealLog /></ProtectedRoute>} />
          <Route path="/admin/fines" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminFines /></ProtectedRoute>} />
          <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminStaff /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

