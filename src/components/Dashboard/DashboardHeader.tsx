
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Bus } from 'lucide-react';

interface DashboardHeaderProps {
  onAssignClick: () => void;
  onETAClick: () => void;
  onInfoClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onAssignClick, 
  onETAClick, 
  onInfoClick 
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
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onAssignClick}
          variant="default"
          className="flex-1 bg-nymphette-purple hover:bg-nymphette-purpleDark"
        >
          Assign Participants
        </Button>
        <Button 
          onClick={onETAClick}
          variant="outline"
          className="flex-1 border-nymphette-purple text-nymphette-purple hover:bg-nymphette-purpleLight hover:text-nymphette-purpleDark"
        >
          View ETA
        </Button>
        <Button 
          onClick={onInfoClick}
          variant="outline"
          className="flex-1 border-nymphette-purple text-nymphette-purple hover:bg-nymphette-purpleLight hover:text-nymphette-purpleDark"
        >
          View Place Info
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
