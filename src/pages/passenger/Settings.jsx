import { User, Globe, Info, PhoneCall, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  
  const settingItems = [
    { icon: User, label: 'Personal Information', color: 'text-blue-500 bg-blue-50' },
    { icon: Globe, label: 'Language', color: 'text-green-500 bg-green-50', value: 'English' },
    { icon: Info, label: 'About App', color: 'text-purple-500 bg-purple-50' },
    { icon: PhoneCall, label: 'Customer Support', color: 'text-orange-500 bg-orange-50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-50 min-h-full pb-8"
    >
      <div className="bg-white px-12 pt-12 pb-8 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              PA
            </div>
            <div>
              <h2 className="font-bold text-2xl text-gray-800">Passenger User</h2>
              <p className="text-lg text-gray-500 mt-1">+84 123 456 789</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {settingItems.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors ${idx !== settingItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center shrink-0`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg text-gray-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.value && <span className="text-base text-gray-400 font-medium">{item.value}</span>}
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
