import React from 'react';

interface CongestionGaugeProps {
  level: 'Light' | 'Medium' | 'Heavy';
  label?: string;
}

const levelToPercent = (level: 'Light' | 'Medium' | 'Heavy') => {
  switch (level) {
    case 'Light':
      return 33;
    case 'Medium':
      return 66;
    case 'Heavy':
    default:
      return 100;
  }
};

const CongestionGauge: React.FC<CongestionGaugeProps> = ({ level, label = 'Congestion' }) => {
  const pct = levelToPercent(level);
  const color = level === 'Heavy' ? '#f87171' : level === 'Medium' ? '#facc15' : '#34d399';

  return (
    <div className="flex items-center space-x-4">
      <div
        className="relative w-24 h-24 rounded-full grid place-items-center"
        style={{
          background: `conic-gradient(${color} ${pct}%, rgba(148,163,184,0.2) ${pct}% 100%)`,
        }}
        aria-label={`${label}: ${level}`}
      >
        <div className="w-20 h-20 rounded-full bg-slate-900 grid place-items-center border border-slate-700">
          <span className="text-sm font-semibold text-slate-200">{level}</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-100">{pct}%</p>
      </div>
    </div>
  );
};

export default CongestionGauge;
