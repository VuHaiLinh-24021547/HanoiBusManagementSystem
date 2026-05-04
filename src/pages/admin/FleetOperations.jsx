import { useState, useEffect } from 'react';
import { Bus, AlertTriangle, MapPin, Search } from 'lucide-react';
import { getBuses } from '../../lib/db';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom bus icon for the map
const busIcon = new L.DivIcon({
  html: `<div style="background-color: var(--color-primary); color: white; padding: 6px; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid white;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></div>`,
  className: 'custom-bus-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

export default function FleetOperations() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    setBuses(getBuses());
  }, []);
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
        {/* Live Map */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 relative overflow-hidden flex items-center justify-center bg-gray-100 z-0">
          <MapContainer 
            center={[21.0285, 105.8542]} 
            zoom={12} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {buses.filter(bus => bus.location).map(bus => (
              <Marker key={bus.id} position={[bus.location.lat, bus.location.lng]} icon={busIcon}>
                <Popup className="rounded-xl overflow-hidden">
                  <div className="font-bold text-gray-800 text-sm mb-1">Bus {bus.routeId.replace('R', '')}</div>
                  <div className="text-xs text-gray-500">Plate: {bus.plate}</div>
                  <div className="text-xs text-gray-500">Driver: {bus.driver}</div>
                  <div className="text-xs text-gray-500 font-bold mt-1">Status: {bus.status}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Fleet Sidebar */}
        <div className="w-80 bg-white rounded-2xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <h3 className="font-bold text-gray-800">Active Fleet</h3>
            <p className="text-xs text-gray-500">{buses.length} buses registered</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {buses.map((bus) => (
              <div key={bus.id} className="border border-gray-100 rounded-xl p-3 hover:border-[var(--color-primary)] cursor-pointer transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 px-2 py-1 rounded font-bold text-sm">Bus {bus.routeId.replace('R', '')}</div>
                    <span className="font-bold text-gray-800 text-sm">{bus.plate}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${bus.status === 'On Route' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {bus.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Driver: {bus.driver}</span>
                  {bus.status === 'Maintenance' && <span className="text-orange-500 font-medium">In Shop</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
