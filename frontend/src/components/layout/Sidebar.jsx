import { NavLink, useLocation } from 'react-router'
import {
  LayoutDashboard, Users, Briefcase, Building2,
  ClipboardList, Calendar, ChevronLeft, ChevronRight,
  UserCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/employees', label: 'Karyawan', icon: Users },
  { to: '/admin/positions', label: 'Jabatan', icon: Briefcase },
  { to: '/admin/departments', label: 'Departemen', icon: Building2 },
  { to: '/admin/attendances', label: 'Absensi', icon: ClipboardList },
  { to: '/admin/leaves', label: 'Cuti', icon: Calendar },
]

const employeeNav = [
  { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/attendance', label: 'Absensi', icon: ClipboardList },
  { to: '/employee/leave', label: 'Cuti', icon: Calendar },
  { to: '/employee/profile', label: 'Profil', icon: UserCircle },
]

export function Sidebar({ isOpen, onToggle }) {
  const { user } = useAuth()
  const navItems = user?.role === 'admin' ? adminNav : employeeNav

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-border z-30 flex flex-col transition-all duration-300',
          'lg:relative lg:translate-x-0',
          isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span
              className={cn(
                'font-bold text-foreground text-base whitespace-nowrap transition-opacity duration-200',
                !isOpen && 'lg:opacity-0'
              )}
            >
              HR System
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1 px-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span
                    className={cn(
                      'whitespace-nowrap transition-opacity duration-200',
                      !isOpen && 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
                    )}
                  >
                    {label}
                  </span>
                  {/* Tooltip when collapsed */}
                  {!isOpen && (
                    <span className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle button (desktop) */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center h-10 border-t border-border hover:bg-accent transition-colors"
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </aside>
    </>
  )
}
