
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  MapPin, 
  Building, 
  ShieldCheck, 
  ExternalLink, 
  Users, 
  Quote, 
  Cpu, 
  Cloud, 
  Shield, 
  Database, 
  Satellite, 
  Sparkles, 
  Layers,
  ChevronRight,
  Mail,
  Zap,
  Award,
  X,
  Send,
  Handshake,
  Loader2,
  FileCheck
} from 'lucide-react';
import { MOCK_ORGANISATIONS } from '../constants';
import { TechCategory } from '../types';

const PartnershipModal = ({ isOpen, onClose, orgName }: { isOpen: boolean; onClose: () => void; orgName: string }) => {
  const [step, setStep] = useState<'form' | 'transmitting' | 'success'>('form');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    type: 'Strategic Alliance',
    message: '',
    urgency: 'Standard'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('transmitting');
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStep('success');
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg">
                <Handshake size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black text-slate-950 tracking-tight">Partnership Protocol</h2>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Target: {orgName}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-950">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 min-h-[400px]">
          {step === 'form' && (
            <form id="partnershipForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alliance Category</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>Strategic Alliance</option>
                  <option>Technical Integration</option>
                  <option>Policy Co-authorship</option>
                  <option>Infrastructure Sharing</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Urgency</label>
                <div className="flex gap-3">
                  {['Standard', 'Priority', 'Critical'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({...formData, urgency: level})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        formData.urgency === level 
                          ? 'bg-slate-950 text-white border-slate-950 shadow-lg' 
                          : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Rationale</label>
                <textarea 
                  required
                  placeholder="Outline the mutual sovereignty benefits..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-medium text-slate-700 leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
                />
              </div>
            </form>
          )}

          {step === 'transmitting' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
               <div className="relative">
                 <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
                 <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative z-10 animate-bounce">
                    <Send size={48} />
                 </div>
               </div>
               <div className="space-y-4 w-full max-w-xs">
                 <h3 className="text-2xl font-black text-slate-950">Transmitting Request</h3>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
                 </div>
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] font-mono animate-pulse">Establishing Secure Handshake...</p>
               </div>
            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xl border-4 border-white">
                  <FileCheck size={48} />
               </div>
               <div className="space-y-3">
                 <h3 className="text-3xl font-black text-slate-950">Request Logged</h3>
                 <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                   Your partnership proposal has been delivered to the {orgName} strategic desk. You will be notified via secure channel upon review.
                 </p>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 font-mono text-[10px] text-slate-400 w-full text-left">
                  <p className="font-bold text-slate-600 mb-2">PARTNERSHIP_RECEIPT:</p>
                  <p>ID: PR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  <p>TIMESTAMP: {new Date().toISOString()}</p>
                  <p>STATUS: AWAITING_ACKNOWLEDGEMENT</p>
               </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
          {step === 'form' ? (
            <button 
              form="partnershipForm"
              type="submit"
              className="w-full bg-slate-950 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3"
            >
              <Send size={18} />
              <span>Submit Request</span>
            </button>
          ) : step === 'success' ? (
            <button 
              onClick={onClose}
              className="w-full bg-slate-950 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
            >
              Back to Profile
            </button>
          ) : (
            <div className="py-5 text-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Processing secure transmission...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrganisationDetailPage: React.FC = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const org = useMemo(() => MOCK_ORGANISATIONS.find(o => o.id === orgId), [orgId]);

  if (!org) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Organisation Not Found</h2>
        <button 
          onClick={() => navigate('/members/organisations')}
          className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to Organisations</span>
        </button>
      </div>
    );
  }

  const getTechIcon = (cat: TechCategory) => {
    switch (cat) {
      case 'Cloud': return <Cloud size={16} />;
      case 'AI/ML': return <Sparkles size={16} />;
      case 'Security': return <Shield size={16} />;
      case 'Chips': return <Cpu size={16} />;
      case 'Quantum': return <Database size={16} />;
      case 'Satellite': return <Satellite size={16} />;
      default: return <Layers size={16} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PartnershipModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
        orgName={org.name} 
      />

      {/* Navigation */}
      <button 
        onClick={() => navigate('/members/organisations')}
        className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest pt-4 group"
      >
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm transition-colors group-hover:border-indigo-300">
          <ArrowLeft size={16} />
        </div>
        <span>Back to directory</span>
      </button>

      {/* Hero Header */}
      <section className="bg-white rounded-[4rem] border border-slate-200 p-10 md:p-16 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
          <div className="relative shrink-0">
             <div className="absolute -inset-4 bg-indigo-500/5 blur-xl rounded-full"></div>
             <img src={org.avatar} className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] border-4 border-white shadow-2xl relative z-10" alt={org.name} />
             {org.verified && (
               <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-2 border-4 border-white z-20 shadow-lg">
                 <ShieldCheck size={24} />
               </div>
             )}
          </div>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {org.type}
                </span>
                <span className="flex items-center space-x-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                   <MapPin size={12} />
                   <span>{org.location}</span>
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                {org.name}
              </h1>
            </div>
            
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl">
              {org.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {org.website && (
                <a 
                  href={org.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                >
                  <Globe size={18} />
                  <span>Visit Website</span>
                  <ExternalLink size={14} className="opacity-50" />
                </a>
              )}
              <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                <Mail size={18} />
                <span>Contact Office</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Institutional Delegates */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
                <Users className="text-indigo-600" size={28} />
                <span>Institutional Delegates</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {org.delegates && org.delegates.length > 0 ? (
                org.delegates.map(delegate => (
                  <div key={delegate.id} className="bg-white rounded-[3rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 group hover:border-indigo-200 transition-all">
                    <img src={delegate.avatar} className="w-20 h-20 rounded-2xl border-4 border-slate-50 shadow-md grayscale group-hover:grayscale-0 transition-all" alt={delegate.name} />
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{delegate.name}</h4>
                        <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">{delegate.role}</p>
                      </div>
                      <div className="relative">
                        <Quote size={24} className="absolute -top-4 -left-6 text-slate-100 -z-10 group-hover:text-indigo-50" />
                        <p className="text-base text-slate-600 leading-relaxed font-medium italic relative z-10">
                          "{delegate.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
                  <p className="font-bold">No active delegates registered for this session.</p>
                </div>
              )}
            </div>
          </section>

          {/* Strategic Context */}
          <section className="bg-slate-900 rounded-[3rem] p-12 text-white space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
             <h2 className="text-2xl font-black tracking-tight flex items-center space-x-3 relative z-10">
                <Award className="text-indigo-400" size={24} />
                <span>Strategic Alignment</span>
             </h2>
             <p className="text-slate-400 font-medium leading-relaxed relative z-10">
               As a {org.type.toLowerCase()}, {org.name} prioritizes the engineering of resilient digital ecosystems. Their participation in the Hub focuses on ensuring that sovereignty is not just a policy objective, but a technical reality anchored in physical infrastructure and audited algorithms.
             </p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="text-[10px] font-black text-indigo-300 uppercase mb-1">Scale</div>
                   <div className="text-lg font-black">{org.memberCount.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="text-[10px] font-black text-indigo-300 uppercase mb-1">Status</div>
                   <div className="text-lg font-black">Verified</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="text-[10px] font-black text-indigo-300 uppercase mb-1">Hub Tier</div>
                   <div className="text-lg font-black">Platinum</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="text-[10px] font-black text-indigo-300 uppercase mb-1">Impact</div>
                   <div className="text-lg font-black">A+</div>
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Technological Focus</h3>
            <div className="space-y-4">
              {org.techCategories.map(tech => (
                <div key={tech} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-200 transition-all">
                   <div className="flex items-center space-x-3">
                     <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                       {getTechIcon(tech)}
                     </div>
                     <span className="text-sm font-bold text-slate-700">{tech}</span>
                   </div>
                   <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-indigo-600 rounded-[2.5rem] p-10 text-white space-y-6 shadow-xl shadow-indigo-100 group overflow-hidden relative">
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
             <div className="relative z-10 space-y-4">
               <Zap size={32} className="text-yellow-300" />
               <h3 className="text-xl font-black leading-tight">Collaborate with {org.name.split(' ')[0]}</h3>
               <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                 Request a technical briefing or invite this organisation to your active working group.
               </p>
               <button 
                onClick={() => setIsRequestModalOpen(true)}
                className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
               >
                 Request Partnership
               </button>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrganisationDetailPage;
