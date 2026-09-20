import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, CreditCard, Shield, ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { formatCurrency } from '../../lib/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AdminAnalytics: React.FC = () => {
  const { state } = useBank();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '6m' | '1y'>('30d');

  const customers = state.profiles.filter((p) => p.role === 'customer');
  const totalAssets = customers.reduce((sum, c) => sum + (c.balance || 50000), 15420500000); // Base $15B+ scale
  const totalLoans = state.loans.reduce((sum, l) => sum + (l.amount || 0), 425000000);
  const totalTransactionsCount = state.transactions.length + 18450;

  // Chart data based on timeRange
  const getGrowthData = () => {
    if (timeRange === '7d') {
      return [
        { date: 'Mon', deposits: 4500000, withdrawals: 1200500, volume: 8200000 },
        { date: 'Tue', deposits: 5200000, withdrawals: 1450000, volume: 9100000 },
        { date: 'Wed', deposits: 4800000, withdrawals: 1100000, volume: 7900000 },
        { date: 'Thu', deposits: 6100000, withdrawals: 1800000, volume: 11200000 },
        { date: 'Fri', deposits: 7500000, withdrawals: 2100500, volume: 14500000 },
        { date: 'Sat', deposits: 3200000, withdrawals: 900000, volume: 5100000 },
        { date: 'Sun', deposits: 3900000, withdrawals: 950000, volume: 6400000 },
      ];
    }
    if (timeRange === '30d') {
      return [
        { date: 'Week 1', deposits: 32000000, withdrawals: 12000000, volume: 54000000 },
        { date: 'Week 2', deposits: 41000000, withdrawals: 15000000, volume: 72000000 },
        { date: 'Week 3', deposits: 38000000, withdrawals: 14000000, volume: 68000000 },
        { date: 'Week 4', deposits: 52000000, withdrawals: 19000000, volume: 95000000 },
      ];
    }
    if (timeRange === '6m') {
      return [
        { date: 'Month 1', deposits: 120000000, withdrawals: 45000000, volume: 240000000 },
        { date: 'Month 2', deposits: 145000000, withdrawals: 52000000, volume: 290000000 },
        { date: 'Month 3', deposits: 160000000, withdrawals: 58000000, volume: 320000000 },
        { date: 'Month 4', deposits: 185000000, withdrawals: 67000000, volume: 380000000 },
        { date: 'Month 5', deposits: 210000000, withdrawals: 74000000, volume: 430000000 },
        { date: 'Month 6', deposits: 245000000, withdrawals: 89000000, volume: 510000000 },
      ];
    }
    return [
      { date: 'Q1', deposits: 450000000, withdrawals: 180000000, volume: 920000000 },
      { date: 'Q2', deposits: 520000000, withdrawals: 210000000, volume: 1100000000 },
      { date: 'Q3', deposits: 610000000, withdrawals: 240000000, volume: 1350000000 },
      { date: 'Q4', deposits: 750000000, withdrawals: 290000000, volume: 1650000000 },
    ];
  };

  const chartData = getGrowthData();

  const assetDistribution = [
    { name: 'Checking Accounts', value: 7200000000, color: '#10b981' },
    { name: 'High-Yield Savings', value: 5400000000, color: '#3b82f6' },
    { name: 'ESG Investments', value: 2100500000, color: '#8b5cf6' },
    { name: 'Loans & Credit', value: 750000000, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-400" />
            <span>Platform Financial &amp; Analytics Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time asset management metrics, liquidity trends, and transactional analytics ($15B+ scale).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {(['7d', '30d', '6m', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                timeRange === range ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* High-Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#162032] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Assets Managed</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {formatCurrency(totalAssets)}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.8% vs last period</span>
          </div>
        </div>

        <div className="bg-[#162032] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Active Customers</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {(customers.length + 142000).toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+3,240 new this month</span>
          </div>
        </div>

        <div className="bg-[#162032] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Loan Portfolio</span>
            <CreditCard className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {formatCurrency(totalLoans)}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>99.4% performing rate</span>
          </div>
        </div>

        <div className="bg-[#162032] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Tx Volume ({timeRange})</span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {totalTransactionsCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+8.2% settlement speed</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposits vs Withdrawals Trend */}
        <div className="lg:col-span-2 bg-[#162032] p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base">Inflows vs Outflows Liquidity Trend</h3>
            <span className="text-xs text-slate-400 font-mono">Currency: USD</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" textAnchor="end" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000000}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Area type="monotone" dataKey="deposits" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDeposits)" name="Deposits" />
                <Area type="monotone" dataKey="withdrawals" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorWithdrawals)" name="Withdrawals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation Pie Chart */}
        <div className="bg-[#162032] p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base">Asset Class Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown of managed capital across portfolios.</p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {assetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {assetDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">
                  {((item.value / 15420500000) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
