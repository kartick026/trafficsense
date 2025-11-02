import React, { useMemo, useEffect } from 'react';
import { TrafficAnalysisResult, FrameAnalysis } from '../types';
import { CarIcon } from './icons/CarIcon';
import { ClockIcon } from './icons/ClockIcon';
import { AmbulanceIcon } from './icons/AmbulanceIcon';
import { AnalyzeIcon } from './icons/AnalyzeIcon';
import { TrendUpIcon } from './icons/TrendUpIcon';
import { TrendDownIcon } from './icons/TrendDownIcon';
import { TrendStableIcon } from './icons/TrendStableIcon';
import { VehicleTypesIcon } from './icons/VehicleTypesIcon';
import CongestionGauge from './CongestionGauge';

interface ResultsDisplayProps {
  result: TrafficAnalysisResult | null;
  isLoading: boolean;
  imageFiles: File[];
}

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass?: string }> = ({ title, value, icon, colorClass = 'text-white' }) => {
  return (
    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-slate-800/50 rounded">{icon}</div>
        <div className="flex-1">
          <p className="text-xs text-slate-400 mb-1">{title}</p>
          <p className={`text-lg font-medium ${colorClass}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

const getCongestionColor = (level: string) => {
    switch(level) {
        case 'Heavy': return 'text-red-400';
        case 'Medium': return 'text-yellow-400';
        case 'Light': return 'text-green-400';
        default: return 'text-white';
    }
}

const TrendIcon: React.FC<{ trend: 'Increasing' | 'Decreasing' | 'Stable' }> = ({ trend }) => {
    switch (trend) {
        case 'Increasing': return <TrendUpIcon className="w-5 h-5 text-red-400" />;
        case 'Decreasing': return <TrendDownIcon className="w-5 h-5 text-green-400" />;
        case 'Stable': return <TrendStableIcon className="w-5 h-5 text-yellow-400" />;
        default: return null;
    }
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, imageFiles }) => {
  const imageUrls = useMemo(() => {
    return imageFiles.map(file => URL.createObjectURL(file));
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-slate-800/30 rounded-lg border border-slate-800 p-12 min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-cyan-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-400">Analyzing images...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center bg-slate-800/30 rounded-lg border border-slate-800 p-12 min-h-[400px]">
        <div className="text-center text-slate-500">
          <AnalyzeIcon className="w-12 h-12 mx-auto mb-4 opacity-50"/>
          <h3 className="text-lg font-medium mb-2">Awaiting Analysis</h3>
          <p className="text-sm">Upload images and click analyze to see results</p>
        </div>
      </div>
    );
  }

  const { overall_analysis, frame_by_frame_analysis } = result;
  const lastFrame = frame_by_frame_analysis[frame_by_frame_analysis.length - 1];

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="bg-slate-800/30 rounded-lg border border-slate-800 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/30 rounded p-4 border border-slate-800">
            <CongestionGauge level={lastFrame.congestion_level} label="Congestion" />
          </div>
          <MetricCard 
            title="Avg. Vehicles" 
            value={overall_analysis.average_vehicle_count.toFixed(1)} 
            icon={<CarIcon className="w-5 h-5 text-cyan-400"/>} 
          />
          <MetricCard 
            title="Trend" 
            value={overall_analysis.congestion_trend} 
            icon={<TrendIcon trend={overall_analysis.congestion_trend} />}
            colorClass={overall_analysis.congestion_trend === 'Increasing' ? 'text-red-400' : overall_analysis.congestion_trend === 'Decreasing' ? 'text-green-400' : 'text-yellow-400'}
          />
          <MetricCard 
            title="Clearance Time" 
            value={overall_analysis.estimated_clearance_time} 
            icon={<ClockIcon className="w-5 h-5 text-cyan-400"/>} 
          />
        </div>
        {overall_analysis.ambulance_present_in_any_frame && (
          <div className="mt-4 bg-yellow-900/20 border border-yellow-800/50 text-yellow-400 px-4 py-3 rounded flex items-center space-x-3">
            <AmbulanceIcon className="w-6 h-6"/>
            <div>
              <p className="font-medium text-sm">Ambulance Detected</p>
              <p className="text-xs text-yellow-500">Emergency vehicle in images</p>
            </div>
          </div>
        )}
      </div>

      {/* Frame Analysis */}
      <div className="bg-slate-800/30 rounded-lg border border-slate-800 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Frame Analysis</h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {frame_by_frame_analysis.map((frame, index) => (
            <FrameCard key={frame.frame_number} frame={frame} imageUrl={imageUrls[index]} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FrameCard: React.FC<{ frame: FrameAnalysis, imageUrl: string }> = ({ frame, imageUrl }) => (
  <div className="bg-slate-900/30 rounded border border-slate-800 p-3 w-56 flex-shrink-0">
    <img src={imageUrl} alt={`Frame ${frame.frame_number}`} className="w-full h-32 object-cover rounded mb-3 border border-slate-800" />
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-medium text-sm text-white">Frame {frame.frame_number}</h4>
      <p className={`text-xs font-medium ${getCongestionColor(frame.congestion_level)}`}>{frame.congestion_level}</p>
    </div>
    <div className="text-xs space-y-1 text-slate-400 border-t border-slate-800 pt-2">
      <p className="flex justify-between">
        <span>Vehicles:</span>
        <span className="text-white font-medium">{frame.vehicle_count}</span>
      </p>
      <p className="flex justify-between">
        <span>Cars:</span>
        <span>{frame.vehicle_breakdown.cars}</span>
      </p>
      <p className="flex justify-between">
        <span>Trucks:</span>
        <span>{frame.vehicle_breakdown.trucks}</span>
      </p>
      <p className="flex justify-between">
        <span>Buses:</span>
        <span>{frame.vehicle_breakdown.buses}</span>
      </p>
      <p className="flex justify-between">
        <span>Motorcycles:</span>
        <span>{frame.vehicle_breakdown.motorcycles}</span>
      </p>
      {frame.ambulance_detected && (
        <p className="text-yellow-400 font-medium text-xs mt-2">⚠ Ambulance</p>
      )}
    </div>
  </div>
);

export default ResultsDisplay;
