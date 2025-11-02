import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-8 text-sm text-slate-400 border-t border-slate-800 bg-slate-900/60">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="order-2 md:order-1">© 2025 TrafficSense</p>
          <div className="order-1 md:order-2 flex items-center gap-2 text-slate-300">
            <span className="px-2 py-1 rounded-full bg-slate-800/60 border border-slate-700">Gemini</span>
            <span className="px-2 py-1 rounded-full bg-slate-800/60 border border-slate-700">Rive</span>
            <span className="px-2 py-1 rounded-full bg-slate-800/60 border border-slate-700">FastAPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
