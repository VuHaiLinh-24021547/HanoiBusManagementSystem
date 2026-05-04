import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, X, Smartphone, Monitor, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrototypeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const views = [
    { name: 'Passenger App', path: '/', icon: Smartphone, color: 'text-green-600 bg-green-50' },
    { name: 'Dispatcher Portal', path: '/dispatcher', icon: Monitor, color: 'text-blue-600 bg-blue-50' },
    { name: 'Admin Dashboard', path: '/admin', icon: ShieldAlert, color: 'text-purple-600 bg-purple-50' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-64 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 mb-2">
              <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase">Prototype Views</h3>
            </div>
            <div className="space-y-1">
              {views.map((view) => {
                const isActive = location.pathname === view.path || (view.path !== '/' && location.pathname.startsWith(view.path));
                return (
                  <button
                    key={view.name}
                    onClick={() => {
                      navigate(view.path);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive ? 'bg-gray-100 ring-1 ring-gray-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${view.color}`}>
                      <view.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {view.name}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-transform"
        title="Switch Prototype View"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
      </button>
    </div>
  );
}
