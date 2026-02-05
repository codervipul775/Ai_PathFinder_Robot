import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Bot, HelpCircle } from 'lucide-react';
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
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false,
  });

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('pathfinder-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }

    window.showToast = (message: string, type: ToastType) => {
      setToast({ message, type, visible: true });
    };
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('pathfinder-tutorial-seen', 'true');
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <Bot size={28} />
          </div>
          <span style={{ marginLeft: '12px', letterSpacing: '-1px' }}>AI PATHFINDER</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="tool-btn"
            onClick={() => setShowTutorial(true)}
            style={{ width: 'auto', padding: '0 20px', height: '44px', borderRadius: '12px' }}
          >
            <HelpCircle size={18} />
            Tutorial
          </button>
        </div>
      </header>

      <main className="main-content" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ControlPanel />
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Grid />
        </div>
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
