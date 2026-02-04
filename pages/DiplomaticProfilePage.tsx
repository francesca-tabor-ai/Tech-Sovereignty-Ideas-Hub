
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Gavel, 
  Download, 
  Loader2, 
  ShieldAlert, 
  Scale, 
  Flag, 
  TrendingUp,
  X,
  Zap,
  CheckCircle2,
  FileText,
  Printer,
  ChevronRight,
  User as UserIcon,
  Award,
  AlertTriangle
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Idea, DiplomaticSimulationResult } from '../types';
import { runDiplomaticSimulation, generateGeopoliticalReport, GeopoliticalReport } from '../geminiService';

interface DiplomaticProfilePageProps {
  ideas: Idea[];
}

const DiplomaticProfilePage: React.FC<DiplomaticProfilePageProps> = ({ ideas }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idea = ideas.find(i => i.id === id);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<DiplomaticSimulationResult | null>(null);
  const [geopoliticalReport, setGeopoliticalReport] = useState<GeopoliticalReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const radarData = useMemo(() => {
    if (!simulationResult) return [];
    return simulationResult.critiques.map(c => ({
      bloc: c.blocName,
      friction: c.stance === 'Supportive' ? 10 : c.stance === 'Neutral' ? 30 : c.stance === 'Opposed' ? 60 : 90,
      fullMark: 100
    }));
  }, [simulationResult]);

  if (!idea) return <div className="p-20 text-center font-black uppercase text-slate-400">Proposal Missing</div>;

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const result = await runDiplomaticSimulation(idea, ['EU', 'USA', 'BRICS', 'Global South']);
      setSimulationResult(result);
    } catch (e) {
      alert("Simulation failed.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!simulationResult) return;
    setIsGeneratingReport(true);
    try {
      const report = await generateGeopoliticalReport(idea, simulationResult);
      setGeopoliticalReport(report);
      setShowReportModal(true);
    } catch (e) {
      alert("Report generation failed.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-rose-600';
      case 'High': return 'text-amber-600';
      case 'Moderate': return 'text-indigo-600';
      case 'Low': return 'text-emerald-600';
      default: return 'text-slate-600';
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
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Diplomatic War Room</h1>
            <p className="text-slate-500 font-medium">Multi-agent geopolitical critique of <span className="text-indigo-600 font-bold">{idea.title}</span></p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-70"
          >
            {isSimulating ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} className="text-indigo-400" />}
            <span>{isSimulating ? 'Convening Agents...' : 'Run Simulation'}</span>
          </button>
          
          {simulationResult && (
            <button 
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-indigo-700 transition-all shadow-xl active:scale-95 disabled:opacity-70"
            >
              {isGeneratingReport ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              <span>Synthesis Report</span>
            </button>
          )}
        </div>
      </header>

      {!simulationResult && !isSimulating && (
        <div className="py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed text-center space-y-8 shadow-sm">
          <div className="p-8 bg-slate-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-slate-200 shadow-inner">
            <Gavel size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Simulation Pipeline Ready</h3>
            <p className="max-w-md mx-auto text-slate-400 font-medium leading-relaxed">
              Launch a multi-agent critique where specialized AI agents representing major world powers provide adversarial feedback on your sovereign tech initiative.
            </p>
          </div>
          <button 
            onClick={handleRunSimulation}
            className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline"
          >
            Execute Baseline Simulation
          </button>
        </div>
      )}

      {isSimulating && (
        <div className="py-32 bg-white rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-10 animate-pulse">
           <div className="relative">
             <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full animate-ping"></div>
             <div className="bg-slate-900 p-8 rounded-full shadow-2xl relative z-10">
                <Globe size={80} className="text-indigo-400 animate-[spin_12s_linear_infinite]" />
             </div>
           </div>
           <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900">Simulating Geopolitical Friction</h2>
             <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] font-mono">Disseminating Cables to EU, USA, BRICS Agents...</p>
           </div>
           <div className="w-full max-w-sm bg-slate-100 h-2 rounded-full overflow-hidden">
             <div className="bg-indigo-600 h-full animate-[loading_10s_ease-in-out_infinite]"></div>
           </div>
        </div>
      )}

      {simulationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in zoom-in-95 duration-500">
          {/* Radar Friction Visualization */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-slate-900">Geopolitical Friction Matrix</h2>
              <div className="flex items-center space-x-4">
                 <div className="text-center px-4 py-2 bg-slate-950 rounded-2xl shadow-lg">
                   <div className="text-2xl font-black text-rose-500">{simulationResult.overallFriction}</div>
                   <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Friction Index</div>
                 </div>
              </div>
            </div>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="bloc" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                  <Radar
                    name="Global Resistance"
                    dataKey="friction"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mt-10">
               <div className="flex items-center space-x-3 text-indigo-600 mb-4">
                 <TrendingUp size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Adversarial Strategy Recommendation</h4>
               </div>
               <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                 "{simulationResult.recommendedDiplomaticApproach}"
               </p>
            </div>
          </div>

          {/* Critiques Sidebar */}
          <div className="space-y-6 overflow-y-auto max-h-[850px] pr-2 custom-scrollbar">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest sticky top-0 bg-[#fcfdfe] pb-2 z-10">Inter-Bloc Intelligence Cables</h3>
            {simulationResult.critiques.map((crit, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 hover:border-indigo-200 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors">
                       <Flag size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{crit.blocName}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{crit.personaTitle}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
                    crit.stance === 'Supportive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    crit.stance === 'Adversarial' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {crit.stance}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"{crit.critique}"</p>
                <div className="pt-4 border-t border-slate-50">
                   <div className="flex items-center space-x-2 text-indigo-600">
                     <ShieldAlert size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Leverage: {crit.strategicLeverage}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geopolitical Report Modal */}
      {showReportModal && geopoliticalReport && (
        <div className="fixed inset-0 z-[140] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border border-white/20">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div className="flex items-center space-x-4">
                 <div className="bg-slate-950 p-3 rounded-xl text-white">
                    <Globe size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-black text-slate-950 tracking-tight">Geopolitical Impact Assessment</h2>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Classified Briefing • Hub Strategic Desk</p>
                 </div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => window.print()} className="flex items-center space-x-2 bg-slate-950 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"><Printer size={16} /><span>Print Report</span></button>
                <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-950"><X size={28} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-white m-4 rounded-[2rem] shadow-inner font-serif prd-container">
               <div className="max-w-3xl mx-auto space-y-12">
                  <section className="text-center space-y-4 border-b border-slate-100 pb-12">
                     <Gavel size={48} className="mx-auto text-slate-950 mb-2" />
                     <h1 className="text-4xl font-black text-slate-950 font-sans tracking-tight uppercase leading-tight">{geopoliticalReport.title}</h1>
                     <p className="text-slate-400 font-sans font-bold text-xs uppercase tracking-[0.3em]">Institutional Resilience Brief v1.2</p>
                  </section>

                  <section className="space-y-4">
                     <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">01. Global Posture Summary</h3>
                     <p className="text-lg text-slate-800 leading-relaxed italic border-l-4 border-slate-900 pl-6 font-serif">
                        "{geopoliticalReport.globalPosture}"
                     </p>
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">02. Multi-Bloc Friction Analysis</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                        {geopoliticalReport.frictionAnalysis.map((item, i) => (
                          <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
                             <div className="flex items-center justify-between">
                               <h4 className="font-black text-slate-900 text-sm">{item.bloc}</h4>
                               <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                 item.riskLevel === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                 item.riskLevel === 'High' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                 'bg-emerald-50 text-emerald-600 border-emerald-100'
                               }`}>Risk: {item.riskLevel}</span>
                             </div>
                             <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">"{item.rationale}"</p>
                          </div>
                        ))}
                     </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">03. Strategic Leverage</h3>
                       <ul className="space-y-4 font-sans">
                          {geopoliticalReport.strategicLeveragePoints.map((p, i) => (
                            <li key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-700">
                              <Award size={18} className="text-amber-500 shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                       </ul>
                    </section>
                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">04. Mitigation Directives</h3>
                       <ul className="space-y-4 font-sans">
                          {geopoliticalReport.mitigationStrategies.map((s, i) => (
                            <li key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-700">
                              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                       </ul>
                    </section>
                  </div>

                  <section className="bg-slate-950 p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden font-sans">
                     <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                     <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest relative z-10">05. Ten-Year Geopolitical Forecast</h3>
                     <p className="text-base text-slate-300 leading-relaxed font-medium relative z-10 italic">
                        "{geopoliticalReport.longTermForecast}"
                     </p>
                  </section>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiplomaticProfilePage;
