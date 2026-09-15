import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeaderStats from './components/HeaderStats';
import GISMapView from './components/GISMapView';
import WorkflowPipeline from './components/WorkflowPipeline';
import CitizenPortal from './components/CitizenPortal';
import AwardGenerator from './components/AwardGenerator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BhuSathiChatbot from './components/BhuSathiChatbot';
import AuditLogModal from './components/AuditLogModal';
import ProposalSubmissionModal from './components/ProposalSubmissionModal';
import DocumentVaultModal from './components/DocumentVaultModal';
import LegalDisputesModal from './components/LegalDisputesModal';
import NotificationsModal from './components/NotificationsModal';
import AuthScreen from './components/AuthScreen';
import { PROJECTS_DATA, PARCELS_DATA } from './data/mockData';

export default function App() {
  // Authentication & RBAC state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('gis');
  const [projects, setProjects] = useState(PROJECTS_DATA);
  const [parcels, setParcels] = useState(PARCELS_DATA);
  const [selectedParcel, setSelectedParcel] = useState(PARCELS_DATA[0]);
  
  // Modals
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [targetStageFilter, setTargetStageFilter] = useState('ALL');

  // Stage sequence order for 10 Statutory Land Management stages
  const STAGE_ORDER = [
    'IDENTIFIED',
    'VERIFICATION',
    'PROPOSAL',
    'NOTICE',
    'COMPENSATION',
    'LEGAL',
    'APPROVAL',
    'ACQUIRED',
    'HANDOVER',
    'UTILIZATION'
  ];

  // Function to handle login success & scope default tab based on role
  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    setIsAuthenticated(true);

    const roleId = userObj?.roleObj?.id || 'SUPER_ADMIN';
    if (roleId === 'CITIZEN') {
      setActiveTab('citizen');
    } else {
      setActiveTab('gis');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Function to advance a parcel's acquisition stage through all statutory stages
  const handleAdvanceStage = (parcelId) => {
    setParcels(prevParcels => 
      prevParcels.map(p => {
        if (p.id === parcelId) {
          const currentIndex = STAGE_ORDER.indexOf(p.status);
          const nextIndex = currentIndex < STAGE_ORDER.length - 1 ? currentIndex + 1 : currentIndex;
          return { ...p, status: STAGE_ORDER[nextIndex] };
        }
        return p;
      })
    );
  };

  // Add new proposal dynamically
  const handleAddProposal = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  // If not authenticated, render the dedicated Login / Registration screen first
  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Navbar with RBAC Scoped Tabs & Modals */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuditLog={() => setIsAuditOpen(true)}
        onOpenProposalModal={() => setIsProposalModalOpen(true)}
        onOpenDocuments={() => setIsDocumentsOpen(true)}
        onOpenLegal={() => setIsLegalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Top Single Sleek KPI Metrics Bar */}
      <HeaderStats projects={projects} />

      {/* Main Tab Content */}
      <main className="flex-1 pb-12 mt-1">
        {activeTab === 'gis' && (
          <GISMapView 
            projects={projects} 
            parcels={parcels} 
            selectedParcel={selectedParcel} 
            setSelectedParcel={setSelectedParcel} 
          />
        )}

        {activeTab === 'workflow' && (
          <WorkflowPipeline 
            projects={projects} 
            parcels={parcels} 
            onAdvanceStage={handleAdvanceStage} 
            targetStageFilter={targetStageFilter}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal parcels={parcels} />
        )}

        {activeTab === 'award' && (
          <AwardGenerator parcels={parcels} projects={projects} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard projects={projects} parcels={parcels} />
        )}
      </main>

      {/* Bhu-Sathi AI Chatbot Widget */}
      <BhuSathiChatbot parcels={parcels} />

      {/* Modals */}
      <AuditLogModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
      <ProposalSubmissionModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onAddProposal={handleAddProposal}
      />
      <DocumentVaultModal
        isOpen={isDocumentsOpen}
        onClose={() => setIsDocumentsOpen(false)}
        parcels={parcels}
      />
      <LegalDisputesModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        parcels={parcels}
      />
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
