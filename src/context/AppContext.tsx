import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  Bus, 
  Participant, 
  Location, 
  Schedule, 
  buses, 
  participants as initialParticipants,
  locations,
  getParticipantsByBus, 
  getSchedulesByBus,
  getLocationById
} from '../data/mockData';
import { toast } from 'sonner';
import { Tour, TourManager, Flight, Hotel, TravelNote } from '@/types/tour';

interface AppContextType {
  buses: Bus[];
  participants: Participant[];
  locations: Location[];
  selectedBus: Bus | null;
  selectedLocation: Location | null;
  activeView: 'dashboard' | 'busAssignment' | 'etaTracker' | 'destination' | 'addBus' | 'manageDestinations' | 'notifications' | 'bulkUpload' | 'userManagement' | 'tourManagement' | 'itineraryManagement';
  setActiveView: (view: 'dashboard' | 'busAssignment' | 'etaTracker' | 'destination' | 'addBus' | 'manageDestinations' | 'notifications' | 'bulkUpload' | 'userManagement' | 'tourManagement' | 'itineraryManagement') => void;
  setSelectedBus: (bus: Bus | null) => void;
  setSelectedLocation: (location: Location | null) => void;
  assignParticipant: (participantId: string, busId: string) => boolean;
  removeParticipantFromBus: (participantId: string) => void;
  getParticipantsByBus: (busId: string) => Participant[];
  getSchedulesByBus: (busId: string) => (Schedule & { location: Location })[];
  updateDepartureTime: (busId: string, locationId: string, newTime: Date) => void;
  calculateETA: (busId: string, locationId: string, fromIndex: number) => Date | null;
  searchParticipant: (term: string) => Participant | null;
  addBus: (label: string, capacity: number, managerName?: string) => void;
  sendNotification: (participantIds: string[], message: string) => Promise<boolean>;
  deleteBus: (busId: string) => void;
  tours: Tour[];
  saveTour: (tour: Tour) => void;
  deleteTour: (tourId: string) => void;
  getTourById: (tourId: string) => Tour | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'busAssignment' | 'etaTracker' | 'destination' | 'addBus' | 'manageDestinations' | 'notifications' | 'bulkUpload' | 'userManagement' | 'tourManagement' | 'itineraryManagement'>('dashboard');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [busList, setBusList] = useState<Bus[]>(buses);
  const [tours, setTours] = useState<Tour[]>([]);

  const assignParticipant = (participantId: string, busId: string): boolean => {
    const participant = participants.find(p => p.id === participantId);
    const bus = buses.find(b => b.id === busId);
    
    if (!participant || !bus) {
      toast.error('Participant or bus not found');
      return false;
    }
    
    const currentBusParticipants = getParticipantsByBus(busId);
    if (currentBusParticipants.length >= bus.capacity) {
      toast.error(`Bus ${bus.label} is at full capacity`);
      return false;
    }
    
    setParticipants(prev => 
      prev.map(p => p.id === participantId ? { ...p, bus_id: busId } : p)
    );
    
    toast.success(`${participant.name} assigned to ${bus.label}`);
    return true;
  };

  const removeParticipantFromBus = (participantId: string): void => {
    const participant = participants.find(p => p.id === participantId);
    if (!participant) {
      toast.error('Participant not found');
      return;
    }
    
    setParticipants(prev =>
      prev.map(p => p.id === participantId ? { ...p, bus_id: null } : p)
    );
    
    toast.success(`${participant.name} removed from bus`);
  };

  const updateDepartureTime = (busId: string, locationId: string, newTime: Date): void => {
    setScheduleData(prev => 
      prev.map(schedule => {
        if (schedule.bus_id === busId && schedule.location_id === locationId) {
          return { ...schedule, departure_time: newTime };
        }
        return schedule;
      })
    );
  };

  const calculateETA = (busId: string, locationId: string, fromIndex: number): Date | null => {
    const busSchedules = getSchedulesByBus(busId);
    
    if (fromIndex >= busSchedules.length || fromIndex < 0) return null;
    
    let cumulativeDuration = 0;
    let startTime = busSchedules[fromIndex].departure_time;
    
    if (!startTime) return null;
    
    for (let i = fromIndex; i < busSchedules.length; i++) {
      if (busSchedules[i].location_id === locationId) {
        const eta = new Date(startTime);
        eta.setMinutes(eta.getMinutes() + cumulativeDuration);
        return eta;
      }
      cumulativeDuration += busSchedules[i].duration_min;
    }
    
    return null;
  };

  const searchParticipant = (term: string): Participant | null => {
    const result = participants.find(
      p => p.id === term || 
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.phone.replace(/\D/g, '').includes(term.replace(/\D/g, ''))
    );
    
    return result || null;
  };

  const addBus = (label: string, capacity: number, managerName?: string): void => {
    const newId = (busList.length + 1).toString();
    const newBus: Bus = {
      id: newId,
      label,
      capacity,
      manager_name: managerName || null
    };
    
    setBusList(prev => [...prev, newBus]);
    toast.success(`Bus ${label} added successfully`);
  };

  const sendNotification = async (participantIds: string[], message: string): Promise<boolean> => {
    try {
      console.log(`Sending notification to ${participantIds.length} participants`);
      console.log('Message:', message);
      console.log('Recipients:', participantIds.map(id => participants.find(p => p.id === id)?.name));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  const deleteBus = (busId: string): void => {
    setParticipants(prev => 
      prev.map(p => p.bus_id === busId ? { ...p, bus_id: null } : p)
    );
    
    setBusList(prev => prev.filter(b => b.id !== busId));
    toast.success('Bus deleted successfully');
  };

  const saveTour = (tour: Tour): void => {
    if (tours.some(t => t.id === tour.id)) {
      setTours(tours.map(t => t.id === tour.id ? tour : t));
      toast.success('Tour itinerary updated successfully');
    } else {
      const newTour = {
        ...tour,
        id: tour.id || (tours.length + 1).toString()
      };
      setTours([...tours, newTour]);
      toast.success('Tour itinerary created successfully');
    }
  };

  const deleteTour = (tourId: string): void => {
    setTours(tours.filter(tour => tour.id !== tourId));
    toast.success('Tour itinerary deleted successfully');
  };

  const getTourById = (tourId: string): Tour | undefined => {
    return tours.find(tour => tour.id === tourId);
  };

  return (
    <AppContext.Provider value={{
      buses: busList,
      participants,
      locations,
      selectedBus,
      selectedLocation,
      activeView,
      setActiveView,
      setSelectedBus,
      setSelectedLocation,
      assignParticipant,
      removeParticipantFromBus,
      getParticipantsByBus,
      getSchedulesByBus,
      updateDepartureTime,
      calculateETA,
      searchParticipant,
      addBus,
      sendNotification,
      deleteBus,
      tours,
      saveTour,
      deleteTour,
      getTourById
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
