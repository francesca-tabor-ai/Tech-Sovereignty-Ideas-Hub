
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  Download, 
  Loader2, 
  ShieldCheck, 
  Scale, 
  Target, 
  TrendingUp, 
  Globe, 
  FileText,
  Printer,
  X,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Award
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Idea } from '../types';
import { generatePRD, PRDReport } from '../geminiService';

interface SovereigntyProfilePageProps {
  ideas: Idea[];
}

const SovereigntyProfilePage: React.FC<SovereigntyProfilePageProps> = ({ ideas }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idea = ideas.find(i => i.id === id);

  const [isGenerating, setIsGenerating] = useState(false);
  const [prd, setPrd] = useState<PRDReport | null>(null);
  const [showPrdModal, setShowPrdModal] = useState(false);

  const chartData = useMemo(() => {
    if (!idea) return [];
    return [
      { subject: 'Impact', A: idea.impactScore, fullMark: 100 },
      { subject: 'Feasibility', A: idea.feasibilityScore, fullMark: 100 },
      { subject: 'Revenue', A: idea.revenueScore, fullMark: 100 },
      { subject: 'Sovereignty', A: idea.sovereigntyScore, fullMark: 100 },
    ];
  }, [idea]);

  if (!idea) {
    return <div className="p-20 text-center text-slate-500 font-black uppercase tracking-widest">Protocol Buffer Empty: Proposal Not Found</div>;
  }

  const handleGeneratePRD = async () => {
    setIsGenerating(true);
    try {
      const report = await generatePRD(idea);
      setPrd(report);
      setShowPrdModal(true);
    } catch (error) {
      alert("Intelligence transmission failed. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
      <header className="pt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center space-x-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest"
          >
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm group-hover:border-indigo-300 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span>Back to Proposal</span>
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sovereignty Profile</h1>
            <p className="text-slate-500 font-medium">Technical & strategic assessment of <span className="text-indigo-600 font-bold">{idea.title}</span></p>
          </div>
        </div>

        <button 
          onClick={handleGeneratePRD}
          disabled={isGenerating}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-70"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          <span>{isGenerating ? 'Synthesizing PRD...' : 'Generate PRD Report'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Radar Visualization */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-slate-900">Metric Blueprint</h2>
            <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
              <Scale size={14} />
              <span>Multi-Dimensional Balance</span>
            </div>
          </div>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar
                  name="Proposal Metrics"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-6 pt-10 border-t border-slate-50">
             {[
               { label: 'Impact', val: idea.impactScore, color: 'text-indigo-600' },
               { label: 'Feasib.', val: idea.feasibilityScore, color: 'text-emerald-600' },
               { label: 'Revenue', val: idea.revenueScore, color: 'text-amber-600' },
               { label: 'Sovereignty', val: idea.sovereigntyScore, color: 'text-rose-600' }
             ].map(m => (
               <div key={m.label} className="text-center space-y-1">
                  <div className={`text-2xl font-black ${m.color}`}>{m.val}%</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Strategic Analysis Sidebar */}
        <div className="space-y-8">
           <div className="bg-slate-950 p-10 rounded-[2.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] rounded-full"></div>
             <div className="flex items-center space-x-3 text-indigo-400">
               <TrendingUp size={20} />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Resilience Forecast</h3>
             </div>
             <div className="space-y-4">
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  "Based on the Sovereignty-to-Impact ratio, this initiative is classified as <span className="text-white font-bold">Strategic Infrastructure</span>. It anchors critical dependencies but requires long-term capital commitment."
                </p>
                <div className="flex items-center space-x-2 pt-4">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">Passed Neural Stress Test</span>
                </div>
             </div>
           </div>

           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stakeholder Alignment</h3>
              <div className="space-y-6">
                 {[
                   { role: 'Regulators', level: 'High', color: 'bg-indigo-600' },
                   { role: 'Institutional Investors', level: 'Moderate', color: 'bg-emerald-500' },
                   { role: 'Academic Lead', level: 'Universal', color: 'bg-indigo-400' }
                 ].map(s => (
                   <div key={s.role} className="space-y-2">
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-600">{s.role}</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase">{s.level}</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color}`} style={{ width: s.level === 'High' ? '85%' : s.level === 'Moderate' ? '50%' : '100%' }}></div>
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 space-y-4">
              <div className="flex items-center space-x-2 text-indigo-600">
                <ShieldCheck size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">Integrity Seal</h3>
              </div>
              <p className="text-xs text-indigo-900 font-medium leading-relaxed italic">
                "Verified digital autonomy asset. Recorded in the Hub registry for formal board escalation."
              </p>
           </div>
        </div>
      </div>

      {/* PRD Modal */}
      {showPrdModal && prd && (
        <div className="fixed inset-0 z-[130] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border border-white/20">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div className="flex items-center space-x-4">
                 <div className="bg-indigo-600 p-3 rounded-xl text-white">
                    <FileText size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-black text-slate-950 tracking-tight">Product Requirements Document</h2>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Protocol Brief v1.0 • {idea.title}</p>
                 </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 bg-slate-950 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                >
                  <Printer size={16} />
                  <span>Print Report</span>
                </button>
                <button onClick={() => setShowPrdModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-950">
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-white m-4 rounded-[2rem] shadow-inner font-serif prd-container">
               <div className="max-w-3xl mx-auto space-y-12">
                  <section className="text-center space-y-4 border-b border-slate-100 pb-12">
                     <Award size={48} className="mx-auto text-indigo-600 mb-2" />
                     <h1 className="text-4xl font-black text-slate-950 font-sans tracking-tight uppercase">{prd.title}</h1>
                     <div className="flex items-center justify-center space-x-6 text-[10px] font-black text-slate-400 uppercase font-sans tracking-widest">
                        <span>Initiative ID: {idea.id}</span>
                        <span>•</span>
                        <span>Strategic Registry Asset</span>
                     </div>
                  </section>

                  <section className="space-y-4">
                     <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">01. Problem Statement</h3>
                     <p className="text-lg text-slate-800 leading-relaxed italic border-l-4 border-indigo-100 pl-6">
                        "{prd.problemStatement}"
                     </p>
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">02. Strategic Goals</h3>
                     <ul className="space-y-4 font-sans">
                        {prd.goals.map((goal, i) => (
                          <li key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-700">
                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                            <span>{goal}</span>
                          </li>
                        ))}
                     </ul>
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">03. Functional Requirements</h3>
                     <div className="grid grid-cols-1 gap-4 font-sans">
                        {prd.functionalRequirements.map((req, i) => (
                          <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                             <span className="text-sm font-bold text-slate-900">{req.feature}</span>
                             <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${
                               req.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                               req.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                               'bg-slate-100 text-slate-500 border-slate-200'
                             }`}>
                               {req.priority} Priority
                             </span>
                          </div>
                        ))}
                     </div>
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">04. Technical Constraints</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                        {prd.technicalConstraints.map((constraint, i) => (
                          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                             <Lock size={16} className="mx-auto mb-3 text-slate-400" />
                             <p className="text-[10px] font-black text-slate-900 leading-tight uppercase">{constraint}</p>
                          </div>
                        ))}
                     </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 pt-12">
                     <div className="space-y-4">
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">05. Stakeholder Impact</h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-sans">{prd.stakeholderImpact}</p>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">06. Sovereignty Alignment</h3>
                        <div className="bg-indigo-950 p-6 rounded-3xl text-white space-y-4 font-sans relative overflow-hidden">
                           <Globe size={40} className="absolute -bottom-4 -right-4 text-white/5" />
                           <p className="text-sm font-medium leading-relaxed italic opacity-90 relative z-10">"{prd.sovereigntyAlignment}"</p>
                        </div>
                     </div>
                  </section>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SovereigntyProfilePage;
