
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Bus, Plus, Users, Map, Clock, Bell, FileUp } from 'lucide-react';

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
  return (
    <div className="flex flex-col space-y-4 md:space-y-6 mb-6 bg-gradient-to-r from-navy-900 to-navy-800 p-6 rounded-xl shadow-lg border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/2b1e0337-a71d-4cec-bfa1-a8ca30806181.png" 
            alt="Nymphette Tours Logo" 
            className="h-16 w-16"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">
              Nymphette Tours
            </h1>
            <p className="text-blue-200/80 mt-1">Tour Management System</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Button 
          onClick={onAddBusClick}
          variant="default"
          className="bg-green-500/90 hover:bg-green-500 backdrop-blur-sm border border-white/10 transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-1" /> Add New Bus
        </Button>
        <Button 
          onClick={onAssignClick}
          variant="default"
          className="bg-blue-600/90 hover:bg-blue-600 backdrop-blur-sm border border-white/10 transition-all duration-300"
        >
          <Users className="h-4 w-4 mr-1" /> Assign Participants
        </Button>
        <Button 
          onClick={onNotificationsClick}
          variant="default"
          className="bg-amber-500/90 hover:bg-amber-500 backdrop-blur-sm border border-white/10 transition-all duration-300"
        >
          <Bell className="h-4 w-4 mr-1" /> Notifications
        </Button>
        <Button 
          onClick={onETAClick}
          variant="outline"
          className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 text-blue-100 transition-all duration-300"
        >
          <Clock className="h-4 w-4 mr-1" /> View ETA
        </Button>
        <Button 
          onClick={onInfoClick}
          variant="outline"
          className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 text-blue-100 transition-all duration-300"
        >
          <Map className="h-4 w-4 mr-1" /> Manage Destinations
        </Button>
        <Button 
          onClick={onBulkUploadClick}
          variant="outline"
          className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 text-blue-100 transition-all duration-300"
        >
          <FileUp className="h-4 w-4 mr-1" /> Bulk Upload
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
