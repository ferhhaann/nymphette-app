
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus } from '../../data/mockData';
import { Bus as BusIcon, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface BusListProps {
  onSelectBus: (bus: Bus) => void;
}

const BusList: React.FC<BusListProps> = ({ onSelectBus }) => {
  const { buses, getParticipantsByBus } = useAppContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {buses.map(bus => {
        const participantCount = getParticipantsByBus(bus.id).length;
        const fillPercentage = (participantCount / bus.capacity) * 100;
        const isFull = participantCount >= bus.capacity;
        
        return (
          <Card 
            key={bus.id} 
            className={`overflow-hidden transition-all duration-200 ${isFull ? 'border-orange-400' : 'hover:border-nymphette-purple'}`}
          >
            <CardContent className="p-0">
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <BusIcon className="h-5 w-5 mr-2 text-nymphette-purple" />
                    <h3 className="font-medium text-lg">{bus.label}</h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span className={`${isFull ? 'text-orange-600 font-medium' : ''}`}>
                      {participantCount}/{bus.capacity}
                    </span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full ${isFull ? 'bg-orange-400' : 'bg-nymphette-purple'}`}
                    style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    onClick={() => onSelectBus(bus)}
                    variant="secondary" 
                    className="w-full bg-gray-100 hover:bg-nymphette-purpleLight"
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
