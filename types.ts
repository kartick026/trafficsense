export interface VehicleBreakdown {
  cars: number;
  trucks: number;
  buses: number;
  motorcycles: number;
}

export interface FrameAnalysis {
  frame_number: number;
  vehicle_count: number;
  congestion_level: 'Light' | 'Medium' | 'Heavy';
  ambulance_detected: boolean;
  vehicle_breakdown: VehicleBreakdown;
}

export interface OverallAnalysis {
  average_vehicle_count: number;
  congestion_trend: 'Increasing' | 'Decreasing' | 'Stable';
  estimated_clearance_time: string;
  ambulance_present_in_any_frame: boolean;
  dominant_vehicle_types: string[];
  recommendation?: string;
}

export interface TrafficAnalysisResult {
  overall_analysis: OverallAnalysis;
  frame_by_frame_analysis: FrameAnalysis[];
}