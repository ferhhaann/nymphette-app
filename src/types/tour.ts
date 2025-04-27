
export interface TourItinerary {
  id: string;
  dayNumber: number;
  date: string;
  location: string;
  description: string;
  morningActivity: string;
  afternoonActivity: string;
  eveningActivity: string;
  lunchPlace: string;
  dinnerPlace: string;
  mealsIncluded: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  pickupTime: string;
  dropTime: string;
  locationsVisited: string[];
  // Adding the missing properties causing TypeScript errors
  startTime?: string;
  endTime?: string;
}

export interface Flight {
  id: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  departureDate: string;
  arrivalTime: string;
  arrivalDate: string;
  seats: {
    city: string;
    count: number;
  }[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface TravelNote {
  id: string;
  category: 'visa' | 'money' | 'immigration' | 'packing' | 'other';
  content: string;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  mainLocation: string;
  coverImage?: string;
  managerId: string | null;
  itinerary: TourItinerary[];
  flights: Flight[];
  hotels: Hotel[];
  travelNotes: TravelNote[];
  managers?: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface TourManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAvailable: boolean;
  assignedCity?: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
}
