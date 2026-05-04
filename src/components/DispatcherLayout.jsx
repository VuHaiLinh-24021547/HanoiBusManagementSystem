import { Outlet, NavLink } from 'react-router-dom';
import { Bus, ShieldAlert, Monitor, LogOut, Radio } from 'lucide-react';
import clsx from 'clsx';

export default function DispatcherLayout() {
  const sidebarItems = [
    { to: '/dispatcher', icon: Monitor, label: 'Live Operations' },
    { to: '/dispatcher/incidents', icon: ShieldAlert, label: 'Incident Management' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 relative">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-7 h-7 text-blue-400" />
            <span className="text-xl font-bold tracking-tight">HanoiBus<span className="text-blue-400 font-black">.</span></span>
          </div>
        </div>
        
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Station 1</p>
          <p className="font-medium text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse" />
            Dispatcher Active
          </p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dispatcher'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            End Shift
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shrink-0 shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800">Central Dispatch Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800">Nguyen Van A</span>
              <span className="text-xs text-slate-500">Lead Dispatcher</span>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 shadow-sm border border-blue-200">
              NA
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-slate-50 p-6 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
