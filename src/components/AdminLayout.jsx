import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Bus, Map, Users, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';

export default function AdminLayout() {
  const sidebarItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/fleet', icon: Bus, label: 'Live Operations' },
    { to: '/admin/routes', icon: Map, label: 'Routes & Schedules' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E293B] text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Bus className="w-8 h-8 text-[var(--color-primary)]" />
            <span className="text-xl font-bold tracking-tight">HanoiBus<span className="text-[var(--color-primary)] font-black">.</span></span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
              AD
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
