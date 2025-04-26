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
    <div className="flex flex-col space-y-4 md:space-y-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Bus className="h-8 w-8 mr-2 text-nymphette-purple" />
            Nymphette Tours
          </h1>
          <p className="text-gray-600 mt-1">Tour Management System</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={onAddBusClick}
          variant="default"
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-1" /> Add New Bus
        </Button>
        <Button 
          onClick={onAssignClick}
          variant="default"
          className="flex-1 bg-nymphette-purple hover:bg-nymphette-purpleDark"
        >
          <Users className="h-4 w-4 mr-1" /> Assign Participants
        </Button>
        <Button 
          onClick={onNotificationsClick}
          variant="default"
          className="flex-1 bg-amber-500 hover:bg-amber-600"
        >
          <Bell className="h-4 w-4 mr-1" /> Notifications
        </Button>
        <Button 
          onClick={onETAClick}
          variant="outline"
          className="flex-1 border-nymphette-purple text-nymphette-purple hover:bg-nymphette-purpleLight hover:text-nymphette-purpleDark"
        >
          <Clock className="h-4 w-4 mr-1" /> View ETA
        </Button>
        <Button 
          onClick={onInfoClick}
          variant="outline"
          className="flex-1 border-nymphette-purple text-nymphette-purple hover:bg-nymphette-purpleLight hover:text-nymphette-purpleDark"
        >
          <Map className="h-4 w-4 mr-1" /> Manage Destinations
        </Button>
        <Button 
          onClick={onBulkUploadClick}
          variant="outline"
          className="flex-1 border-nymphette-purple text-nymphette-purple hover:bg-nymphette-purpleLight hover:text-nymphette-purpleDark"
        >
          <FileUp className="h-4 w-4 mr-1" /> Bulk Upload
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
