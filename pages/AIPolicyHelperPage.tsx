
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit,
  FileEdit,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { draftProposal, DraftedProposal } from '../geminiService';
import { Idea, Category, User } from '../types';

interface AIPolicyHelperPageProps {
  onAddIdea: (idea: Idea) => void;
  currentUser: User | null;
  onRequireAuth: () => void;
}

const AIPolicyHelperPage: React.FC<AIPolicyHelperPageProps> = ({ onAddIdea, currentUser, onRequireAuth }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [rawInput, setRawInput] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [proposal, setProposal] = useState<DraftedProposal | null>(null);

  const handleStartDrafting = async () => {
    if (!rawInput.trim()) return;
    setIsDrafting(true);
    try {
      const result = await draftProposal(rawInput);
      setProposal(result);
      setStep(2);
    } catch (error) {
      alert("AI failed to assist with your proposal. Please try again.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handlePublish = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (!proposal) return;

    const newIdea: Idea = {
      id: `id${Date.now()}`,
      title: proposal.title,
      description: proposal.description,
      category: proposal.category as Category,
      authorId: currentUser.id,
      authorName: currentUser.name,
      timestamp: Date.now(),
      status: 'Proposed',
      impactScore: 75,
      feasibilityScore: 75,
      revenueScore: 50,
      sovereigntyScore: 80,
      votes: { up: 0, down: 0 },
      comments: [],
      tags: proposal.tags,
      version: 1
    };

    onAddIdea(newIdea);
    navigate('/explore');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Policy Helper</h1>
            <p className="text-slate-500">Transform raw concepts into initiatives.</p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={24} className="text-slate-400" />
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center space-x-4 mb-12 overflow-x-auto pb-4">
        {[
          { num: 1, label: 'Ideation', icon: Sparkles },
          { num: 2, label: 'Structuring', icon: FileEdit },
          { num: 3, label: 'Validation', icon: Globe }
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-4 shrink-0">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
              step === s.num ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 
              step > s.num ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              {step > s.num ? <CheckCircle2 size={16} /> : <s.icon size={16} />}
              <span className="text-sm font-bold">{s.label}</span>
            </div>
            {s.num < 3 && <div className="w-8 h-px bg-slate-200"></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">What's the core idea?</h2>
            <p className="text-slate-500 text-sm">Describe your proposal in plain language. Mention stakeholders and why sovereignty matters.</p>
          </div>

          <textarea 
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="e.g. We need a way for regulators to share secure AI model datasets without relying on cloud providers. It should use local data centers..."
            className="w-full min-h-[200px] p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium leading-relaxed resize-none"
          />

          <div className="flex items-center justify-between pt-4">
             <div className="flex items-center space-x-2 text-indigo-600">
               <Zap size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">AI Powered</span>
             </div>
             <button 
              onClick={handleStartDrafting}
              disabled={isDrafting || !rawInput.trim()}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center space-x-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
             >
               {isDrafting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
               <span>{isDrafting ? 'Structuring...' : 'Start Drafting'}</span>
             </button>
          </div>
        </div>
      )}

      {step === 2 && proposal && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                AI Structured Result
              </span>
              <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center space-x-1">
                <ArrowLeft size={14} />
                <span>Refine Input</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Formal Title</label>
                <input 
                  value={proposal.title}
                  onChange={(e) => setProposal({...proposal, title: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xl font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    value={proposal.category}
                    onChange={(e) => setProposal({...proposal, category: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Governance & Standards</option>
                    <option>Sovereign Infrastructure</option>
                    <option>Capital & Risk</option>
                    <option>Market Design</option>
                    <option>Talent & Education</option>
                    <option>Narrative & Influence</option>
                    <option>Frontier / Radical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {proposal.tags.map((tag, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-[10px] font-black text-slate-600 px-3 py-1 rounded-lg">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary</label>
                <textarea 
                  value={proposal.description}
                  onChange={(e) => setProposal({...proposal, description: e.target.value})}
                  rows={6}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <Globe size={16} />
                  <h4 className="text-xs font-black uppercase tracking-widest">Impact Forecast</h4>
                </div>
                <p className="text-sm text-emerald-900 font-medium leading-relaxed italic">"{proposal.impactForecast}"</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button 
                onClick={handlePublish}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center space-x-3"
              >
                <Save size={18} />
                <span>Publish to Ideas Hub</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertCircle className="text-indigo-400" size={24} />
              <p className="text-sm font-medium">Ready for collaboration? Launch a Workspace after publishing.</p>
            </div>
            <ArrowRight className="text-slate-600" />
          </div>
        </div>
      )}
    </div>
  );
};

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>
);

export default AIPolicyHelperPage;
