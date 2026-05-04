import { Bus, AlertTriangle, MapPin, Search } from 'lucide-react';

export default function FleetOperations() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Real-Time Dispatch</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Search Bus ID..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-red-100 hover:bg-red-100 transition-colors">
            <AlertTriangle className="w-5 h-5" />
            Log Incident
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Map Placeholder */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 relative overflow-hidden flex items-center justify-center bg-gray-100">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="text-center z-10">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">Map Interface Integration (Mapbox/Google Maps)</p>
            <p className="text-sm text-gray-400">Live coordinates polling active every 15s</p>
          </div>
          
          {/* Mock Bus Markers */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ring-4 ring-green-100 animate-pulse">
            32
          </div>
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ring-4 ring-orange-100">
            14
          </div>
        </div>

        {/* Fleet Sidebar */}
        <div className="w-80 bg-white rounded-2xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <h3 className="font-bold text-gray-800">Active Fleet</h3>
            <p className="text-xs text-gray-500">854 buses on road</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[
              { id: '29B-123.45', route: '32', status: 'On Time', driver: 'Nguyen Van A' },
              { id: '29B-987.65', route: '14', status: 'Delayed', driver: 'Tran Thi B', delay: '15m' },
              { id: '29B-456.78', route: '01', status: 'On Time', driver: 'Le Van C' },
            ].map((bus, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-3 hover:border-[var(--color-primary)] cursor-pointer transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 px-2 py-1 rounded font-bold text-sm">Bus {bus.route}</div>
                    <span className="font-bold text-gray-800 text-sm">{bus.id}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${bus.status === 'On Time' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {bus.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Driver: {bus.driver}</span>
                  {bus.delay && <span className="text-orange-500 font-medium">Delay: {bus.delay}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
