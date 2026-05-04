import { useState } from 'react';
import { AlertTriangle, Filter, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';
import IncidentModal from '../../components/IncidentModal';

export default function IncidentManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [incidents, setIncidents] = useState([
    { id: 'INC-001', route: 'Route 32', type: 'Heavy Traffic', time: '10 mins ago', severity: 'warning', status: 'Active' },
    { id: 'INC-002', route: 'Route 01', type: 'Vehicle Breakdown', time: '25 mins ago', severity: 'critical', status: 'Active' },
    { id: 'INC-003', route: 'Route 08', type: 'Detour', time: '1 hour ago', severity: 'info', status: 'Active' },
    { id: 'INC-004', route: 'Route 12', type: 'Accident', time: '2 hours ago', severity: 'critical', status: 'Resolved' },
    { id: 'INC-005', route: 'Route 44', type: 'Roadwork Delay', time: '3 hours ago', severity: 'warning', status: 'Resolved' },
  ]);

  const handleResolve = (id) => {
    setIncidents(incidents.map(inc => inc.id === id ? { ...inc, status: 'Resolved' } : inc));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            Incident Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track, log, and resolve fleet incidents and delays.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          Log New Incident
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search incidents by route or ID..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          Filter Status
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4 pl-6 whitespace-nowrap">Incident ID</th>
                <th className="p-4 whitespace-nowrap">Route</th>
                <th className="p-4 whitespace-nowrap">Type & Severity</th>
                <th className="p-4 whitespace-nowrap">Time Logged</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 pr-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {incidents.map((inc) => (
                <tr key={inc.id} className={`transition-colors ${inc.status === 'Resolved' ? 'bg-gray-50/30' : 'hover:bg-gray-50/50'}`}>
                  <td className="p-4 pl-6 font-bold text-gray-700">{inc.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800 bg-gray-100 w-max px-3 py-1 rounded-lg border border-gray-200">
                      {inc.route}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-800 text-sm">{inc.type}</span>
                      <span className={`w-max px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inc.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        inc.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 text-sm font-medium">{inc.time}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      inc.status === 'Active' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {inc.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      {inc.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {inc.status === 'Active' ? (
                      <button 
                        onClick={() => handleResolve(inc.id)}
                        className="text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ml-auto"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Resolve
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm font-medium">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <IncidentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
