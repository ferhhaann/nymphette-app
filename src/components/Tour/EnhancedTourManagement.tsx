
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tour, TourItinerary, TourManager, Flight, Hotel, TravelNote } from '@/types/tour';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  Plus,
  Route,
  Trash,
  User,
  Users,
  Plane,
  Hotel as HotelIcon,
  CalendarDays,
  FileText
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data
const MOCK_TOURS: Tour[] = [];

const MOCK_MANAGERS: TourManager[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1234567890',
    isAvailable: true,
    assignedCity: 'Hyderabad'
  },
  {
    id: '2',
    name: 'Mohammed Ali',
    email: 'mohammed@example.com',
    phone: '+1987654321',
    isAvailable: true,
    assignedCity: 'Chennai'
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david@example.com',
    phone: '+1567890123',
    isAvailable: false,
    assignedCity: 'Bangalore'
  }
];

const EnhancedTourManagement = () => {
  const { user, userRole } = useAuth();
  const { setActiveView } = useAppContext();
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [managers, setManagers] = useState<TourManager[]>(MOCK_MANAGERS);
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('trip-info');

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      mainLocation: '',
      startDate: '',
      endDate: '',
      coverImage: '',
      managers: [] as string[],
      itinerary: [] as any[],
      flights: [] as any[],
      hotels: [] as any[],
      travelNotes: [] as any[]
    }
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary
  } = useFieldArray({
    control: form.control,
    name: "itinerary"
  });

  const {
    fields: flightFields,
    append: appendFlight,
    remove: removeFlight
  } = useFieldArray({
    control: form.control,
    name: "flights"
  });

  const {
    fields: hotelFields,
    append: appendHotel,
    remove: removeHotel
  } = useFieldArray({
    control: form.control,
    name: "hotels"
  });

  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote
  } = useFieldArray({
    control: form.control,
    name: "travelNotes"
  });

  useEffect(() => {
    if (editingTour) {
      form.reset({
        name: editingTour.name,
        description: editingTour.description,
        mainLocation: editingTour.mainLocation || '',
        startDate: editingTour.startDate,
        endDate: editingTour.endDate,
        coverImage: editingTour.coverImage || '',
        managers: editingTour.managers || [],
        itinerary: editingTour.itinerary.map(item => ({
          id: item.id,
          dayNumber: item.dayNumber,
          date: item.date || '',
          location: item.location || '',
          description: item.description || '',
          morningActivity: item.morningActivity || '',
          afternoonActivity: item.afternoonActivity || '',
          eveningActivity: item.eveningActivity || '',
          lunchPlace: item.lunchPlace || '',
          dinnerPlace: item.dinnerPlace || '',
          mealsIncluded: item.mealsIncluded || { breakfast: false, lunch: false, dinner: false },
          pickupTime: item.pickupTime || '',
          dropTime: item.dropTime || '',
          locationsVisited: item.locationsVisited || []
        })),
        flights: editingTour.flights?.map(flight => ({
          id: flight.id,
          airline: flight.airline,
          departureAirport: flight.departureAirport,
          arrivalAirport: flight.arrivalAirport,
          departureTime: flight.departureTime,
          departureDate: flight.departureDate,
          arrivalTime: flight.arrivalTime,
          arrivalDate: flight.arrivalDate,
          seats: flight.seats
        })) || [],
        hotels: editingTour.hotels?.map(hotel => ({
          id: hotel.id,
          name: hotel.name,
          city: hotel.city,
          roomType: hotel.roomType,
          checkInDate: hotel.checkInDate,
          checkOutDate: hotel.checkOutDate
        })) || [],
        travelNotes: editingTour.travelNotes?.map(note => ({
          id: note.id,
          category: note.category,
          content: note.content
        })) || []
      });
      setShowForm(true);
    }
  }, [editingTour, form]);

  const handleOpenNewTourForm = () => {
    setEditingTour(null);
    form.reset({
      name: '',
      description: '',
      mainLocation: '',
      startDate: '',
      endDate: '',
      coverImage: '',
      managers: [],
      itinerary: [],
      flights: [],
      hotels: [],
      travelNotes: []
    });
    setShowForm(true);
    setCurrentTab('trip-info');
  };

  const handleAddItineraryItem = () => {
    const newDayNumber = itineraryFields.length > 0 
      ? Math.max(...itineraryFields.map(f => f.dayNumber)) + 1 
      : 1;
      
    appendItinerary({
      id: `temp-${itineraryFields.length}`,
      dayNumber: newDayNumber,
      date: '',
      location: '',
      description: '',
      morningActivity: '',
      afternoonActivity: '',
      eveningActivity: '',
      lunchPlace: '',
      dinnerPlace: '',
      mealsIncluded: { breakfast: false, lunch: false, dinner: false },
      pickupTime: '',
      dropTime: '',
      locationsVisited: []
    });
  };

  const handleAddFlight = () => {
    appendFlight({
      id: `flight-${flightFields.length}`,
      airline: '',
      departureAirport: '',
      arrivalAirport: '',
      departureTime: '',
      departureDate: '',
      arrivalTime: '',
      arrivalDate: '',
      seats: []
    });
  };

  const handleAddFlightSeat = (flightIndex: number) => {
    const currentSeats = form.getValues(`flights.${flightIndex}.seats`) || [];
    form.setValue(`flights.${flightIndex}.seats`, [
      ...currentSeats,
      { city: '', count: 0 }
    ]);
  };

  const handleAddHotel = () => {
    appendHotel({
      id: `hotel-${hotelFields.length}`,
      name: '',
      city: '',
      roomType: '',
      checkInDate: '',
      checkOutDate: ''
    });
  };

  const handleAddTravelNote = () => {
    appendNote({
      id: `note-${noteFields.length}`,
      category: 'other',
      content: ''
    });
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (editingTour) {
      const updatedTour: Tour = {
        ...editingTour,
        name: data.name,
        description: data.description,
        mainLocation: data.mainLocation,
        startDate: data.startDate,
        endDate: data.endDate,
        coverImage: data.coverImage,
        managers: data.managers,
        itinerary: data.itinerary,
        flights: data.flights,
        hotels: data.hotels,
        travelNotes: data.travelNotes,
        status: editingTour.status || 'upcoming'
      };
      
      setTours(tours.map(t => t.id === editingTour.id ? updatedTour : t));
      toast.success('Tour updated successfully');
    } else {
      const newTour: Tour = {
        id: (tours.length + 1).toString(),
        name: data.name,
        description: data.description,
        mainLocation: data.mainLocation,
        startDate: data.startDate,
        endDate: data.endDate,
        coverImage: data.coverImage,
        managerId: null,
        managers: data.managers,
        itinerary: data.itinerary.map((item, index) => ({
          ...item,
          id: `new-itin-${index}`
        })),
        flights: data.flights.map((flight, index) => ({
          ...flight,
          id: `new-flight-${index}`
        })),
        hotels: data.hotels.map((hotel, index) => ({
          ...hotel,
          id: `new-hotel-${index}`
        })),
        travelNotes: data.travelNotes.map((note, index) => ({
          ...note,
          id: `new-note-${index}`
        })),
        status: 'upcoming'
      };
      
      setTours([...tours, newTour]);
      toast.success('Tour created successfully');
    }
    
    setShowForm(false);
    setEditingTour(null);
  });

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
  };

  const handleDeleteTour = (tourId: string) => {
    setTours(tours.filter(t => t.id !== tourId));
    toast.success('Tour deleted successfully');
  };

  const handleSelectTour = (tourId: string) => {
    setSelectedTourId(tourId === selectedTourId ? null : tourId);
  };

  const handleChangeTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const getManagerNames = (managerIds: string[] = []) => {
    return managerIds
      .map(id => managers.find(m => m.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  if (userRole !== 'super_admin') {
    return (
      <div className="p-6 text-center">
        <Route className="h-12 w-12 mx-auto mb-2 text-blue-400" />
        <h2 className="text-xl font-semibold text-blue-100">Unauthorized Access</h2>
        <p className="mt-2 text-blue-200/80">Only administrators can manage tours.</p>
      </div>
    );
  }

  const getTourStatusBadge = (status: string) => {
    switch(status) {
      case 'upcoming':
        return <Badge className="bg-blue-600">Upcoming</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-600">Ongoing</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Completed</Badge>;
      default:
        return <Badge className="bg-blue-600">Upcoming</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
            Itinerary Management
          </h1>
          <p className="text-blue-200/80 mt-1">Create and manage detailed trip itineraries</p>
        </div>
        {!showForm && (
          <Button
            onClick={handleOpenNewTourForm}
            className="bg-gradient-to-r from-blue-600 to-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Itinerary
          </Button>
        )}
      </div>

      {showForm ? (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-100">
              {editingTour ? 'Edit Itinerary' : 'Create New Itinerary'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Fill in all details for this trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs 
                  value={currentTab} 
                  onValueChange={handleChangeTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-6 mb-6">
                    <TabsTrigger value="trip-info">Trip Info</TabsTrigger>
                    <TabsTrigger value="flights">Flights</TabsTrigger>
                    <TabsTrigger value="hotels">Hotels</TabsTrigger>
                    <TabsTrigger value="itinerary">Day-by-Day</TabsTrigger>
                    <TabsTrigger value="managers">Tour Managers</TabsTrigger>
                    <TabsTrigger value="notes">Travel Notes</TabsTrigger>
                  </TabsList>

                  {/* Trip Info Tab */}
                  <TabsContent value="trip-info" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Trip Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Dubai-Georgia Trip (Apr 2025)" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="mainLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Main Location/Country</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Georgia" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Start Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">End Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Cover Image URL (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter image URL" 
                              className="bg-white/5 border-white/10 text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Trip Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter details about the trip" 
                              className="bg-white/5 border-white/10 text-white min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Flights Tab */}
                  <TabsContent value="flights" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-100">Flight Details</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddFlight}
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Flight
                      </Button>
                    </div>

                    <div className="mt-3 space-y-4">
                      {flightFields.map((flight, flightIndex) => (
                        <Card key={flight.id} className="bg-white/5 border border-white/10">
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between">
                              <CardTitle className="text-md text-blue-100">
                                <Plane className="h-4 w-4 inline mr-2" /> Flight {flightIndex + 1}
                              </CardTitle>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFlight(flightIndex)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 px-2"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`flights.${flightIndex}.airline`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Airline Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. Air Arabia"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`flights.${flightIndex}.departureAirport`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Departure Airport</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. HYD"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`flights.${flightIndex}.arrivalAirport`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Arrival Airport</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. SHJ"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <FormField
                                control={form.control}
                                name={`flights.${flightIndex}.departureDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Departure Date</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="date"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`flights.${flightIndex}.departureTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Departure Time</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="time"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`flights.${flightIndex}.arrivalDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Arrival Date</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="date"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`flights.${flightIndex}.arrivalTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Arrival Time</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="time"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-blue-200">Reserved Seats by City</h4>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleAddFlightSeat(flightIndex)}
                                  className="h-7 text-blue-400 hover:text-blue-300"
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add City
                                </Button>
                              </div>

                              <div className="space-y-2">
                                {form.watch(`flights.${flightIndex}.seats`)?.map((seat, seatIndex) => (
                                  <div className="grid grid-cols-2 gap-2" key={`seat-${flightIndex}-${seatIndex}`}>
                                    <FormField
                                      control={form.control}
                                      name={`flights.${flightIndex}.seats.${seatIndex}.city`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input 
                                              placeholder="City name"
                                              className="bg-white/10 border-white/10 text-white h-8 text-sm"
                                              {...field} 
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name={`flights.${flightIndex}.seats.${seatIndex}.count`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input 
                                              type="number"
                                              placeholder="Seats"
                                              className="bg-white/10 border-white/10 text-white h-8 text-sm"
                                              {...field} 
                                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                ))}

                                {!form.watch(`flights.${flightIndex}.seats`)?.length && (
                                  <div className="text-sm text-blue-300/70 italic">
                                    No reserved seats added yet
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {flightFields.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-md p-6 text-center">
                          <Plane className="h-10 w-10 mx-auto text-blue-400/50 mb-2" />
                          <p className="text-gray-400">No flights added yet</p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleAddFlight} 
                            className="mt-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add First Flight
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Hotels Tab */}
                  <TabsContent value="hotels" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-100">Hotel Details</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddHotel}
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Hotel
                      </Button>
                    </div>

                    <div className="mt-3 space-y-4">
                      {hotelFields.map((hotel, hotelIndex) => (
                        <Card key={hotel.id} className="bg-white/5 border border-white/10">
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between">
                              <CardTitle className="text-md text-blue-100">
                                <HotelIcon className="h-4 w-4 inline mr-2" /> Hotel {hotelIndex + 1}
                              </CardTitle>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeHotel(hotelIndex)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 px-2"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name={`hotels.${hotelIndex}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Hotel Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. The Biltmore"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`hotels.${hotelIndex}.city`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">City</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. Tbilisi"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name={`hotels.${hotelIndex}.roomType`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Room Type</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. Twin Sharing"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-2 gap-3">
                                <FormField
                                  control={form.control}
                                  name={`hotels.${hotelIndex}.checkInDate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-gray-300">Check-in Date</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="date"
                                          className="bg-white/10 border-white/10 text-white"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`hotels.${hotelIndex}.checkOutDate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-gray-300">Check-out Date</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="date"
                                          className="bg-white/10 border-white/10 text-white"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {hotelFields.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-md p-6 text-center">
                          <HotelIcon className="h-10 w-10 mx-auto text-blue-400/50 mb-2" />
                          <p className="text-gray-400">No hotels added yet</p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleAddHotel} 
                            className="mt-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add First Hotel
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Daily Itinerary Tab */}
                  <TabsContent value="itinerary" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-100">Day-by-Day Schedule</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddItineraryItem}
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Day
                      </Button>
                    </div>
                    
                    <div className="mt-3 space-y-4">
                      {/* Add itinerary management content here */}
                      <p className="text-blue-200">Itinerary content will be added here</p>
                    </div>
                  </TabsContent>

                  {/* Managers Tab */}
                  <TabsContent value="managers" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-100">Tour Managers</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="managers"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-2">
                            {managers.map(manager => (
                              <div key={manager.id} className="flex items-center space-x-2">
                                <input 
                                  type="checkbox"
                                  id={`manager-${manager.id}`}
                                  value={manager.id}
                                  checked={(field.value || []).includes(manager.id)}
                                  onChange={(e) => {
                                    const value = [...(field.value || [])];
                                    if (e.target.checked) {
                                      value.push(manager.id);
                                    } else {
                                      const idx = value.indexOf(manager.id);
                                      if (idx !== -1) value.splice(idx, 1);
                                    }
                                    field.onChange(value);
                                  }}
                                  className="rounded bg-white/5 border-white/10 text-blue-500"
                                />
                                <label 
                                  htmlFor={`manager-${manager.id}`}
                                  className="text-gray-300 flex items-center"
                                >
                                  <span>{manager.name}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`ml-2 ${manager.isAvailable ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}
                                  >
                                    {manager.isAvailable ? 'Available' : 'Unavailable'}
                                  </Badge>
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Travel Notes Tab */}
                  <TabsContent value="notes" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-100">Travel Notes</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddTravelNote}
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Note
                      </Button>
                    </div>
                    
                    <div className="mt-3 space-y-4">
                      {/* Add travel notes content here */}
                      <p className="text-blue-200">Travel notes content will be added here</p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500"
                  >
                    <Route className="mr-2 h-4 w-4" /> 
                    {editingTour ? 'Update Itinerary' : 'Create Itinerary'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTour(null);
                    }}
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div>Tour list will be displayed here</div>
      )}
    </div>
  );
};

export default EnhancedTourManagement;
