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
import QRScanner from '../QRScanner/QRScanner';

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
  const [showScanner, setShowScanner] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busParticipants, setBusParticipants] = useState<Participant[]>([]);
  
  useEffect(() => {
    if (selectedBus) {
      setBusParticipants(getParticipantsByBus(selectedBus.id));
    } else {
      setBusParticipants([]);
    }
  }, [selectedBus, getParticipantsByBus]);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const participant = searchParticipant(searchTerm);
    setScannedParticipant(participant);
    
    setTimeout(() => {
      setSearchTerm('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  const handleQRScan = (data: string) => {
    const participant = searchParticipant(data);
    setScannedParticipant(participant);
    setShowScanner(false);
  };
  
  const handleQRError = (error: Error) => {
    console.error("QR Scan Error:", error);
  };
  
  const handleAssign = () => {
    if (!selectedBus || !scannedParticipant) return;
    
    const success = assignParticipant(scannedParticipant.id, selectedBus.id);
    
    if (success) {
      setBusParticipants(getParticipantsByBus(selectedBus.id));
      setScannedParticipant(null);
    }
  };
  
  const handleRemove = (participant: Participant) => {
    removeParticipantFromBus(participant.id);
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
        className="mb-6 hover:bg-blue-50"
        onClick={() => setActiveView('dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <Card className="mb-6 border-blue-100 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="text-2xl text-navy-800">Bus Assignment</CardTitle>
          <CardDescription className="text-gray-600">Manage participant assignments to buses</CardDescription>
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
                <SelectTrigger className="w-full bg-white border-blue-200 hover:border-blue-300">
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
            
            {selectedBus && !showScanner && (
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Search Participant
                  </label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50"
                    onClick={() => setShowScanner(true)}
                  >
                    Use QR Scanner
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter ID, name or phone"
                    className="flex-1 border-blue-200 focus:border-blue-400"
                  />
                  <Button 
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="h-4 w-4 mr-2" /> Search
                  </Button>
                </div>
              </div>
            )}
            
            {selectedBus && showScanner && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">QR Scanner</label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50"
                    onClick={() => setShowScanner(false)}
                  >
                    Manual Entry
                  </Button>
                </div>
                <QRScanner onScan={handleQRScan} onError={handleQRError} />
              </div>
            )}
            
            {scannedParticipant && (
              <div className="mt-4">
                <div className="bg-white p-4 rounded-md border border-blue-100 shadow-sm">
                  <div className="font-medium text-navy-800">{scannedParticipant.name}</div>
                  <div className="text-sm text-gray-600">ID: {scannedParticipant.id}</div>
                  <div className="text-sm text-gray-600">Phone: {scannedParticipant.phone}</div>
                  <div className="text-sm mt-1">
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
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
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
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-navy-800">
                {selectedBus.label} Participants
              </CardTitle>
              <CardDescription>
                {busParticipants.length} / {selectedBus.capacity} participants assigned
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {busParticipants.length > 0 ? (
              <div className="border border-blue-100 rounded-md divide-y divide-blue-100">
                {busParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 hover:bg-blue-50">
                    <div>
                      <div className="font-medium text-navy-800">{participant.name}</div>
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
