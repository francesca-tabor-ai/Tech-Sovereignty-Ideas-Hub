
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Bell, 
  Lock, 
  Settings as SettingsIcon, 
  Sparkles, 
  X, 
  TrendingUp, 
  MessageSquare, 
  Calendar, 
  ShieldAlert, 
  Fingerprint, 
  Database, 
  Cpu as CpuIcon, 
  Key, 
  Globe, 
  ChevronRight 
} from 'lucide-react';
import { User } from '../types';

interface SettingsPageProps {
  user: User | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [alerts, setAlerts] = useState({
    votes: true,
    comments: true,
    events: true,
    strategic: false
  });

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700">
      <header className="pt-12 space-y-2">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          <SettingsIcon size={12} />
          <span>Control Center</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hub Settings</h1>
        <p className="text-slate-500">Configure your terminal and institutional identity preferences.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex min-h-[600px]">
        {/* Modal Sidebar (Now Page Sidebar) */}
        <aside className="w-64 bg-slate-50 border-r border-slate-100 p-10 flex flex-col space-y-8">
           <nav className="flex-1 flex flex-col space-y-6">
             {[
               { id: 'profile', label: 'Identity', icon: UserIcon },
               { id: 'alerts', label: 'Intelligence', icon: Bell },
               { id: 'security', label: 'Security', icon: Lock },
               { id: 'hub', label: 'Hub Config', icon: SettingsIcon }
             ].map(item => (
               <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-4 text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === item.id 
                      ? 'text-indigo-600 scale-105 origin-left' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
               >
                  <item.icon size={18} className={activeTab === item.id ? 'animate-pulse' : ''} />
                  <span>{item.label}</span>
               </button>
             ))}
           </nav>
        </aside>

        {/* Page Content Body */}
        <main className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-white">
           {activeTab === 'profile' && (
             <div className="space-y-12 animate-in fade-in duration-300">
                <div className="flex items-center space-x-8">
                   <div className="relative group">
                     <img src={user?.avatar || 'https://picsum.photos/seed/guest/80'} className="w-24 h-24 rounded-[2rem] border-4 border-slate-50 shadow-xl group-hover:opacity-75 transition-opacity" alt="" />
                     <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Sparkles size={24} className="text-white drop-shadow-md" />
                     </button>
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name || 'Institutional Guest'}</h3>
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">{user?.role || 'External Stakeholder'}</p>
                   </div>
                   <button className="ml-auto bg-slate-100 text-slate-600 border border-slate-200 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">Replace Digital Mask</button>
                </div>

                <div className="grid grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Organization</label>
                      <input readOnly value={user?.organization || 'N/A'} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-none text-sm font-bold text-slate-700 shadow-inner" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sovereign Jurisdiction</label>
                      <select className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-none text-sm font-bold text-slate-700 shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>European Economic Area</option>
                        <option>North American Alliance</option>
                        <option>Asia-Pacific Corridor</option>
                        <option>Global South Registry</option>
                      </select>
                   </div>
                   <div className="col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Mandate (Bio)</label>
                      <textarea placeholder="Outline your institutional focus..." rows={4} className="w-full bg-slate-50 px-6 py-4 rounded-3xl border-none text-sm font-medium text-slate-700 shadow-inner resize-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end">
                   <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">Update identity</button>
                </div>
             </div>
           )}

           {activeTab === 'alerts' && (
             <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Intelligence Configuration</h3>
                  <p className="text-slate-400 text-sm font-medium">Manage how strategic signals are transmitted to your terminal.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'votes', label: 'Registry Endorsements', desc: 'Alert when institutional partners endorse your proposals.', icon: TrendingUp },
                    { id: 'comments', label: 'Peer Deliberations', desc: 'Notification for new critiques or refinements on active drafts.', icon: MessageSquare },
                    { id: 'events', label: 'Summit Invitations', desc: 'Broadcasts for board reviews and working group convenings.', icon: Calendar },
                    { id: 'strategic', label: 'Geopolitical Shocks', desc: 'High-priority alerts for simulated supply chain perturbations.', icon: ShieldAlert }
                  ].map(item => (
                    <div key={item.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                      <div className="flex items-center space-x-5">
                        <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:text-indigo-600 group-hover:shadow-md transition-all">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{item.label}</h4>
                          <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <Toggle 
                        active={(alerts as any)[item.id]} 
                        onToggle={() => setAlerts(prev => ({ ...prev, [item.id]: !(prev as any)[item.id] }))} 
                      />
                    </div>
                  ))}
                </div>
             </div>
           )}

           {activeTab === 'security' && (
             <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Security & Integrity</h3>
                  <p className="text-slate-400 text-sm font-medium">Manage your sovereign keys and institutional credentials.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
                    <div className="flex items-center space-x-3 text-indigo-300">
                      <Fingerprint size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sovereign Digital ID</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter mb-2">Authenticated HASH</p>
                      <code className="text-xs font-mono bg-black/20 p-3 rounded-xl block truncate">0x72a8b9f12d4c6e8a0b9f12d4c6e8a</code>
                    </div>
                    <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Rotate Private Key</button>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 space-y-6">
                    <div className="flex items-center space-x-3 text-indigo-600">
                      <Lock size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Session Control</span>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-500">Global Encryption (E2EE)</span>
                         <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Active</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-500">MFA Validation</span>
                         <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">Recommended</span>
                       </div>
                    </div>
                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl">Revoke Current Session</button>
                  </div>
                </div>
                
                <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex items-start space-x-4">
                  <ShieldAlert className="text-rose-600 shrink-0" size={20} />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest">Emergency Revocation</h4>
                    <p className="text-[11px] text-rose-700 leading-relaxed">Instantly purge all local data residency and active connections across all Hub instances.</p>
                    <button className="text-[10px] font-black text-rose-600 hover:text-rose-900 uppercase tracking-widest pt-2 flex items-center space-x-1">
                      <span>Execute Wipe</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'hub' && (
             <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Hub Configuration</h3>
                  <p className="text-slate-400 text-sm font-medium">Fine-tune your terminal's interface and regional dependencies.</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Visuals</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="p-4 rounded-2xl border-2 border-indigo-600 bg-white shadow-lg text-left group">
                         <div className="w-8 h-8 rounded-lg bg-slate-100 mb-4 group-hover:scale-110 transition-transform"></div>
                         <p className="text-[10px] font-black uppercase">Institutional</p>
                         <p className="text-[9px] text-slate-400 font-bold">Standard Light</p>
                       </button>
                       <button className="p-4 rounded-2xl border border-slate-100 bg-slate-900 text-left group">
                         <div className="w-8 h-8 rounded-lg bg-slate-800 mb-4 group-hover:scale-110 transition-transform"></div>
                         <p className="text-[10px] font-black uppercase text-white">Stealth</p>
                         <p className="text-[9px] text-slate-500 font-bold">Strategic Dark</p>
                       </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Compute Dependency</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'res-eu', label: 'EEA High Availability', sub: 'Low Latency, High Compliance', icon: Globe },
                        { id: 'res-us', label: 'US-West Genesis', sub: 'Hyperscale Performance', icon: CpuIcon },
                        { id: 'res-custom', label: 'Local Cold Storage', sub: 'Max Sovereignty, High Latency', icon: Database }
                      ].map(res => (
                        <button key={res.id} className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center space-x-4 hover:border-indigo-200 hover:bg-white transition-all text-left">
                          <res.icon size={16} className="text-slate-400" />
                          <div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{res.label}</p>
                            <p className="text-[9px] text-slate-400 font-bold">{res.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600">
                      <Key size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-indigo-900">API Gateway Management</h4>
                      <p className="text-xs text-indigo-600 font-medium">Manage external connectors for regional cloud registries.</p>
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">Open Gateway</button>
                </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
