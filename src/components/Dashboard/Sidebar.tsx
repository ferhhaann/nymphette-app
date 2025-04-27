
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bus, 
  Users, 
  Map, 
  Clock, 
  Bell, 
  FileUp,
  LogOut, 
  Plus,
  UserPlus,
  Home,
  Route,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { activeView, setActiveView } = useAppContext();
  const { user, logout, userRole } = useAuth();
  
  const handleSetView = (view: string) => {
    setActiveView(view as any);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  return (
    <aside className="w-20 md:w-72 bg-navy-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col">
      <div className="flex flex-col items-center justify-center py-6 border-b border-white/10">
        <img 
          src="/lovable-uploads/2b1e0337-a71d-4cec-bfa1-a8ca30806181.png" 
          alt="Tour Management System Logo" 
          className="h-12 w-12 md:h-16 md:w-16"
        />
        <h1 className="hidden md:block mt-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-300">
          Tour Management
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <Button
          variant={activeView === 'dashboard' ? 'default' : 'ghost'} 
          className={`w-full justify-start ${activeView === 'dashboard' ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          onClick={() => handleSetView('dashboard')}
        >
          <Home className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Dashboard</span>
        </Button>
        
        <Button
          variant={activeView === 'busAssignment' ? 'default' : 'ghost'} 
          className={`w-full justify-start ${activeView === 'busAssignment' ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          onClick={() => handleSetView('busAssignment')}
        >
          <Users className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Assign Participants</span>
        </Button>
        
        <Button
          variant={activeView === 'etaTracker' ? 'default' : 'ghost'} 
          className={`w-full justify-start ${activeView === 'etaTracker' ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          onClick={() => handleSetView('etaTracker')}
        >
          <Clock className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">ETA Tracker</span>
        </Button>
        
        <Button
          variant={activeView === 'destination' ? 'default' : 'ghost'} 
          className={`w-full justify-start ${activeView === 'destination' ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          onClick={() => handleSetView('destination')}
        >
          <Map className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Destinations</span>
        </Button>
        
        <Button
          variant={activeView === 'notifications' ? 'default' : 'ghost'} 
          className={`w-full justify-start ${activeView === 'notifications' ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          onClick={() => handleSetView('notifications')}
        >
          <Bell className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Notifications</span>
        </Button>
        
        <Button
          variant={activeView === 'addBus' ? 'default' : 'ghost'} 
          className={`w-full justify-start ${activeView === 'addBus' ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          onClick={() => handleSetView('addBus')}
        >
          <Plus className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Add Bus</span>
        </Button>
        
        <Button
          variant={activeView === 'bulkUpload' ? 'default' : 'ghost'} 
          className={`w-full justify-start ${activeView === 'bulkUpload' ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          onClick={() => handleSetView('bulkUpload')}
        >
          <FileUp className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Bulk Upload</span>
        </Button>
        
        {userRole === 'super_admin' && (
          <>
            <Button
              variant={activeView === 'tourManagement' ? 'default' : 'ghost'} 
              className={`w-full justify-start ${activeView === 'tourManagement' ? 'bg-gradient-to-r from-blue-500/80 to-blue-500/80 hover:from-blue-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
              onClick={() => handleSetView('tourManagement')}
            >
              <Route className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Tour Management</span>
            </Button>
            
            <Button
              variant={activeView === 'itineraryManagement' ? 'default' : 'ghost'} 
              className={`w-full justify-start ${activeView === 'itineraryManagement' ? 'bg-gradient-to-r from-blue-500/80 to-blue-500/80 hover:from-blue-500 hover:to-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
              onClick={() => handleSetView('itineraryManagement')}
            >
              <Calendar className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Itinerary Management</span>
            </Button>
          </>
        )}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="hidden md:block text-xs text-gray-400 mb-2">
          Logged in as: {user?.email}
          <div className="text-xs opacity-70">{userRole === 'super_admin' ? 'Super Admin' : 'Tour Manager'}</div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-900/30"
        >
          <LogOut className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
