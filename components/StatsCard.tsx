import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, subtitle, color = "purple" }) => {
  const colorMap: Record<string, string> = {
    purple: "text-purple-400 bg-purple-500/10",
    green: "text-emerald-400 bg-emerald-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    yellow: "text-amber-400 bg-amber-500/10",
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
        {subtitle && (
          <span className="text-xs font-medium text-slate-500">{subtitle}</span>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white mc-font group-hover:scale-105 transition-transform origin-left">
        {value}
      </div>
    </div>
  );
};

export default StatsCard;