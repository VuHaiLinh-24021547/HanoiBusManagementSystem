import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'alert', title: 'Route 32 Detour', desc: 'Due to roadwork, route 32 will detour via Cau Giay street until 18:00.', time: '10 mins ago', icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
    { id: 2, type: 'info', title: 'Monthly Pass Expiring', desc: 'Your student pass expires in 3 days. Renew now to avoid interruption.', time: '2 hours ago', icon: Info, color: 'text-blue-500 bg-blue-50' },
    { id: 3, type: 'success', title: 'Payment Successful', desc: 'Successfully purchased 1x Single Journey Ticket.', time: 'Yesterday', icon: CheckCircle2, color: 'text-green-500 bg-green-50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-50 min-h-full pb-8"
    >
      <div className="bg-white px-6 md:px-12 pt-10 md:pt-12 pb-4 shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">Notifications</h1>
      </div>

      <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-4 md:space-y-6">
        {notifications.map((note) => (
          <div key={note.id} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex gap-4 md:gap-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className={`w-10 h-10 md:w-14 md:h-14 ${note.color} rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <note.icon className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <h4 className="font-bold text-gray-800 text-sm md:text-xl">{note.title}</h4>
                <span className="text-[10px] md:text-sm text-gray-400 font-medium">{note.time}</span>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">{note.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
