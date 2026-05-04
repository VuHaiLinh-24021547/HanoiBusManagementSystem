import { Search, Navigation, MapPin, Bus, Route, Ticket, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 min-h-full pb-8"
    >
      {/* Header / Hero */}
      <div className="bg-[var(--color-primary)] px-6 pt-12 pb-24 md:pt-20 md:pb-36 md:rounded-3xl md:mx-6 md:mt-6 rounded-b-[40px] text-white relative shadow-md overflow-hidden">
        {/* Decorative background elements for desktop */}
        <div className="hidden md:block absolute right-0 top-0 w-1/3 h-full bg-white/10 skew-x-12 translate-x-16"></div>
        <div className="hidden md:block absolute right-32 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h1 className="text-2xl md:text-5xl font-bold tracking-tight">HanoiBus</h1>
            <p className="text-sm md:text-xl opacity-90 font-medium md:mt-3">Smart Urban Transit for Everyone</p>
          </div>
          {/* Hide PA avatar on mobile since top nav handles it on desktop, but keep for mobile if needed. Actually it's hidden on desktop in layout, let's just hide this avatar on desktop */}
          <div className="md:hidden w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="font-bold">PA</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 -mt-20 md:-mt-24 relative z-10 md:grid md:grid-cols-12 md:gap-8 md:px-12">
        
        {/* Left Column (Search) */}
        <div className="md:col-span-7 lg:col-span-8">
          <div className="bg-white rounded-2xl p-5 md:p-8 shadow-xl border border-gray-100 h-full">
            <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2 md:text-xl">
              <Navigation className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
              Plan your journey
            </h2>
            
            <div className="space-y-4 md:space-y-6 relative">
              <div className="absolute left-3.5 top-6 bottom-12 w-0.5 bg-gray-200 z-0 hidden md:block"></div>
              <div className="absolute left-3.5 top-5 bottom-8 w-0.5 bg-gray-200 z-0 md:hidden"></div>
              
              <div className="relative z-10 flex items-center gap-3 md:gap-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[var(--color-primary)] rounded-full"></div>
                </div>
                <input 
                  type="text" 
                  placeholder="Where are you now?" 
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-3 md:py-4 md:text-base text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all hover:bg-gray-100"
                  defaultValue="Hoan Kiem Lake"
                />
              </div>
              
              <div className="relative z-10 flex items-center gap-3 md:gap-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                </div>
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-3 md:py-4 md:text-base text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all hover:bg-gray-100"
                />
              </div>
              
              <button className="w-full mt-6 bg-[var(--color-primary)] text-white font-bold py-3.5 md:py-4 md:text-lg rounded-xl shadow-md hover:bg-[var(--color-primary-dark)] transition-colors hover:shadow-lg transform active:scale-[0.98] duration-200">
                Find Route
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Quick Actions & News) */}
        <div className="md:col-span-5 lg:col-span-4 mt-8 md:mt-0 space-y-8 flex flex-col">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 md:text-lg">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Route, label: 'Routes', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                { icon: Bus, label: 'Live Bus', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
                { icon: Ticket, label: 'Passes', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group">
                  <div className={`w-14 h-14 md:w-16 md:h-16 ${item.color} rounded-2xl flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300 transform group-hover:-translate-y-1`}>
                    <item.icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* News / Banner */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-4 md:text-lg px-1">Latest News</h3>
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden h-full flex flex-col justify-center group cursor-pointer hover:shadow-xl transition-shadow">
              <Bus className="absolute right-0 bottom-0 w-24 h-24 md:w-32 md:h-32 text-white/10 transform translate-x-4 translate-y-4 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
              <div className="relative z-10">
                <span className="bg-white/20 px-2.5 py-1 rounded-md text-xs font-bold inline-block mb-3 backdrop-blur-sm">Update</span>
                <h4 className="font-bold md:text-xl mb-2">New Electric Buses</h4>
                <p className="text-xs md:text-sm text-white/90 line-clamp-2 md:line-clamp-3 leading-relaxed">Experience the new zero-emission buses on route 32 starting this Monday. Environmentally friendly and completely silent!</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
