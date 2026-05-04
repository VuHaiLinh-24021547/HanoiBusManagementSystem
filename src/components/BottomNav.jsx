import { Home, Ticket, Bell, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center gap-1 transition-colors duration-200',
              isActive ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={clsx('w-6 h-6 transition-transform duration-200', isActive && 'scale-110')}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
