import React from 'react';
import { useTheme } from '../../contexts';
import { Search, Plus, MoreVertical, MapPin, Phone, Mail, Award, TrendingUp } from 'lucide-react';
import { SalesPerson } from '../../types';
import { cn } from '../../utils/utils';

const mockSalesPersons: SalesPerson[] = [
  {
    id: '1',
    name: 'Sarah Miller',
    email: 'sarah.m@company.com',
    phone: '+1 234 567 001',
    status: 'active',
    performance: 92,
    totalInquiries: 145,
    closedInquiries: 120,
    avatar: 'https://picsum.photos/seed/sarah/100/100',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@company.com',
    phone: '+1 234 567 002',
    status: 'active',
    performance: 85,
    totalInquiries: 132,
    closedInquiries: 105,
    avatar: 'https://picsum.photos/seed/michael/100/100',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.w@company.com',
    phone: '+1 234 567 003',
    status: 'blocked',
    performance: 45,
    totalInquiries: 88,
    closedInquiries: 32,
    avatar: 'https://picsum.photos/seed/emma/100/100',
  },
];

export default function SalesPersonsPage() {
  const { tokens } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: tokens.text }}>Sales Team</h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>Manage your sales persons and monitor their performance.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus size={18} />
          Add Sales Person
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSalesPersons.map((person) => (
          <div 
            key={person.id}
            className="rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-xl"
            style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <img 
                    src={person.avatar} 
                    alt={person.name} 
                    className="w-16 h-16 rounded-2xl object-cover border-2" 
                    style={{ borderColor: tokens.border }}
                    referrerPolicy="no-referrer"
                  />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2",
                    person.status === 'active' ? "bg-green-500" : "bg-red-500"
                  )} style={{ borderColor: tokens.surface }}></div>
                </div>
                <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors" style={{ color: tokens.textMuted, backgroundColor: tokens.borderLight }}>
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold" style={{ color: tokens.text }}>{person.name}</h3>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2 text-xs" style={{ color: tokens.textSec }}>
                    <Mail size={14} />
                    {person.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: tokens.textSec }}>
                    <Phone size={14} />
                    {person.phone}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: tokens.textMuted }}>
                    <span>Performance</span>
                    <span style={{ color: person.performance > 80 ? tokens.success : tokens.danger }}>{person.performance}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: tokens.bg }}>
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ 
                        width: `${person.performance}%`, 
                        backgroundColor: person.performance > 80 ? tokens.success : tokens.danger 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: tokens.bg }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: tokens.textMuted }}>Total</p>
                    <p className="text-lg font-bold" style={{ color: tokens.text }}>{person.totalInquiries}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: tokens.bg }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: tokens.textMuted }}>Closed</p>
                    <p className="text-lg font-bold" style={{ color: tokens.text }}>{person.closedInquiries}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: tokens.border, backgroundColor: tokens.bg + '30' }}>
              <button className="text-sm font-bold text-blue-600 hover:underline">View Full Report</button>
              <button className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-lg transition-colors",
                person.status === 'active' ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-green-500 bg-green-500/10 hover:bg-green-500/20"
              )}>
                {person.status === 'active' ? 'Block Agent' : 'Unblock Agent'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
