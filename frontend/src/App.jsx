import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import { ProtectedRoute, GuestRoute } from '@/router/guards'
import { AppLayout } from '@/components/layout/AppLayout'

// Pages
import { LoginPage } from '@/pages/LoginPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminDashboardPage } from '@/pages/admin/DashboardPage'
import { EmployeesPage } from '@/pages/admin/EmployeesPage'
import { EmployeeFormPage } from '@/pages/admin/EmployeeFormPage'
import { PositionsPage } from '@/pages/admin/PositionsPage'
import { DepartmentsPage } from '@/pages/admin/DepartmentsPage'
import { AttendancesPage } from '@/pages/admin/AttendancesPage'
import { LeavesPage } from '@/pages/admin/LeavesPage'
import { EmployeeDashboardPage } from '@/pages/employee/DashboardPage'
import { EmployeeAttendancePage } from '@/pages/employee/AttendancePage'
import { EmployeeLeavePage } from '@/pages/employee/LeavePage'
import { ProfilePage } from '@/pages/employee/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Guest only */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Public (accessible to any authenticated user) */}
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/employees" element={<EmployeesPage />} />
              <Route path="/admin/employees/create" element={<EmployeeFormPage />} />
              <Route path="/admin/employees/:id/edit" element={<EmployeeFormPage />} />
              <Route path="/admin/positions" element={<PositionsPage />} />
              <Route path="/admin/departments" element={<DepartmentsPage />} />
              <Route path="/admin/attendances" element={<AttendancesPage />} />
              <Route path="/admin/leaves" element={<LeavesPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Employee Routes */}
          <Route element={<ProtectedRoute role="employee" />}>
            <Route element={<AppLayout />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
              <Route path="/employee/attendance" element={<EmployeeAttendancePage />} />
              <Route path="/employee/leave" element={<EmployeeLeavePage />} />
              <Route path="/employee/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Catch-all — 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  )
}
