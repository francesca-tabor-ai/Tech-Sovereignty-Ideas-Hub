import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageSquare, Target, ShieldCheck, Activity, TrendingUp, Clock } from 'lucide-react';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onVote: (id: string, dir: 'up' | 'down') => void;
}

const ScoreBadge = ({ label, score, colorClass }: { label: string, score: number, colorClass: string }) => (
  <div className="flex flex-col items-center">
    <div className={`text-[10px] font-bold uppercase ${colorClass} mb-1`}>{label}</div>
    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${colorClass.replace('text-', 'bg-')}`} style={{ width: `${score}%` }}></div>
    </div>
  </div>
);

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onVote }) => {
  const totalVotes = idea.votes.up - idea.votes.down;

  const cardImage = useMemo(() => {
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
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-indigo-200 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 group relative overflow-hidden flex flex-col">
      {/* 1. Header Image */}
      <div className="h-48 w-full overflow-hidden relative">
         <img 
          src={cardImage} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
          alt={idea.title} 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
         
         <div className="absolute top-4 right-4">
            <span className="text-[9px] bg-slate-950/80 backdrop-blur-md text-white px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/10 shadow-lg">
              v{idea.version}.0
            </span>
         </div>

         <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/10">
              {idea.category}
            </span>
            <div className="flex items-center text-white/60 space-x-2">
              <Clock size={12} />
              <span className="text-[8px] font-black uppercase tracking-tighter">4h ago</span>
            </div>
         </div>
      </div>

      <div className="p-8 flex items-start space-x-6 relative z-10">
        {/* Voting Sidebar */}
        <div className="flex flex-col items-center space-y-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shrink-0">
          <button 
            onClick={(e) => { e.preventDefault(); onVote(idea.id, 'up'); }}
            className="p-1.5 hover:text-indigo-600 hover:bg-white rounded-lg transition-all active:scale-125"
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
          <span className="font-black text-slate-900 text-xs">{totalVotes}</span>
          <button 
            onClick={(e) => { e.preventDefault(); onVote(idea.id, 'down'); }}
            className="p-1.5 hover:text-rose-500 hover:bg-white rounded-lg transition-all active:scale-125"
          >
            <ArrowDown size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link to={`/idea/${idea.id}`}>
            <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-tight tracking-tight">
              {idea.title}
            </h3>
          </Link>
          
          <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
            {idea.description}
          </p>

          {/* Granular Scores */}
          <div className="grid grid-cols-4 gap-4 py-4 px-5 bg-slate-50 rounded-2xl mb-6 border border-slate-100 group-hover:bg-white group-hover:border-indigo-50 transition-colors">
            <ScoreBadge label="Impact" score={idea.impactScore} colorClass="text-indigo-600" />
            <ScoreBadge label="Feasib." score={idea.feasibilityScore} colorClass="text-emerald-600" />
            <ScoreBadge label="Revenue" score={idea.revenueScore} colorClass="text-amber-600" />
            <ScoreBadge label="Sov." score={idea.sovereigntyScore} colorClass="text-rose-600" />
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-slate-400 space-x-1.5">
                <MessageSquare size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{idea.comments.length}</span>
              </div>
              <div className="flex items-center text-indigo-600 text-[9px] font-black uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {idea.status}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-900 leading-none mb-1 tracking-tight">{idea.authorName}</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Verified Lead</p>
              </div>
              <img src={`https://picsum.photos/seed/${idea.authorId}/32`} className="w-8 h-8 rounded-xl border-2 border-slate-50 shadow-sm" alt={idea.authorName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;