import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BrainCircuit, Bell } from 'lucide-react';
import { ArisProvider, useAris } from './context/ArisContext';

// Pages
import Dashboard from './pages/Dashboard';
import TasksView from './pages/TasksView';
import AITutor from './pages/AITutor';
import NotificationsTab from './pages/NotificationsTab';
import Auth from './pages/Auth';

const Navigation = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/tasks', icon: <BookOpen size={24} />, label: 'Missions' },
    { path: '/tutor', icon: <BrainCircuit size={24} />, label: 'AI Tutor' },
    { path: '/notifications', icon: <Bell size={24} />, label: 'Alerts' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, 
      background: 'rgba(10, 10, 11, 0.9)', backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 50,
      padding: '0.75rem 0', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '600px', margin: '0 auto' }}>
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              textDecoration: 'none',
              color: location.pathname === item.path ? '#8B5CF6' : '#71717A',
              transition: 'color 0.2s',
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

function AppContent() {
  const { currentUser, authLoading } = useAris();

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading ARIS...</p>
      </div>
    );
  }

  // Auth Guard
  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      <div style={{ paddingBottom: '80px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksView />} />
          <Route path="/tutor" element={<AITutor />} />
          <Route path="/notifications" element={<NotificationsTab />} />
        </Routes>
      </div>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <ArisProvider>
      <Router>
        <AppContent />
      </Router>
    </ArisProvider>
  );
}

export default App;
