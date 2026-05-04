import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map, GitMerge, Clock, MapPin, Sun } from 'lucide-react';
import { addRoute } from '../lib/db';

const freqOptions = ['5 mins', '10 mins', '15 mins', '20 mins', '25 mins', '30 mins', '45 mins', '60 mins'];

const opPresets = [
  { label: 'Working Hours', start: '07:00', end: '18:00' },
  { label: 'Extended',      start: '05:30', end: '22:30' },
  { label: 'Full Day',      start: '05:00', end: '23:59' },
  { label: 'Daytime Only',  start: '06:00', end: '18:00' },
  { label: 'Night Service', start: '20:00', end: '01:00' },
];

export default function RouteFormModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    start: '',
    end: '',
    frequency: '15 mins',
    status: 'Active',
    startTime: '05:00',
    endTime: '22:30',
  });

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const applyPreset = (p) => setForm(f => ({ ...f, startTime: p.start, endTime: p.end }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      addRoute({
        name: form.name,
        start: form.start,
        end: form.end,
        frequency: form.frequency,
        status: form.status,
        operatingHours: { startTime: form.startTime, endTime: form.endTime },
      });
      setIsSubmitting(false);
      setForm({ name: '', start: '', end: '', frequency: '15 mins', status: 'Active', startTime: '05:00', endTime: '22:30' });
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2 text-blue-700">
                <Map className="w-5 h-5" />
                <h2 className="font-bold text-lg">Create New Route</h2>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Route Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Route Number / Name</label>
                <div className="relative">
                  <GitMerge className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Route 01"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Terminals */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Terminal</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Gia Lam"
                      value={form.start}
                      onChange={e => set('start', e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Terminal</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Yen Nghia"
                      value={form.end}
                      onChange={e => set('end', e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Frequency</label>
                <div className="flex flex-wrap gap-2">
                  {freqOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set('frequency', opt)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                        form.frequency === opt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-purple-500" />
                  Operating Hours
                </label>

                {/* Presets */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {opPresets.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        form.startTime === p.start && form.endTime === p.end
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Custom time pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">First Bus</label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={e => set('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Last Bus</label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={e => set('endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Preview badge */}
                <div className="mt-2 inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  {form.startTime} — {form.endTime}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Status</label>
                <div className="flex gap-3">
                  {['Active', 'Maintenance'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set('status', s)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                        form.status === s
                          ? s === 'Active'
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-amber-500 text-white border-amber-500'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-colors shadow-md shadow-green-600/20 disabled:opacity-70 flex items-center justify-center"
                >
                  {isSubmitting
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : 'Create Route'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
