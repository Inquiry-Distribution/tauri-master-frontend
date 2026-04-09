import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../contexts';
import { ChevronLeft, Mail, Phone, Calendar, Award, TrendingUp, PieChart as PieChartIcon, MapPin } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const data = [
  { name: 'Jan', closed: 40, lost: 10 },
  { name: 'Feb', closed: 30, lost: 15 },
  { name: 'Mar', closed: 45, lost: 8 },
];

const pieData = [
  { name: 'Website', value: 400 },
  { name: 'Referral', value: 300 },
  { name: 'Social', value: 300 },
];

const COLORS = ['#4F7DF3', '#34D399', '#FB923C'];

export default function SalesPersonReportPage() {
  const { id } = useParams();
  const { tokens } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/sales-persons" className="p-2 rounded-lg hover:bg-opacity-10" style={{ backgroundColor: tokens.borderLight, color: tokens.textSec }}>
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: tokens.text }}>Agent Report</h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>Detailed performance analysis for Agent {id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
            <div className="flex flex-col items-center text-center">
              <img 
                src={`https://picsum.photos/seed/${id}/200/200`} 
                alt="Agent" 
                className="w-24 h-24 rounded-2xl object-cover mb-4 border-2" 
                style={{ borderColor: tokens.border }}
                referrerPolicy="no-referrer"
              />
              <h2 className="text-xl font-bold" style={{ color: tokens.text }}>Sarah Miller</h2>
              <p className="text-sm mb-4" style={{ color: tokens.textSec }}>Senior Sales Executive</p>
              
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500">Active</span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500">Top Performer</span>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 text-sm" style={{ color: tokens.textSec }}>
                  <Mail size={16} />
                  <span>sarah.m@company.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm" style={{ color: tokens.textSec }}>
                  <Phone size={16} />
                  <span>+1 234 567 001</span>
                </div>
                <div className="flex items-center gap-3 text-sm" style={{ color: tokens.textSec }}>
                  <Calendar size={16} />
                  <span>Joined Oct 2023</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
            <h3 className="font-bold mb-4" style={{ color: tokens.text }}>Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: tokens.textSec }}>Conversion Rate</span>
                <span className="font-bold text-green-500">82.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: tokens.textSec }}>Avg. Response Time</span>
                <span className="font-bold" style={{ color: tokens.text }}>14 mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: tokens.textSec }}>Customer Satisfaction</span>
                <span className="font-bold text-blue-500">4.8/5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
              <h3 className="font-bold mb-6 flex items-center gap-2" style={{ color: tokens.text }}>
                <TrendingUp size={18} className="text-blue-500" />
                Monthly Closures
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.chartGrid} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tokens.textMuted, fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: tokens.textMuted, fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: tokens.tooltipBg, border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="closed" fill={tokens.accent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-2xl border" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
              <h3 className="font-bold mb-6 flex items-center gap-2" style={{ color: tokens.text }}>
                <PieChartIcon size={18} className="text-purple-500" />
                Lead Sources
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
            <h3 className="font-bold mb-6" style={{ color: tokens.text }}>Recent Closed Inquiries</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: tokens.bg }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: tokens.text }}>Enterprise Solution Deal</p>
                      <p className="text-xs" style={{ color: tokens.textSec }}>Closed on March {20 - i}, 2024</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: tokens.text }}>$12,400</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
