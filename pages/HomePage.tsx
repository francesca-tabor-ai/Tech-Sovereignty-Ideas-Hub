
import React from 'react';
// Added Link import from react-router-dom
import { Link } from 'react-router-dom';
import { Idea } from '../types';
import IdeaCard from '../components/IdeaCard';
// Added Shield and Zap to lucide-react imports
// Fix: Added Shield to the list of icons imported from lucide-react
import { TrendingUp, Activity, Award, ExternalLink, Zap, Milestone, ArrowRight, Shield } from 'lucide-react';

interface HomePageProps {
  ideas: Idea[];
  onVote: (id: string, dir: 'up' | 'down') => void;
}

const HomePage: React.FC<HomePageProps> = ({ ideas, onVote }) => {
  const trendingIdeas = [...ideas].sort((a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down));
  const latestIdeas = [...ideas].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-bold opacity-90 mb-1">Total Impact</h2>
            <div className="text-4xl font-black mb-4">8.4k</div>
            <p className="text-xs font-medium opacity-75">+12% from last month</p>
          </div>
          <Activity className="absolute bottom-[-10px] right-[-10px] w-32 h-32 opacity-10" />
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Active Missions</h2>
            <div className="bg-amber-100 p-1 rounded-lg">
              <Award className="text-amber-600" size={20} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Audit Passports</span>
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded font-bold uppercase">75%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Compute Reserve</span>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-1 rounded font-bold uppercase">40%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Featured Challenge</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              "Securing Sovereign AI Infrastructure for 2030"
            </p>
          </div>
          <button className="mt-4 text-indigo-600 text-xs font-bold flex items-center space-x-1 hover:underline">
            <span>View Challenge Details</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <TrendingUp className="text-indigo-600" size={24} />
              <span>Trending Ideas Hub Proposals</span>
            </h2>
            <Link to="/explore" className="text-indigo-600 text-sm font-bold hover:underline">See all</Link>
          </div>
          
          <div className="space-y-4">
            {trendingIdeas.map(idea => (
              <IdeaCard key={idea.id} idea={idea} onVote={onVote} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Community Roadmap Signal Widget */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Community Pulse</h3>
               <Milestone size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Top Requested Feature</p>
              <h4 className="font-black text-slate-900 leading-tight">Scenario Simulator</h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-black text-indigo-600">256 Supports</span>
                <Link to="/roadmap" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 flex items-center space-x-1 uppercase tracking-widest transition-colors">
                  <span>Vote Now</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800">Fresh Submissions</h2>
          <div className="space-y-4">
            {latestIdeas.map(idea => (
              <div key={idea.id} className="bg-white p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors shadow-sm">
                <span className="text-[9px] font-bold uppercase text-indigo-600 block mb-1">{idea.category}</span>
                <Link to={`/idea/${idea.id}`} className="font-bold text-slate-900 block mb-2 hover:text-indigo-600">{idea.title}</Link>
                <div className="flex items-center space-x-2">
                  <img src={`https://picsum.photos/seed/${idea.authorId}/20`} className="w-5 h-5 rounded-full" alt="" />
                  <span className="text-[10px] text-slate-400">By {idea.authorName}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-950 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="font-black text-lg mb-2 flex items-center space-x-2">
              <Shield className="text-indigo-400" size={24} />
              <span>Ideas Hub</span>
            </h3>
            <p className="text-sm text-indigo-300/80 mb-6 leading-relaxed font-medium">
              Join the institutional network coordinate infrastructure, policy, and strategic capital for technical independence.
            </p>
            <Link 
              to="/explore"
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all block text-center shadow-xl shadow-indigo-950/20"
            >
              Explore Proposals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
