import { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle, Clock, ShieldAlert, Bus, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import IncidentModal from '../../components/IncidentModal';
import { getBuses, getRoutes, getIncidents } from '../../lib/db';

// Custom bus icons by status
const makeIcon = (color) => new L.DivIcon({
  html: `<div style="background-color:${color};color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:10px;font-weight:bold;">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

const onRouteIcon = makeIcon('#16a34a');
const maintenanceIcon = makeIcon('#f97316');

// Deterministic route colour from route id
const routeColor = (id) => {
  const colors = ['#6366f1','#0ea5e9','#f43f5e','#f59e0b','#10b981','#8b5cf6','#ec4899','#14b8a6'];
  const sum = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

// Build a fake 4-waypoint polyline between start/end of a route in Hanoi
const terminalCoords = {
  'Gia Lam':       [21.0325, 105.9012], 'Yen Nghia':      [20.9805, 105.7442],
  'Bac Co':        [21.0285, 105.8450], 'Long Bien':      [21.0455, 105.8812],
  'Dong My':       [20.9635, 105.8112], 'Giap Bat':       [20.9955, 105.8392],
  'Nhon':          [21.0415, 105.7302], 'My Dinh':        [21.0285, 105.7742],
  'Cau Giay':      [21.0285, 105.7942], 'Nam Thang Long': [21.0655, 105.8042],
  'Ha Dong':       [20.9705, 105.7712], 'Noi Bai':        [21.2195, 105.8042],
  'Dong Anh':      [21.1265, 105.8392], 'Thanh Tri':      [20.9555, 105.8552],
  'Hoang Mai':     [20.9855, 105.8542], 'Tay Ho':         [21.0705, 105.8242],
  'Ba Dinh':       [21.0385, 105.8292], 'Hai Ba Trung':   [21.0085, 105.8642],
  'Tu Liem':       [21.0285, 105.7542],
};

function buildRouteLine(route) {
  const s = terminalCoords[route.start];
  const e = terminalCoords[route.end];
  if (!s || !e) return null;
  // Add two midpoints to simulate a road curve
  const mid1 = [(s[0] + e[0]) / 2 + 0.005, (s[1] + e[1]) / 2 - 0.005];
  const mid2 = [(s[0] + e[0]) / 2 - 0.003, (s[1] + e[1]) / 2 + 0.007];
  return [s, mid1, mid2, e];
}

export default function DispatcherDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = () => {
    setBuses(getBuses().filter(b => b.location));
    setRoutes(getRoutes().filter(r => r.status === 'Active'));
    setIncidents(getIncidents().filter(i => i.status === 'Active'));
    setLastRefresh(new Date());
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 15000); // poll every 15s
    return () => clearInterval(timer);
  }, []);

  const hanoiCenter = [21.0285, 105.8542];

  const filteredBuses = selectedRouteId
    ? buses.filter(b => b.routeId === selectedRouteId)
    : buses;

  const routeMap = Object.fromEntries(routes.map(r => [r.id, r]));

  const getSeverity = (type) => {
    if (['Breakdown', 'Accident'].includes(type)) return 'critical';
    if (['Traffic', 'Roadwork Delay'].includes(type)) return 'warning';
    return 'info';
  };

  return (
    <div className="h-full flex gap-6">
      {/* Main Area: Map */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        {/* Map Toolbar */}
        <div className="absolute top-0 inset-x-0 px-5 py-3 border-b border-slate-100 bg-white/90 backdrop-blur-md z-[1000] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-slate-800">Live Fleet Map</h2>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xs overflow-x-auto">
            <button
              onClick={() => setSelectedRouteId(null)}
              className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${
                !selectedRouteId
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Routes
            </button>
            {routes.slice(0, 8).map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRouteId(selectedRouteId === r.id ? null : r.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-colors`}
                style={selectedRouteId === r.id
                  ? { backgroundColor: routeColor(r.id), color: 'white', borderColor: routeColor(r.id) }
                  : { color: routeColor(r.id), borderColor: routeColor(r.id), background: 'white' }
                }
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {filteredBuses.length} Active
            </span>
            <button
              onClick={load}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title={`Last refresh: ${lastRefresh.toLocaleTimeString()}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative z-0 pt-14">
          <MapContainer center={hanoiCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Route polylines */}
            {(selectedRouteId
              ? routes.filter(r => r.id === selectedRouteId)
              : routes
            ).map(route => {
              const pts = buildRouteLine(route);
              if (!pts) return null;
              return (
                <Polyline
                  key={route.id}
                  positions={pts}
                  pathOptions={{
                    color: routeColor(route.id),
                    weight: selectedRouteId === route.id ? 5 : 3,
                    opacity: selectedRouteId ? (selectedRouteId === route.id ? 0.9 : 0.15) : 0.5,
                    dashArray: '8 4',
                  }}
                />
              );
            })}

            {/* Bus markers */}
            {filteredBuses.map(bus => {
              const route = routeMap[bus.routeId];
              return (
                <Marker
                  key={bus.id}
                  position={[bus.location.lat, bus.location.lng]}
                  icon={bus.status === 'On Route' ? onRouteIcon : maintenanceIcon}
                >
                  <Popup>
                    <div className="p-1 min-w-[160px]">
                      <div className="font-bold text-gray-800 text-sm mb-0.5">
                        {route ? `${route.name}` : `Route ${bus.routeId.replace('R', '')}`}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{bus.plate}</div>
                      {route && (
                        <div className="text-xs text-gray-500 mb-1">
                          {route.start} → {route.end}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-1.5 text-xs mt-2">
                        <div className="bg-gray-50 p-1.5 rounded">
                          <span className="text-gray-400 block">Status</span>
                          <span className={`font-bold ${bus.status === 'On Route' ? 'text-green-600' : 'text-orange-500'}`}>
                            {bus.status}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-1.5 rounded">
                          <span className="text-gray-400 block">Frequency</span>
                          <span className="text-gray-800 font-bold">{route?.frequency || '—'}</span>
                        </div>
                        <div className="bg-gray-50 p-1.5 rounded col-span-2">
                          <span className="text-gray-400 block">Driver</span>
                          <span className="text-gray-800 font-bold">{bus.driver}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 flex flex-col gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg shadow-red-600/20 font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-5 h-5" />
          Log Incident
        </button>

        {/* Active Incidents */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Active Alerts
            </h3>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {incidents.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {incidents.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm font-medium">
                No active incidents 🎉
              </div>
            ) : (
              incidents.map(inc => {
                const severity = getSeverity(inc.type);
                const route = routeMap[inc.routeId];
                return (
                  <div key={inc.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="font-bold text-slate-800 text-sm">
                        {route ? route.name : inc.routeId || 'Unknown Route'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        severity === 'critical' ? 'bg-red-100 text-red-700' :
                        severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {severity}
                      </span>
                    </div>
                    {route && (
                      <p className="text-xs text-slate-400 mb-1">{route.start} → {route.end}</p>
                    )}
                    <p className="text-sm font-medium text-slate-700 mb-2">{inc.type}</p>
                    {inc.description && (
                      <p className="text-xs text-slate-500 mb-2 italic">"{inc.description}"</p>
                    )}
                    <div className="flex items-center text-xs text-slate-500 gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <IncidentModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); load(); }} />
    </div>
  );
}
