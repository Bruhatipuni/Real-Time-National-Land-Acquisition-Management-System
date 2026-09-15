import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeaderStats from './components/HeaderStats';
import GISMapView from './components/GISMapView';
import WorkflowPipeline from './components/WorkflowPipeline';
import CitizenPortal from './components/CitizenPortal';
import AwardGenerator from './components/AwardGenerator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CentralMinistryCommandCenter from './components/CentralMinistryCommandCenter';
import BhuSathiChatbot from './components/BhuSathiChatbot';
import AuditLogModal from './components/AuditLogModal';
import ProposalSubmissionModal from './components/ProposalSubmissionModal';
import DocumentVaultModal from './components/DocumentVaultModal';
import LegalDisputesModal from './components/LegalDisputesModal';
import NotificationsModal from './components/NotificationsModal';
import MunicipalOfficerDashboard from './components/MunicipalOfficerDashboard';
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
    } else if (roleId === 'MUNICIPAL_OFFICER') {
      setActiveTab('municipal');
    } else if (roleId === 'SUPER_ADMIN') {
      setActiveTab('analytics');
    } else {
      setActiveTab('gis');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Stage titles and expected next actions dictionary
  const STAGE_META = {
    IDENTIFIED: { title: "Land Identification", action: "Initiate Khata revenue record encumbrance verification & Aadhaar authentication" },
    VERIFICATION: { title: "Land Verification", action: "Upload land revenue record (Khatauni) and conduct Field Surveyor inspection" },
    PROPOSAL: { title: "Acquisition Proposal", action: "Submit corridor acquisition proposal for District Collector scrutiny" },
    NOTICE: { title: "Notifications / Notice", action: "Publish Section 3A e-Gazette notification and issue public stakeholder notice" },
    COMPENSATION: { title: "Compensation Process", action: "Calculate RFCTLARR 2013 100% solatium award & verify PFMS bank account for DBT" },
    LEGAL: { title: "Legal / Objections", action: "Conduct Section 3C public objection hearing & resolve High Court stay disputes" },
    APPROVAL: { title: "Approval / Acquisition", action: "Obtain District Collector & State Admin approval for Section 3G statutory award" },
    ACQUIRED: { title: "Land Acquired", action: "Execute statutory vesting order & issue acquisition completion certificate" },
    HANDOVER: { title: "Land Handover", action: "Issue Land Possession Certificate & execute R&R plot allotment" },
    UTILIZATION: { title: "Project Utilization", action: "Monitor post-acquisition corridor construction & quarterly drone inspection" }
  };

  // Function to advance a parcel's acquisition stage through all statutory stages
  const handleAdvanceStage = (parcelId) => {
    const userRoleId = currentUser?.roleObj?.id || 'SUPER_ADMIN';
    if (userRoleId === 'CITIZEN') {
      alert("Role-Based Access Control (RBAC): Only authorized Government Officers can advance statutory acquisition stages.");
      return;
    }

    setParcels(prevParcels => 
      prevParcels.map(p => {
        if (p.id === parcelId || p.landId === parcelId) {
          const currentIndex = STAGE_ORDER.indexOf(p.status);
          const nextIndex = currentIndex < STAGE_ORDER.length - 1 ? currentIndex + 1 : currentIndex;
          const nextStageId = STAGE_ORDER[nextIndex];
          const meta = STAGE_META[nextStageId] || { title: nextStageId, action: "Proceed to next statutory milestone" };

          // Update approval stepper state
          const updatedApprovals = (p.approvals || []).map((app, idx) => {
            if (idx <= nextIndex / 2) {
              return { ...app, status: 'COMPLETED' };
            } else if (idx === Math.ceil(nextIndex / 2)) {
              return { ...app, status: 'PENDING' };
            }
            return { ...app, status: 'NOT_STARTED' };
          });

          return { 
            ...p, 
            status: nextStageId,
            acquisitionStatus: meta.title,
            expectedNextAction: meta.action,
            approvals: updatedApprovals
          };
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
          <CitizenPortal 
            parcels={parcels} 
            selectedParcel={selectedParcel}
            setSelectedParcel={setSelectedParcel}
          />
        )}

        {activeTab === 'municipal' && (
          <MunicipalOfficerDashboard 
            currentUser={currentUser}
          />
        )}

        {activeTab === 'award' && (
          <AwardGenerator parcels={parcels} projects={projects} />
        )}

        {activeTab === 'analytics' && (
          <CentralMinistryCommandCenter projects={projects} parcels={parcels} />
        )}
      </main>

      {/* Official Government Portal Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono font-black text-sm tracking-wide">BHOOMI<span className="text-amber-500">SETU</span></span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400 font-medium text-xs">National Land Acquisition & Management System</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Designed & Developed for Ministry of Rural Development & MoRTH • Government of India
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span className="hover:text-amber-400 transition-colors cursor-pointer">DILRMP 3.0</span>
              <span>•</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">PM Gati Shakti NMP</span>
              <span>•</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">Bhu-Aadhaar (ULPIN)</span>
              <span>•</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">NIC Cloud Platform</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
            <div>
              © 2026 Ministry of Rural Development & MoRTH. Content owned & maintained by Land Reforms Division.
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>Gateway: Online (200 OK)</span>
            </div>
          </div>
        </div>
        <div className="gov-tricolor-bar" />
      </footer>

      {/* Bhu-Sathi AI Chatbot Widget */}
      <BhuSathiChatbot 
        parcels={parcels} 
        selectedParcel={selectedParcel}
      />

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
