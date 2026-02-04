import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Idea, Category, User } from '../types';
import { CATEGORIES } from '../constants';
import IdeaCard from '../components/IdeaCard';
import { 
  Plus, 
  X, 
  Loader2, 
  Sparkles, 
  Sliders, 
  LayoutGrid, 
  List, 
  ArrowUpDown,
  Search as SearchIcon,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { analyzeIdea, AnalysisResult } from '../geminiService';

interface ExplorePageProps {
  ideas: Idea[];
  onVote: (id: string, dir: 'up' | 'down') => void;
  onAddIdea: (idea: Idea) => void;
  currentUser: User | null;
  onRequireAuth: () => void;
}

type SortOption = 'newest' | 'impact' | 'sovereignty' | 'votes';

const ExplorePage: React.FC<ExplorePageProps> = ({ ideas, onVote, onAddIdea, currentUser, onRequireAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState<Category>(CATEGORIES[0]);
  const [impact, setImpact] = useState(50);
  const [feasibility, setFeasibility] = useState(50);
  const [revenue, setRevenue] = useState(50);
  const [sovereignty, setSovereignty] = useState(50);
  const [parentIdeaId, setParentIdeaId] = useState<string | undefined>();
  const [version, setVersion] = useState(1);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refineId = params.get('refine');
    if (refineId) {
      const parent = ideas.find(i => i.id === refineId);
      if (parent) {
        if (!currentUser) {
          onRequireAuth();
          return;
        }
        setTitle(`Refined: ${parent.title}`);
        setDesc(parent.description);
        setCat(parent.category);
        setImpact(parent.impactScore);
        setFeasibility(parent.feasibilityScore);
        setRevenue(parent.revenueScore);
        setSovereignty(parent.sovereigntyScore);
        setParentIdeaId(parent.id);
        setVersion(parent.version + 1);
        setModalOpen(true);
      }
    }
  }, [location.search, ideas, currentUser, onRequireAuth]);

  // Simulate loading on filter/search for better micro-interaction
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  const processedIdeas = useMemo(() => {
    let filtered = ideas.filter(idea => {
      const matchesCategory = selectedCategory === 'All' || idea.category === selectedCategory;
      const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            idea.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'impact') return b.impactScore - a.impactScore;
      if (sortBy === 'sovereignty') return b.sovereigntyScore - a.sovereigntyScore;
      if (sortBy === 'votes') return (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down);
      return 0;
    });
  }, [ideas, selectedCategory, searchQuery, sortBy]);

  const handleAiAssist = async () => {
    if (!title || !desc) return;
    setIsAnalyzing(true);
    const result = await analyzeIdea(title, desc);
    setAiAnalysis(result);
    setCat(result.suggestedCategory as Category);
    setSovereignty(result.sovereigntyScore);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    const newIdea: Idea = {
      id: `id${Date.now()}`,
      title,
      description: desc,
      category: cat,
      authorId: currentUser.id,
      authorName: currentUser.name,
      timestamp: Date.now(),
      status: 'Proposed',
      impactScore: impact,
      feasibilityScore: feasibility,
      revenueScore: revenue,
      sovereigntyScore: sovereignty,
      votes: { up: 0, down: 0 },
      comments: [],
      tags: ['New', cat.split(' ')[0]],
      version: version,
      parentIdeaId: parentIdeaId
    };
    onAddIdea(newIdea);
    setModalOpen(false);
    navigate('/explore');
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setImpact(50);
    setFeasibility(50);
    setRevenue(50);
    setSovereignty(50);
    setAiAnalysis(null);
    setParentIdeaId(undefined);
    setVersion(1);
  };

  const ScoreSlider = ({ label, value, onChange, colorClass }: any) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        <span className={`text-xs font-black ${colorClass}`}>{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" max="100" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );

  const IdeaListItem = ({ idea }: { idea: Idea }) => {
    const thumbImage = useMemo(() => {
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
      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group flex items-center justify-between animate-in fade-in duration-300">
        <div className="flex items-center space-x-6 flex-1 min-w-0">
          <div className="relative w-16 h-20 shrink-0">
             <img src={thumbImage} className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
             <div className="absolute inset-0 bg-slate-900/10 rounded-2xl group-hover:bg-transparent transition-colors"></div>
             <div className="absolute -bottom-2 -right-2 bg-white border border-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-slate-900 shadow-sm">
               {idea.votes.up - idea.votes.down}
             </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50/50 px-2 py-0.5 rounded">{idea.category}</span>
              <span className="text-[9px] font-black text-slate-400 bg-slate-950 text-white px-2 py-0.5 rounded-full shadow-sm">v{idea.version}.0</span>
            </div>
            <h3 
              onClick={() => navigate(`/idea/${idea.id}`)}
              className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate cursor-pointer tracking-tight"
            >
              {idea.title}
            </h3>
            <div className="flex items-center space-x-5 mt-2">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <MessageSquare size={14} />
                <span className="text-[10px] font-black">{idea.comments.length}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-400">
                <TrendingUp size={14} className="text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">{idea.impactScore}% Impact</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-400">
                <ShieldCheck size={14} className="text-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">{idea.sovereigntyScore}% Sov.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6 ml-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[11px] font-black text-slate-900 tracking-tight">{idea.authorName}</span>
            <span className="text-[9px] text-indigo-600 font-black uppercase tracking-widest">{idea.status}</span>
          </div>
          <button 
            onClick={() => navigate(`/idea/${idea.id}`)}
            className="p-3 text-slate-300 group-hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="pt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <LayoutGrid size={12} />
            <span>Hub</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ideas</h1>
            <p className="text-slate-500 font-medium">Coordinate the next generation of sovereign infrastructure.</p>
          </div>
        </div>
        <button 
          onClick={() => { 
            if (!currentUser) {
              onRequireAuth();
            } else {
              resetForm(); 
              setModalOpen(true); 
            }
          }}
          className="bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 active:scale-95 transition-all group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add New Idea</span>
        </button>
      </header>

      {/* Filter & Action Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Filter by title, rationale, or stakeholder..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900 placeholder:text-slate-300 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
            </div>

            <div className="relative">
              <ArrowUpDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-12 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer min-w-[200px] shadow-sm hover:bg-slate-100 transition-colors"
              >
                <option value="newest">Chronological</option>
                <option value="impact">Highest Impact</option>
                <option value="sovereignty">Highest Sovereignty</option>
                <option value="votes">Most Votes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-4 border-t border-slate-50">
          {['All', ...CATEGORIES].map((category) => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                selectedCategory === category 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {isFiltering && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[3rem] animate-in fade-in duration-300 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        )}
        
        {processedIdeas.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "space-y-6"}>
            {processedIdeas.map(idea => (
              <React.Fragment key={idea.id}>
                {viewMode === 'grid' ? (
                  <IdeaCard idea={idea} onVote={onVote} />
                ) : (
                  <IdeaListItem idea={idea} />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="p-8 bg-slate-50 rounded-full text-slate-200 shadow-inner">
              <SearchIcon size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">No initiatives found</h3>
              <p className="text-slate-400 max-w-xs mx-auto font-medium">Try broadening your parameters or search query to find more proposals.</p>
            </div>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Add Idea Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 relative border border-white/20">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10 shadow-sm">
              <div className="flex items-center space-x-5">
                <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-xl shadow-indigo-200">
                  <Sliders size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                    {parentIdeaId ? `Refine Initiative (v${version})` : 'New Sovereign Initiative'}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Contributing to the collective intelligence registry</p>
                </div>
              </div>
              <button onClick={() => { setModalOpen(false); navigate('/explore'); }} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900 active:scale-75">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left Column: Basic Info */}
                <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Initiative Title</label>
                    <input 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text" 
                      placeholder="e.g. National Quantum Security Layer"
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-black text-lg placeholder:text-slate-300 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Strategic Rationale</label>
                    <textarea 
                      required
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      rows={10}
                      placeholder="Detail the technical landscape, current dependency risks, and proposed sovereign architecture..."
                      className="w-full px-8 py-6 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium leading-relaxed resize-none shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Technical Domain</label>
                    <div className="relative group">
                      <select 
                        value={cat}
                        onChange={(e) => setCat(e.target.value as Category)}
                        className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-sm font-black text-slate-900 cursor-pointer shadow-inner group-hover:bg-slate-100 transition-colors"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <Plus size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Right Column: Scoring & AI */}
                <div className="space-y-10">
                  <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-inner">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Metrics</h3>
                      <TrendingUp size={16} className="text-indigo-600 opacity-50" />
                    </div>
                    <div className="space-y-8">
                      <ScoreSlider label="Strategic Impact" value={impact} onChange={setImpact} colorClass="text-indigo-600" />
                      <ScoreSlider label="Operational Feasibility" value={feasibility} onChange={setFeasibility} colorClass="text-emerald-600" />
                      <ScoreSlider label="Revenue Potential" value={revenue} onChange={setRevenue} colorClass="text-amber-600" />
                      <ScoreSlider label="Sovereignty Multiplier" value={sovereignty} onChange={setSovereignty} colorClass="text-rose-600" />
                    </div>
                    
                    <button 
                      type="button"
                      disabled={isAnalyzing || !title || !desc}
                      onClick={handleAiAssist}
                      className="w-full flex items-center justify-center space-x-4 bg-slate-950 text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50 hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 mt-6 group"
                    >
                      {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:animate-pulse" />}
                      <span>{isAnalyzing ? 'Processing Insight...' : 'Validate with Neural AI'}</span>
                    </button>
                  </div>

                  {aiAnalysis && (
                    <div className="bg-indigo-950 p-10 rounded-[2.5rem] text-white space-y-6 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden shadow-2xl border border-white/10">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full"></div>
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Neural Recommendation</span>
                        <div className="text-3xl font-black text-indigo-50 tracking-tighter">{aiAnalysis.sovereigntyScore}%</div>
                      </div>
                      <p className="text-base text-indigo-100/90 leading-relaxed font-bold italic relative z-10 border-l-2 border-indigo-500/50 pl-6">
                        "{aiAnalysis.strategicInsight}"
                      </p>
                      <div className="pt-4 flex flex-wrap gap-3 relative z-10">
                        {aiAnalysis.pros.slice(0, 2).map((pro, i) => (
                          <span key={i} className="text-[9px] font-black bg-white/5 px-3 py-1.5 rounded-xl text-emerald-400 border border-white/10 flex items-center space-x-2">
                             <ShieldCheck size={12} />
                             <span>{pro}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row gap-6">
                <button 
                  type="button"
                  onClick={() => { setModalOpen(false); navigate('/explore'); }}
                  className="px-12 py-5 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                >
                  Save as Draft
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-2xl shadow-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                >
                  <Plus size={18} />
                  <span>{parentIdeaId ? 'Submit Refined Version' : 'Publish to Global Registry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;