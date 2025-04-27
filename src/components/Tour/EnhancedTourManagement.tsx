
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
  Airplane,
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
                                <Airplane className="h-4 w-4 inline mr-2" /> Flight {flightIndex + 1}
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
                          <Airplane className="h-10 w-10 mx-auto text-blue-400/50 mb-2" />
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
                      {itineraryFields.map((item, index) => (
                        <Card key={item.id} className="bg-white/5 border border-white/10">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-md text-blue-100">
                                <CalendarDays className="h-4 w-4 inline mr-2" /> 
                                Day {item.dayNumber}
                              </CardTitle>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeItinerary(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 px-2"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`itinerary.${index}.dayNumber`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Day Number</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="1"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`itinerary.${index}.date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Date</FormLabel>
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
                                name={`itinerary.${index}.location`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Location</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. Tbilisi Old Town"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`itinerary.${index}.morningActivity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Morning Activity</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. City Tour"
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
                                name={`itinerary.${index}.afternoonActivity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Afternoon Activity</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. Museum Visit"
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
                                name={`itinerary.${index}.eveningActivity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Evening Activity</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. Dinner & Dance Show"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`itinerary.${index}.lunchPlace`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Lunch Place</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. Maharaja Palace"
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
                                name={`itinerary.${index}.dinnerPlace`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Dinner Place</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="E.g. Maharaja Lounge"
                                        className="bg-white/10 border-white/10 text-white"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`itinerary.${index}.pickupTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Pickup Time</FormLabel>
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
                                name={`itinerary.${index}.dropTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">Drop Time</FormLabel>
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
                              
                              <div className="col-span-2">
                                <FormLabel className="text-gray-300 block mb-2">Meals Included</FormLabel>
                                <div className="flex space-x-4">
                                  <FormField
                                    control={form.control}
                                    name={`itinerary.${index}.mealsIncluded.breakfast`}
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                          <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-blue-500"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-gray-300">Breakfast</FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name={`itinerary.${index}.mealsIncluded.lunch`}
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                          <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-blue-500"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-gray-300">Lunch</FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name={`itinerary.${index}.mealsIncluded.dinner`}
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                          <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-blue-500"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-gray-300">Dinner</FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <FormField
                              control={form.control}
                              name={`itinerary.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Detailed Activity Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Detailed description of activities"
                                      className="bg-white/10 border-white/10 text-white min-h-[80px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      ))}
                      
                      {itineraryFields.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-md p-6 text-center">
                          <CalendarDays className="h-10 w-10 mx-auto text-blue-400/50 mb-2" />
                          <p className="text-gray-400">No daily schedule items added yet</p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleAddItineraryItem} 
                            className="mt-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add First Day
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Tour Managers Tab */}
                  <TabsContent value="managers" className="space-y-4">
                    <h3 className="text-lg font-medium text-blue-100">Tour Manager Assignment</h3>
                    
                    <FormField
                      control={form.control}
                      name="managers"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-4">
                            <Table className="border border-white/10 rounded-md overflow-hidden">
                              <TableHeader className="bg-white/5">
                                <TableRow className="hover:bg-white/5 border-white/10">
                                  <TableHead className="text-blue-200 font-medium">Assign</TableHead>
                                  <TableHead className="text-blue-200 font-medium">Manager Name</TableHead>
                                  <TableHead className="text-blue-200 font-medium">Assigned City</TableHead>
                                  <TableHead className="text-blue-200 font-medium">Contact Number</TableHead>
                                  <TableHead className="text-blue-200 font-medium">Availability</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {managers.map(manager => (
                                  <TableRow key={manager.id} className="hover:bg-white/5 border-white/10">
                                    <TableCell>
                                      <Checkbox 
                                        id={`manager-${manager.id}`}
                                        checked={(field.value || []).includes(manager.id)}
                                        onCheckedChange={(checked) => {
                                          const value = [...(field.value || [])];
                                          if (checked) {
                                            value.push(manager.id);
                                          } else {
                                            const idx = value.indexOf(manager.id);
                                            if (idx !== -1) value.splice(idx, 1);
                                          }
                                          field.onChange(value);
                                        }}
                                        className="data-[state=checked]:bg-blue-500"
                                      />
                                    </TableCell>
                                    <TableCell className="text-blue-100">
                                      <label 
                                        htmlFor={`manager-${manager.id}`}
                                        className="cursor-pointer"
                                      >
                                        {manager.name}
                                      </label>
                                    </TableCell>
                                    <TableCell className="text-gray-300">{manager.assignedCity || "—"}</TableCell>
                                    <TableCell className="text-gray-300">{manager.phone}</TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant="outline" 
                                        className={manager.isAvailable ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}
                                      >
                                        {manager.isAvailable ? 'Available' : 'Unavailable'}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {managers.length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                                      No tour managers available
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Travel Notes Tab */}
                  <TabsContent value="notes" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-100">Travel Documentation Notes</h3>
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
                      {noteFields.map((note, noteIndex) => (
                        <Card key={note.id} className="bg-white/5 border border-white/10">
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between">
                              <CardTitle className="text-md text-blue-100">
                                <FileText className="h-4 w-4 inline mr-2" /> Travel Note {noteIndex + 1}
                              </CardTitle>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeNote(noteIndex)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 px-2"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 space-y-4">
                            <FormField
                              control={form.control}
                              name={`travelNotes.${noteIndex}.category`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Note Category</FormLabel>
                                  <Select 
                                    value={field.value} 
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-white/10 border-white/10 text-white">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-navy-800 border-white/10">
                                      <SelectItem value="visa">Visa Requirement</SelectItem>
                                      <SelectItem value="money">Travel Fund</SelectItem>
                                      <SelectItem value="immigration">Immigration Guidelines</SelectItem>
                                      <SelectItem value="packing">Packing Reminders</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`travelNotes.${noteIndex}.content`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Note Content</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter note details"
                                      className="bg-white/10 border-white/10 text-white min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      ))}
                      
                      {noteFields.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-md p-6 text-center">
                          <FileText className="h-10 w-10 mx-auto text-blue-400/50 mb-2" />
                          <p className="text-gray-400">No travel notes added yet</p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleAddTravelNote} 
                            className="mt-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add First Note
                          </Button>
                        </div>
                      )}
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
        <div className="space-y-6">
          {tours.length === 0 ? (
            <div className="rounded-lg backdrop-blur-lg bg-white/5 border border-white/10 p-12 text-center">
              <Route className="mx-auto h-12 w-12 text-blue-400 mb-3" />
              <h3 className="text-xl font-medium text-blue-100">No Itineraries Created Yet</h3>
              <p className="mt-2 text-gray-400 max-w-md mx-auto">
                Create your first trip itinerary to start planning detailed schedules with flight details, hotels, and daily activities.
              </p>
              <Button 
                onClick={handleOpenNewTourForm} 
                className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Itinerary
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {tours.map(tour => (
                <Card 
                  key={tour.id} 
                  className={`backdrop-blur-lg bg-white/5 border ${
                    selectedTourId === tour.id ? 'border-blue-500/50' : 'border-white/10'
                  } transition-all hover:border-blue-500/30`}
                >
                  <CardHeader className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div>
                          <CardTitle className="text-blue-100 text-xl">{tour.name}</CardTitle>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            <div className="flex items-center text-sm text-blue-300">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            
                            {tour.mainLocation && (
                              <div className="flex items-center text-sm text-blue-300">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{tour.mainLocation}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center text-sm text-blue-300">
                              {getTourStatusBadge(tour.status || 'upcoming')}
                            </div>
                          </div>
                          <CardDescription className="text-gray-400 mt-2">
                            {tour.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTour(tour)}
                          className="h-8 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTour(tour.id)}
                          className="h-8 bg-red-900/20 border-red-500/30 hover:bg-red-900/30 text-red-300"
                        >
                          <Trash className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="px-5 py-3 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectTour(tour.id)}
                        className="h-9 text-blue-300 hover:text-blue-200 hover:bg-blue-900/20 justify-start"
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {selectedTourId === tour.id ? 'Hide Day-by-Day Details' : 'Show Day-by-Day Details'}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTourId(tour.id === selectedTourId ? null : tour.id)}
                        className="h-9 text-blue-300 hover:text-blue-200 hover:bg-blue-900/20 justify-start"
                      >
                        <Airplane className="h-4 w-4 mr-2" />
                        {(tour.flights?.length || 0) > 0 ? `${tour.flights?.length} Flights` : 'No Flights Added'}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTourId(tour.id === selectedTourId ? null : tour.id)}
                        className="h-9 text-blue-300 hover:text-blue-200 hover:bg-blue-900/20 justify-start"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {tour.managers && tour.managers.length > 0 
                          ? `${tour.managers.length} Managers` 
                          : 'No Managers Assigned'}
                      </Button>
                    </div>
                    
                    {selectedTourId === tour.id && (
                      <div className="border-t border-white/5 p-5">
                        <Tabs defaultValue="schedule" className="w-full">
                          <TabsList className="grid grid-cols-4 w-full mb-4">
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                            <TabsTrigger value="flights">Flights</TabsTrigger>
                            <TabsTrigger value="hotels">Hotels</TabsTrigger>
                            <TabsTrigger value="notes">Travel Notes</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="schedule">
                            {tour.itinerary?.length > 0 ? (
                              <Table className="w-full">
                                <TableHeader>
                                  <TableRow className="border-white/10 hover:bg-white/5">
                                    <TableHead className="text-blue-200 font-medium">Day</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Date</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Morning</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Lunch</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Evening</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Dinner</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {tour.itinerary.map((item) => (
                                    <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                                      <TableCell className="text-blue-100">{item.dayNumber}</TableCell>
                                      <TableCell className="text-gray-300">
                                        {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                                      </TableCell>
                                      <TableCell className="text-gray-300">{item.morningActivity || '—'}</TableCell>
                                      <TableCell className="text-gray-300">{item.lunchPlace || '—'}</TableCell>
                                      <TableCell className="text-gray-300">{item.eveningActivity || '—'}</TableCell>
                                      <TableCell className="text-gray-300">{item.dinnerPlace || '—'}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <div className="text-center py-4 text-gray-400">
                                No day-by-day schedule added yet
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="flights">
                            {tour.flights?.length > 0 ? (
                              <Table className="w-full">
                                <TableHeader>
                                  <TableRow className="border-white/10 hover:bg-white/5">
                                    <TableHead className="text-blue-200 font-medium">Airline</TableHead>
                                    <TableHead className="text-blue-200 font-medium">From</TableHead>
                                    <TableHead className="text-blue-200 font-medium">To</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Departure</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Arrival</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Seats</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {tour.flights.map((flight) => (
                                    <TableRow key={flight.id} className="border-white/10 hover:bg-white/5">
                                      <TableCell className="text-blue-100">{flight.airline}</TableCell>
                                      <TableCell className="text-gray-300">{flight.departureAirport}</TableCell>
                                      <TableCell className="text-gray-300">{flight.arrivalAirport}</TableCell>
                                      <TableCell className="text-gray-300">
                                        {flight.departureDate && (
                                          <span className="block text-xs">{new Date(flight.departureDate).toLocaleDateString()}</span>
                                        )}
                                        {flight.departureTime}
                                      </TableCell>
                                      <TableCell className="text-gray-300">
                                        {flight.arrivalDate && (
                                          <span className="block text-xs">{new Date(flight.arrivalDate).toLocaleDateString()}</span>
                                        )}
                                        {flight.arrivalTime}
                                      </TableCell>
                                      <TableCell className="text-gray-300">
                                        {flight.seats?.map((seat, idx) => (
                                          <div key={idx} className="text-xs">
                                            {seat.city}: {seat.count}
                                          </div>
                                        ))}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <div className="text-center py-4 text-gray-400">
                                No flights added yet
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="hotels">
                            {tour.hotels?.length > 0 ? (
                              <Table className="w-full">
                                <TableHeader>
                                  <TableRow className="border-white/10 hover:bg-white/5">
                                    <TableHead className="text-blue-200 font-medium">Hotel</TableHead>
                                    <TableHead className="text-blue-200 font-medium">City</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Room Type</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Check-in</TableHead>
                                    <TableHead className="text-blue-200 font-medium">Check-out</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {tour.hotels.map((hotel) => (
                                    <TableRow key={hotel.id} className="border-white/10 hover:bg-white/5">
                                      <TableCell className="text-blue-100">{hotel.name}</TableCell>
                                      <TableCell className="text-gray-300">{hotel.city}</TableCell>
                                      <TableCell className="text-gray-300">{hotel.roomType}</TableCell>
                                      <TableCell className="text-gray-300">
                                        {hotel.checkInDate ? new Date(hotel.checkInDate).toLocaleDateString() : '—'}
                                      </TableCell>
                                      <TableCell className="text-gray-300">
                                        {hotel.checkOutDate ? new Date(hotel.checkOutDate).toLocaleDateString() : '—'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <div className="text-center py-4 text-gray-400">
                                No hotels added yet
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="notes">
                            {tour.travelNotes?.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tour.travelNotes.map((note) => (
                                  <Card key={note.id} className="bg-white/5 border border-white/10">
                                    <CardHeader className="p-4 pb-2">
                                      <CardTitle className="text-md text-blue-100">
                                        <Badge className="bg-blue-500 text-xs">
                                          {note.category === 'visa' && 'Visa Requirement'}
                                          {note.category === 'money' && 'Travel Fund'}
                                          {note.category === 'immigration' && 'Immigration Guidelines'}
                                          {note.category === 'packing' && 'Packing Reminders'}
                                          {note.category === 'other' && 'Other Information'}
                                        </Badge>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                      <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-400">
                                No travel notes added yet
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedTourManagement;
