
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import BusList from '../components/Dashboard/BusList';
import BusAssignmentModule from '../components/BusAssignment/BusAssignmentModule';
import ETATrackerModule from '../components/ETATracker/ETATrackerModule';
import DestinationInfoPanel from '../components/DestinationInfo/DestinationInfoPanel';
import AddBusForm from '../components/Bus/AddBusForm';
import NotificationPanel from '../components/Notification/NotificationPanel';
import BulkUploadForm from '../components/Participant/BulkUploadForm';
import { Bus } from '../data/mockData';

const Index = () => {
  const { 
    activeView, 
    setActiveView, 
    setSelectedBus 
  } = useAppContext();

  const handleAssignClick = () => {
    setActiveView('busAssignment');
  };

  const handleETAClick = () => {
    setActiveView('etaTracker');
  };

  const handleInfoClick = () => {
    setActiveView('destination');
  };

  const handleAddBusClick = () => {
    setActiveView('addBus');
  };

  const handleNotificationsClick = () => {
    setActiveView('notifications');
  };

  const handleBulkUploadClick = () => {
    setActiveView('bulkUpload');
  };

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    // Default to bus assignment view when selecting a bus from the dashboard
    setActiveView('busAssignment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900">
      <div className="container mx-auto p-4">
        {activeView === 'dashboard' && (
          <>
            <DashboardHeader 
              onAssignClick={handleAssignClick}
              onETAClick={handleETAClick}
              onInfoClick={handleInfoClick}
              onAddBusClick={handleAddBusClick}
              onNotificationsClick={handleNotificationsClick}
              onBulkUploadClick={handleBulkUploadClick}
            />
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 p-4">
              <BusList onSelectBus={handleSelectBus} />
            </div>
          </>
        )}
        
        {activeView === 'busAssignment' && <BusAssignmentModule />}
        {activeView === 'etaTracker' && <ETATrackerModule />}
        {activeView === 'destination' && <DestinationInfoPanel />}
        {activeView === 'addBus' && <AddBusForm />}
        {activeView === 'notifications' && <NotificationPanel />}
        {activeView === 'bulkUpload' && <BulkUploadForm />}
      </div>
    </div>
  );
};

export default Index;
