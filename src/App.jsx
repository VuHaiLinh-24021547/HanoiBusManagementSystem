import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Passenger Pages
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/passenger/Home';
import Tickets from './pages/passenger/Tickets';
import Notifications from './pages/passenger/Notifications';
import Settings from './pages/passenger/Settings';
import PassengerLayout from './components/PassengerLayout';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import FleetOperations from './pages/admin/FleetOperations';
import RouteManagement from './pages/admin/RouteManagement';
import UserManagement from './pages/admin/UserManagement';

// Dispatcher Pages
import DispatcherLayout from './components/DispatcherLayout';
import DispatcherDashboard from './pages/dispatcher/Dashboard';
import IncidentManagement from './pages/dispatcher/IncidentManagement';

// Prototype Tools
import PrototypeSwitcher from './components/PrototypeSwitcher';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        
        {/* Passenger Routes */}
        <Route element={<PassengerLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="fleet" element={<FleetOperations />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Dispatcher Routes */}
        <Route path="/dispatcher" element={<DispatcherLayout />}>
          <Route index element={<DispatcherDashboard />} />
          <Route path="incidents" element={<IncidentManagement />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <PrototypeSwitcher />
    </Router>
  );
}

export default App;
