import React from 'react';
import { useTheme } from '../../contexts';
import { Users, FileText, CheckCircle, AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { cn } from '../../utils/utils';

const stats = [
  { label: 'Total Inquiries', value: '1,284', icon: FileText, color: 'bg-blue-500', trend: '+12.5%' },
  { label: 'Assigned', value: '1,102', icon: CheckCircle, color: 'bg-green-500', trend: '+8.2%' },
  { label: 'Unassigned', value: '182', icon: AlertCircle, color: 'bg-amber-500', trend: '-4.1%' },
  { label: 'Active Agents', value: '24', icon: Users, color: 'bg-purple-500', trend: '0%' },
];

const chartData = [
  { name: 'Mon', inquiries: 45, assigned: 38 },
  { name: 'Tue', inquiries: 52, assigned: 48 },
  { name: 'Wed', inquiries: 48, assigned: 42 },
  { name: 'Thu', inquiries: 61, assigned: 55 },
  { name: 'Fri', inquiries: 55, assigned: 50 },
  { name: 'Sat', inquiries: 32, assigned: 28 },
  { name: 'Sun', inquiries: 28, assigned: 25 },
];

export default function DashboardPage() {
  const { tokens } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: tokens.text }}>Dashboard Overview</h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl font-medium text-sm transition-all" style={{ backgroundColor: tokens.surface, color: tokens.text, border: `1px solid ${tokens.border}` }}>
            Download Report
          </button>
          <button className="px-4 py-2 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Upload Inquiry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="p-6 rounded-2xl border transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-xl text-white shadow-lg", stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-lg",
                stat.trend.startsWith('+') ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
              )}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: tokens.textMuted }}>{stat.label}</p>
              <h3 className="text-2xl font-bold" style={{ color: tokens.text }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          className="lg:col-span-2 p-6 rounded-2xl border"
          style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg" style={{ color: tokens.text }}>Inquiry Distribution</h3>
            <select className="bg-transparent text-sm outline-none border-none cursor-pointer" style={{ color: tokens.textSec }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={tokens.accent} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={tokens.accent} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.chartGrid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tokens.textMuted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: tokens.textMuted, fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tokens.tooltipBg, 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="inquiries" stroke={tokens.accent} fillOpacity={1} fill="url(#colorInq)" strokeWidth={3} />
                <Area type="monotone" dataKey="assigned" stroke={tokens.success} fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
        >
          <h3 className="font-bold text-lg mb-6" style={{ color: tokens.text }}>Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: tokens.text }}>New Inquiry Received</p>
                  <p className="text-xs" style={{ color: tokens.textSec }}>Customer: John Doe • 2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-bold rounded-xl transition-colors" style={{ backgroundColor: tokens.borderLight, color: tokens.accent }}>
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
