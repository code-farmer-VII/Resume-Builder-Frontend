import React from 'react';
import { FileText, LogOut, History, PlusCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 shadow-lg">
              <FileText className="text-white" size={20} />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Resume Builder Khalix Academy
            </span>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 transition"
              onClick={() => (window.location.href = '/builder')}
            >
              <PlusCircle size={18} className="mr-1 text-pink-400" />
              New Resume
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 transition"
              onClick={() => (window.location.href = '/history')}
            >
              <History size={18} className="mr-1 text-blue-400" />
              History
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border border-white/20 text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 shadow-md"
              onClick={handleSignOut}
            >
              <LogOut size={18} className="mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
