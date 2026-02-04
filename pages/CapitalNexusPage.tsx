
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  TrendingUp, 
  LineChart as LineChartIcon, 
  Search, 
  Plus, 
  Zap, 
  Clock, 
  Lock, 
  Globe,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  Database,
  Key,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Idea, FinancialProjection, IPRecord } from '../types';
import { generateFinancialModel } from '../geminiService';
import { Link } from 'react-router-dom';

interface CapitalNexusPageProps {
  ideas: Idea[];
}

const MOCK_IP_RECORDS: IPRecord[] = [
  { id: 'ip1', ideaId: 'idea-039', ownerName: 'Dr. Sarah Chen', organization: 'Stanford AI Policy Lab', timestamp: Date.now() - 1000000, action: 'Created', signature: 'sig_0x82...1a' },
  { id: 'ip2', ideaId: 'idea-039', ownerName: 'James Wilson', organization: 'European Tech Agency', timestamp: Date.now() - 500000, action: 'Secured', signature: 'sig_0xf1...9b' },
  { id: 'ip3', ideaId: 'idea-039', ownerName: 'Elena Rodriguez', organization: 'Sovereign Capital Partners', timestamp: Date.now() - 100000, action: 'Licensed', signature: 'sig_0x2e...4c' }
];

const CapitalNexusPage: React.FC<CapitalNexusPageProps> = ({ ideas }) => {
  const [activeTab, setActiveTab] = useState<'capital' | 'ip'>('capital');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(ideas[0]?.id || '');
  const [projections, setProjections] = useState<FinancialProjection[]>([]);
  const [isModeling, setIsModeling] = useState(false);

  const selectedIdea = useMemo(() => ideas.find(i => i.id === selectedIdeaId), [ideas, selectedIdeaId]);

  const runFinancialSimulation = async () => {
    if (!selectedIdea) return;
    setIsModeling(true);
    try {
      const data = await generateFinancialModel(selectedIdea, 5);
      setProjections(data);
    } catch (err) {
      alert("Modeling failed.");
    } finally {
      setIsModeling(false);
    }
  };

  useEffect(() => {
    if (selectedIdeaId) runFinancialSimulation();
  }, [selectedIdeaId]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <DollarSign size={12} />
            <span>Strategic Asset Management</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sovereign Capital Nexus</h1>
          <p className="text-slate-500 max-w-xl">Integration of financial modeling for Sovereign Wealth Funds and cryptographic IP registries.</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('capital')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'capital' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Capital Modeler
          </button>
          <button 
            onClick={() => setActiveTab('ip')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ip' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            IP Registry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Idea Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Selection</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {ideas.map(idea => (
                <button
                  key={idea.id}
                  onClick={() => setSelectedIdeaId(idea.id)}
                  className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all border ${
                    selectedIdeaId === idea.id 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <p className="line-clamp-1">{idea.title}</p>
                  <div className="flex items-center space-x-2 mt-2 opacity-60">
                    <span className="text-[8px] uppercase tracking-tighter bg-white px-1.5 rounded border border-slate-200">v{idea.version}</span>
                    <span className="text-[8px] uppercase tracking-tighter">{idea.category.split(' ')[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-6">
            <div className="flex items-center space-x-3 text-emerald-400">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Nexus Verification</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Assets selected for Nexus modeling are audited for "Return on Independence" (ROI) and geopolitical leverage.
            </p>
            <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Request Full Audit
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'capital' ? (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              {/* Header Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-black text-slate-400 uppercase mb-2">Projected 5Y ROI</div>
                  <div className="text-3xl font-black text-emerald-600">
                    {projections.length > 0 ? `+${projections[projections.length - 1].roi}%` : '---'}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-black text-slate-400 uppercase mb-2">Capital Intensity</div>
                  <div className="text-3xl font-black text-indigo-600">
                    {projections.length > 0 ? `$${projections.reduce((acc, p) => acc + p.cost, 0).toFixed(1)}M` : '---'}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-black text-slate-400 uppercase mb-2">Sov. Index Delta</div>
                  <div className="text-3xl font-black text-amber-600">
                    {projections.length > 0 ? `+${projections[projections.length - 1].sovereigntyGain}` : '---'}
                  </div>
                </div>
              </div>

              {/* Main Chart */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <LineChartIcon className="text-indigo-600" size={24} />
                    <h2 className="text-xl font-black text-slate-900">SWF Performance Forecast</h2>
                  </div>
                  <button 
                    onClick={runFinancialSimulation}
                    disabled={isModeling}
                    className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isModeling ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="text-yellow-400" />}
                    <span>{isModeling ? 'Modeling Neural Markets...' : 'Update Projection'}</span>
                  </button>
                </div>

                <div className="h-[400px]">
                  {isModeling ? (
                    <div className="h-full flex items-center justify-center">
                       <Loader2 size={48} className="text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={projections}>
                        <defs>
                          <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSov" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} label={{ value: 'Years Horizon', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 'bold', paddingTop: 20 }} />
                        <Area type="monotone" dataKey="roi" name="Projected ROI (%)" stroke="#10b981" fillOpacity={1} fill="url(#colorRoi)" strokeWidth={3} />
                        <Area type="monotone" dataKey="sovereigntyGain" name="Sovereignty Multiplier" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSov)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Capital Allocation Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Cost Breakdown (USD M)</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={projections}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                         <Tooltip />
                         <Bar dataKey="cost" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Annual Capex" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center space-y-6">
                  <div className="flex items-center space-x-3 text-indigo-400">
                    <TrendingUp size={24} />
                    <h3 className="text-lg font-black tracking-tight">Investment Rationale</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    "This asset demonstrates high convexity in shock scenarios. The initial capital outlay of 
                    <span className="text-white font-bold ml-1">${projections[0]?.cost || '...'}M</span> 
                    is offset by a structural decrease in dependency on external cloud providers by Year 3."
                  </p>
                  <button className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-white hover:text-indigo-400 transition-colors">
                    <span>View Strategic Brief</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               {/* IP Registry Interface */}
               <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <Database className="text-indigo-600" size={24} />
                     <h2 className="text-xl font-black text-slate-900">Chain of Custody Registry</h2>
                   </div>
                   <div className="flex items-center space-x-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                     <Lock size={12} />
                     <span>Cryptographically Signed</span>
                   </div>
                 </div>

                 <div className="relative">
                   {/* Timeline Line */}
                   <div className="absolute top-0 bottom-0 left-[2rem] w-px bg-slate-100 hidden md:block"></div>

                   <div className="space-y-8">
                     {MOCK_IP_RECORDS.map((record, idx) => (
                       <div key={record.id} className="relative flex flex-col md:flex-row md:items-start md:space-x-12 pl-0 md:pl-0">
                         {/* Circle indicator */}
                         <div className="hidden md:flex absolute left-6 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 z-10"></div>
                         
                         <div className="md:w-32 pt-1">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(record.timestamp).toLocaleDateString()}</div>
                           <div className="text-[10px] text-slate-400">{new Date(record.timestamp).toLocaleTimeString()}</div>
                         </div>

                         <div className="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                           <div className="flex items-center space-x-4">
                             <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <Key size={18} />
                             </div>
                             <div>
                               <div className="flex items-center space-x-2">
                                 <h4 className="font-bold text-slate-900">{record.action}</h4>
                                 <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">Verified</span>
                               </div>
                               <p className="text-xs text-slate-500 font-medium">{record.ownerName} • {record.organization}</p>
                             </div>
                           </div>
                           <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[8px] text-slate-400 overflow-hidden whitespace-nowrap mask-fade-right max-w-[200px]">
                             HASH: {record.signature}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="bg-indigo-900 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-2 text-center md:text-left">
                     <h3 className="text-lg font-black tracking-tight">Protect Asset Provenance</h3>
                     <p className="text-xs text-indigo-200 font-medium">Issue a new cryptographic signature to the IP registry for this refinement.</p>
                   </div>
                   <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-950 flex items-center space-x-3">
                     <Plus size={18} />
                     <span>Sign & Commit Record</span>
                   </button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapitalNexusPage;
