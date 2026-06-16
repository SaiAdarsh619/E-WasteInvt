import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { fetchStats, fetchMonthlyStats } from './dashboardSlice';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import {
  HiOutlineDeviceTablet,
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineWrenchScrewdriver,
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineArchiveBox,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line,
} from 'recharts';

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card !rounded-lg p-3 !border-white/10">
        <p className="text-xs font-semibold text-dark-200 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{typeof entry.value === 'number' && entry.name?.toLowerCase().includes('revenue') ? `₹${entry.value.toLocaleString()}` : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { onMenuToggle } = useOutletContext();
  const { stats, monthlyData, loading } = useSelector((state) => state.dashboard);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchMonthlyStats(new Date().getFullYear()));
    setMounted(true);
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  const conditionData = stats?.componentsByCondition?.map((c) => ({
    name: c._id,
    value: c.count,
  })) || [];

  const deviceTypeData = stats?.deviceTypes?.map((d) => ({
    name: d._id,
    value: d.count,
  })) || [];

  const getConditionCount = (condition) => {
    const found = stats?.componentsByCondition?.find((c) => c._id === condition);
    return found?.count || 0;
  };

  return (
    <div>
      <Header title="Dashboard" subtitle="E-Waste recovery overview" onMenuToggle={onMenuToggle} />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={HiOutlineDeviceTablet}
          label="Total Devices"
          value={stats?.totalDevices || 0}
          subtitle="Devices received"
          color="blue"
          delay={1}
        />
        <StatCard
          icon={HiOutlineCube}
          label="Components Extracted"
          value={stats?.totalComponents || 0}
          subtitle="From all devices"
          color="green"
          delay={2}
        />
        <StatCard
          icon={HiOutlineArchiveBox}
          label="In Stock"
          value={stats?.inventoryStock || 0}
          subtitle="Available units"
          color="cyan"
          delay={3}
        />
        <StatCard
          icon={HiOutlineCurrencyDollar}
          label="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          subtitle={`${stats?.totalSold || 0} items sold`}
          color="amber"
          delay={4}
        />
      </div>

      {/* Condition breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={HiOutlineCheckCircle}
          label="Working"
          value={getConditionCount('Working')}
          color="green"
          delay={5}
        />
        <StatCard
          icon={HiOutlineWrenchScrewdriver}
          label="Repairable"
          value={getConditionCount('Repairable')}
          color="amber"
          delay={5}
        />
        <StatCard
          icon={HiOutlineTrash}
          label="Scrap"
          value={getConditionCount('Scrap')}
          color="red"
          delay={6}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Recovery Chart */}
        <div className="glass-card p-6 animate-fade-in animate-delay-3 flex flex-col min-w-0">
          <h3 className="text-base font-semibold text-dark-100 mb-4 flex items-center gap-2">
            <HiOutlineArrowTrendingUp className="text-primary-400" />
            Monthly Recovery
          </h3>
          <div className="w-full">
            {mounted && (
              <ResponsiveContainer width="100%" aspect={2.2}>
                <AreaChart data={monthlyData?.monthlyData || []}>
                  <defs>
                    <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorComponents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="devices" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDevices)" name="Devices" />
                  <Area type="monotone" dataKey="components" stroke="#10b981" fillOpacity={1} fill="url(#colorComponents)" name="Components" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Component Condition Pie */}
        <div className="glass-card p-6 animate-fade-in animate-delay-4 flex flex-col min-w-0">
          <h3 className="text-base font-semibold text-dark-100 mb-4">Component Conditions</h3>
          <div className="w-full">
            {mounted && (
              <ResponsiveContainer width="100%" aspect={2.2}>
                <PieChart>
                  <Pie
                    data={conditionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {conditionData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Device Types Bar Chart */}
        <div className="glass-card p-6 animate-fade-in animate-delay-5 flex flex-col min-w-0">
          <h3 className="text-base font-semibold text-dark-100 mb-4">Devices by Type</h3>
          <div className="w-full">
            {mounted && (
              <ResponsiveContainer width="100%" aspect={2.2}>
                <BarChart data={deviceTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                    {deviceTypeData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Monthly Revenue Line Chart */}
        <div className="glass-card p-6 animate-fade-in animate-delay-6 flex flex-col min-w-0">
          <h3 className="text-base font-semibold text-dark-100 mb-4">Monthly Revenue</h3>
          <div className="w-full">
            {mounted && (
              <ResponsiveContainer width="100%" aspect={2.2}>
                <LineChart data={monthlyData?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Devices */}
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-base font-semibold text-dark-100 mb-4">Recently Added Devices</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Type</th>
                <th>Brand / Model</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentDevices?.map((device) => {
                const statusBadge = {
                  Received: 'badge-blue',
                  Processing: 'badge-yellow',
                  Dismantled: 'badge-cyan',
                  Completed: 'badge-green',
                };
                return (
                  <tr key={device._id}>
                    <td className="font-mono text-xs text-primary-400">{device.deviceId}</td>
                    <td>{device.deviceType}</td>
                    <td>{device.brand} {device.model}</td>
                    <td className="text-dark-400 text-xs max-w-[200px] truncate">{device.source}</td>
                    <td><span className={`badge ${statusBadge[device.status] || 'badge-gray'}`}>{device.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
