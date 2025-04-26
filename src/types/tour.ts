
export interface TourItinerary {
  id: string;
  dayNumber: number;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  managerId: string | null;
  itinerary: TourItinerary[];
}
