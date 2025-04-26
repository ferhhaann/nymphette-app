
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QrReader from 'react-qr-scanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: Error) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [delay, setDelay] = useState(300);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const handleScanResult = (data: { text: string } | null) => {
    if (data && data.text) {
      onScan(data.text);
      setIsScanning(false);
      toast.success("QR Code scanned successfully");
    }
  };

  const handleScanError = (err: Error) => {
    setCameraError(`Camera error: ${err.message}`);
    onError(err);
    console.error("QR Scan Error:", err);
  };
  
  const handleManualSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (manualId.trim()) {
      onScan(manualId.trim());
      setManualId('');
      toast.success("ID submitted manually");
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center mb-4">
          {cameraError && (
            <p className="text-red-500 mb-2 text-sm">{cameraError}</p>
          )}
          
          {isScanning ? (
            <div className="space-y-4">
              <div className="w-full h-[250px] relative bg-gray-100 rounded-lg overflow-hidden">
                <QrReader
                  delay={delay}
                  style={{ width: '100%', height: '100%' }}
                  onError={handleScanError}
                  onScan={handleScanResult}
                  constraints={{
                    audio: false,
                    video: { facingMode: 'environment' }
                  }}
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-nymphette-purple opacity-50 z-10"></div>
              </div>
              <Button
                onClick={() => setIsScanning(false)}
                variant="outline"
                className="w-full"
              >
                Cancel Scanning
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Scan participant QR codes or enter their ID manually
              </p>
              
              <Button
                onClick={() => setIsScanning(true)}
                className="w-full bg-nymphette-purple text-white hover:bg-nymphette-purpleDark"
              >
                Start QR Scanner
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>
              
              <form onSubmit={handleManualSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="Enter participant ID"
                  className="flex-1 border rounded-md p-2"
                />
                <Button
                  type="submit"
                  className="bg-nymphette-purple text-white hover:bg-nymphette-purpleDark"
                >
                  Submit
                </Button>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
