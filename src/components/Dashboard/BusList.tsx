
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus } from '../../data/mockData';
import { Bus as BusIcon, Users, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface BusListProps {
  onSelectBus: (bus: Bus) => void;
}

const BusList: React.FC<BusListProps> = ({ onSelectBus }) => {
  const { buses, getParticipantsByBus, deleteBus } = useAppContext();

  const handleDelete = (e: React.MouseEvent, bus: Bus) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${bus.label}?`)) {
      deleteBus(bus.id);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {buses.map(bus => {
        const participantCount = getParticipantsByBus(bus.id).length;
        const fillPercentage = (participantCount / bus.capacity) * 100;
        const isFull = participantCount >= bus.capacity;
        
        return (
          <Card 
            key={bus.id} 
            className={`overflow-hidden transition-all duration-200 bg-gradient-to-br 
              ${isFull 
                ? 'from-orange-100 via-orange-50 to-orange-100 border-orange-300' 
                : 'from-blue-50 via-white to-blue-100 border-blue-300'}`}
          >
            <CardContent className="p-0">
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <BusIcon className="h-5 w-5 mr-2 text-blue-600" />
                    <h3 className="font-medium text-lg text-navy-800">{bus.label}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <Users className="h-4 w-4 mr-1" />
                      <span className={`${isFull ? 'text-orange-600 font-medium' : 'text-blue-600'}`}>
                        {participantCount}/{bus.capacity}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDelete(e, bus)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full ${isFull ? 'bg-orange-400' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                  ></div>
                </div>
                
                {bus.manager_name && (
                  <div className="mb-3 text-sm text-gray-600">
                    Manager: {bus.manager_name}
                  </div>
                )}
                
                <div className="mt-auto">
                  <Button 
                    onClick={() => onSelectBus(bus)}
                    variant="secondary" 
                    className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-colors"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BusList;
