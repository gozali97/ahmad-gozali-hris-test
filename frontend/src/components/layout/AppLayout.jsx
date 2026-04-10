import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/employees': 'Daftar Karyawan',
  '/admin/employees/create': 'Tambah Karyawan',
  '/admin/positions': 'Jabatan',
  '/admin/departments': 'Departemen',
  '/admin/attendances': 'Absensi',
  '/admin/leaves': 'Cuti',
  '/employee/dashboard': 'Dashboard',
  '/employee/attendance': 'Absensi',
  '/employee/leave': 'Cuti',
  '/employee/profile': 'Profil',
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const pageTitle = Object.entries(pageTitles).find(([key]) =>
    location.pathname.startsWith(key)
  )?.[1] || ''

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
