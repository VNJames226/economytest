import React from 'react';
import { SERVER_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onAgbClick: () => void;
  onDatenschutzClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick, onAgbClick, onDatenschutzClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen void-gradient flex flex-col">
      <header className="border-b border-purple-900/30 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onHomeClick}>
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center neon-border">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mc-font">
              {SERVER_NAME} <span className="text-purple-400">Economy</span>
            </h1>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a 
              href="https://voidnest.de" 
              className="hover:text-purple-400 transition-colors uppercase tracking-widest font-black text-[10px] md:text-xs"
            >
              Home
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-purple-900/20 py-8 bg-black/40">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} {SERVER_NAME} | Voidnest Economy System
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <a 
              href="https://sh.nxah.de/impressum" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-600 hover:text-purple-400 text-xs transition-colors font-medium"
            >
              Impressum
            </a>
            <button 
              onClick={onAgbClick}
              className="text-slate-600 hover:text-purple-400 text-xs transition-colors font-medium"
            >
              AGB
            </button>
            <button 
              onClick={onDatenschutzClick}
              className="text-slate-600 hover:text-purple-400 text-xs transition-colors font-medium"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;