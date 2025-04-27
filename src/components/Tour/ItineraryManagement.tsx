
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tour, TourItinerary, TourManager, Destination } from '@/types/tour';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import { 
  Calendar, 
  Clock, 
  Edit, 
  MapPin, 
  Plus, 
  Route, 
  Trash, 
  User, 
  Users 
} from 'lucide-react';

// Mock data - in a real app this would come from your backend
const MOCK_TOURS: Tour[] = [
  {
    id: '1',
    name: 'Dubai City Tour',
    description: 'Experience the wonders of Dubai in this 5-day tour',
    startDate: '2025-11-15',
    endDate: '2025-11-20',
    managerId: null,
    managers: ['1', '2'],
    itinerary: [
      {
        id: '1',
        dayNumber: 1,
        location: 'Burj Khalifa',
        description: 'Visit tallest building in the world',
        startTime: '09:00',
        endTime: '11:00'
      },
      {
        id: '2',
        dayNumber: 1,
        location: 'Dubai Mall',
        description: 'Lunch and shopping break',
        startTime: '12:00',
        endTime: '14:30'
      },
      {
        id: '3',
        dayNumber: 2,
        location: 'Desert Safari',
        description: 'Dune bashing and entertainment show',
        startTime: '15:00',
        endTime: '19:00'
      }
    ]
  }
];

const MOCK_MANAGERS: TourManager[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1234567890',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Mohammed Ali',
    email: 'mohammed@example.com',
    phone: '+1987654321',
    isAvailable: true
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david@example.com',
    phone: '+1567890123',
    isAvailable: false
  }
];

const MOCK_DESTINATIONS: Destination[] = [
  { id: '1', name: 'Burj Khalifa', description: 'The tallest building in the world' },
  { id: '2', name: 'Dubai Mall', description: 'One of the largest shopping malls' },
  { id: '3', name: 'Desert Safari', description: 'Experience the Arabian desert' },
  { id: '4', name: 'Palm Jumeirah', description: 'Iconic artificial archipelago' }
];

const ItineraryManagement = () => {
  const { user, userRole } = useAuth();
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [managers, setManagers] = useState<TourManager[]>(MOCK_MANAGERS);
  const [destinations, setDestinations] = useState<Destination[]>(MOCK_DESTINATIONS);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);

  // Form setup with react-hook-form
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      managers: [] as string[],
      itinerary: [] as any[]
    }
  });

  // Setup field array for itinerary items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itinerary"
  });

  // When editing a tour, populate the form
  useEffect(() => {
    if (editingTour) {
      form.reset({
        name: editingTour.name,
        description: editingTour.description,
        startDate: editingTour.startDate,
        endDate: editingTour.endDate,
        managers: editingTour.managers || [],
        itinerary: editingTour.itinerary.map(item => ({
          id: item.id,
          dayNumber: item.dayNumber,
          location: item.location,
          description: item.description,
          startTime: item.startTime,
          endTime: item.endTime
        }))
      });
      setShowForm(true);
    }
  }, [editingTour, form]);

  const handleOpenNewTourForm = () => {
    setEditingTour(null);
    form.reset({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      managers: [],
      itinerary: []
    });
    setShowForm(true);
  };

  const handleAddItineraryItem = () => {
    append({
      id: `temp-${fields.length}`,
      dayNumber: fields.length > 0 ? fields[fields.length - 1].dayNumber : 1,
      location: '',
      description: '',
      startTime: '',
      endTime: ''
    });
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (editingTour) {
      // Update existing tour
      const updatedTour: Tour = {
        ...editingTour,
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        managers: data.managers,
        itinerary: data.itinerary
      };
      
      setTours(tours.map(t => t.id === editingTour.id ? updatedTour : t));
      toast.success('Tour updated successfully');
    } else {
      // Create new tour
      const newTour: Tour = {
        id: (tours.length + 1).toString(),
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        managerId: null,
        managers: data.managers,
        itinerary: data.itinerary.map((item, index) => ({
          ...item,
          id: `new-${index}`
        }))
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

  if (userRole !== 'super_admin') {
    return (
      <div className="p-6 text-center">
        <Route className="h-12 w-12 mx-auto mb-2 text-blue-400" />
        <h2 className="text-xl font-semibold text-blue-100">Unauthorized Access</h2>
        <p className="mt-2 text-blue-200/80">Only administrators can manage itineraries.</p>
      </div>
    );
  }

  const getManagerNames = (managerIds: string[] = []) => {
    return managerIds
      .map(id => managers.find(m => m.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
            Itinerary Management
          </h1>
          <p className="text-blue-200/80 mt-1">Create and manage trip itineraries and assign tour managers</p>
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
              {editingTour ? 'Edit Tour Itinerary' : 'Create New Tour Itinerary'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the tour details and itinerary information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Tour Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="E.g. Dubai City Tour" 
                            className="bg-white/5 border-white/10 text-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
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
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Tour Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter details about the tour" 
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="managers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Assign Tour Managers</FormLabel>
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
                
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-blue-100">Itinerary Items</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddItineraryItem}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  
                  <div className="mt-3 space-y-4">
                    {fields.map((item, index) => (
                      <Card key={item.id} className="bg-white/5 border border-white/10">
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between">
                            <CardTitle className="text-md text-blue-100">Day {item.dayNumber} Activity</CardTitle>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => remove(index)}
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
                              name={`itinerary.${index}.location`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Destination</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="E.g. Burj Khalifa"
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
                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name={`itinerary.${index}.startTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">ETD (Start Time)</FormLabel>
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
                                name={`itinerary.${index}.endTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-300">ETA (End Time)</FormLabel>
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
                            
                            <FormField
                              control={form.control}
                              name={`itinerary.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Activity details"
                                      className="bg-white/10 border-white/10 text-white min-h-[80px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {fields.length === 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-md p-6 text-center">
                        <p className="text-gray-400">No itinerary items added yet</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleAddItineraryItem} 
                          className="mt-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add First Item
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500"
                  >
                    <Route className="mr-2 h-4 w-4" /> 
                    {editingTour ? 'Update Tour' : 'Create Tour'}
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
              <h3 className="text-xl font-medium text-blue-100">No Tours Created Yet</h3>
              <p className="mt-2 text-gray-400 max-w-md mx-auto">
                Create your first tour itinerary to start planning your trips with detailed schedules and manager assignments.
              </p>
              <Button 
                onClick={handleOpenNewTourForm} 
                className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Tour
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {tours.map(tour => (
                <Card 
                  key={tour.id} 
                  className={`backdrop-blur-lg bg-white/5 border ${selectedTourId === tour.id ? 'border-blue-500/50' : 'border-white/10'} transition-all hover:border-blue-500/30`}
                >
                  <CardHeader className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-blue-100 text-xl">{tour.name}</CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {tour.description}
                        </CardDescription>
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
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                      <div className="flex items-center text-sm text-blue-300">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}</span>
                      </div>
                      
                      {tour.managers && tour.managers.length > 0 && (
                        <div className="flex items-center text-sm text-blue-300">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{getManagerNames(tour.managers)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-blue-300">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{tour.itinerary.length} destinations</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="px-5 py-3 border-t border-white/5 flex justify-between items-center">
                      <div className="font-medium text-blue-200">
                        Itinerary Details
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectTour(tour.id)}
                        className="h-8 text-blue-300 hover:text-blue-200 hover:bg-blue-900/20"
                      >
                        {selectedTourId === tour.id ? 'Hide Details' : 'Show Details'}
                      </Button>
                    </div>
                    
                    {selectedTourId === tour.id && (
                      <div className="border-t border-white/5 p-5">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                              <TableHead className="text-blue-200 font-medium">Day</TableHead>
                              <TableHead className="text-blue-200 font-medium">Destination</TableHead>
                              <TableHead className="text-blue-200 font-medium">ETD</TableHead>
                              <TableHead className="text-blue-200 font-medium">ETA</TableHead>
                              <TableHead className="text-blue-200 font-medium">Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tour.itinerary.map((item) => (
                              <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="text-blue-100">Day {item.dayNumber}</TableCell>
                                <TableCell className="text-blue-100">{item.location}</TableCell>
                                <TableCell className="text-gray-300">{item.startTime}</TableCell>
                                <TableCell className="text-gray-300">{item.endTime}</TableCell>
                                <TableCell className="text-gray-300 max-w-xs truncate">{item.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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

export default ItineraryManagement;
