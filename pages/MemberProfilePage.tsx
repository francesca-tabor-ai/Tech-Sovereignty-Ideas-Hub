
import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_USERS } from '../constants';
import { Idea } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Trophy, 
  ShieldCheck, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight,
  Mail,
  Linkedin,
  Twitter,
  Globe,
  Award,
  Zap,
  Calendar
} from 'lucide-react';

interface MemberProfilePageProps {
  ideas: Idea[];
}

const MemberProfilePage: React.FC<MemberProfilePageProps> = ({ ideas }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const user = useMemo(() => MOCK_USERS.find(u => u.id === userId), [userId]);
  const userIdeas = useMemo(() => ideas.filter(i => i.authorId === userId), [userId, ideas]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Member Not Found</h2>
        <button 
          onClick={() => navigate('/members')}
          className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </button>
      </div>
    );
  }

  const impactRank = MOCK_USERS.indexOf(user) + 1;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Nav */}
      <button 
        onClick={() => navigate('/members')}
        className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest pt-4"
      >
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span>Back to Directory</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col: Profile Stats & Info */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-xl opacity-20"></div>
              <img 
                src={user.avatar} 
                className="w-40 h-40 rounded-full border-8 border-white shadow-2xl relative z-10" 
                alt={user.name} 
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white rounded-full w-10 h-10 flex items-center justify-center text-white shadow-lg z-20">
                <ShieldCheck size={20} />
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-2">{user.name}</h1>
            <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">{user.role}</p>
            
            <div className="flex flex-col items-center space-y-3 mb-10">
              <div className="flex items-center space-x-2 text-slate-600 font-bold">
                <Building2 size={18} className="text-slate-400" />
                <span>{user.organization}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                <MapPin size={16} className="text-slate-400" />
                <span>Verified Stakeholder Hub</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Rank</div>
                <div className="text-2xl font-black text-slate-900">#{impactRank}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reputation</div>
                <div className="text-2xl font-black text-indigo-600">{user.points.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:bg-white hover:shadow-md">
                <Mail size={20} />
              </button>
              <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:bg-white hover:shadow-md">
                <Linkedin size={20} />
              </button>
              <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:bg-white hover:shadow-md">
                <Twitter size={20} />
              </button>
              <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:bg-white hover:shadow-md">
                <Globe size={20} />
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Contributor Achievements</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 group">
                <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                  <Award size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Policy Architect</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Authored 5+ high-impact proposals</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rapid Responder</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">100+ community peer reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Activity / Proposals */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Initiatives ({userIdeas.length})</h2>
              <Link to="/explore" className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">View All Hub Proposals</Link>
            </div>

            <div className="space-y-6">
              {userIdeas.length > 0 ? userIdeas.map(idea => (
                <Link 
                  to={`/idea/${idea.id}`}
                  key={idea.id} 
                  className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all group flex flex-col md:flex-row items-center gap-8"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{idea.category}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">v{idea.version}.0</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{idea.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{idea.description}</p>
                    
                    <div className="flex items-center space-x-6 pt-2">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <TrendingUp size={14} className="text-indigo-500" />
                        <span className="text-xs font-bold text-slate-700">{idea.impactScore}% Impact</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <MessageSquare size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">{idea.comments.length} Reviews</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">{new Date(idea.timestamp).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                    <ChevronRight size={24} />
                  </div>
                </Link>
              )) : (
                <div className="py-20 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="bg-white p-4 rounded-full shadow-sm">
                    <Zap size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-600">No proposals authored yet.</h3>
                  <Link to="/draft" className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Draft First Initiative</Link>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Network Activity</h2>
            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {[
                { label: 'Endorsed Proposal', meta: 'National Quantum Security Layer', time: '2 hours ago', icon: Zap },
                { label: 'Published Review', meta: 'European Trusted Cloud Alliance', time: '1 day ago', icon: MessageSquare },
                { label: 'Joined Working Group', meta: 'Sovereign AI Infrastructure', time: '3 days ago', icon: ShieldCheck }
              ].map((activity, i) => (
                <div key={i} className="relative pl-12 flex items-center justify-between group">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm z-10 group-hover:border-indigo-500 transition-colors">
                    <activity.icon size={14} className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{activity.label}</h4>
                    <p className="text-xs text-slate-500">{activity.meta}</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{activity.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MemberProfilePage;
