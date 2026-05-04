import { useState, useEffect } from 'react';
import { User, Globe, Info, PhoneCall, ChevronRight, Save, X, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAccountByEmail, updateAccount } from '../../lib/db';

export default function Settings() {
  const session = JSON.parse(localStorage.getItem('hanoibus_current_user') || '{}');
  const [account, setAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({ name: '', address: '', contact: '' });

  useEffect(() => {
    if (session.email) {
      const acc = getAccountByEmail(session.email);
      if (acc) {
        setAccount(acc);
        setForm({ name: acc.name || '', address: acc.address || '', contact: acc.contact || '' });
      }
    }
  }, []);

  const handleSave = () => {
    if (!account) return;
    const updated = updateAccount(account.id, {
      name: form.name,
      address: form.address,
      contact: form.contact
    });
    if (updated) {
      setAccount(updated);
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCancel = () => {
    setForm({ name: account.name || '', address: account.address || '', contact: account.contact || '' });
    setIsEditing(false);
  };

  const initials = (account?.name || 'PA').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-50 min-h-full pb-8"
    >
      {/* Profile Header */}
      <div className="bg-white px-12 pt-12 pb-8 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {initials}
            </div>
            <div>
              <h2 className="font-bold text-2xl text-gray-800">{account?.name || 'Passenger User'}</h2>
              <p className="text-base text-gray-500 mt-0.5">{account?.email || ''}</p>
              {account?.contact && (
                <p className="text-base text-gray-500 mt-0.5">{account.contact}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-12 max-w-4xl mx-auto space-y-6">

        {/* Success Banner */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-6 py-4 flex items-center gap-3 font-semibold"
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              Personal information updated successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personal Information Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-gray-800">Personal Information</span>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] px-4 py-2 rounded-xl hover:bg-green-50 transition-colors"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] px-4 py-2 rounded-xl transition-colors shadow"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="p-6 space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1.5">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-gray-50 font-medium text-gray-800 transition-all"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-800">{account?.name || '—'}</span>
                </div>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1.5">Email Address <span className="text-gray-400 font-normal">(cannot be changed)</span></label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-500">{account?.email || '—'}</span>
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1.5">Home Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-gray-50 font-medium text-gray-800 transition-all"
                  placeholder="Enter your home address"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-800">{account?.address || '—'}</span>
                </div>
              )}
            </div>

            {/* Contact Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-1.5">Phone / Contact</label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.contact}
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-gray-50 font-medium text-gray-800 transition-all"
                  placeholder="+84 xxx xxx xxx"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-800">{account?.contact || '—'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {[
            { icon: Globe, label: 'Language', color: 'text-green-500 bg-green-50', value: 'English' },
            { icon: Info, label: 'About App', color: 'text-purple-500 bg-purple-50' },
            { icon: PhoneCall, label: 'Customer Support', color: 'text-orange-500 bg-orange-50' },
          ].map((item, idx, arr) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors ${idx !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 ${item.color} rounded-full flex items-center justify-center shrink-0`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg text-gray-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.value && <span className="text-base text-gray-400 font-medium">{item.value}</span>}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
