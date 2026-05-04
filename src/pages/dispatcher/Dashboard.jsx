import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import IncidentModal from '../../components/IncidentModal';

// Fix for default marker icon in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Bus Icon
const busIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function DispatcherDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hanoi center coordinates
  const hanoiPosition = [21.0285, 105.8542];

  // Mock active buses
  const activeBuses = [
    { id: '29B-12345', route: 'Route 32', lat: 21.0315, lng: 105.8452, status: 'On Time', speed: '35 km/h' },
    { id: '29B-67890', route: 'Route 01', lat: 21.0255, lng: 105.8582, status: 'Delayed', speed: '12 km/h' },
    { id: '29B-44556', route: 'Route 08', lat: 21.0185, lng: 105.8422, status: 'On Time', speed: '40 km/h' },
    { id: '29B-99887', route: 'Route 12', lat: 21.0355, lng: 105.8622, status: 'On Time', speed: '28 km/h' },
  ];

  const activeIncidents = [
    { id: 1, route: 'Route 32', type: 'Heavy Traffic', time: '10 mins ago', severity: 'warning' },
    { id: 2, route: 'Route 01', type: 'Vehicle Breakdown', time: '25 mins ago', severity: 'critical' },
    { id: 3, route: 'Route 08', type: 'Detour', time: '1 hour ago', severity: 'info' }
  ];

  return (
    <div className="h-full flex gap-6">
      {/* Main Area: Map */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 px-6 py-4 border-b border-slate-100 bg-white/90 backdrop-blur-md z-[1000] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-slate-800">Live Fleet Map</h2>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              142 Active Vehicles
            </span>
          </div>
        </div>
        
        <div className="flex-1 relative z-0">
          <MapContainer center={hanoiPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {activeBuses.map((bus) => (
              <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
                <Popup className="rounded-xl">
                  <div className="p-1">
                    <div className="font-bold text-gray-800 text-sm mb-1">{bus.route}</div>
                    <div className="text-xs text-gray-500 mb-2">Vehicle: {bus.id}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-1.5 rounded">
                        <span className="text-gray-400 block mb-0.5">Status</span>
                        <span className={bus.status === 'On Time' ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>
                          {bus.status}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-1.5 rounded">
                        <span className="text-gray-400 block mb-0.5">Speed</span>
                        <span className="text-gray-800 font-bold">{bus.speed}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Side Panel: Incidents */}
      <div className="w-80 flex flex-col gap-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg shadow-red-600/20 font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-5 h-5" />
          Log Incident
        </button>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Active Alerts
            </h3>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-slate-800 text-sm">{incident.route}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    incident.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    incident.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {incident.severity}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 mb-3">{incident.type}</p>
                <div className="flex items-center text-xs text-slate-500 gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {incident.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <IncidentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
