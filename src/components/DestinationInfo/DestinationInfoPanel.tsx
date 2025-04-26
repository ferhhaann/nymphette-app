
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Location } from '../../data/mockData';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const DestinationInfoPanel: React.FC = () => {
  const { locations, setActiveView, selectedLocation, setSelectedLocation } = useAppContext();
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Button 
        variant="ghost" 
        className="mb-6 text-blue-200 hover:text-white hover:bg-white/10"
        onClick={() => setActiveView('dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="space-y-6">
        <div className="relative">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 via-purple-200 to-blue-100 bg-clip-text text-transparent mb-2">
            Destination Information
          </h1>
          <p className="text-blue-200/80">Explore tour destinations and facilities</p>
        </div>

        <ScrollArea className="w-full whitespace-nowrap pb-4 -mx-4">
          <div className="flex space-x-4 px-4">
            {locations.map((location) => (
              <Card 
                key={location.id} 
                className={`flex-shrink-0 w-[280px] cursor-pointer transition-all duration-300 backdrop-blur-lg bg-white/5 border-white/10 hover:bg-white/10
                  ${selectedLocation?.id === location.id ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setSelectedLocation(location)}
              >
                <CardContent className="p-4">
                  <div className="overflow-hidden rounded-lg mb-3">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src={location.image_url} 
                        alt={location.name}
                        className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                      />
                    </AspectRatio>
                  </div>
                  <div className="font-medium text-lg bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent">
                    {location.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        {selectedLocation ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 backdrop-blur-lg bg-white/5 border-white/10">
              <CardContent className="p-0">
                <div className="overflow-hidden rounded-t-lg">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={selectedLocation.image_url} 
                      alt={selectedLocation.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold flex items-center bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent">
                    <MapPin className="mr-2 h-6 w-6 text-purple-400" />
                    {selectedLocation.name}
                  </h2>
                  <p className="mt-4 text-blue-200/90 leading-relaxed">
                    {selectedLocation.description}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className="backdrop-blur-lg bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Facilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-blue-200/90">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
                      Restrooms
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
                      Dining Area
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
                      Gift Shop
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
                      Information Center
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-lg bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-blue-200/90">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
                      Meet at designated area
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
                      Carry ID at all times
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
                      Return to bus on time
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
                      Contact guide if separated
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-blue-200/50 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl">
            Select a destination to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationInfoPanel;
