
import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, UserCheck, UserMinus, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Participant } from '../../data/mockData';

const BusAssignmentModule: React.FC = () => {
  const { 
    buses, 
    selectedBus, 
    setSelectedBus, 
    setActiveView,
    getParticipantsByBus,
    assignParticipant,
    removeParticipantFromBus,
    searchParticipant
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [scannedParticipant, setScannedParticipant] = useState<Participant | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busParticipants, setBusParticipants] = useState<Participant[]>([]);
  
  // Update participants list when selected bus changes
  useEffect(() => {
    if (selectedBus) {
      setBusParticipants(getParticipantsByBus(selectedBus.id));
    } else {
      setBusParticipants([]);
    }
  }, [selectedBus, getParticipantsByBus]);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const participant = searchParticipant(searchTerm);
    setScannedParticipant(participant);
    
    // Auto-clear search term
    setTimeout(() => {
      setSearchTerm('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  const handleAssign = () => {
    if (!selectedBus || !scannedParticipant) return;
    
    const success = assignParticipant(scannedParticipant.id, selectedBus.id);
    
    if (success) {
      // Update the local bus participants list
      setBusParticipants(getParticipantsByBus(selectedBus.id));
      // Clear the scanned participant
      setScannedParticipant(null);
    }
  };
  
  const handleRemove = (participant: Participant) => {
    removeParticipantFromBus(participant.id);
    // Update the local bus participants list
    if (selectedBus) {
      setBusParticipants(getParticipantsByBus(selectedBus.id));
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
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
          <CardTitle>Bus Assignment</CardTitle>
          <CardDescription>Assign participants to buses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Bus</label>
              <Select
                value={selectedBus?.id || ''}
                onValueChange={(value) => {
                  const bus = buses.find(b => b.id === value);
                  setSelectedBus(bus || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a bus" />
                </SelectTrigger>
                <SelectContent>
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.label} ({getParticipantsByBus(bus.id).length}/{bus.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participant ID / Name / Phone
              </label>
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scan or enter participant info"
                  className="flex-1"
                />
                <Button onClick={handleSearch} type="button">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </div>
            
            {scannedParticipant && (
              <div className="mt-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="font-medium">{scannedParticipant.name}</div>
                  <div className="text-sm text-gray-600">ID: {scannedParticipant.id}</div>
                  <div className="text-sm text-gray-600">Phone: {scannedParticipant.phone}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {scannedParticipant.bus_id ? (
                      <div className="flex items-center text-amber-600">
                        <Users className="h-4 w-4 mr-1" />
                        Currently assigned to Bus {scannedParticipant.bus_id}
                      </div>
                    ) : (
                      <div className="text-gray-600">Not assigned to any bus</div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <Button 
                      disabled={!selectedBus || (scannedParticipant.bus_id === selectedBus?.id)}
                      onClick={handleAssign}
                      className="w-full bg-nymphette-purple hover:bg-nymphette-purpleDark"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      {scannedParticipant.bus_id ? 'Reassign to This Bus' : 'Assign to This Bus'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {selectedBus && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Participants on {selectedBus.label}</CardTitle>
              <CardDescription>
                {busParticipants.length} / {selectedBus.capacity} participants assigned
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {busParticipants.length > 0 ? (
              <div className="border rounded-md divide-y">
                {busParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3">
                    <div>
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-sm text-gray-600">ID: {participant.id}</div>
                      <div className="text-sm text-gray-600">Phone: {participant.phone}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemove(participant)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No participants assigned to this bus yet
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusAssignmentModule;
