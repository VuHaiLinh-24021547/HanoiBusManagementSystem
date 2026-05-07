// src/lib/db.js

const DB_KEY = 'hanoibus_db';

const opHoursPresets = [
  { startTime: '05:00', endTime: '22:30' }, // Standard full day
  { startTime: '05:30', endTime: '21:00' }, // Standard shortened
  { startTime: '06:00', endTime: '22:00' }, // Working hours extended
  { startTime: '05:00', endTime: '23:30' }, // Late night
  { startTime: '07:00', endTime: '19:00' }, // Working hours only
  { startTime: '05:30', endTime: '22:00' }, // Full day standard
  { startTime: '06:30', endTime: '20:30' }, // Daytime service
  { startTime: '04:30', endTime: '23:59' }, // Extended early-late
  { startTime: '06:00', endTime: '18:00' }, // Daytime only
  { startTime: '05:00', endTime: '21:00' }, // Evening cutoff
  { startTime: '07:30', endTime: '22:00' }, // Late start, late end
  { startTime: '05:00', endTime: '20:00' }, // Early cutoff
];

const mockRoutes = [
  { id: 'R01', name: 'Route 01', start: 'Gia Lam', end: 'Yen Nghia', frequency: '15 mins', status: 'Active', operatingHours: { startTime: '05:00', endTime: '22:30' } },
  { id: 'R02', name: 'Route 02', start: 'Bac Co', end: 'Yen Nghia', frequency: '20 mins', status: 'Active', operatingHours: { startTime: '05:30', endTime: '21:30' } },
  { id: 'R08', name: 'Route 08', start: 'Long Bien', end: 'Dong My', frequency: '10 mins', status: 'Active', operatingHours: { startTime: '05:00', endTime: '23:00' } },
  { id: 'R32', name: 'Route 32', start: 'Giap Bat', end: 'Nhon', frequency: '15 mins', status: 'Maintenance', operatingHours: { startTime: '06:00', endTime: '20:00' } },
  ...Array.from({ length: 46 }).map((_, i) => ({
    id: `R${(i + 10).toString().padStart(2, '0')}`,
    name: `Route ${i + 10}`,
    start: ['Giap Bat', 'My Dinh', 'Gia Lam', 'Long Bien', 'Cau Giay', 'Yen Nghia', 'Nam Thang Long', 'Ha Dong'][i % 8],
    end: ['Noi Bai', 'Dong Anh', 'Thanh Tri', 'Hoang Mai', 'Tay Ho', 'Ba Dinh', 'Hai Ba Trung', 'Tu Liem'][i % 8],
    frequency: `${[10, 15, 20, 25, 30][i % 5]} mins`,
    status: i % 7 === 0 ? 'Maintenance' : 'Active',
    operatingHours: opHoursPresets[i % opHoursPresets.length]
  }))
];

const mockBuses = mockRoutes.map((r, i) => ({
  id: `B${100 + i}`,
  plate: `29B-${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 90 + 10)}`,
  routeId: r.id,
  status: Math.random() > 0.2 ? 'On Route' : 'Maintenance',
  driver: `Driver ${i + 1}`,
  capacity: 60,
  location: Math.random() > 0.1 ? { lat: 21.0285 + (Math.random() - 0.5) * 0.1, lng: 105.8542 + (Math.random() - 0.5) * 0.1 } : null
}));

const initialData = {
  accounts: [
    { id: 'A1', name: 'Demo Passenger', email: 'passenger@hanoibus.vn', password: 'test', role: 'passenger', status: 'Active', balance: 500000, address: '12 Ly Thai To, Hoan Kiem, Hanoi', contact: '+84 123 456 789' },
    { id: 'A2', name: 'Demo Admin', email: 'admin@hanoibus.vn', password: 'demo', role: 'admin', status: 'Active', balance: 0, address: '', contact: '' },
    { id: 'A3', name: 'Demo Dispatcher', email: 'dispatcher@hanoibus.vn', password: 'demo', role: 'dispatcher', status: 'Active', balance: 0, address: '', contact: '' },
    { id: 'A4', name: 'Passenger 1', email: 'passenger01@example.com', password: 'demo', role: 'passenger', status: 'Active', balance: 500000, address: '', contact: '' },
    { id: 'A5', name: 'Passenger 2', email: 'passenger02@example.com', password: 'demo', role: 'passenger', status: 'Active', balance: 200000, address: '', contact: '' },
    { id: 'A6', name: 'Dispatcher 1', email: 'dispatch1@hanoibus.com', password: 'demo', role: 'dispatcher', status: 'Active', balance: 0, address: '', contact: '' },
    { id: 'A7', name: 'Passenger 3', email: 'passenger03@example.com', password: 'demo', role: 'passenger', status: 'Suspended', balance: 150000, address: '', contact: '' },
    { id: 'A8', name: 'Nguyen Van A', email: 'nguyenvana@example.com', password: 'demo', role: 'passenger', status: 'Active', balance: 350000, address: '', contact: '' },
    { id: 'A9', name: 'Broke Passenger', email: 'broke@example.com', password: 'demo', role: 'passenger', status: 'Active', balance: 0, address: '', contact: '' },
  ],
  routes: mockRoutes,
  buses: mockBuses,
  incidents: [
    { id: 'INC-001', type: 'Breakdown', busId: 'B101', routeId: 'R01', status: 'Active', description: 'Engine overheating near Long Bien', timestamp: new Date(Date.now() - 3600000).toISOString(), reportedBy: 'A3' },
    { id: 'INC-002', type: 'Traffic', busId: 'B301', routeId: 'R08', status: 'Resolved', description: 'Heavy traffic at Nguyen Trai', timestamp: new Date(Date.now() - 86400000).toISOString(), reportedBy: 'A3' }
  ],
  tickets: []
};

// Initialize DB if empty
const initDB = () => {
  // Always regenerate data if we don't have exactly 50 routes or 50 buses
  const currentDb = JSON.parse(localStorage.getItem(DB_KEY) || 'null');
  if (!currentDb || !currentDb.routes || currentDb.routes.length < 50 || currentDb.buses.length < 50) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  }

  // Migration: patch any existing route missing operatingHours
  const db = JSON.parse(localStorage.getItem(DB_KEY));
  let migrated = false;
  db.routes = db.routes.map((route, i) => {
    if (!route.operatingHours) {
      // Find the matching seed route first, fall back to preset cycle
      const seedRoute = initialData.routes.find(r => r.id === route.id);
      migrated = true;
      return { ...route, operatingHours: seedRoute?.operatingHours || opHoursPresets[i % opHoursPresets.length] };
    }
    return route;
  });

  // Migration: ensure all accounts have a status field
  db.accounts = db.accounts.map(a => a.status ? a : { ...a, status: 'Active', migrated: true });
  if (db.accounts.some(a => a.migrated)) {
    db.accounts = db.accounts.map(({ migrated: _m, ...rest }) => rest);
    migrated = true;
  }

  // Migration: ensure all accounts have a balance field
  db.accounts = db.accounts.map(a => {
    if (a.balance === undefined || a.balance === null) {
      migrated = true;
      // Check seed for the correct value; fall back to role-based default
      const seed = initialData.accounts.find(s => s.id === a.id || s.email === a.email);
      return { ...a, balance: seed?.balance ?? (a.role === 'passenger' ? 500000 : 0) };
    }
    return a;
  });

  // Migration: merge new seed accounts that don't exist yet
  initialData.accounts.forEach(seed => {
    if (!db.accounts.find(a => a.id === seed.id || a.email === seed.email)) {
      db.accounts.push(seed);
      migrated = true;
    }
  });

  if (migrated) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
  
  // Migrate old 'hanoibus_users' if present
  const oldUsers = JSON.parse(localStorage.getItem('hanoibus_users') || '[]');
  if (oldUsers.length > 0) {
    const db = getDB();
    oldUsers.forEach(user => {
      if (!db.accounts.find(a => a.email === user.email)) {
        db.accounts.push({ id: 'A' + Date.now() + Math.floor(Math.random()*1000), ...user });
      }
    });
    saveDB(db);
    localStorage.removeItem('hanoibus_users');
  }
};

const getDB = () => JSON.parse(localStorage.getItem(DB_KEY));
const saveDB = (data) => localStorage.setItem(DB_KEY, JSON.stringify(data));

// Call initialization immediately
initDB();

// --- Accounts ---
export const getAccounts = () => getDB().accounts;
export const addAccount = (account) => {
  const db = getDB();
  const newAccount = { id: 'A' + Date.now(), ...account };
  db.accounts.push(newAccount);
  saveDB(db);
  return newAccount;
};
export const getAccountByEmail = (email) => getDB().accounts.find(a => a.email === email);
export const updateAccount = (id, updates) => {
  const db = getDB();
  const index = db.accounts.findIndex(a => a.id === id);
  if (index !== -1) {
    db.accounts[index] = { ...db.accounts[index], ...updates };
    saveDB(db);
    return db.accounts[index];
  }
  return null;
};
export const deleteAccount = (id) => {
  const db = getDB();
  db.accounts = db.accounts.filter(a => a.id !== id);
  saveDB(db);
};

// --- Routes ---
export const getRoutes = () => getDB().routes;
export const addRoute = (route) => {
  const db = getDB();
  const newRoute = { id: 'R' + Date.now(), ...route };
  db.routes.push(newRoute);
  saveDB(db);
  return newRoute;
};
export const updateRoute = (id, updates) => {
  const db = getDB();
  const index = db.routes.findIndex(r => r.id === id || r.id === Number(id));
  if (index !== -1) {
    db.routes[index] = { ...db.routes[index], ...updates };
    saveDB(db);
    return db.routes[index];
  }
  return null;
};
export const deleteRoute = (id) => {
  const db = getDB();
  db.routes = db.routes.filter(r => r.id !== id && r.id !== Number(id));
  saveDB(db);
};

// --- Buses ---
export const getBuses = () => getDB().buses;
export const addBus = (bus) => {
  const db = getDB();
  const newBus = { id: 'B' + Date.now(), ...bus };
  db.buses.push(newBus);
  saveDB(db);
  return newBus;
};
export const updateBus = (id, updates) => {
  const db = getDB();
  const index = db.buses.findIndex(b => b.id === id);
  if (index !== -1) {
    db.buses[index] = { ...db.buses[index], ...updates };
    saveDB(db);
    return db.buses[index];
  }
  return null;
};
export const deleteBus = (id) => {
  const db = getDB();
  db.buses = db.buses.filter(b => b.id !== id);
  saveDB(db);
};

// --- Incidents ---
export const getIncidents = () => getDB().incidents;
export const addIncident = (incident) => {
  const db = getDB();
  const newIncident = { id: 'INC-' + Date.now(), timestamp: new Date().toISOString(), ...incident };
  db.incidents.push(newIncident);
  saveDB(db);
  return newIncident;
};
export const updateIncident = (id, updates) => {
  const db = getDB();
  const index = db.incidents.findIndex(i => i.id === id);
  if (index !== -1) {
    db.incidents[index] = { ...db.incidents[index], ...updates };
    saveDB(db);
    return db.incidents[index];
  }
  return null;
};
export const deleteIncident = (id) => {
  const db = getDB();
  db.incidents = db.incidents.filter(i => i.id !== id);
  saveDB(db);
};

// --- Tickets ---
export const getTicketsByUser = (email) => {
  const db = getDB();
  if (!db.tickets) return [];
  return db.tickets.filter(t => t.email === email).sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));
};
export const addTicket = (ticket) => {
  const db = getDB();
  if (!db.tickets) db.tickets = [];
  const txId = 'HNB-' + Math.floor(Math.random() * 90000 + 10000);
  const newTicket = {
    id: txId,
    qrData: `${txId}-${ticket.type}${ticket.isStudent ? '-STUDENT' : ''}`,
    purchasedAt: new Date().toISOString(),
    ...ticket
  };
  db.tickets.push(newTicket);
  saveDB(db);
  return newTicket;
};
