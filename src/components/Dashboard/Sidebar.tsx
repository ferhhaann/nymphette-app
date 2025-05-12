
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import TourSelector from '../Tour/TourSelector';
import {
  Bus,
  Clock,
  MapPin,
  PlusCircle,
  Bell,
  Upload,
  Users,
  Route,
  CalendarDays,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { activeView, setActiveView } = useAppContext();
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (view: typeof activeView) => {
    setActiveView(view);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-16 md:w-64 transition-all duration-300 bg-navy-950/70 backdrop-blur-lg border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center md:justify-start p-4 h-16 border-b border-white/10">
        <Route className="h-10 w-10 text-blue-400" />
        <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent ml-2">
          TourMaster
        </span>
      </div>

      {/* Tour Selector - Only show for admins */}
      {userRole === 'super_admin' && (
        <div className="px-3 py-2 hidden md:block">
          <TourSelector />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          <li>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={cn(
                "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                activeView === 'dashboard'
                  ? "bg-blue-600/30 text-blue-200"
                  : "text-gray-400 hover:bg-white/5 hover:text-blue-300"
              )}
            >
              <Bus className="h-5 w-5" />
              <span className="hidden md:block ml-3">Buses</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('etaTracker')}
              className={cn(
                "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                activeView === 'etaTracker'
                  ? "bg-blue-600/30 text-blue-200"
                  : "text-gray-400 hover:bg-white/5 hover:text-blue-300"
              )}
            >
              <Clock className="h-5 w-5" />
              <span className="hidden md:block ml-3">ETA Tracker</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('destination')}
              className={cn(
                "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                activeView === 'destination'
                  ? "bg-blue-600/30 text-blue-200"
                  : "text-gray-400 hover:bg-white/5 hover:text-blue-300"
              )}
            >
              <MapPin className="h-5 w-5" />
              <span className="hidden md:block ml-3">Destinations</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('addBus')}
              className={cn(
                "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                activeView === 'addBus'
                  ? "bg-blue-600/30 text-blue-200"
                  : "text-gray-400 hover:bg-white/5 hover:text-blue-300"
              )}
            >
              <PlusCircle className="h-5 w-5" />
              <span className="hidden md:block ml-3">Add Bus</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('notifications')}
              className={cn(
                "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                activeView === 'notifications'
                  ? "bg-blue-600/30 text-blue-200"
                  : "text-gray-400 hover:bg-white/5 hover:text-blue-300"
              )}
            >
              <Bell className="h-5 w-5" />
              <span className="hidden md:block ml-3">Notifications</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('bulkUpload')}
              className={cn(
                "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                activeView === 'bulkUpload'
                  ? "bg-blue-600/30 text-blue-200"
                  : "text-gray-400 hover:bg-white/5 hover:text-blue-300"
              )}
            >
              <Upload className="h-5 w-5" />
              <span className="hidden md:block ml-3">Bulk Upload</span>
            </button>
          </li>

          {userRole === 'super_admin' && (
            <li>
              <button
                onClick={() => handleNavClick('userManagement')}
                className={cn(
                  "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                  activeView === 'userManagement'
                    ? "bg-blue-600/30 text-blue-200"
                    : "text-gray-400 hover:bg-white/5 hover:text-blue-300"
                )}
              >
                <Users className="h-5 w-5" />
                <span className="hidden md:block ml-3">User Management</span>
              </button>
            </li>
          )}

          {userRole === 'super_admin' && (
            <li>
              <button
                onClick={() => handleNavClick('tourManagement')}
                className={cn(
                  "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                  activeView === 'tourManagement'
                    ? "bg-blue-600/30 text-blue-200"
                    : "text-gray-400 hover:bg-white/5 hover:text-blue-300"
                )}
              >
                <Route className="h-5 w-5" />
                <span className="hidden md:block ml-3">Tour Management</span>
              </button>
            </li>
          )}

          {userRole === 'super_admin' && (
            <li>
              <Link 
                to="/itinerary"
                className={cn(
                  "flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg transition-colors",
                  "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-blue-200 hover:from-blue-600/40 hover:to-indigo-600/40"
                )}
              >
                <CalendarDays className="h-5 w-5" />
                <span className="hidden md:block ml-3">Enhanced Itinerary</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start w-full p-2 md:px-4 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:block ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
