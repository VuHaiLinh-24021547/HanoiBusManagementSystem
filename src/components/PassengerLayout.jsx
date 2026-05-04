import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Ticket, Bell, Settings, Bus, LogOut } from 'lucide-react';
import clsx from 'clsx';

export default function PassengerLayout() {
  const navigate = useNavigate();
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/notifications', icon: Bell, label: 'Alerts' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* Top Desktop Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-2xl">
            <Bus className="w-8 h-8" />
            <span>HanoiBus</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 font-semibold transition-colors duration-200 py-5 border-b-2',
                    isActive ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : 'text-gray-500 border-transparent hover:text-[var(--color-primary)] hover:border-gray-200'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right mr-2">
              <div className="text-sm font-bold text-gray-800">Passenger User</div>
              <div className="text-xs text-gray-500">Premium Member</div>
            </div>
            <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-green-200 cursor-pointer hover:bg-green-200 transition-colors">
              PA
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2" 
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 min-h-full flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
