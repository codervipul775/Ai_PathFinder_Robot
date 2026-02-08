import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Bot, HelpCircle, Menu, X } from 'lucide-react';
import { Grid, ControlPanel, Tutorial, Toast } from './components';
import type { ToastType } from './components';
import './index.css';

// Global toast function
declare global {
  interface Window {
    showToast: (message: string, type: ToastType) => void;
  }
}

function App() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const hasSeenTutorial = localStorage.getItem('pathfinder-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }

    window.showToast = (message: string, type: ToastType) => {
      setToast({ message, type, visible: true });
    };

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('pathfinder-tutorial-seen', 'true');
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className={`app ${isMobile ? 'mobile' : ''}`}>
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <Bot size={window.innerWidth <= 480 ? 20 : 28} />
          </div>
          <span className="logo-text">AI PATHFINDER</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className="tool-btn tutorial-toggle-btn"
            onClick={() => setShowTutorial(true)}
          >
            <HelpCircle size={18} />
            <span className="hide-mobile">Tutorial</span>
          </button>
          {isMobile && (
            <button
              className={`tool-btn menu-toggle-btn ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        <ControlPanel isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <Grid />
      </main>

      <AnimatePresence>
        {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
      </AnimatePresence>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={handleCloseToast}
        duration={5000}
      />
    </div>
  );
}

export default App;
