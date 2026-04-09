import React from 'react';
import { useTheme } from '../../contexts';
import { Smartphone, MapPin, Shield, ShieldOff, Clock, User } from 'lucide-react';
import { Device } from '../../types';
import { cn } from '../../utils/utils';

const mockDevices: Device[] = [
  {
    id: 'dev-1',
    salesPersonId: '1',
    deviceName: 'Samsung Galaxy S21',
    os: 'Android 13',
    lastSeen: '2024-03-20T10:45:00Z',
    status: 'active',
    location: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'dev-2',
    salesPersonId: '2',
    deviceName: 'iPhone 14 Pro',
    os: 'iOS 16.5',
    lastSeen: '2024-03-20T10:30:00Z',
    status: 'active',
    location: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: 'dev-3',
    salesPersonId: '3',
    deviceName: 'Google Pixel 7',
    os: 'Android 14',
    lastSeen: '2024-03-19T18:20:00Z',
    status: 'blocked',
    location: { lat: 41.8781, lng: -87.6298 }
  },
];

export default function DevicesPage() {
  const { tokens } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: tokens.text }}>Device Monitoring</h1>
        <p className="text-sm" style={{ color: tokens.textSec }}>Track all active devices and manage access permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
            <div className="p-6 border-b" style={{ borderColor: tokens.border }}>
              <h3 className="font-bold" style={{ color: tokens.text }}>Active Devices</h3>
            </div>
            <div className="divide-y" style={{ divideColor: tokens.border }}>
              {mockDevices.map((device) => (
                <div key={device.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-opacity-50 transition-colors" style={{ backgroundColor: device.status === 'blocked' ? tokens.dangerLight + '10' : 'transparent' }}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      device.status === 'active' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" : "bg-red-100 text-red-600 dark:bg-red-900/30"
                    )}>
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: tokens.text }}>{device.deviceName}</h4>
                      <p className="text-xs" style={{ color: tokens.textSec }}>{device.os} • ID: {device.id}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <div className="text-xs">
                        <p className="font-bold" style={{ color: tokens.text }}>Agent {device.salesPersonId}</p>
                        <p style={{ color: tokens.textMuted }}>Assigned User</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <div className="text-xs">
                        <p className="font-bold" style={{ color: tokens.text }}>{new Date(device.lastSeen).toLocaleTimeString()}</p>
                        <p style={{ color: tokens.textMuted }}>Last Seen</p>
                      </div>
                    </div>
                    <button className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all",
                      device.status === 'active' ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-green-500 bg-green-500/10 hover:bg-green-500/20"
                    )}>
                      {device.status === 'active' ? (
                        <><ShieldOff size={14} /> Block Device</>
                      ) : (
                        <><Shield size={14} /> Unblock Device</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border p-6" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: tokens.text }}>
              <MapPin size={18} className="text-red-500" />
              Live Locations
            </h3>
            <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border" style={{ borderColor: tokens.border }}>
              <div className="text-center p-6">
                <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium" style={{ color: tokens.textSec }}>Interactive Map View</p>
                <p className="text-xs mt-1" style={{ color: tokens.textMuted }}>Click to expand and view all device locations in real-time.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {mockDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium" style={{ color: tokens.text }}>Agent {device.salesPersonId}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800" style={{ color: tokens.textMuted }}>
                    {device.location.lat.toFixed(2)}, {device.location.lng.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
