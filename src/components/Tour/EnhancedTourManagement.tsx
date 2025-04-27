import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tour, TourItinerary, TourManager } from '@/types/tour';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Calendar, 
  Clock, 
  Edit, 
  MapPin, 
  Plus, 
  Route, 
  Trash, 
  Users,
  Hotel as HotelIcon,
  Plane
} from 'lucide-react';

const EnhancedTourManagement = () => {
  const { user, userRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState('basicInfo');
  const [tours, setTours] = useState<Tour[]>([]);
  
  if (userRole !== 'super_admin') {
    return (
      <div className="container mx-auto p-6 text-center">
        <Route className="h-12 w-12 mx-auto mb-2 text-blue-400" />
        <h2 className="text-xl font-semibold text-blue-100">Unauthorized Access</h2>
        <p className="mt-2 text-blue-200/80">Only administrators can manage tours.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
          Tour Management Suite
        </h1>
        <p className="text-blue-200/80 mt-1">Create and manage comprehensive tour itineraries</p>
      </div>
      
      <div className="flex space-x-4 border-b border-white/10">
        <Button
          variant={activeTab === 'basicInfo' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('basicInfo')}
          className={activeTab === 'basicInfo' ? 'bg-blue-600' : 'text-blue-300'}
        >
          <Route className="mr-2 h-4 w-4" /> Basic Info
        </Button>
        <Button
          variant={activeTab === 'flights' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('flights')}
          className={activeTab === 'flights' ? 'bg-blue-600' : 'text-blue-300'}
        >
          <Plane className="mr-2 h-4 w-4" /> Flights
        </Button>
        <Button
          variant={activeTab === 'hotels' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('hotels')}
          className={activeTab === 'hotels' ? 'bg-blue-600' : 'text-blue-300'}
        >
          <HotelIcon className="mr-2 h-4 w-4" /> Hotels
        </Button>
        <Button
          variant={activeTab === 'itinerary' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('itinerary')}
          className={activeTab === 'itinerary' ? 'bg-blue-600' : 'text-blue-300'}
        >
          <Calendar className="mr-2 h-4 w-4" /> Daily Schedule
        </Button>
        <Button
          variant={activeTab === 'managers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('managers')}
          className={activeTab === 'managers' ? 'bg-blue-600' : 'text-blue-300'}
        >
          <Users className="mr-2 h-4 w-4" /> Managers
        </Button>
      </div>
      
      {activeTab === 'basicInfo' && (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-100">Tour Basic Information</CardTitle>
            <CardDescription className="text-gray-400">
              Enter the fundamental details about the tour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200">Basic information form will be implemented here</p>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'flights' && (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-100">Flight Information</CardTitle>
            <CardDescription className="text-gray-400">
              Manage all flights for this tour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200">Flight management form will be implemented here</p>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'hotels' && (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-100">Hotel Accommodations</CardTitle>
            <CardDescription className="text-gray-400">
              Manage hotel bookings and room assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200">Hotel management form will be implemented here</p>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'itinerary' && (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-100">Daily Itinerary</CardTitle>
            <CardDescription className="text-gray-400">
              Plan the daily activities, meals, and transportation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200">Itinerary management form will be implemented here</p>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'managers' && (
        <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-100">Tour Managers</CardTitle>
            <CardDescription className="text-gray-400">
              Assign managers to this tour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200">Manager assignment form will be implemented here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedTourManagement;
