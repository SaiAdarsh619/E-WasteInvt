const StatCard = ({ icon: Icon, label, value, subtitle, color = 'green', delay = 0 }) => {
  const colorMap = {
    green: { glow: 'stat-glow-green', iconBg: 'from-primary-500/20 to-primary-600/10', iconColor: 'text-primary-400' },
    blue: { glow: 'stat-glow-blue', iconBg: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
    amber: { glow: 'stat-glow-amber', iconBg: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
    cyan: { glow: 'stat-glow-cyan', iconBg: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400' },
    red: { glow: 'stat-glow-red', iconBg: 'from-red-500/20 to-red-600/10', iconColor: 'text-red-400' },
    purple: { glow: 'stat-glow-purple', iconBg: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
  };

  const c = colorMap[color] || colorMap.green;

  return (
    <div className={`glass-card ${c.glow} p-5 animate-fade-in animate-delay-${delay}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-1 truncate">{label}</p>
          <p className="text-2xl font-bold text-dark-50 truncate">{value}</p>
          {subtitle && <p className="text-xs text-dark-500 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${c.iconBg} flex items-center justify-center`}>
          <Icon className={`text-xl ${c.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
