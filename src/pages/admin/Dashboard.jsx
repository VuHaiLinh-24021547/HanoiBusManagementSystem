import { Bus, Users, Map, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Active Routes', value: '142', icon: Map, color: 'text-blue-600 bg-blue-100' },
    { label: 'Buses on Road', value: '854', icon: Bus, color: 'text-[var(--color-primary)] bg-green-100' },
    { label: 'Total Passengers', value: '1.2M', icon: Users, color: 'text-purple-600 bg-purple-100' },
    { label: 'Active Incidents', value: '3', icon: AlertTriangle, color: 'text-orange-600 bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <div className="text-sm text-gray-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Passenger Traffic</h3>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-gray-200 pl-2 pb-2">
            {[40, 60, 45, 80, 100, 75, 50, 90, 85, 65, 40, 55].map((val, i) => (
              <div key={i} className="w-full bg-[var(--color-primary)] rounded-t-sm hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer" style={{ height: `${val}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>10 PM</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {[
              { title: 'Route 32 Delayed', time: '10 mins ago', type: 'warning' },
              { title: 'Bus 14 Maintenance', time: '1 hour ago', type: 'info' },
              { title: 'Traffic Jam: Cau Giay', time: '2 hours ago', type: 'error' },
            ].map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-2 h-2 mt-1.5 rounded-full ${alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">{alert.title}</h4>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
