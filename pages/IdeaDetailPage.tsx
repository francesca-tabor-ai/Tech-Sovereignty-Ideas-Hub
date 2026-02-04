
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Sparkles,
  ShieldAlert,
  Target,
  Users,
  Send,
  Loader2,
  History,
  TrendingUp,
  Cpu,
  BarChart3,
  Zap,
  Globe,
  FileText,
  Calendar,
  Layers,
  Link as LinkIcon,
  UserPlus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Milestone,
  Clock,
  MapPin,
  ArrowRight,
  Shield,
  Flag,
  Scale,
  Award,
  AlertTriangle,
  UserCheck,
  ChevronLeft,
  BookOpen,
  Anchor,
  Activity,
  Workflow,
  X,
  Building2,
  FileCheck,
  ShieldCheck,
  Server,
  Gavel
} from 'lucide-react';
import { Idea, User, Comment } from '../types';
import { summarizeDiscussion } from '../geminiService';
import { MOCK_USERS } from '../constants';

interface IdeaDetailPageProps {
  ideas: Idea[];
  onVote: (id: string, dir: 'up' | 'down') => void;
  currentUser: User | null;
  onRequireAuth: () => void;
}

const INSTITUTIONS = [
  { id: 'reg-eu', name: 'EEA Digital Oversight Board', category: 'Regulator', icon: Shield },
  { id: 'lab-nat', name: 'National AI Infrastructure Lab', category: 'Public Lab', icon: Server },
  { id: 'council-strat', name: 'Sovereign Wealth Council', category: 'Strategic Council', icon: BarChart3 },
  { id: 'g7-fragment', name: 'G7 Internet Protocol Committee', category: 'Regulator', icon: Globe },
  { id: 'alliance-sov', name: 'Global South Tech Alliance', category: 'Strategic Council', icon: Users }
];

const IdeaDetailPage: React.FC<IdeaDetailPageProps> = ({ ideas, onVote, currentUser, onRequireAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idea = ideas.find(i => i.id === id);

  const [isJoined, setIsJoined] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(idea?.comments || []);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);
  
  // Submission Modal States
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [selectedInst, setSelectedInst] = useState<string[]>([]);
  const [submissionStep, setSubmissionStep] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [submissionProgress, setSubmissionProgress] = useState(0);

  useEffect(() => {
    if (idea) setLocalComments(idea.comments);
  }, [idea]);

  if (!idea) {
    return <div className="p-12 text-center text-slate-500 font-medium">Proposal not found.</div>;
  }

  const handleJoin = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    setIsJoined(true);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      text: commentText,
      timestamp: Date.now()
    };
    
    setLocalComments(prev => [newComment, ...prev]);
    setCommentText('');
  };

  const handleSummarize = async () => {
    if (localComments.length === 0) return;
    setIsSummarizing(true);
    const summary = await summarizeDiscussion(localComments.map(c => c.text));
    setAiSummary(summary);
    setIsSummarizing(false);
  };

  const handleEscalate = () => {
    if (selectedInst.length === 0) return;
    setSubmissionStep('submitting');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSubmissionProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setSubmissionStep('success');
      }
    }, 400);
  };

  const SovereigntyMetric = ({ label, score, colorClass }: any) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className={colorClass}>{score}%</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass.replace('text-', 'bg-')}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  const heroImage = useMemo(() => {
    const images: Record<string, string> = {
      'Governance & Standards': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070',
      'Sovereign Infrastructure': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034',
      'Capital & Risk': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070',
      'Market Design': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426',
      'Talent & Education': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070',
      'Narrative & Influence': 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=1974',
      'Frontier / Radical': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072'
    };
    return images[idea.category] || images['Frontier / Radical'];
  }, [idea.category]);

  return (
    <div className="space-y-0 animate-in fade-in duration-700 pb-24">
      
      {/* Escalation Modal */}
      {isEscalationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg">
                    <Building2 size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-black text-slate-950 tracking-tight">Institutional Escalation</h2>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Formal Protocol Delivery</p>
                 </div>
              </div>
              <button onClick={() => setIsEscalationOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-950">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 min-h-[400px]">
              {submissionStep === 'idle' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Target Stakeholders</h3>
                    <p className="text-sm text-slate-500 font-medium">Select accredited institutions to receive this formal proposal briefing.</p>
                  </div>
                  
                  <div className="space-y-3">
                    {INSTITUTIONS.map(inst => (
                      <button 
                        key={inst.id}
                        onClick={() => setSelectedInst(prev => prev.includes(inst.id) ? prev.filter(i => i !== inst.id) : [...prev, inst.id])}
                        className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${
                          selectedInst.includes(inst.id) 
                            ? 'bg-indigo-50 border-indigo-600 shadow-md translate-x-1' 
                            : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                           <div className={`p-3 rounded-xl transition-colors ${selectedInst.includes(inst.id) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                             <inst.icon size={18} />
                           </div>
                           <div className="text-left">
                             <div className="text-sm font-black text-slate-900">{inst.name}</div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{inst.category}</div>
                           </div>
                        </div>
                        {selectedInst.includes(inst.id) && <CheckCircle2 size={20} className="text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {submissionStep === 'submitting' && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-ping"></div>
                    <Globe size={80} className="text-indigo-600 relative z-10 animate-[spin_8s_linear_infinite]" />
                  </div>
                  <div className="space-y-4 w-full max-w-sm">
                    <h3 className="text-2xl font-black text-slate-950">Transmitting Credentials</h3>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                       <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${submissionProgress}%` }}></div>
                    </div>
                    <div className="flex flex-col space-y-1">
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] font-mono">
                          {submissionProgress < 30 ? 'ENCRYPTING PACKET...' : 
                           submissionProgress < 60 ? 'VALIDATING SOVEREIGN SIGNATURE...' : 
                           submissionProgress < 90 ? 'ROUTING TO BOARD GATEWAY...' : 'FINALIZING HANDSHAKE...'}
                       </span>
                    </div>
                  </div>
                </div>
              )}

              {submissionStep === 'success' && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500">
                   <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xl border-4 border-white">
                      <FileCheck size={48} />
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-3xl font-black text-slate-950">Escalation Executed</h3>
                     <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                       Your proposal has been cryptographically signed and delivered to the boardrooms of <span className="text-indigo-600 font-black">{selectedInst.length}</span> institutions. You will receive an intelligence notification upon receipt validation.
                     </p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 font-mono text-[10px] text-slate-400 w-full text-left">
                      <p className="font-bold text-slate-600 mb-2">RECEIPT_LOG_STDOUT:</p>
                      <p>TOKEN: 0xFD28...A91C</p>
                      <p>TIMESTAMP: {new Date().toISOString()}</p>
                      <p>DESTINATIONS: {selectedInst.join(', ')}</p>
                      <p>STATUS: DELIVERED_SECURE</p>
                   </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
               {submissionStep === 'idle' ? (
                 <button 
                  disabled={selectedInst.length === 0}
                  onClick={handleEscalate}
                  className="w-full bg-slate-950 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3"
                 >
                   <Send size={18} />
                   <span>Execute Escalation</span>
                 </button>
               ) : submissionStep === 'success' ? (
                 <button 
                  onClick={() => setIsEscalationOpen(false)}
                  className="w-full bg-slate-950 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                 >
                   Return to Hub
                 </button>
               ) : (
                 <div className="py-5 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Transmission in progress...</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* 1. Decision Header Bar (Hero Section) */}
      <div className="relative h-[600px] w-full overflow-hidden bg-slate-900 rounded-b-[4rem] shadow-2xl">
        <img 
          src={heroImage} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay grayscale" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950"></div>
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-10 py-16 flex flex-col justify-between">
          <button 
            onClick={() => navigate('/explore')}
            className="flex items-center space-x-3 text-white/50 hover:text-white transition-all group w-fit bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Ideas Hub</span>
          </button>

          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-4">
                <div className="bg-rose-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest animate-pulse shadow-2xl shadow-rose-900/50">
                  {idea.status} • Awaiting Board Quorum
                </div>
                <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em]">Protocol Version {idea.version}.0</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none max-w-5xl drop-shadow-2xl">
                {idea.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-white/40 uppercase tracking-widest">
                <span className="flex items-center space-x-2.5">
                  <Milestone size={16} className="text-indigo-400" />
                  <span className="text-white/70">Next: Working Group Formation</span>
                </span>
                <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
                <span className="text-rose-400 flex items-center space-x-2">
                   <Activity size={14} />
                   <span>312 endorsements needed</span>
                </span>
                <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
                <div className="flex items-center space-x-3">
                  <span>Stakeholder Power:</span>
                  <div className="flex text-amber-400 space-x-1">
                    <Zap size={14} className="fill-current" /><Zap size={14} className="fill-current" /><Zap size={14} className="fill-current" /><Zap size={14} className="text-white/10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 w-fit shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
              {!isJoined && (
                <button onClick={handleJoin} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl active:scale-95">
                  Join Working Group
                </button>
              )}
              <button onClick={() => onVote(idea.id, 'up')} className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center space-x-3 active:scale-95 shadow-xl">
                <Award size={20} />
                <span>Endorse</span>
              </button>
              <button className="bg-white/10 text-rose-400 border border-white/10 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500/20 transition-all flex items-center justify-center space-x-3 active:scale-95">
                <Flag size={20} />
                <span>Challenge</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Main Content Area: Detailed Wikipedia Style */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* 3. Structured Argument Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-indigo-600">
                  <div className="p-2.5 bg-indigo-50 rounded-xl shadow-sm"><Workflow size={20} /></div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">System Framing</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-bold">
                  Proposes an integrated system of AI capital, domestic governance, and secure physical infrastructure.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-rose-600">
                  <div className="p-2.5 bg-rose-50 rounded-xl shadow-sm"><AlertTriangle size={20} /></div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Why This Matters</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-bold">
                  Prevents strategic dependency on foreign hyper-scalers, reinforcing national capacity and aligning leadership.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-emerald-600">
                  <div className="p-2.5 bg-emerald-50 rounded-xl shadow-sm"><Anchor size={20} /></div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Success State</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-bold">
                  Policy alignment achieved through localized infrastructure and fully accountable AI operations.
                </p>
              </div>
            </section>

            {/* Abstract Section - Wikipedia style with Expandable Context */}
            <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-12 space-y-10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                  <div className="flex items-center space-x-4">
                    <BookOpen size={24} className="text-indigo-600" />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Abstract and Context</h2>
                  </div>
                  <button 
                    onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <span>{isAbstractExpanded ? 'Collapse' : 'Expand Full Context'}</span>
                    {isAbstractExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                <div className={`prose prose-slate max-w-none serif transition-all duration-700 overflow-hidden ${isAbstractExpanded ? 'max-h-[2000px]' : 'max-h-[300px]'}`}>
                  <p className="text-xl text-slate-800 leading-relaxed font-medium mb-8">
                    {idea.description}
                  </p>
                  
                  {isAbstractExpanded && (
                    <div className="space-y-12 pt-8 border-t border-slate-50 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 font-sans tracking-tight">1. Technical Architecture</h3>
                        <p className="text-slate-600 leading-relaxed">
                          The implementation follows a modular decentralized framework. Key technical modules include the <span className="font-bold text-slate-800">Genesis Orchestration Layer</span> for distributed compute and the <span className="font-bold text-slate-800">Sovereign Data Vaults</span> for ensuring regional residency of model weights and training datasets.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-mono text-xs text-slate-500 space-y-2">
                          <p>// Protocol Specification v1.2</p>
                          <p>IDENTIFIER: HUB_ID_{idea.id.toUpperCase()}</p>
                          <p>ENCRYPTION: E2EE_AES256_QUANTUM_RESISTANT</p>
                          <p>DEPENDENCIES: [GENESIS_NODES, EEA_REGISTRY]</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 font-sans tracking-tight">2. Historical Precedent</h3>
                        <p className="text-slate-600 leading-relaxed">
                          This proposal builds on the lessons from the 2024 "Open Infrastructure Accord." It shifts the paradigm from shared global dependencies to "Regional Autonomy under Mutual Defense" protocols. 
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 font-sans tracking-tight">3. Strategic Alignment</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Aligns with Directive 42-B regarding national digital preparedness. It specifically addresses the "Shadow AI" problem by centralizing institutional governance without sacrificing departmental speed.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!isAbstractExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                  )}
                </div>
              </div>
            </section>

            {/* 4. Discussion Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-4">
                  <MessageSquare className="text-indigo-600" size={32} />
                  <span>Institutional Deliberation ({localComments.length})</span>
                </h3>
                {localComments.length > 0 && (
                  <button 
                    disabled={isSummarizing}
                    onClick={handleSummarize}
                    className="flex items-center space-x-2 bg-white px-6 py-2.5 rounded-xl border border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    {isSummarizing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    <span>Synthesize Discussion</span>
                  </button>
                )}
              </div>

              {aiSummary && (
                <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-indigo-400">AI Intelligence Summary</h4>
                  <p className="text-lg leading-relaxed font-medium italic">"{aiSummary}"</p>
                </div>
              )}

              {localComments.length === 0 ? (
                <div className="bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 p-16 text-center space-y-10">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                       <MessageSquare size={24} className="text-slate-200" />
                    </div>
                    <p className="text-slate-600 text-lg font-bold">💬 This idea needs its first institutional critique.</p>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">Select a lens below to lower the friction of initial review.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {["Add a governance risk", "Propose a constraint", "Suggest a partner", "Challenge an assumption"].map(prompt => (
                      <button 
                        key={prompt}
                        onClick={() => setCommentText(prompt + ": ")}
                        className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {localComments.map(comment => (
                    <div key={comment.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-start space-x-8 animate-in fade-in transition-all hover:border-indigo-100">
                      <img src={`https://picsum.photos/seed/${comment.userId}/56`} className="w-14 h-14 rounded-2xl border-4 border-slate-50 shadow-sm" alt="" />
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-slate-900 uppercase tracking-widest">{comment.userName}</span>
                          <span className="text-[10px] text-slate-300 font-bold uppercase">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-base text-slate-600 leading-relaxed font-medium">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl">
                <form onSubmit={handlePostComment} className="space-y-8">
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Analyze value or propose a technical refinement..."
                    className="w-full bg-slate-50 border-none rounded-3xl px-10 py-8 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none min-h-[200px] resize-none shadow-inner"
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="bg-slate-950 text-white px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl active:scale-95">
                      Post Strategic Observation
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>

          {/* Right Column: Sovereignty Profile & Authority (Sidebar) */}
          <div className="space-y-12 sticky top-32">
            
            {/* 2. Sovereignty Profile Card */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-950 p-10 text-white flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em]">Strategic Profiles</h4>
                <Scale size={20} className="text-indigo-400" />
              </div>
              <div className="p-12 space-y-10">
                <div className="space-y-3">
                   <p className="text-sm font-black text-slate-900 leading-tight">
                    Multi-Dimensional Analysis: Impact, Autonomy, and Geopolitical Friction.
                  </p>
                </div>
                
                <div className="space-y-8">
                  <SovereigntyMetric label="Strategic Impact" score={idea.impactScore} colorClass="text-indigo-600" />
                  <SovereigntyMetric label="National Sovereignty" score={idea.sovereigntyScore} colorClass="text-rose-600" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Link 
                    to={`/idea/${idea.id}/profile`}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <BarChart3 size={14} />
                    <span>Sovereignty Profile</span>
                  </Link>
                  <Link 
                    to={`/idea/${idea.id}/diplomatic`}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Gavel size={14} className="text-indigo-400" />
                    <span>Diplomatic War Room</span>
                  </Link>
                </div>

                <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 mt-10">
                  <p className="text-xs text-indigo-900 font-bold leading-relaxed italic">
                    "This proposal prioritizes autonomy and governance over near-term revenue."
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Author Authority Block */}
            <div className="bg-white rounded-[3rem] border border-slate-200 p-12 space-y-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[4rem] flex items-center justify-center">
                 <UserCheck size={28} className="text-emerald-600 translate-x-3 -translate-y-3" />
              </div>
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authority Manifest</h4>
                <div className="flex items-center space-x-6">
                  <img src={`https://picsum.photos/seed/${idea.authorId}/96`} className="w-24 h-24 rounded-[2rem] border-4 border-slate-50 shadow-md" alt="" />
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{idea.authorName}</p>
                    <p className="text-xs text-indigo-600 font-black uppercase tracking-widest">{idea.category.split(' ')[0]} Specialist</p>
                    <div className="flex flex-wrap gap-2">
                       <span className="text-[9px] bg-slate-950 text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter shadow-sm">Independent</span>
                       <span className="text-[9px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black uppercase tracking-tighter">Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-8 border-t border-slate-50">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Scope of Authority</span>
                  <span className="text-slate-900">National Strategy</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Track Record</span>
                  <span className="text-slate-900">3 Adopted Proposals</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Hub Trust Index</span>
                  <span className="text-emerald-600 font-black">A+ VERIFIED</span>
                </div>
              </div>
            </div>

            {/* 6. Institutional Escalation */}
            <div className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
               <div className="relative z-10 space-y-8">
                 <div className="space-y-3">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Institutional Escalation</h4>
                   <p className="text-base text-indigo-50 font-medium leading-relaxed">Submit this idea to accredited partners for high-level formal review.</p>
                 </div>
                 <button 
                  onClick={() => setIsEscalationOpen(true)}
                  className="w-full bg-white text-indigo-600 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center space-x-4 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] active:scale-95"
                 >
                   <ArrowUpRight size={24} />
                   <span>Submit to Institutions</span>
                 </button>
                 <div className="flex items-center justify-center space-x-6 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                    <span className="text-[10px] font-black uppercase tracking-tighter">Regulators</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Public Labs</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Strategic Councils</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowUpRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
);

export default IdeaDetailPage;
