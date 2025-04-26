
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
    <div className="container mx-auto p-4 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => setActiveView('dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Destination Information</CardTitle>
          <CardDescription>Details about tour destinations</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap pb-4 -mx-4">
            <div className="flex space-x-4 px-4">
              {locations.map((location) => (
                <Card 
                  key={location.id} 
                  className={`flex-shrink-0 w-[250px] cursor-pointer transition-all 
                    ${selectedLocation?.id === location.id ? 'ring-2 ring-nymphette-purple' : 'hover:border-nymphette-purple'}`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <CardContent className="p-3">
                    <div className="overflow-hidden rounded-md mb-2">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={location.image_url} 
                          alt={location.name}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                    <div className="font-medium">{location.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          {selectedLocation ? (
            <div className="mt-6 space-y-4">
              <div className="overflow-hidden rounded-lg">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={selectedLocation.image_url} 
                    alt={selectedLocation.name}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-nymphette-purple" />
                  {selectedLocation.name}
                </h2>
                <p className="mt-2 text-gray-700">{selectedLocation.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm">Facilities</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <ul className="text-sm space-y-1">
                      <li>• Restrooms</li>
                      <li>• Dining Area</li>
                      <li>• Gift Shop</li>
                      <li>• Information Center</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm">Important Information</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <ul className="text-sm space-y-1">
                      <li>• Meet at designated area</li>
                      <li>• Carry ID at all times</li>
                      <li>• Return to bus on time</li>
                      <li>• Contact guide if separated</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="mt-6 py-12 text-center text-gray-500">
              Select a destination to view details
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DestinationInfoPanel;
