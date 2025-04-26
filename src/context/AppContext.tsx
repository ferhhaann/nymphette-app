
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  Bus, 
  Participant, 
  Location, 
  Schedule, 
  buses, 
  participants as initialParticipants,
  getParticipantsByBus, 
  getSchedulesByBus,
  getLocationById
} from '../data/mockData';
import { toast } from 'sonner';

interface AppContextType {
  buses: Bus[];
  participants: Participant[];
  selectedBus: Bus | null;
  selectedLocation: Location | null;
  activeView: 'dashboard' | 'busAssignment' | 'etaTracker' | 'destination';
  setActiveView: (view: 'dashboard' | 'busAssignment' | 'etaTracker' | 'destination') => void;
  setSelectedBus: (bus: Bus | null) => void;
  setSelectedLocation: (location: Location | null) => void;
  assignParticipant: (participantId: string, busId: string) => boolean;
  removeParticipantFromBus: (participantId: string) => void;
  getParticipantsByBus: (busId: string) => Participant[];
  getSchedulesByBus: (busId: string) => (Schedule & { location: Location })[];
  updateDepartureTime: (busId: string, locationId: string, newTime: Date) => void;
  calculateETA: (busId: string, locationId: string, fromIndex: number) => Date | null;
  searchParticipant: (term: string) => Participant | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'busAssignment' | 'etaTracker' | 'destination'>('dashboard');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);

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
    // Search by ID (exact match) or name (partial match)
    const result = participants.find(
      p => p.id === term || 
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.phone.replace(/\D/g, '').includes(term.replace(/\D/g, ''))
    );
    
    return result || null;
  };

  return (
    <AppContext.Provider value={{
      buses,
      participants,
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
      searchParticipant
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
