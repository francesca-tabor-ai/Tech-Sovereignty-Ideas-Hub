
import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  ShieldAlert, 
  Zap, 
  Loader2, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Boxes,
  Activity
} from 'lucide-react';
import { Idea, SimulationResult } from '../types';
import { simulateGeopoliticalShock } from '../geminiService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

interface SimulationPageProps {
  ideas: Idea[];
}

const SCENARIOS = [
  "Total Semiconductor Embargo (Global Supply Chain Collapse)",
  "DNS Poisoning & Regional Internet Fragmentation",
  "Critical Undersea Cable Sabotage",
  "Sudden Energy Grid Destabilization",
  "Forced Data Localization Crisis (G7 vs BRICS)",
  "AI Model Weight Theft by State Actors"
];

const SimulationPage: React.FC<SimulationPageProps> = ({ ideas }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedIdeaId = searchParams.get('ideaId');
  
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simStatus, setSimStatus] = useState('');

  const currentIdea = useMemo(() => 
    ideas.find(i => i.id === selectedIdeaId), 
  [ideas, selectedIdeaId]);

  const handleSimulate = async () => {
    if (!currentIdea) return;
    
    setIsSimulating(true);
    setResult(null);
    setSimStatus('Initializing Neural Simulation...');
    
    const statuses = [
      'Mapping Supply Chain Interdependencies...',
      'Injecting Geopolitical Perturbations...',
      'Calculating Cascading Failure Probabilities...',
      'Evaluating Adaptive Resource Reallocation...',
      'Finalizing Resilience Report...'
    ];

    let statusIdx = 0;
    const interval = setInterval(() => {
      if (statusIdx < statuses.length) {
        setSimStatus(statuses[statusIdx]);
        statusIdx++;
      }
    }, 1500);

    try {
      const simResult = await simulateGeopoliticalShock(currentIdea, selectedScenario);
      setResult(simResult);
    } catch (error) {
      alert("Simulation failed. Our servers might be under too much 'geopolitical stress'.");
    } finally {
      clearInterval(interval);
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Geopolitical Stress Test</h1>
          <p className="text-slate-500">Simulate black swan events to measure proposal resilience.</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Select Proposal</label>
              <select 
                value={selectedIdeaId || ''}
                onChange={(e) => navigate(`/simulation?ideaId=${e.target.value}`)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="" disabled>Select a proposal to test...</option>
                {ideas.map(idea => (
                  <option key={idea.id} value={idea.id}>{idea.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Choose Shock Scenario</label>
              <div className="space-y-2">
                {SCENARIOS.map(sc => (
                  <button
                    key={sc}
                    onClick={() => setSelectedScenario(sc)}
                    className={`w-full text-left p-4 rounded-xl text-xs font-bold transition-all border ${
                      selectedScenario === sc 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={!selectedIdeaId || isSimulating}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {isSimulating ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className="text-yellow-400" />}
              <span>{isSimulating ? 'Simulating...' : 'Run Stress Test'}</span>
            </button>
          </div>

          {currentIdea && (
            <div className="bg-indigo-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
              <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-4">Targeting</h3>
              <h2 className="text-xl font-black mb-3 leading-tight">{currentIdea.title}</h2>
              <p className="text-sm text-indigo-100/70 line-clamp-3 mb-6">{currentIdea.description}</p>
              <div className="flex items-center space-x-2 text-indigo-300">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-black uppercase">Baseline Sovereignty: {currentIdea.sovereigntyScore}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {!result && !isSimulating && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
              <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <Activity size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Simulation Idle</h3>
              <p className="max-w-md text-sm">Select a sovereign initiative and a crisis scenario to begin the adversarial simulation.</p>
            </div>
          )}

          {isSimulating && (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center space-y-8 animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-ping"></div>
                <Globe size={80} className="text-indigo-600 relative z-10 animate-spin-slow" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900">Engaging Adversarial Engine</h3>
                <p className="text-indigo-600 font-bold font-mono text-sm tracking-widest uppercase">{simStatus}</p>
              </div>
              <div className="w-full max-w-sm bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full animate-[loading_10s_ease-in-out_infinite]"></div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-rose-600 mb-2">
                      <AlertTriangle size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">Shock Outcome</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">{result.scenarioName}</h2>
                  </div>
                  <div className="text-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="text-4xl font-black text-indigo-600">{result.resilienceScore}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Resilience Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <Lock size={20} className="text-indigo-600" />
                      <span className="text-xl font-black text-slate-900">{result.metrics.security}%</span>
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security</h4>
                    <div className="w-full bg-white h-1.5 rounded-full mt-3">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${result.metrics.security}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <Activity size={20} className="text-emerald-600" />
                      <span className="text-xl font-black text-slate-900">{result.metrics.continuity}%</span>
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Continuity</h4>
                    <div className="w-full bg-white h-1.5 rounded-full mt-3">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${result.metrics.continuity}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <Boxes size={20} className="text-amber-600" />
                      <span className="text-xl font-black text-slate-900">{result.metrics.adaptability}%</span>
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adaptability</h4>
                    <div className="w-full bg-white h-1.5 rounded-full mt-3">
                      <div className="bg-amber-600 h-full rounded-full" style={{ width: `${result.metrics.adaptability}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Adversarial Analysis</h4>
                  <p className="text-lg text-slate-700 leading-relaxed font-medium italic">"{result.analysis}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mitigation Directives</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.mitigationSteps.map((step, idx) => (
                      <div key={idx} className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex items-start space-x-3">
                        <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                        <span className="text-xs font-bold text-indigo-900 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <Link to={`/idea/${selectedIdeaId}`} className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center space-x-2 hover:translate-x-1 transition-transform">
                  <span>Back to Proposal Details</span>
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
