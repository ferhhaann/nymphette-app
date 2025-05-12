import { Tour } from '@/types/tour';

export const mockTours: Tour[] = [
  {
    id: '1',
    name: 'Dubai & Georgia Explorer',
    description: 'Experience the modern marvels of Dubai and the ancient history of Georgia in one amazing trip',
    startDate: '2025-04-10',
    endDate: '2025-04-20',
    mainLocation: 'Dubai & Georgia',
    managerId: null,
    coverImage: '/placeholder.svg',
    managers: ['1', '2'],
    flights: [
      {
        id: 'flight-1',
        airline: 'Emirates',
        departureAirport: 'HYD',
        arrivalAirport: 'DXB',
        departureTime: '22:45',
        departureDate: '2025-04-10',
        arrivalTime: '01:05',
        arrivalDate: '2025-04-11',
        seats: [
          { city: 'Hyderabad', count: 40 },
          { city: 'Chennai', count: 25 }
        ]
      },
      {
        id: 'flight-2',
        airline: 'FlyDubai',
        departureAirport: 'DXB',
        arrivalAirport: 'TBS',
        departureTime: '10:15',
        departureDate: '2025-04-14',
        arrivalTime: '14:00',
        arrivalDate: '2025-04-14',
        seats: [
          { city: 'Dubai', count: 65 }
        ]
      }
    ],
    itinerary: [
      {
        id: 'itin-1',
        dayNumber: 1,
        date: '2025-04-10',
        location: 'Hyderabad to Dubai',
        description: 'Departure from Hyderabad International Airport to Dubai',
        morningActivity: 'Check-in at airport',
        afternoonActivity: 'Departure from Hyderabad',
        eveningActivity: 'Arrival in Dubai, transfer to hotel',
        lunchPlace: 'Airport food court',
        dinnerPlace: 'Hotel restaurant',
        mealsIncluded: { breakfast: false, lunch: true, dinner: true },
        pickupTime: '18:00',
        dropTime: '02:30',
        locationsVisited: ['Hyderabad Airport', 'Dubai Airport', 'Dubai Hotel'],
        startTime: '18:00',
        endTime: '02:30'
      },
      {
        id: 'itin-2',
        dayNumber: 2,
        date: '2025-04-11',
        location: 'Dubai City Tour',
        description: 'Explore the highlights of Dubai including Burj Khalifa and Dubai Mall',
        morningActivity: 'Burj Khalifa tour',
        afternoonActivity: 'Dubai Mall shopping',
        eveningActivity: 'Dubai Fountain show',
        lunchPlace: 'Arabian Tea House',
        dinnerPlace: 'Al Ustad Special Kabab',
        mealsIncluded: { breakfast: true, lunch: true, dinner: true },
        pickupTime: '09:00',
        dropTime: '21:00',
        locationsVisited: ['Burj Khalifa', 'Dubai Mall', 'Dubai Fountain'],
        startTime: '09:00',
        endTime: '21:00'
      },
      {
        id: 'day1',
        dayNumber: 1,
        date: '2025-04-01',
        location: 'Burj Khalifa',
        description: 'Visit the tallest building in the world',
        morningActivity: 'Dubai Mall Tour',
        afternoonActivity: 'Burj Khalifa Observatory Deck',
        eveningActivity: 'Dubai Fountain Show',
        lunchPlace: 'The Dubai Mall Food Court',
        dinnerPlace: 'Atmosphere Restaurant',
        mealsIncluded: {
          breakfast: true,
          lunch: true,
          dinner: true
        },
        pickupTime: '09:00',
        dropTime: '21:00',
        locationsVisited: ['Dubai Mall', 'Burj Khalifa', 'Dubai Fountain']
      },
      {
        id: 'day2',
        dayNumber: 2,
        date: '2025-04-02',
        location: 'Desert Safari',
        description: 'Experience the Arabian desert with dune bashing and camel rides',
        morningActivity: 'Desert Dune Bashing',
        afternoonActivity: 'Camel Riding',
        eveningActivity: 'Bedouin Camp Dinner & Shows',
        lunchPlace: 'Al Hadheera Desert Restaurant',
        dinnerPlace: 'Bedouin Camp',
        mealsIncluded: {
          breakfast: true,
          lunch: true,
          dinner: true
        },
        pickupTime: '08:00',
        dropTime: '22:00',
        locationsVisited: ['Desert Conservation Reserve', 'Bedouin Camp']
      }
    ],
    hotels: [
      {
        id: 'hotel-1',
        name: 'Atlantis The Palm',
        city: 'Dubai',
        roomType: 'Ocean King Room',
        checkInDate: '2025-04-11',
        checkOutDate: '2025-04-14'
      },
      {
        id: 'hotel-2',
        name: 'Tbilisi Marriott',
        city: 'Tbilisi',
        roomType: 'Deluxe Suite',
        checkInDate: '2025-04-14',
        checkOutDate: '2025-04-18'
      }
    ],
    travelNotes: [
      {
        id: 'note-1',
        category: 'visa',
        content: 'UAE visa on arrival for Indian passport holders with US visa. Georgian e-visa must be applied 7 days before travel.'
      },
      {
        id: 'note-2',
        category: 'money',
        content: 'Bring UAE Dirhams for Dubai and Georgian Lari for Georgia. Credit cards widely accepted in Dubai, less so in Georgian countryside.'
      }
    ],
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Paris & Switzerland Tour',
    description: 'A romantic journey through Paris and the Swiss Alps',
    startDate: '2025-05-15',
    endDate: '2025-05-25',
    mainLocation: 'France & Switzerland',
    managerId: null,
    coverImage: '/placeholder.svg',
    managers: ['3'],
    flights: [
      {
        id: 'flight-3',
        airline: 'Air France',
        departureAirport: 'DEL',
        arrivalAirport: 'CDG',
        departureTime: '23:10',
        departureDate: '2025-05-15',
        arrivalTime: '05:40',
        arrivalDate: '2025-05-16',
        seats: [
          { city: 'Delhi', count: 50 }
        ]
      }
    ],
    itinerary: [
      {
        id: 'itin-3',
        dayNumber: 1,
        date: '2025-05-15',
        location: 'Delhi to Paris',
        description: 'Overnight flight to Paris',
        morningActivity: 'Airport check-in',
        afternoonActivity: 'Departure preparations',
        eveningActivity: 'Flight to Paris',
        lunchPlace: 'Home',
        dinnerPlace: 'In-flight meal',
        mealsIncluded: { breakfast: false, lunch: false, dinner: true },
        pickupTime: '19:00',
        dropTime: '23:00',
        locationsVisited: ['Delhi Airport'],
        startTime: '19:00',
        endTime: '23:00'
      }
    ],
    hotels: [
      {
        id: 'hotel-3',
        name: 'Le Meurice',
        city: 'Paris',
        roomType: 'Deluxe Room',
        checkInDate: '2025-05-16',
        checkOutDate: '2025-05-20'
      }
    ],
    travelNotes: [
      {
        id: 'note-3',
        category: 'visa',
        content: 'Schengen visa required. Apply at least 30 days before travel.'
      }
    ],
    status: 'upcoming'
  }
];
