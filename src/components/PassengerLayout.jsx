import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Bus, Home, Ticket, Bell, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';
import BottomNav from './BottomNav';

export default function PassengerLayout() {
  const navigate = useNavigate();
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Top Navbar for Laptop/Desktop */}
      <div className="hidden md:flex bg-white shadow-sm border-b border-gray-100 px-8 py-4 items-center justify-between z-50">
        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-2xl">
          <Bus className="w-8 h-8" />
          <span>HanoiBus</span>
        </div>
        
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 font-semibold transition-colors duration-200',
                  isActive ? 'text-[var(--color-primary)]' : 'text-gray-500 hover:text-[var(--color-primary)]'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:bg-[var(--color-primary-dark)] transition-colors">
            PA
          </div>
          <button onClick={() => navigate('/login')} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="w-full md:max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
