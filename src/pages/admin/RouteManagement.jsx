import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, MoreVertical, Route as RouteIcon, Clock, Copy, Trash2, X, Check, SunMedium } from 'lucide-react';
import RouteFormModal from '../../components/RouteFormModal';
import { getRoutes, updateRoute, deleteRoute, addRoute } from '../../lib/db';
import { AnimatePresence, motion } from 'framer-motion';

// Inline frequency editor modal
function FrequencyModal({ route, onSave, onClose }) {
  const freqOptions = ['5 mins', '10 mins', '15 mins', '20 mins', '25 mins', '30 mins', '45 mins', '60 mins'];
  const [selected, setSelected] = useState(route.frequency);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Change Frequency</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Route: <span className="font-semibold text-gray-700">{route.name}</span></p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {freqOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                selected === opt
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            onClick={() => onSave(selected)}
            className="flex-1 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Operating Hours modal
function OperatingHoursModal({ route, onSave, onClose }) {
  const oh = route.operatingHours || { startTime: '05:00', endTime: '22:00' };
  const [startTime, setStartTime] = useState(oh.startTime);
  const [endTime, setEndTime] = useState(oh.endTime);

  const presets = [
    { label: 'Working Hours', start: '07:00', end: '18:00' },
    { label: 'Extended Hours', start: '05:30', end: '22:30' },
    { label: 'Early Morning', start: '04:30', end: '08:00' },
    { label: 'Night Service', start: '20:00', end: '01:00' },
    { label: 'Full Day', start: '05:00', end: '23:59' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-800 text-lg">Operating Hours</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Route: <span className="font-semibold text-gray-700">{route.name}</span></p>

        {/* Presets */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => { setStartTime(p.start); setEndTime(p.end); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  startTime === p.start && endTime === p.end
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[var(--color-primary)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Pickers */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">First Bus</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Last Bus</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-blue-50 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm text-blue-700 font-semibold">{startTime} — {endTime}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            onClick={() => onSave({ startTime, endTime })}
            className="flex-1 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Row action dropdown
function ActionMenu({ route, onFrequency, onOperatingHours, onDuplicate, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden"
          >
            <button
              onClick={() => { setOpen(false); onFrequency(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Change Frequency
            </button>
            <button
              onClick={() => { setOpen(false); onOperatingHours(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <SunMedium className="w-4 h-4" />
              Operating Hours
            </button>
            <button
              onClick={() => { setOpen(false); onDuplicate(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicate Route
            </button>
            <div className="h-px bg-gray-100 mx-3" />
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove Route
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RouteManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [freqRoute, setFreqRoute] = useState(null);
  const [hoursRoute, setHoursRoute] = useState(null); // route being edited for operating hours
  const [toast, setToast] = useState(null);

  const reload = () => setRoutes(getRoutes());

  useEffect(() => { reload(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFrequencySave = (newFreq) => {
    updateRoute(freqRoute.id, { frequency: newFreq });
    reload();
    setFreqRoute(null);
    showToast(`Frequency updated to ${newFreq} for ${freqRoute.name}`);
  };

  const handleOperatingHoursSave = (newHours) => {
    updateRoute(hoursRoute.id, { operatingHours: newHours });
    reload();
    setHoursRoute(null);
    showToast(`Operating hours updated for ${hoursRoute.name}`);
  };

  const handleDuplicate = (route) => {
    const copy = {
      name: `${route.name} (Copy)`,
      start: route.start,
      end: route.end,
      frequency: route.frequency,
      status: 'Active',
    };
    addRoute(copy);
    reload();
    showToast(`Duplicated "${route.name}" successfully`);
  };

  const handleDelete = (route) => {
    if (!window.confirm(`Remove "${route.name}"? This cannot be undone.`)) return;
    deleteRoute(route.id);
    reload();
    showToast(`"${route.name}" has been removed`, 'error');
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.start.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.end.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoutes = filteredRoutes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold flex items-center gap-2 ${
              toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
            }`}
          >
            {toast.type === 'error' ? <Trash2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <RouteIcon className="w-6 h-6 text-[var(--color-primary)]" />
            Route & Schedule Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage public transit routes, terminals, and frequencies.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Route
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search routes by name or terminal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4 pl-6 whitespace-nowrap">Route Name</th>
                <th className="p-4 whitespace-nowrap">Start Terminal</th>
                <th className="p-4 whitespace-nowrap">End Terminal</th>
                <th className="p-4 whitespace-nowrap">Frequency</th>
                <th className="p-4 whitespace-nowrap">Operating Hours</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 pr-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRoutes.length > 0 ? (
                paginatedRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-gray-800 bg-gray-100 w-max px-3 py-1 rounded-lg border border-gray-200">
                        {route.name}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-600">{route.start}</td>
                    <td className="p-4 font-medium text-gray-600">{route.end}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {route.frequency}
                      </span>
                    </td>
                    <td className="p-4">
                      {route.operatingHours ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-lg">
                          <SunMedium className="w-3.5 h-3.5" />
                          {route.operatingHours.startTime} – {route.operatingHours.endTime}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        route.status === 'Active'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <ActionMenu
                        route={route}
                        onFrequency={() => setFreqRoute(route)}
                        onOperatingHours={() => setHoursRoute(route)}
                        onDuplicate={() => handleDuplicate(route)}
                        onDelete={() => handleDelete(route)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">
                    No routes found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div>Showing {filteredRoutes.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRoutes.length)} of {filteredRoutes.length} entries</div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors">Prev</button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${currentPage === i + 1 ? 'bg-[var(--color-primary)] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors">Next</button>
            </div>
          </div>
        )}
        {totalPages <= 1 && filteredRoutes.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
            Showing all {filteredRoutes.length} entries
          </div>
        )}
      </div>

      {/* Modals */}
      <RouteFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); reload(); }} />

      <AnimatePresence>
        {freqRoute && (
          <FrequencyModal
            route={freqRoute}
            onSave={handleFrequencySave}
            onClose={() => setFreqRoute(null)}
          />
        )}
        {hoursRoute && (
          <OperatingHoursModal
            route={hoursRoute}
            onSave={handleOperatingHoursSave}
            onClose={() => setHoursRoute(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
