import React from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  UserCheck, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle,
  Compass,
  FileText,
  IndianRupee
} from 'lucide-react';
import { AUTHORITY_OFFICE_DETAILS } from './citizenData';

export default function AuthorityContactCard({ parcel, lang = 'en' }) {
  const isHi = lang === 'hi';
  const office = AUTHORITY_OFFICE_DETAILS;

  const caseHandlers = [
    {
      role: "Boundary Survey & Geo-Tagging",
      roleHi: "सीमा सर्वेक्षण एवं जियो-टैगिंग",
      handler: "Survey of India & Field Kanungo",
      contact: "+91 98112-44590",
      icon: Compass,
      desc: "Handles ULPIN assignment, drone map discrepancies, and physical boundary pegs."
    },
    {
      role: "Section 3C Objections & Title Hearings",
      roleHi: "धारा 3C आपत्ति एवं मालिकाना सुनवाई",
      handler: "Shri S.K. Verma (Legal Nodal Officer, LAO)",
      contact: "cala-legal@gurugram.gov.in",
      icon: FileText,
      desc: "Coordinates objection filing, hearing notices, and Section 3G statutory determination orders."
    },
    {
      role: "Compensation Award & DBT Bank Payout",
      roleHi: "मुआवजा निर्धारण एवं डीबीटी भुगतान",
      handler: "District Treasury Officer & PFMS Helpdesk",
      contact: "pfms-treasury@hry.gov.in",
      icon: IndianRupee,
      desc: "Handles PFMS bank account KYC verification and RBI e-Kuber direct benefit disbursement."
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 font-mono flex items-center space-x-2">
              <span>{isHi ? "सक्षम प्राधिकारी संपर्क केंद्र" : "CONTACT MY COMPETENT AUTHORITY (CALA)"}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {isHi 
                ? "सीधे अपने जिला कलेक्टर, भू-अधिग्रहण अधिकारी एवं संबंधित नोडल अधिकारियों से संपर्क करें।"
                : "Official directory of the District Land Acquisition Officer and dedicated case handlers for your land parcel."}
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 text-purple-900 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5">
          <Phone className="w-3.5 h-3.5" />
          <span>Toll Free: 1800-180-2026</span>
        </div>
      </div>

      {/* Main Grid: Left Primary Office Card (6 cols), Right "Who is handling my case?" (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: District Land Acquisition Office */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Statutory Authority Office
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1">
              {isHi ? office.officeNameHi : office.officeName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">District: {office.district}</p>
          </div>

          {/* Key Officer */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {isHi ? "सक्षम भू-अधिग्रहण अधिकारी (CALA)" : "Competent Authority for Land Acquisition"}
            </span>
            <p className="font-black text-slate-900 text-sm">{office.officerName}</p>
            <p className="text-slate-600">{office.designation}</p>
          </div>

          {/* Contact Details List */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">{isHi ? "कार्यालय का पता" : "Office Address"}</span>
                <span className="text-slate-600 leading-relaxed">{office.officeAddress}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50">
              <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">{isHi ? "दूरभाष / हेल्पलाइन" : "Official Telephone"}</span>
                <span className="font-mono text-slate-600">{office.phone}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50">
              <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">{isHi ? "आधिकारिक ईमेल" : "Official Email"}</span>
                <span className="font-mono text-slate-600">{office.email}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">{isHi ? "कार्यालय समय एवं जनसुनवाई" : "Office & Public Hearing Hours"}</span>
                <span className="text-slate-600">{office.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Direct Action Buttons */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
            <a
              href="tel:+911242325501"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isHi ? "कॉल करें" : "Call Office"}</span>
            </a>

            <a
              href="mailto:dc-gurugram@hry.gov.in"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isHi ? "ईमेल भेजें" : "Send Email"}</span>
            </a>
          </div>
        </div>

        {/* Right Column: "Who is handling my case?" */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                Workflow Responsibility Matrix
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>{isHi ? "मेरे मामले की देखभाल कौन कर रहा है?" : "Who Is Handling My Case?"}</span>
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {caseHandlers.map((ch, idx) => {
              const Icon = ch.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 flex items-center space-x-1.5">
                      <Icon className="w-4 h-4 text-purple-600" />
                      <span>{isHi ? ch.roleHi : ch.role}</span>
                    </span>
                    <span className="text-[11px] font-mono text-purple-700 font-bold">{ch.contact}</span>
                  </div>

                  <p className="font-bold text-slate-800 text-xs pl-5.5">
                    {ch.handler}
                  </p>

                  <p className="text-[11px] text-slate-500 pl-5.5 leading-relaxed">
                    {ch.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs space-y-1">
            <span className="font-bold text-amber-950 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>{isHi ? "अधिकार-सम्पन्न नागरिक सहायता" : "Citizen Protection & Assistance"}</span>
            </span>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              {isHi 
                ? "नागरिकों को किसी भी मध्यस्थ या अनधिकृत व्यक्ति से संपर्क करने की आवश्यकता नहीं है। यह प्रणाली पारदर्शी रूप से संबंधित अधिकारियों से सीधे संपर्क स्थापित करती है।"
                : "Landowners are protected under the Citizens Charter. You do not need any intermediary or broker; every statutory action is directly accessible here."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
