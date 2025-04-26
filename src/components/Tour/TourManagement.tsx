
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tour, TourItinerary } from '@/types/tour';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Route, Calendar, UserPlus } from 'lucide-react';

// Mock data - in a real app this would come from your backend
const MOCK_TOURS: Tour[] = [];

const TourManagement = () => {
  const { user, userRole } = useAuth();
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [newTour, setNewTour] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    managerId: '',
  });
  const [showForm, setShowForm] = useState(false);

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tour: Tour = {
      id: (tours.length + 1).toString(),
      ...newTour,
      itinerary: []
    };
    
    setTours([...tours, tour]);
    setNewTour({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      managerId: '',
    });
    setShowForm(false);
    toast.success('Tour created successfully');
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
            Tour Management
          </h1>
          <p className="text-blue-200/80 mt-1">Create and manage tours and their itineraries</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Tour
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-100">Create New Tour</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the tour details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTour} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tour Name</label>
                <Input
                  value={newTour.name}
                  onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                  placeholder="Enter tour name"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <Textarea
                  value={newTour.description}
                  onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                  placeholder="Enter tour description"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Start Date</label>
                  <Input
                    type="date"
                    value={newTour.startDate}
                    onChange={(e) => setNewTour({ ...newTour, startDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">End Date</label>
                  <Input
                    type="date"
                    value={newTour.endDate}
                    onChange={(e) => setNewTour({ ...newTour, endDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500"
                >
                  <Route className="mr-2 h-4 w-4" /> Create Tour
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <Card key={tour.id} className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-blue-100">{tour.name}</CardTitle>
              <CardDescription className="text-gray-400">
                {tour.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-blue-200/80">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    onClick={() => toast.info('Itinerary management coming soon')}
                  >
                    <Route className="mr-2 h-4 w-4" /> Manage Itinerary
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    onClick={() => toast.info('Manager assignment coming soon')}
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Assign Manager
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TourManagement;
