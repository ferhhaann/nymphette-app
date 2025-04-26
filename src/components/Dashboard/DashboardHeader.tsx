
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Bus, Plus, Users, Map, Clock, Bell, FileUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardHeaderProps {
  onAssignClick: () => void;
  onETAClick: () => void;
  onInfoClick: () => void;
  onAddBusClick: () => void;
  onNotificationsClick: () => void;
  onBulkUploadClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onAssignClick, 
  onETAClick, 
  onInfoClick,
  onAddBusClick,
  onNotificationsClick,
  onBulkUploadClick
}) => {
  const { userRole } = useAuth();
  const isSuperAdmin = userRole === 'super_admin';
  
  return (
    <div className="mb-6 p-6 rounded-xl border border-white/10 backdrop-blur-lg bg-white/5">
      <div className="flex flex-col space-y-4">
        {/* Header with user welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 via-purple-200 to-blue-100 bg-clip-text text-transparent">
              Tour Dashboard
            </h1>
            <p className="text-blue-200/80 mt-1">
              {isSuperAdmin ? 'Super Admin View' : 'Manager View'} - Tour Management System
            </p>
          </div>
          
          <div className="hidden md:flex space-x-3 items-center">
            <div className="text-xs text-blue-200/80 px-3 py-1 rounded-full border border-blue-300/20 bg-blue-900/20">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Quick action buttons in a futuristic layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button 
            onClick={onAddBusClick}
            variant="default"
            className="bg-gradient-to-r from-green-600/90 to-green-500/90 hover:from-green-500 hover:to-green-500 border border-white/10 backdrop-blur-sm"
            disabled={!isSuperAdmin} // Only super admin can add buses
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Bus
          </Button>
          
          <Button 
            onClick={onAssignClick}
            variant="default"
            className="bg-gradient-to-r from-blue-600/90 to-blue-500/90 hover:from-blue-500 hover:to-blue-500 border border-white/10 backdrop-blur-sm"
          >
            <Users className="h-4 w-4 mr-2" /> Assign Participants
          </Button>
          
          <Button 
            onClick={onNotificationsClick}
            variant="default"
            className="bg-gradient-to-r from-amber-600/90 to-amber-500/90 hover:from-amber-500 hover:to-amber-500 border border-white/10 backdrop-blur-sm"
          >
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </Button>
          
          <Button 
            onClick={onETAClick}
            variant="outline"
            className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 text-blue-100 transition-all duration-300"
          >
            <Clock className="h-4 w-4 mr-2" /> View ETA
          </Button>
          
          <Button 
            onClick={onInfoClick}
            variant="outline"
            className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 text-blue-100 transition-all duration-300"
          >
            <Map className="h-4 w-4 mr-2" /> Manage Destinations
          </Button>
          
          <Button 
            onClick={onBulkUploadClick}
            variant="outline"
            className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 text-blue-100 transition-all duration-300"
          >
            <FileUp className="h-4 w-4 mr-2" /> Bulk Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
