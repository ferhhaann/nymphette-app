
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
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

const Index = () => {
  const { 
    activeView, 
    setActiveView, 
    setSelectedBus 
  } = useAppContext();
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="animate-pulse text-blue-200 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  // If authentication check is complete and user is not logged in, component will redirect

  return (
    <div className="flex h-screen bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
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
              <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6 shadow-xl">
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
          {activeView === 'userManagement' && <UserManagementPanel />}
        </div>
      </div>
    </div>
  );
};

export default Index;
