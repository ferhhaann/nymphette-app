
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tour, TourItinerary } from '@/types/tour';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Calendar, Edit, MapPin, Plus, Route, Trash, Clock } from 'lucide-react';

// Mock data - will be replaced with actual tour context
const MOCK_ITINERARY = [];

const ItineraryManagement = () => {
  const { user, userRole } = useAuth();
  const { 
    setActiveView, 
    tours: appTours,
    activeTourId,
    saveTour,
  } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TourItinerary | null>(null);

  // Get current tour
  const currentTour = appTours.find(tour => tour.id === activeTourId);
  const itinerary = currentTour?.itinerary || [];

  const form = useForm({
    defaultValues: {
      dayNumber: 1,
      date: '',
      location: '',
      description: '',
      startTime: '',
      endTime: ''
    }
  });

  useEffect(() => {
    if (editingItem) {
      form.reset({
        dayNumber: editingItem.dayNumber,
        date: editingItem.date || '',
        location: editingItem.location,
        description: editingItem.description,
        startTime: editingItem.startTime,
        endTime: editingItem.endTime
      });
    }
  }, [editingItem, form]);

  const handleOpenNewForm = () => {
    setEditingItem(null);
    form.reset({
      dayNumber: itinerary.length > 0 ? Math.max(...itinerary.map(item => item.dayNumber)) + 1 : 1,
      date: '',
      location: '',
      description: '',
      startTime: '',
      endTime: ''
    });
    setShowForm(true);
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (!currentTour) {
      toast.error('No active tour selected');
      return;
    }
    
    const itineraryItem: TourItinerary = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      dayNumber: data.dayNumber,
      date: data.date,
      location: data.location,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime
    };

    let updatedItinerary;
    if (editingItem) {
      updatedItinerary = currentTour.itinerary.map(item => 
        item.id === editingItem.id ? itineraryItem : item
      );
    } else {
      updatedItinerary = [...currentTour.itinerary, itineraryItem];
    }

    // Save updated tour
    const updatedTour: Tour = {
      ...currentTour,
      itinerary: updatedItinerary
    };
    
    saveTour(updatedTour);
    setShowForm(false);
    setEditingItem(null);
    toast.success(editingItem ? 'Itinerary item updated' : 'Itinerary item added');
  });

  const handleEdit = (item: TourItinerary) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (itemId: string) => {
    if (!currentTour) return;
    
    const updatedItinerary = currentTour.itinerary.filter(item => item.id !== itemId);
    const updatedTour: Tour = {
      ...currentTour,
      itinerary: updatedItinerary
    };
    
    saveTour(updatedTour);
    toast.success('Itinerary item removed');
  };

  if (userRole !== 'super_admin' && userRole !== 'tour_manager') {
    return (
      <div className="p-6 text-center">
        <Route className="h-12 w-12 mx-auto mb-2 text-blue-400" />
        <h2 className="text-xl font-semibold text-blue-100">Unauthorized Access</h2>
        <p className="mt-2 text-blue-200/80">Only administrators can manage itineraries.</p>
      </div>
    );
  }

  if (!currentTour) {
    return (
      <div className="p-6 text-center">
        <Route className="h-12 w-12 mx-auto mb-2 text-blue-400" />
        <h2 className="text-xl font-semibold text-blue-100">No Tour Selected</h2>
        <p className="mt-2 text-blue-200/80">Please select a tour to manage its itinerary.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
            Day-by-Day Itinerary
          </h1>
          <p className="text-blue-200/80 mt-1">
            Managing itinerary for: <span className="font-medium text-blue-100">{currentTour.name}</span>
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={handleOpenNewForm}
            className="bg-gradient-to-r from-blue-600 to-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Itinerary Item
          </Button>
        )}
      </div>

      {showForm ? (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-100">
              {editingItem ? 'Edit Itinerary Item' : 'Add Itinerary Item'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details for this itinerary item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dayNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Day Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            className="bg-white/5 border-white/10 text-white"
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
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Date</FormLabel>
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="E.g. Burj Khalifa" 
                            className="bg-white/5 border-white/10 text-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Start Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
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
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">End Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter details about this activity" 
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500"
                  >
                    <Route className="mr-2 h-4 w-4" /> 
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
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
      ) : itinerary.length > 0 ? (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardContent className="p-0">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-blue-200 font-medium">Day</TableHead>
                  <TableHead className="text-blue-200 font-medium">Date</TableHead>
                  <TableHead className="text-blue-200 font-medium">Location</TableHead>
                  <TableHead className="text-blue-200 font-medium">Start</TableHead>
                  <TableHead className="text-blue-200 font-medium">End</TableHead>
                  <TableHead className="text-blue-200 font-medium">Description</TableHead>
                  <TableHead className="text-blue-200 font-medium w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itinerary.sort((a, b) => a.dayNumber - b.dayNumber).map((item) => (
                  <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-blue-100">Day {item.dayNumber}</TableCell>
                    <TableCell className="text-gray-300">
                      {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="text-blue-100">{item.location}</TableCell>
                    <TableCell className="text-gray-300">{item.startTime}</TableCell>
                    <TableCell className="text-gray-300">{item.endTime}</TableCell>
                    <TableCell className="text-gray-300 max-w-xs truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8 text-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 text-red-400"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg backdrop-blur-lg bg-white/5 border border-white/10 p-12 text-center">
          <Route className="mx-auto h-12 w-12 text-blue-400 mb-3" />
          <h3 className="text-xl font-medium text-blue-100">No Itinerary Items Yet</h3>
          <p className="mt-2 text-gray-400 max-w-md mx-auto">
            Start creating your day-by-day itinerary to plan your tour activities in detail.
          </p>
          <Button 
            onClick={handleOpenNewForm} 
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" /> Add First Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItineraryManagement;
