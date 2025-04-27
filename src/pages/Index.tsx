
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import BusList from '../components/Dashboard/BusList';
import BusAssignmentModule from '../components/BusAssignment/BusAssignmentModule';
import ETATrackerModule from '../components/ETATracker/ETATrackerModule';
import DestinationInfoPanel from '../components/DestinationInfo/DestinationInfoPanel';
import AddBusForm from '../components/Bus/AddBusForm';
import NotificationPanel from '../components/Notification/NotificationPanel';
import BulkUploadForm from '../components/Participant/BulkUploadForm';
import UserManagementPanel from '../components/UserManagement/UserManagementPanel';
import Sidebar from '../components/Dashboard/Sidebar';
import { Bus } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import TourManagement from '../components/Tour/TourManagement';
import ItineraryManagement from '../components/Tour/ItineraryManagement';

const Index = () => {
  const { 
    activeView, 
    setActiveView, 
    setSelectedBus 
  } = useAppContext();
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    setActiveView('busAssignment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="animate-pulse text-blue-200 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {activeView === 'dashboard' && (
            <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6 shadow-xl">
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-100 via-purple-200 to-blue-100 bg-clip-text text-transparent">
                Tour Dashboard
              </h1>
              <BusList onSelectBus={handleSelectBus} />
            </div>
          )}
          
          {activeView === 'busAssignment' && <BusAssignmentModule />}
          {activeView === 'etaTracker' && <ETATrackerModule />}
          {activeView === 'destination' && <DestinationInfoPanel />}
          {activeView === 'addBus' && <AddBusForm />}
          {activeView === 'notifications' && <NotificationPanel />}
          {activeView === 'bulkUpload' && <BulkUploadForm />}
          {activeView === 'userManagement' && <UserManagementPanel />}
          {activeView === 'tourManagement' && <TourManagement />}
          {activeView === 'itineraryManagement' && <ItineraryManagement />}
        </div>
      </div>
    </div>
  );
};

export default Index;
