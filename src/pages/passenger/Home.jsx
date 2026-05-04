import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, ChevronRight, Bus, Search, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getBuses } from '../../lib/db';

// Custom bus icon for the map
const busIcon = new L.DivIcon({
  html: `<div style="background-color: var(--color-primary); color: white; padding: 6px; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid white;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></div>`,
  className: 'custom-bus-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

export default function Home() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    setBuses(getBuses().filter(b => b.location));
  }, []);

  const hanoiLocations = [
    'Hoan Kiem Lake',
    'West Lake (Ho Tay)',
    'National University',
    'Aeon Mall Long Bien',
    'Noi Bai Airport',
    'My Dinh Stadium',
    'Times City',
    'Royal City',
    'Giap Bat Bus Station',
    'Yen Nghia Bus Station'
  ];

  const filteredFromLocations = hanoiLocations.filter(loc => loc.toLowerCase().includes(fromLocation.toLowerCase()));
  const filteredToLocations = hanoiLocations.filter(loc => loc.toLowerCase().includes(toLocation.toLowerCase()));

  const mockResults = [
    { id: 1, route: '32', time: '45 min', eta: '5 min', changes: 0, cost: '7,000 VND', frequency: '15 mins' },
    { id: 2, route: '01 → 08', time: '55 min', eta: '2 min', changes: 1, cost: '14,000 VND', frequency: '10-20 mins' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!fromLocation || !toLocation) return;
    
    setIsSearching(true);
    setShowResults(false);
    
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  const useCurrentLocation = () => {
    setFromLocation('Current Location (Hoan Kiem)');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-8">
      {/* Left Column: Journey Planner */}
      <div className="w-full lg:w-1/3 space-y-6 flex flex-col h-full">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] p-8 rounded-[24px] text-white shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden shrink-0">
          <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
            <Bus className="w-48 h-48" />
          </div>
          <h1 className="text-3xl font-bold mb-2 relative z-10">Where to?</h1>
          <p className="text-green-50 text-base mb-8 relative z-10">Plan your journey across Hanoi.</p>

          <form onSubmit={handleSearch} className="space-y-4 relative z-10">
            {/* From Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"></div>
              <input 
                type="text" 
                placeholder="From" 
                value={fromLocation}
                onChange={(e) => {
                  setFromLocation(e.target.value);
                  setShowFromSuggestions(true);
                }}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium backdrop-blur-sm"
                required
              />
              <button 
                type="button" 
                onClick={useCurrentLocation}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                title="Use current location"
              >
                <Navigation className="w-5 h-5" />
              </button>

              {/* From Suggestions Dropdown */}
              <AnimatePresence>
                {showFromSuggestions && fromLocation && filteredFromLocations.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-48 overflow-y-auto"
                  >
                    {filteredFromLocations.map((loc, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setFromLocation(loc);
                          setShowFromSuggestions(false);
                        }}
                        className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none flex items-center gap-3"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-sm">{loc}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* To Input */}
            <div className="relative">
              <div className="absolute left-4.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
              <input 
                type="text" 
                placeholder="To" 
                value={toLocation}
                onChange={(e) => {
                  setToLocation(e.target.value);
                  setShowToSuggestions(true);
                }}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium backdrop-blur-sm"
                required
              />

              {/* To Suggestions Dropdown */}
              <AnimatePresence>
                {showToSuggestions && toLocation && filteredToLocations.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-48 overflow-y-auto"
                  >
                    {filteredToLocations.map((loc, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setToLocation(loc);
                          setShowToSuggestions(false);
                        }}
                        className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none flex items-center gap-3"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-sm">{loc}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit"
              disabled={isSearching}
              className="w-full bg-white text-[var(--color-primary-dark)] font-bold py-4 rounded-xl shadow-lg mt-4 flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-90 text-lg"
            >
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  Find Route
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 flex-1"
              >
                <h2 className="font-bold text-gray-800 text-xl px-1">Suggested Routes</h2>
                
                <div className="space-y-4 pr-2 overflow-y-auto max-h-[400px]">
                  {mockResults.map((result) => (
                    <div key={result.id} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 items-center">
                          <div className="bg-yellow-400 text-yellow-900 font-black px-4 py-2 rounded-xl text-lg flex items-center shadow-sm">
                            <Bus className="w-5 h-5 mr-2" />
                            {result.route}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-black text-xl">{result.eta}</div>
                          <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">Live ETA</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl flex flex-wrap justify-between items-center text-sm font-semibold text-gray-600 gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          {result.time}
                        </div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <div>{result.changes === 0 ? 'Direct' : `${result.changes} transfer`}</div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <div className="text-blue-600">Every {result.frequency}</div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <div className="text-gray-800 font-bold">{result.cost}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : !isSearching ? (
              <motion.div 
                key="recent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="font-bold text-gray-800 text-xl px-1">Recent Places</h2>
                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 flex items-center justify-between border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">National University</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Xuan Thuy, Cau Giay</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">Aeon Mall</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Long Bien</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Map Preview */}
      <div className="hidden lg:block lg:w-2/3 bg-white rounded-[24px] shadow-sm border border-gray-200 overflow-hidden relative relative z-0">
        <MapContainer 
          center={[21.0285, 105.8542]} 
          zoom={13} 
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {buses.map(bus => (
            <Marker key={bus.id} position={[bus.location.lat, bus.location.lng]} icon={busIcon}>
              <Popup className="rounded-xl overflow-hidden">
                <div className="font-bold text-gray-800 text-sm mb-1">Bus {bus.routeId.replace('R', '')}</div>
                <div className="text-xs text-gray-500">Plate: {bus.plate}</div>
                <div className="text-xs text-gray-500">Status: {bus.status}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Overlay when no search is active (optional, maybe keep it clear so they can see the map) */}
        {!showResults && !isSearching && (
          <div className="absolute top-6 left-6 z-[400] bg-white/90 backdrop-blur px-6 py-4 rounded-2xl shadow-lg border border-gray-100 max-w-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Live Transit Map</h2>
            <p className="text-slate-500 text-sm">
              Select a destination on the left to plan your route, or interact with the map to view live bus locations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
