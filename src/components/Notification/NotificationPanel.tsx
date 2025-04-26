import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Bell, Clock, Send } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Participant } from '../../data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const NotificationPanel: React.FC = () => {
  const { 
    buses, 
    participants,
    selectedBus, 
    setSelectedBus, 
    setActiveView,
    getParticipantsByBus
  } = useAppContext();
  
  const [messageTemplate, setMessageTemplate] = useState<string>(
    "Hi [name], the buses are leaving in 5 minutes. Please return to the pickup area now."
  );
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState<'all' | 'missing' | 'custom'>('all');
  
  // Generate list of participants based on selection criteria
  const updateFilteredParticipants = () => {
    if (!selectedBus) return;
    
    let filtered: Participant[] = [];
    const busParticipants = getParticipantsByBus(selectedBus.id);
    
    switch (notificationType) {
      case 'all':
        filtered = busParticipants;
        break;
      case 'missing':
        // Simulating "missing" participants as 30% of the bus participants
        // In a real implementation, this would check check-in/check-out status
        const missingCount = Math.floor(busParticipants.length * 0.3);
        filtered = busParticipants.slice(0, missingCount);
        break;
      case 'custom':
        // Keep previously selected participants
        filtered = busParticipants;
        break;
    }
    
    setFilteredParticipants(filtered);
    // For 'all' and 'missing', auto-select all filtered participants
    if (notificationType !== 'custom') {
      setSelectedParticipants(filtered.map(p => p.id));
    }
  };
  
  // Update filtered participants when bus or notification type changes
  React.useEffect(() => {
    updateFilteredParticipants();
  }, [selectedBus, notificationType]);
  
  const handleToggleParticipant = (participantId: string) => {
    setSelectedParticipants(prev => {
      if (prev.includes(participantId)) {
        return prev.filter(id => id !== participantId);
      } else {
        return [...prev, participantId];
      }
    });
  };
  
  const handleSelectAll = () => {
    setSelectedParticipants(filteredParticipants.map(p => p.id));
  };
  
  const handleDeselectAll = () => {
    setSelectedParticipants([]);
  };
  
  const sendNotification = () => {
    if (selectedParticipants.length === 0) {
      toast.error("Please select at least one participant");
      return;
    }
    
    // In a real implementation, this would call an API like Twilio
    // For now, we'll simulate the notification being sent
    toast.success(`Notifications sent to ${selectedParticipants.length} participants`);
    
    // Log for demonstration
    console.log("Sending notifications to:", selectedParticipants);
    console.log("Message template:", messageTemplate);
    
    // Show recipients in toast
    const recipients = participants
      .filter(p => selectedParticipants.includes(p.id))
      .map(p => p.name);
    
    toast(`Recipients: ${recipients.join(", ")}`, {
      duration: 5000,
    });
  };
  
  const replaceTemplateVariables = (template: string, participant: Participant) => {
    return template.replace(/\[name\]/g, participant.name);
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
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-nymphette-purple" />
            <CardTitle>Notification Center</CardTitle>
          </div>
          <CardDescription>Send notifications to tour participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
            
            {selectedBus && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification Type</label>
                  <Select
                    value={notificationType}
                    onValueChange={(value: 'all' | 'missing' | 'custom') => {
                      setNotificationType(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Participants</SelectItem>
                      <SelectItem value="missing">Missing Participants</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                  <Textarea
                    value={messageTemplate}
                    onChange={(e) => setMessageTemplate(e.target.value)}
                    placeholder="Enter your message here. Use [name] to insert participant name."
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Recommended to include time information in your message.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Recipients ({selectedParticipants.length})</h3>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSelectAll}
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDeselectAll}
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  
                  {filteredParticipants.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto rounded border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Participant</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Phone</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredParticipants.map(participant => (
                            <TableRow 
                              key={participant.id}
                              className="cursor-pointer"
                              onClick={() => handleToggleParticipant(participant.id)}
                            >
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedParticipants.includes(participant.id)}
                                  onChange={() => {}} // Handled by row click
                                  className="rounded border-gray-300"
                                />
                              </TableCell>
                              <TableCell>{participant.name}</TableCell>
                              <TableCell>{participant.id}</TableCell>
                              <TableCell>{participant.phone}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No participants available
                    </div>
                  )}
                </div>
                
                {selectedParticipants.length > 0 && (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">Preview</h3>
                    <div className="bg-white p-3 rounded border">
                      {participants.find(p => p.id === selectedParticipants[0]) && (
                        <div className="text-sm">
                          <div className="font-medium mb-1">To: {participants.find(p => p.id === selectedParticipants[0])?.name}</div>
                          <div className="p-3 bg-blue-50 rounded-lg text-gray-800">
                            {replaceTemplateVariables(
                              messageTemplate, 
                              participants.find(p => p.id === selectedParticipants[0])!
                            )}
                          </div>
                          {selectedParticipants.length > 1 && (
                            <div className="text-xs text-gray-500 mt-2">
                              + {selectedParticipants.length - 1} more recipients
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={sendNotification}
                  className="w-full bg-nymphette-purple hover:bg-nymphette-purpleDark"
                  disabled={selectedParticipants.length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Notifications ({selectedParticipants.length})
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;
