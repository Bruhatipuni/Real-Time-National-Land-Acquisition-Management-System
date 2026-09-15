import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  Compass, 
  UserCheck, 
  Key,
  Briefcase
} from 'lucide-react';
import { PRESET_ROLES } from './LoginModal';

export default function AuthScreen({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('MINISTRY');
  const [department, setDepartment] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const roleObj = PRESET_ROLES.find(r => r.id === selectedRoleId) || PRESET_ROLES[0];
    onLoginSuccess({
      name: fullName || roleObj.user,
      email: email || `${selectedRoleId.toLowerCase()}@bhoomisetu.gov.in`,
      roleObj
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      alert("Please fill in your Name, Email, and Password.");
      return;
    }

    const roleObj = PRESET_ROLES.find(r => r.id === selectedRoleId) || PRESET_ROLES[0];
    const newUser = {
      name: fullName,
      email: email,
      department: department || roleObj.department,
      roleObj: {
        ...roleObj,
        user: fullName
      }
    };

    setRegSuccess(true);
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1500);
  };

  const handleQuickRoleLogin = (roleId) => {
    const roleObj = PRESET_ROLES.find(r => r.id === roleId);
    onLoginSuccess({
      name: roleObj.user,
      email: `${roleId.toLowerCase()}@bhoomisetu.gov.in`,
      roleObj
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full space-y-6 z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-amber-500/20">
            <Building2 className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-3xl font-black font-mono tracking-tight text-white">
            BHOOMI<span className="text-amber-500">SETU</span>
          </h1>
          <p className="text-sm font-black text-amber-400 italic">
            "Your Land, Our Responsibility"
          </p>
          <p className="text-xs text-slate-400">
            National Land Acquisition & Management Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => { setIsRegister(false); setRegSuccess(false); }}
              className={`py-2 rounded-lg transition-all ${!isRegister ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In (Login)
            </button>
            <button
              onClick={() => { setIsRegister(true); setRegSuccess(false); }}
              className={`py-2 rounded-lg transition-all ${isRegister ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Register Account
            </button>
          </div>

          {!regSuccess ? (
            !isRegister ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="officer@bhoomisetu.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Access Role</label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    {PRESET_ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.title} ({r.badge})</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>Authenticate & Enter System</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick Persona Logins */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Quick One-Click Demo Access</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESET_ROLES.map((role) => (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => handleQuickRoleLogin(role.id)}
                        className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2 rounded-lg text-[10px] text-slate-300 hover:text-white font-medium text-left truncate transition-colors cursor-pointer"
                      >
                        ⚡ {role.title}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Dr. Ramesh Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Official Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="name@domain.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Role / Designation</label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    {PRESET_ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Department / Organization</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. District Collector Office, Gurugram"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Set Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer mt-2"
                >
                  <span>Create Account & Grant RBAC Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-sm font-bold text-white">Registration Successful!</h4>
              <p className="text-xs text-slate-400">
                Encrypted RBAC identity generated. Launching BHOOMISETU Platform...
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          Encrypted OAuth2 / DILRMP 3.0 National Single Sign-On Gateway
        </div>
      </div>
    </div>
  );
}
