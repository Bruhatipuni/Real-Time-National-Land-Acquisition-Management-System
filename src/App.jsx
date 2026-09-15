import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeaderStats from './components/HeaderStats';
import GISMapView from './components/GISMapView';
import FieldSurveyStudio from './components/FieldSurveyStudio';
import LandDisputeRadar from './components/LandDisputeRadar';
import RouteSimulator from './components/RouteSimulator';
import WorkflowPipeline from './components/WorkflowPipeline';
import CitizenPortal from './components/CitizenPortal';
import AwardGenerator from './components/AwardGenerator';
import CentralMinistryCommandCenter from './components/CentralMinistryCommandCenter';
import BhuSathiChatbot from './components/BhuSathiChatbot';
import AuditLogModal from './components/AuditLogModal';
import ProposalSubmissionModal from './components/ProposalSubmissionModal';
import DocumentVaultModal from './components/DocumentVaultModal';
import LegalDisputesModal from './components/LegalDisputesModal';
import NotificationsModal from './components/NotificationsModal';
import RnRFamiliesModal from './components/RnRFamiliesModal';
import AuthScreen from './components/AuthScreen';
import { PROJECTS_DATA } from './data/mockData';
import { NATIONAL_PROJECTS, NATIONAL_PARCELS } from './data/nationalHierarchyData';

const DEFAULT_SURVEYOR_USER = {
  name: 'Anish Kumar (Senior Surveyor)',
  email: 'surveyor@bhusetu.gov.in',
  roleObj: {
    id: 'LAND_OFFICER',
    title: 'Field Surveyor & GIS Nodal',
    user: 'Anish Kumar (Senior Surveyor)',
    badge: 'FIELD INSPECTOR',
    department: 'Survey & Land Revenue Nodal'
  }
};

export default function App() {
  // Authentication & RBAC state (Defaulted to Field Surveyor & GIS Nodal as requested)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState(DEFAULT_SURVEYOR_USER);

  // Active Main Navigation Tab ('gis' | 'survey' | 'disputes' | 'simulator' | 'workflow' | 'citizen' | 'award' | 'analytics')
  const [activeTab, setActiveTab] = useState('gis');

  // National Projects and Parcels
  const [projects, setProjects] = useState(NATIONAL_PROJECTS);
  const [parcels, setParcels] = useState(NATIONAL_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState(NATIONAL_PARCELS[0]);
  
  // Modals
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRnROpen, setIsRnROpen] = useState(false);
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

    const roleId = userObj?.roleObj?.id || 'LAND_OFFICER';
    if (roleId === 'CITIZEN') {
      setActiveTab('citizen');
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

  // Function to advance a parcel's acquisition stage
  const handleAdvanceStage = (parcelId) => {
    const userRoleId = currentUser?.roleObj?.id || 'LAND_OFFICER';
    if (userRoleId === 'CITIZEN') {
      alert("Role-Based Access Control (RBAC): Only authorized Government Officers can advance statutory acquisition stages.");
      return;
    }

    setParcels(prevParcels => 
      prevParcels.map(p => {
        if (p.id === parcelId || p.landId === parcelId || p.ulpin === parcelId) {
          const currentIndex = STAGE_ORDER.indexOf(p.status);
          const nextIndex = currentIndex < STAGE_ORDER.length - 1 ? currentIndex + 1 : currentIndex;
          const nextStageId = STAGE_ORDER[nextIndex];
          const meta = STAGE_META[nextStageId] || { title: nextStageId, action: "Proceed to next statutory milestone" };

          return { 
            ...p, 
            status: nextStageId,
            acquisitionStatus: meta.title,
            expectedNextAction: meta.action
          };
        }
        return p;
      })
    );
  };

  // Update parcel coordinates & ground assets from Interactive Polygon Node Editor
  const handleSaveCoordinates = (parcelId, newNodes, groundAssets, status) => {
    setParcels(prev => prev.map(p => {
      if (p.id === parcelId || p.landId === parcelId || p.ulpin === parcelId) {
        return {
          ...p,
          coordinates: newNodes,
          groundAssets: groundAssets || p.groundAssets,
          surveyStatus: status || p.surveyStatus
        };
      }
      return p;
    }));

    if (selectedParcel && (selectedParcel.id === parcelId || selectedParcel.ulpin === parcelId)) {
      setSelectedParcel(prev => ({
        ...prev,
        coordinates: newNodes,
        groundAssets: groundAssets || prev.groundAssets,
        surveyStatus: status || prev.surveyStatus
      }));
    }
  };

  // Function to add new proposal
  const handleAddProposal = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  // If not authenticated, render Login screen
  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Sovereign Header + Officer Profile + Nav Bar */}
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
        onOpenRnRFamilies={() => setIsRnROpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12 mt-1">
        {/* TAB 1: HOME / GIS MAP */}
        {activeTab === 'gis' && (
          <GISMapView 
            projects={projects} 
            parcels={parcels} 
            selectedParcel={selectedParcel} 
            setSelectedParcel={setSelectedParcel}
            onNavigateToSimulator={() => setActiveTab('simulator')}
            onNavigateToDisputes={() => setActiveTab('disputes')}
            onLogAudit={(log) => console.log('BhuStack Audit:', log)}
          />
        )}

        {/* TAB 2: FIELD SURVEY & DEMARCATION STUDIO */}
        {activeTab === 'survey' && (
          <FieldSurveyStudio
            parcels={parcels}
            selectedParcel={selectedParcel}
            setSelectedParcel={setSelectedParcel}
            onSaveCoordinates={handleSaveCoordinates}
            onNavigateToDisputes={() => setActiveTab('disputes')}
            onLogAudit={(log) => console.log('BhuStack Audit:', log)}
          />
        )}

        {/* TAB 3: PERSON-TO-PERSON LAND DISPUTE RADAR */}
        {activeTab === 'disputes' && (
          <LandDisputeRadar
            onSelectParcelForInspection={(plot) => {
              const matched = parcels.find(p => (p.plotNumber || p.surveyNo) === plot);
              if (matched) setSelectedParcel(matched);
              setActiveTab('gis');
            }}
          />
        )}

        {/* TAB 4: PRE-ACQUISITION ALTERNATIVE ROUTE SIMULATOR */}
        {activeTab === 'simulator' && (
          <RouteSimulator
            onInspectParcel={(parcelId) => {
              const matched = parcels.find(p => p.id === parcelId || p.ulpin === parcelId);
              if (matched) setSelectedParcel(matched);
              setActiveTab('gis');
            }}
          />
        )}

        {/* TAB 5: STATUTORY 10-STAGE WORKFLOW PIPELINE */}
        {activeTab === 'workflow' && (
          <WorkflowPipeline 
            projects={projects} 
            parcels={parcels} 
            onAdvanceStage={handleAdvanceStage} 
            targetStageFilter={targetStageFilter}
          />
        )}

        {/* TAB 6: CITIZEN PORTAL */}
        {activeTab === 'citizen' && (
          <CitizenPortal 
            parcels={parcels} 
            selectedParcel={selectedParcel}
            setSelectedParcel={setSelectedParcel}
          />
        )}

        {/* TAB 7: AWARD CERTIFICATE GENERATOR */}
        {activeTab === 'award' && (
          <AwardGenerator parcels={parcels} projects={projects} />
        )}

        {/* TAB 8: NATIONAL COMMAND CENTER */}
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
                <span className="text-white font-mono font-black text-sm tracking-wide">BHUSETU</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400 font-medium text-xs">National Land Acquisition & Management Platform</span>
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
              <span className="hover:text-amber-400 transition-colors cursor-pointer">NIC Sovereign Cloud</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
            <div>
              © 2026 Ministry of Rural Development & MoRTH. Smart India Hackathon (SIH 2026 Problem Statement ID: 26016).
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>Role: Field Surveyor &amp; GIS Nodal (Online)</span>
            </div>
          </div>
        </div>
        <div className="gov-tricolor-bar" />
      </footer>

      {/* Floating Bhu-Sathi AI Decision Support Assistant */}
      <BhuSathiChatbot 
        parcels={parcels} 
        selectedParcel={selectedParcel}
      />

      {/* Modals */}
      <AuditLogModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
      <RnRFamiliesModal isOpen={isRnROpen} onClose={() => setIsRnROpen(false)} projects={projects} />
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
