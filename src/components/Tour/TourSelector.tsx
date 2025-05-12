
import React, { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Tour } from '@/types/tour';

const TourSelector = () => {
  const { tours, activeTourId, setActiveTourId } = useAppContext();

  // Set the first tour as active if none is selected and tours are available
  useEffect(() => {
    if (!activeTourId && tours.length > 0) {
      setActiveTourId(tours[0].id);
    }
  }, [tours, activeTourId, setActiveTourId]);

  if (tours.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
        <div className="flex flex-col items-center justify-center py-2">
          <p className="text-gray-400 text-sm">No tours available</p>
          <Button 
            variant="link" 
            className="text-blue-400 text-sm p-0 h-auto mt-1"
            onClick={() => window.location.href = '/itinerary'}
          >
            Create your first tour
          </Button>
        </div>
      </div>
    );
  }

  const activeTour = tours.find(tour => tour.id === activeTourId);
  const getTourStatus = (tour: Tour) => {
    const now = new Date();
    const startDate = new Date(tour.startDate);
    const endDate = new Date(tour.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'ongoing';
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-400">Active Tour</label>
        <Select
          value={activeTourId || ''}
          onValueChange={(value) => setActiveTourId(value)}
        >
          <SelectTrigger className="bg-white/10 border-white/10 text-white">
            <SelectValue placeholder="Select a tour" />
          </SelectTrigger>
          <SelectContent className="bg-navy-900 border-white/10">
            {tours.map((tour) => (
              <SelectItem key={tour.id} value={tour.id} className="text-white hover:bg-white/10">
                <div className="flex items-center">
                  <span className="font-medium">{tour.name}</span>
                  <Badge 
                    className={`ml-2 ${
                      getTourStatus(tour) === 'upcoming' ? 'bg-blue-700/50 text-blue-300' : 
                      getTourStatus(tour) === 'ongoing' ? 'bg-green-700/50 text-green-300' : 
                      'bg-gray-700/50 text-gray-300'
                    }`}
                    variant="outline"
                  >
                    {getTourStatus(tour)}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeTour && (
          <div className="pt-2 border-t border-white/10 mt-2">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center text-blue-300">
                <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                {formatDate(activeTour.startDate)} - {formatDate(activeTour.endDate)}
              </div>
              <div className="flex items-center text-blue-300">
                <MapPin className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                {activeTour.mainLocation || 'No location set'}
              </div>
              <div className="text-gray-400 text-xs">
                Tour ID: {activeTour.id}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourSelector;
