import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const { tokens } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-6xl font-black mb-2" style={{ color: tokens.text }}>404</h1>
      <h2 className="text-2xl font-bold mb-4" style={{ color: tokens.textSec }}>Page Not Found</h2>
      <p className="max-w-md mb-8" style={{ color: tokens.textMuted }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
      >
        <Home size={20} />
        Back to Dashboard
      </Link>
    </div>
  );
}
