// Mock data for the tour management system

export interface Participant {
  id: string;
  name: string;
  phone: string;
  bus_id: string | null;
}

export interface Bus {
  id: string;
  label: string;
  capacity: number;
  manager_name?: string | null;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Schedule {
  bus_id: string;
  location_id: string;
  arrival_time: Date | null;
  departure_time: Date | null;
  distance_km: number;
  duration_min: number;
}

// Mock buses
export const buses: Bus[] = [
  { id: '1', label: 'Bus 1', capacity: 50 },
  { id: '2', label: 'Bus 2', capacity: 50 },
  { id: '3', label: 'Bus 3', capacity: 50 },
  { id: '4', label: 'Bus 4', capacity: 40 },
  { id: '5', label: 'Bus 5', capacity: 40 },
  { id: '6', label: 'Bus 6', capacity: 45 },
  { id: '7', label: 'Bus 7', capacity: 45 },
  { id: '8', label: 'Bus 8', capacity: 35 },
  { id: '9', label: 'Bus 9', capacity: 35 },
  { id: '10', label: 'Bus 10', capacity: 30 },
];

// Mock locations
export const locations: Location[] = [
  {
    id: '1',
    name: 'Mountain Viewpoint',
    description: 'Scenic overlook with panoramic mountain views and hiking trails nearby.',
    image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  },
  {
    id: '2',
    name: 'Lakeside Resort',
    description: 'Luxury accommodations by the lake with water activities and relaxation areas.',
    image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
  },
  {
    id: '3',
    name: 'Forest Reserve',
    description: 'Protected forest with rare species and guided nature walks through ancient trees.',
    image_url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff',
  },
  {
    id: '4',
    name: 'Historical Village',
    description: 'Preserved traditional village showcasing local culture and craftsmanship.',
    image_url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb',
  },
  {
    id: '5',
    name: 'Waterfall Trail',
    description: 'Series of stunning waterfalls with swimming holes and picnic areas.',
    image_url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67',
  },
];

// Generate random participants
const generateRandomParticipants = (count: number): Participant[] => {
  const participants: Participant[] = [];
  const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Daniel', 'Sophia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    participants.push({
      id: `P${i + 1}`,
      name: `${firstName} ${lastName}`,
      phone: `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      bus_id: Math.random() > 0.3 ? `${Math.ceil(Math.random() * 10)}` : null,
    });
  }
  
  return participants;
};

export const participants: Participant[] = generateRandomParticipants(250);

// Mock schedules
export const schedules: Schedule[] = [];

// Create schedules for each bus and location
buses.forEach(bus => {
  locations.forEach((location, index) => {
    // Base departure time is 9 AM today plus increments for each location
    const baseTime = new Date();
    baseTime.setHours(9, 0, 0, 0);
    baseTime.setDate(baseTime.getDate() + Math.floor(index / locations.length));
    
    const departureTime = new Date(baseTime);
    departureTime.setMinutes(departureTime.getMinutes() + (index * 120));
    
    const distance = 20 + Math.floor(Math.random() * 80);
    const duration = distance * 1.5; // Roughly 1.5 minutes per kilometer
    
    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + duration);
    
    schedules.push({
      bus_id: bus.id,
      location_id: location.id,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      distance_km: distance,
      duration_min: duration
    });
  });
});

export const getParticipantsByBus = (busId: string): Participant[] => {
  return participants.filter(participant => participant.bus_id === busId);
};

export const getParticipantCountByBus = (busId: string): number => {
  return participants.filter(participant => participant.bus_id === busId).length;
};

export const getSchedulesByBus = (busId: string): (Schedule & { location: Location })[] => {
  const busSchedules = schedules.filter(schedule => schedule.bus_id === busId);
  
  return busSchedules.map(schedule => {
    const location = locations.find(loc => loc.id === schedule.location_id)!;
    return { ...schedule, location };
  }).sort((a, b) => {
    if (!a.departure_time || !b.departure_time) return 0;
    return a.departure_time.getTime() - b.departure_time.getTime();
  });
};

export const getLocationById = (locationId: string): Location | undefined => {
  return locations.find(location => location.id === locationId);
};
