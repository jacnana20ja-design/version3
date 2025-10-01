import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MobileMenu from './components/Layout/MobileMenu';
import Dashboard from './components/Dashboard/Dashboard';
import Interns from './components/Sections/Interns';
import Projects from './components/Sections/Projects';
import Kanban from './components/Sections/Kanban';
import Reports from './components/Sections/Reports';
import Settings from './components/Sections/Settings';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Listen for navigation events from search
  React.useEffect(() => {
    const handleNavigate = (event: any) => {
      setActiveSection(event.detail);
    };
    
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'interns':
        return <Interns />;
      case 'projects':
        return <Projects />;
      case 'kanban':
        return <Kanban />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-30 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={(section) => {
            setActiveSection(section);
            setIsMobileMenuOpen(false);
          }} 
        />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="main-content p-4 md:p-6">
        {renderContent()}
      </main>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
    </ThemeProvider>
  );
}

export default App;