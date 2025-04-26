
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AddBusForm: React.FC = () => {
  const { setActiveView, addBus } = useAppContext();
  
  const [label, setLabel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [managerName, setManagerName] = useState('');
  const [errors, setErrors] = useState<{ label?: string; capacity?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { label?: string; capacity?: string } = {};
    let isValid = true;

    if (!label.trim()) {
      newErrors.label = 'Bus name is required';
      isValid = false;
    }

    if (!capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
      isValid = false;
    } else if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    addBus(label, Number(capacity), managerName || undefined);
    
    // Reset form
    setLabel('');
    setCapacity('');
    setManagerName('');
    
    // Return to dashboard
    setActiveView('dashboard');
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
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Bus</CardTitle>
          <CardDescription>Create a new bus for your tour</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="label">Bus Name/Label</Label>
              <Input 
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Bus 11, VIP Bus, etc."
                className={errors.label ? "border-red-500" : ""}
              />
              {errors.label && <p className="text-red-500 text-sm">{errors.label}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input 
                id="capacity"
                type="number" 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 50"
                min="1"
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager">Manager (Optional)</Label>
              <Input 
                id="manager"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="e.g. John Smith"
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-nymphette-purple hover:bg-nymphette-purpleDark"
            >
              Add Bus
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBusForm;
