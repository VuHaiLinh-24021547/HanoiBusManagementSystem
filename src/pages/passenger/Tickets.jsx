import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Ticket as TicketIcon, Clock, CreditCard, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function Tickets() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-50 min-h-full pb-8"
    >
      <div className="bg-white px-6 md:px-12 pt-10 md:pt-12 pb-4 shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-2">My Tickets</h1>
        
        {/* Mobile Tabs */}
        <div className="flex md:hidden bg-gray-100 p-1 rounded-xl">
          <button 
            className={clsx('flex-1 py-2 text-sm font-bold rounded-lg transition-all', activeTab === 'active' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500')}
            onClick={() => setActiveTab('active')}
          >
            Active Passes
          </button>
          <button 
            className={clsx('flex-1 py-2 text-sm font-bold rounded-lg transition-all', activeTab === 'buy' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500')}
            onClick={() => setActiveTab('buy')}
          >
            Buy New
          </button>
        </div>
      </div>

      <div className="p-6 md:p-12 md:grid md:grid-cols-2 md:gap-12 md:items-start max-w-7xl mx-auto">
        {/* Active Passes Section */}
        <div className={clsx("space-y-6", activeTab !== 'active' && "hidden md:block")}>
          <h2 className="hidden md:block font-bold text-xl text-gray-800 mb-2">Active Passes</h2>
          
          {/* Monthly Pass Card */}
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden transform transition-transform hover:scale-[1.02] duration-300">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 top-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="flex justify-between items-start mb-8 md:mb-10 relative z-10">
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Intercity Pass</span>
                <h3 className="font-bold text-xl md:text-3xl mt-3">Monthly Student</h3>
                <p className="text-white/80 text-sm mt-1">Zone 1 & 2</p>
              </div>
              <div className="bg-white p-2 md:p-3 rounded-xl shadow-md">
                <QrCode className="w-16 h-16 md:w-20 md:h-20 text-gray-800" />
              </div>
            </div>
            
            <div className="space-y-1 relative z-10 bg-white/10 p-3 md:p-4 rounded-xl backdrop-blur-sm inline-block w-full">
              <p className="text-xs text-white/80 uppercase tracking-wide font-medium">Valid until</p>
              <p className="font-bold text-lg md:text-xl">May 31, 2026</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 md:text-lg">Purchase History</h4>
                <p className="text-xs md:text-sm text-gray-500">View past transactions & receipts</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-gray-800 transition-colors" />
          </div>
        </div>

        {/* Buy Tickets Section */}
        <div className={clsx("space-y-4 md:space-y-6", activeTab !== 'buy' && "hidden md:block")}>
          <h2 className="hidden md:block font-bold text-xl text-gray-800 mb-2">Buy New Ticket</h2>
          <h3 className="font-bold text-gray-800 mb-2 md:hidden">Available Options</h3>
          
          <div className="space-y-3 md:space-y-4">
            {[
              { title: 'Single Journey', desc: 'Valid for one ride on any standard route', price: '7,000 VND', icon: TicketIcon, color: 'bg-blue-50 text-blue-600' },
              { title: 'Monthly Pass (Standard)', desc: 'Unlimited rides for 30 days', price: '200,000 VND', icon: CreditCard, color: 'bg-green-50 text-green-600' },
              { title: 'Monthly Pass (Student)', desc: 'Unlimited rides with student ID', price: '100,000 VND', icon: CreditCard, color: 'bg-orange-50 text-orange-600' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex gap-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all cursor-pointer group">
                <div className={`w-12 h-12 md:w-14 md:h-14 ${item.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 md:text-lg">{item.title}</h4>
                    <span className="font-bold text-[var(--color-primary)] md:text-lg">{item.price}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 md:mt-8 bg-gray-900 text-white font-bold py-4 md:py-5 md:text-lg rounded-xl shadow-md hover:bg-[var(--color-primary)] transition-colors hover:shadow-lg transform active:scale-[0.98] duration-200">
            Proceed to Payment
          </button>
        </div>
      </div>
    </motion.div>
  );
}
