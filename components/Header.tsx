import React from 'react';
import { TrafficIcon } from './icons/TrafficIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-800/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrafficIcon className="w-6 h-6 text-cyan-400" />
          <h1 className="text-xl font-semibold tracking-tight text-white">
            TrafficSense
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-400">
          <a href="#upload" className="hover:text-white transition-colors duration-200">
            Upload
          </a>
          <a href="#live" className="hover:text-white transition-colors duration-200">
            Live
          </a>
          <a href="#results" className="hover:text-white transition-colors duration-200">
            Results
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
