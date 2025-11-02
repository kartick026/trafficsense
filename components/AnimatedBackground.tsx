import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Minimal accent */}
      <div
        className="absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl opacity-5"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.4), transparent)' }}
      />
    </div>
  );
};

export default AnimatedBackground;
