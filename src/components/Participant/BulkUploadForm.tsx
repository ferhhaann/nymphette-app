
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'sonner';

const BulkUploadForm: React.FC = () => {
  const { setActiveView } = useAppContext();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      const text = await file.text();
      const rows = text.split('\n');
      const validRows = rows.filter(row => row.trim()); // Remove empty rows

      if (validRows.length === 0) {
        toast.error('The file appears to be empty');
        return;
      }

      // TODO: Process the CSV data and add participants
      // For now, just show a success message
      toast.success(`Successfully processed ${validRows.length - 1} participants`);
      setActiveView('dashboard');
    } catch (error) {
      toast.error('Error processing file');
      console.error('Error:', error);
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
      
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Participants</CardTitle>
          <CardDescription>
            Upload a CSV file containing participant information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Upload className="mr-2 h-4 w-4" />
                {file ? file.name : 'Choose CSV file'}
              </label>
              <p className="mt-2 text-xs text-gray-500">
                Format: Name, Phone Number, Unique ID
              </p>
            </div>
            
            <Button 
              onClick={handleUpload}
              disabled={!file}
              className="w-full bg-nymphette-purple hover:bg-nymphette-purpleDark"
            >
              Upload and Process
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadForm;
