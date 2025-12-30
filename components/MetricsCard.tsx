
import React from 'react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  trend: number;
  icon: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, trend, icon }) => {
  const isPositive = trend > 0;
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-indigo-500/10 rounded-lg">
          <i className={`fas ${icon} text-indigo-400 text-xl`}></i>
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          <i className={`fas fa-caret-${isPositive ? 'up' : 'down'} mr-1`}></i>
          {Math.abs(trend)}%
        </div>
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
    </div>
  );
};

export default MetricsCard;
