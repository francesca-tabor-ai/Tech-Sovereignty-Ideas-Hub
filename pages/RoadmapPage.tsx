
import React, { useState, useMemo } from 'react';
import { 
  Milestone, 
  ChevronRight, 
  Zap, 
  Globe, 
  Lock, 
  Cpu, 
  Users, 
  FileJson, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Search,
  X,
  Target,
  FileText,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Plus,
  ChevronDown,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  status: 'In Progress' | 'Planned' | 'Researching';
  icon: any;
  supports: number;
  category: 'Core' | 'Interface' | 'Simulation' | 'Capital';
  requirements: string[];
  impactArea: string;
}

interface RoadmapPhase {
  period: string;
  theme: string;
  items: RoadmapItem[];
}

const INITIAL_PHASES: RoadmapPhase[] = [
  {
    period: 'Q1 2026',
    theme: 'Foundations',
    items: [
      {
        id: 'r0',
        title: 'Genesis Nodes',
        description: 'Launching the first independent compute clusters in sovereign jurisdictions.',
        longDescription: 'Deploying bare-metal server infrastructure that bypasses global hyper-scalers, ensuring physical control over core computing resources.',
        status: 'In Progress',
        icon: Cpu,
        supports: 312,
        category: 'Core',
        requirements: ['Hardware Sourcing', 'Security Hardening', 'Latency Testing'],
        impactArea: 'Physical Autonomy'
      },
      {
        id: 'r0.5',
        title: 'Governance Charter',
        description: 'Ratification of the multi-stakeholder operational framework.',
        longDescription: 'A formal legal and technical agreement defining how Hub stakeholders vote on resource allocation and policy implementation.',
        status: 'Planned',
        icon: ShieldCheck,
        supports: 184,
        category: 'Core',
        requirements: ['Legal Audit', 'Voting Protocol Design', 'Stakeholder Onboarding'],
        impactArea: 'Institutional Integrity'
      }
    ]
  },
  {
    period: 'Q2 2026',
    theme: 'Collaboration',
    items: [
      {
        id: 'r1',
        title: 'Working Groups',
        description: 'Virtual boardrooms for ideas with task tracking and shared editing.',
        longDescription: 'A comprehensive suite for distributed governance, allowing stakeholders to form formal working groups with multi-sig approval workflows.',
        status: 'In Progress',
        icon: Users,
        supports: 142,
        category: 'Interface',
        requirements: ['Encrypted storage', 'Real-time sync', 'Multi-sig APIs'],
        impactArea: 'Institutional Coherence'
      },
      {
        id: 'r2',
        title: 'Policy Ingestion',
        description: 'Upload documents and have AI automatically extract structured proposals.',
        longDescription: 'Leveraging AI to parse existing legislative documents and institutional whitepapers to extract strategic pillars and risks.',
        status: 'In Progress',
        icon: FileJson,
        supports: 89,
        category: 'Core',
        requirements: ['Vector Database', 'Legal LLM Tuning'],
        impactArea: 'Knowledge Sovereignty'
      }
    ]
  },
  {
    period: 'Q3 2026',
    theme: 'Stress Testing',
    items: [
      {
        id: 'r3',
        title: 'Scenario Simulator',
        description: 'Test proposal resilience against simulated geopolitical events.',
        longDescription: 'An adversarial simulation engine that models the blast radius of shocks like supply chain failures or data embargoes.',
        status: 'Planned',
        icon: Globe,
        supports: 256,
        category: 'Simulation',
        requirements: ['Game Theory Models', 'Economic Impact Curves'],
        impactArea: 'Infrastructure Resilience'
      },
      {
        id: 'r4',
        title: 'Diplomatic Critique',
        description: 'AI agents representing major powers provide feedback.',
        longDescription: 'Multi-agent system where specialized AI personas critique proposals from the perspective of different geopolitical blocs.',
        status: 'Researching',
        icon: Sparkles,
        supports: 198,
        category: 'Simulation',
        requirements: ['Agentic Workflows', 'Persona Tuning'],
        impactArea: 'Strategic Autonomy'
      }
    ]
  },
  {
    period: 'Q4 2026',
    theme: 'Capital Sovereignty',
    items: [
      {
        id: 'r5',
        title: 'Sovereign Bond Modeler',
        description: 'Financial forecasting tools for state-backed tech investments.',
        longDescription: 'Financial modeling for evaluating Return on Independence. Tracks the long-term value of decoupling from foreign providers.',
        status: 'Planned',
        icon: Lock,
        supports: 67,
        category: 'Capital',
        requirements: ['Quant Models', 'Cloud Spend Benchmarks'],
        impactArea: 'Economic Autonomy'
      },
      {
        id: 'r6',
        title: 'IP Provenance Registry',
        description: 'Registry for tracking the origin of ideas and research.',
        longDescription: 'A chain-of-custody for intellectual property. Every refinement is cryptographically signed for sovereign custodial control.',
        status: 'Researching',
        icon: ShieldCheck,
        supports: 112,
        category: 'Core',
        requirements: ['Cryptographic Notarization', 'DID Integration'],
        impactArea: 'Asset Integrity'
      }
    ]
  }
];

const RoadmapPage: React.FC = () => {
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDesc, setProposalDesc] = useState('');

  const handleSupport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVotedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Meta-Proposal Submitted: ${proposalTitle}`);
    setIsProposalModalOpen(false);
    setProposalTitle('');
    setProposalDesc('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-1000 px-6">
      {/* Simplified Header */}
      <header className="pt-12 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          <Milestone size={12} />
          <span>Timeline</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Roadmap</h1>
          <button 
            onClick={() => setIsProposalModalOpen(true)}
            className="hidden md:flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <Plus size={16} />
            <span>Propose Milestone</span>
          </button>
        </div>
        <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">
          The technical and strategic trajectory for engineering digital autonomy. 
          Prioritize the milestones that anchor sovereign infrastructure.
        </p>
      </header>

      {/* Timeline Section */}
      <div className="relative pt-8">
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 left-[30px] md:left-[50px] w-px bg-gradient-to-b from-slate-100 via-slate-200 to-transparent hidden md:block"></div>

        <div className="space-y-32">
          {INITIAL_PHASES.map((phase, pIdx) => (
            <div key={pIdx} className="relative space-y-12">
              {/* Phase Marker */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 pl-0 md:pl-24">
                <div className="relative">
                  <div className="absolute -inset-4 bg-indigo-50 blur-xl rounded-full opacity-50"></div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-lg relative z-10 shadow-xl">
                    {pIdx + 1}
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-950 tracking-tight">{phase.period}</h2>
                  <div className="flex items-center space-x-3 text-indigo-600">
                    <Layers size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">{phase.theme}</span>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pl-0 md:pl-24">
                {phase.items.map((item) => {
                  const Icon = item.icon;
                  const isVoted = votedItems.has(item.id);
                  const isExpanded = expandedItems.has(item.id);
                  const totalSupports = item.supports + (isVoted ? 1 : 0);
                  
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => toggleExpand(item.id)}
                      className={`group bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer ${
                        isExpanded ? 'lg:col-span-2 border-indigo-100' : 'hover:border-slate-200'
                      }`}
                    >
                      <div className="p-10 md:p-12 space-y-8">
                        <div className="flex items-start justify-between">
                          <div className={`p-4 rounded-2xl transition-all duration-500 ${
                            isVoted ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600'
                          }`}>
                            <Icon size={24} />
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                            item.status === 'In Progress' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            item.status === 'Researching' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                            'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-2xl font-black text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-slate-500 text-base leading-relaxed font-medium">
                            {item.description}
                          </p>
                        </div>

                        {isExpanded && (
                          <div className="pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="space-y-4">
                              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Deep Dive</h4>
                              <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                                "{item.longDescription}"
                              </p>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Requirements</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.requirements.map(req => (
                                  <span key={req} className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signal</span>
                            <span className="text-sm font-black text-slate-900">{totalSupports} Stakeholders</span>
                          </div>

                          <button 
                            onClick={(e) => handleSupport(item.id, e)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              isVoted 
                              ? 'bg-indigo-600 text-white shadow-lg' 
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            <Zap size={14} className={isVoted ? 'fill-current' : ''} />
                            <span>{isVoted ? 'Endorsed' : 'Endorse'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <section className="bg-slate-950 rounded-[3rem] p-12 text-white text-center space-y-6">
        <h2 className="text-3xl font-black">Architect the Sovereignty Stack</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed font-medium">
          The Roadmap is determined by stakeholder consensus. Propose new technical milestones or policy gaps to align the Hub's strategic trajectory.
        </p>
        <button 
          onClick={() => setIsProposalModalOpen(true)}
          className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
        >
          Propose Milestone
        </button>
      </section>

      {/* Proposal Modal */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Propose Milestone</h2>
              <button onClick={() => setIsProposalModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  required
                  value={proposalTitle}
                  onChange={e => setProposalTitle(e.target.value)}
                  placeholder="e.g. Regional Data Trust Protocol"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-950 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rationale</label>
                <textarea 
                  required
                  value={proposalDesc}
                  onChange={e => setProposalDesc(e.target.value)}
                  rows={3}
                  placeholder="Why is this milestone critical for independence?"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium"
                />
              </div>

              <button className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95">
                Submit for Research
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
