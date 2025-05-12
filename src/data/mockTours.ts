
import { Tour } from '@/types/tour';

export const mockTours: Tour[] = [
  {
    id: '1',
    name: 'Dubai Adventure 2025',
    description: 'Explore the wonders of Dubai with this comprehensive 5-day tour',
    startDate: '2025-04-01',
    endDate: '2025-04-05',
    mainLocation: 'Dubai, UAE',
    managerId: '1',
    managers: ['1', '2'],
    status: 'upcoming',
    flights: [
      {
        id: 'f1',
        airline: 'Emirates',
        departureAirport: 'JFK',
        arrivalAirport: 'DXB',
        departureTime: '21:00',
        departureDate: '2025-03-31',
        arrivalTime: '19:20',
        arrivalDate: '2025-04-01',
        seats: [{ city: 'New York', count: 45 }]
      }
    ],
    hotels: [
      {
        id: 'h1',
        name: 'Grand Hyatt Dubai',
        city: 'Dubai',
        roomType: 'Double Deluxe',
        checkInDate: '2025-04-01',
        checkOutDate: '2025-04-05'
      }
    ],
    itinerary: [
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
    travelNotes: [
      {
        id: 'n1',
        category: 'visa',
        content: 'Tourist visa required for non-GCC nationals. Apply at least 14 days before travel.'
      },
      {
        id: 'n2',
        category: 'money',
        content: 'Bring UAE Dirhams. Major credit cards accepted in most places.'
      }
    ]
  },
  {
    id: '2',
    name: 'Paris Highlights 2025',
    description: 'Experience the romance and culture of Paris in this 4-day tour',
    startDate: '2025-05-10',
    endDate: '2025-05-14',
    mainLocation: 'Paris, France',
    managerId: '3',
    managers: ['3'],
    status: 'upcoming',
    flights: [
      {
        id: 'f2',
        airline: 'Air France',
        departureAirport: 'LHR',
        arrivalAirport: 'CDG',
        departureTime: '09:30',
        departureDate: '2025-05-10',
        arrivalTime: '11:45',
        arrivalDate: '2025-05-10',
        seats: [{ city: 'London', count: 32 }]
      }
    ],
    hotels: [
      {
        id: 'h2',
        name: 'Hotel Le Meurice',
        city: 'Paris',
        roomType: 'Superior Room',
        checkInDate: '2025-05-10',
        checkOutDate: '2025-05-14'
      }
    ],
    itinerary: [
      {
        id: 'day1-paris',
        dayNumber: 1,
        date: '2025-05-10',
        location: 'Eiffel Tower',
        description: 'Visit the iconic landmark of Paris',
        morningActivity: 'Check-in at hotel',
        afternoonActivity: 'Eiffel Tower visit',
        eveningActivity: 'Seine River Cruise',
        lunchPlace: 'Café de l\'Homme',
        dinnerPlace: 'Restaurant le Jules Verne',
        mealsIncluded: {
          breakfast: false,
          lunch: true,
          dinner: true
        },
        pickupTime: '12:30',
        dropTime: '21:00',
        locationsVisited: ['Eiffel Tower', 'Seine River']
      }
    ],
    travelNotes: [
      {
        id: 'n3',
        category: 'visa',
        content: 'Schengen visa required for non-EU nationals.'
      }
    ]
  }
];
