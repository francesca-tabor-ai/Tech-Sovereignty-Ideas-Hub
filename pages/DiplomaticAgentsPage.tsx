
import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Globe, 
  Users, 
  MessageSquare, 
  Zap, 
  Loader2, 
  ArrowLeft, 
  ShieldAlert, 
  Scale, 
  Flag,
  ChevronRight,
  TrendingUp,
  FileText,
  Lock,
  History
} from 'lucide-react';
import { Idea, DiplomaticSimulationResult } from '../types';
import { runDiplomaticSimulation } from '../geminiService';

interface DiplomaticAgentsPageProps {
  ideas: Idea[];
}

const BLOCS = [
  { id: 'EU', name: 'European Union', persona: 'The Regulator' },
  { id: 'USA', name: 'United States', persona: 'The Hegemon' },
  { id: 'BRICS', name: 'BRICS+', persona: 'The Challenger' },
  { id: 'SOUTH', name: 'Global South', persona: 'The Unaligned' }
];

const DiplomaticAgentsPage: React.FC<DiplomaticAgentsPageProps> = ({ ideas }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedIdeaId = searchParams.get('ideaId');
  
  const [selectedBlocs, setSelectedBlocs] = useState<string[]>(['EU', 'USA', 'BRICS']);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<DiplomaticSimulationResult | null>(null);
  const [simStep, setSimStep] = useState('');

  const currentIdea = useMemo(() => ideas.find(i => i.id === selectedIdeaId), [ideas, selectedIdeaId]);

  const toggleBloc = (id: string) => {
    setSelectedBlocs(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const handleSimulate = async () => {
    if (!currentIdea || selectedBlocs.length === 0) return;
    
    setIsSimulating(true);
    setResult(null);
    setSimStep('Opening Secure Diplomatic Channels...');
    
    const steps = [
      'Establishing Secure Channels...',
      'Dispatching AI Attachés to Capitals...',
      'Gathering Adversarial Insights...',
      'Synthesizing Geopolitical Friction Matrix...',
      'Encrypting Diplomatic Cables...'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setSimStep(steps[i]);
        i++;
      }
    }, 1500);

    try {
      const simResult = await runDiplomaticSimulation(currentIdea, selectedBlocs);
      setResult(simResult);
    } catch (error) {
      alert("Simulation failed. Diplomatic relations are currently unstable.");
    } finally {
      clearInterval(interval);
      setIsSimulating(false);
    }
  };

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'Supportive': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Neutral': return 'bg-slate-50 text-slate-700 border-slate-100';
      case 'Opposed': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Adversarial': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <Globe size={12} />
            <span>Diplomatic War Room</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Geopolitical Critique</h1>
          <p className="text-slate-500">Multi-agent simulation where world powers evaluate your sovereign tech proposal.</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Initiative</label>
              <select 
                value={selectedIdeaId || ''}
                onChange={(e) => navigate(`/diplomacy?ideaId=${e.target.value}`)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="" disabled>Select a proposal...</option>
                {ideas.map(idea => (
                  <option key={idea.id} value={idea.id}>{idea.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participating Agents</label>
              <div className="space-y-2">
                {BLOCS.map(bloc => (
                  <button
                    key={bloc.id}
                    onClick={() => toggleBloc(bloc.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      selectedBlocs.includes(bloc.id) 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-xs font-black">{bloc.name}</div>
                      <div className={`text-[10px] font-bold ${selectedBlocs.includes(bloc.id) ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {bloc.persona}
                      </div>
                    </div>
                    {selectedBlocs.includes(bloc.id) && <Zap size={14} className="text-yellow-400 fill-current" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={!selectedIdeaId || selectedBlocs.length === 0 || isSimulating}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {isSimulating ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} className="text-indigo-400" />}
              <span>{isSimulating ? 'Convening Council...' : 'Run Simulation'}</span>
            </button>
          </div>

          {currentIdea && (
            <div className="bg-indigo-900 text-white p-6 rounded-[2rem] shadow-xl space-y-4">
              <div className="flex items-center space-x-2 text-indigo-300">
                <FileText size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Subject Draft</span>
              </div>
              <h3 className="text-lg font-black leading-tight">{currentIdea.title}</h3>
              <p className="text-xs text-indigo-100/60 line-clamp-3">{currentIdea.description}</p>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-3">
          {!result && !isSimulating && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
              <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <Users size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Council is Recessed</h3>
              <p className="max-w-md text-sm">Select an initiative and choose which geopolitical powers should critique it.</p>
            </div>
          )}

          {isSimulating && (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center space-y-8 animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full animate-ping"></div>
                <div className="bg-slate-900 p-8 rounded-full shadow-2xl relative z-10">
                   <Globe size={64} className="text-indigo-400 animate-[spin_10s_linear_infinite]" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900">Multi-Agent Geopolitical Synthesis</h3>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest animate-bounce">
                    {simStep}
                  </span>
                </div>
              </div>
              <div className="w-full max-w-md grid grid-cols-4 gap-4 px-12 opacity-50">
                <div className="h-1 bg-indigo-600 rounded-full"></div>
                <div className="h-1 bg-indigo-400 rounded-full"></div>
                <div className="h-1 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-1 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Global Summary */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">Geopolitical Summary</h2>
                    <div className="text-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="text-2xl font-black text-rose-600">{result.overallFriction}</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase">Friction Index</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{result.geopoliticalSummary}"</p>
                  
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-3">
                    <div className="flex items-center space-x-2 text-indigo-700">
                      <TrendingUp size={16} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Recommended Pitch</h4>
                    </div>
                    <p className="text-xs text-indigo-900 font-bold leading-relaxed">{result.recommendedDiplomaticApproach}</p>
                  </div>
                </div>

                {/* Cables Section Header */}
                <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                  {result.critiques.map((critique, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <Flag size={16} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{critique.blocName}</h4>
                            <p className="text-[10px] text-slate-500 font-bold">{critique.personaTitle}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${getStanceColor(critique.stance)}`}>
                          {critique.stance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-slate-100 pl-4">"{critique.critique}"</p>
                      <div className="pt-4 border-t border-slate-50 flex items-center space-x-2 text-indigo-600">
                        <Scale size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Leverage: {critique.strategicLeverage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => navigate(`/idea/${selectedIdeaId}`)}
                  className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center space-x-2 hover:translate-x-1 transition-transform"
                >
                  <span>Return to Initiative Details</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-2xl font-black">Adversarial Diplomacy</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our Diplomatic Agents use Gemini 3 Pro to simulate realistic high-stakes responses from world powers. 
              By understanding opposition early, you can refine your "Narrative & Influence" strategy to bypass resistance.
            </p>
          </div>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <img key={i} src={`https://picsum.photos/seed/bloc${i}/40`} className="w-12 h-12 rounded-full border-4 border-slate-900 shadow-xl" alt="" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiplomaticAgentsPage;
