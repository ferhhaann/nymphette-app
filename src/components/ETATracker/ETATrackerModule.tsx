
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Bus, Clock, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Schedule, Location } from '../../data/mockData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ETATrackerModule: React.FC = () => {
  const { 
    buses, 
    selectedBus, 
    setSelectedBus, 
    setActiveView,
    getSchedulesByBus,
  } = useAppContext();
  
  const [schedules, setSchedules] = useState<(Schedule & { location: Location })[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Update schedules when selected bus changes
  useEffect(() => {
    if (selectedBus) {
      setSchedules(getSchedulesByBus(selectedBus.id));
    } else {
      setSchedules([]);
    }
  }, [selectedBus, getSchedulesByBus]);
  
  const formatTime = (date: Date | null): string => {
    if (!date) return 'Not set';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Not set';
    return date.toLocaleDateString();
  };
  
  const getProgressPercentage = (departure: Date | null, arrival: Date | null): number => {
    if (!departure || !arrival) return 0;
    
    const now = currentTime.getTime();
    const start = departure.getTime();
    const end = arrival.getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return Math.floor(((now - start) / (end - start)) * 100);
  };
  
  const isTravelInProgress = (departure: Date | null, arrival: Date | null): boolean => {
    if (!departure || !arrival) return false;
    const now = currentTime.getTime();
    return now >= departure.getTime() && now <= arrival.getTime();
  };
  
  const handleTimeUpdate = (scheduleIndex: number, newTime: string) => {
    if (!selectedBus) return;
    
    const updatedSchedules = [...schedules];
    const [hours, minutes] = newTime.split(':').map(Number);
    
    const newDate = new Date(updatedSchedules[scheduleIndex].departure_time || new Date());
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    updatedSchedules[scheduleIndex].departure_time = newDate;
    
    // Calculate new arrival time based on duration
    if (updatedSchedules[scheduleIndex].duration_min) {
      const arrivalTime = new Date(newDate);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + updatedSchedules[scheduleIndex].duration_min);
      updatedSchedules[scheduleIndex].arrival_time = arrivalTime;
    }
    
    setSchedules(updatedSchedules);
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => setActiveView('dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ETA Tracker</CardTitle>
          <CardDescription>Track estimated arrival times for all destinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Bus</label>
            <Select
              value={selectedBus?.id || ''}
              onValueChange={(value) => {
                const bus = buses.find(b => b.id === value);
                setSelectedBus(bus || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a bus" />
              </SelectTrigger>
              <SelectContent>
                {buses.map((bus) => (
                  <SelectItem key={bus.id} value={bus.id}>
                    {bus.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedBus && schedules.length > 0 ? (
            <div className="space-y-4 mt-6">
              {schedules.map((schedule, index) => {
                const progressPercentage = getProgressPercentage(schedule.departure_time, schedule.arrival_time);
                const isActive = isTravelInProgress(schedule.departure_time, schedule.arrival_time);
                
                return (
                  <Card key={index} className={`border ${isActive ? 'border-nymphette-purple' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="flex items-center mb-2 md:mb-0">
                          <MapPin className="h-5 w-5 mr-2 text-nymphette-purple" />
                          <div>
                            <h3 className="font-medium">{schedule.location.name}</h3>
                            <p className="text-sm text-gray-600">
                              {schedule.distance_km} km • {schedule.duration_min} min
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:items-end">
                          <div className="flex items-center text-sm">
                            <span className="mr-2">Departure:</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 text-sm"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(schedule.departure_time)}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2">
                                <div className="space-y-2">
                                  <p className="text-sm">Set departure time:</p>
                                  <input
                                    type="time"
                                    className="border rounded p-1"
                                    value={schedule.departure_time ? 
                                      `${schedule.departure_time.getHours().toString().padStart(2, '0')}:${schedule.departure_time.getMinutes().toString().padStart(2, '0')}` : 
                                      ''}
                                    onChange={(e) => handleTimeUpdate(index, e.target.value)}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="flex items-center mt-1 text-sm">
                            <span className="mr-2">ETA:</span>
                            <span className="font-medium">
                              {formatTime(schedule.arrival_time)}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(schedule.departure_time)}
                          </div>
                        </div>
                      </div>
                      
                      {schedule.departure_time && schedule.arrival_time && (
                        <div className="mt-3">
                          <div className="text-xs flex justify-between mb-1">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-nymphette-purple h-2 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : selectedBus ? (
            <div className="text-center py-8 text-gray-500">
              No schedule data available for this bus
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Please select a bus to view the schedule
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ETATrackerModule;
