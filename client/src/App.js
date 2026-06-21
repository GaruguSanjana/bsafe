import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import EmergencyContacts from './pages/EmergencyContacts';
import SafetyProfile from './pages/SafetyProfile';
import SafeZones from './pages/SafeZones';
import AlertHistory from './pages/AlertHistory';
import AdminVolunteers from './pages/AdminVolunteers';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/profile" element={<SafetyProfile />} />
        <Route path="/safezones" element={<SafeZones />} />
        <Route path="/history" element={<AlertHistory />} />
        <Route path="/admin/volunteers" element={<AdminVolunteers />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;