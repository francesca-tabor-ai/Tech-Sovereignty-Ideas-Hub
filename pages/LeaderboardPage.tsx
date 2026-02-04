
import React from 'react';
import { MOCK_USERS } from '../constants';
import { Trophy, Medal, Star, ChevronRight } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.points - a.points);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="text-amber-600" size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Contributor Hall of Fame</h1>
        <p className="text-slate-500">Recognizing the most impactful voices in tech sovereignty.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-12 p-6 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-6">Contributor</div>
          <div className="col-span-2 text-center">Impact Points</div>
          <div className="col-span-3 text-right">Badges</div>
        </div>

        <div className="divide-y divide-slate-50">
          {sortedUsers.map((user, index) => (
            <div key={user.id} className="grid grid-cols-12 p-6 items-center hover:bg-slate-50 transition-colors group">
              <div className="col-span-1 flex items-center">
                {index === 0 ? <Medal className="text-amber-400" size={24} /> : 
                 index === 1 ? <Medal className="text-slate-400" size={24} /> : 
                 index === 2 ? <Medal className="text-amber-700" size={24} /> : 
                 <span className="text-lg font-bold text-slate-300 ml-2">{index + 1}</span>}
              </div>
              
              <div className="col-span-6 flex items-center space-x-4">
                <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="" />
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{user.role}</p>
                </div>
              </div>

              <div className="col-span-2 text-center">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black text-sm">
                  {user.points.toLocaleString()}
                </span>
              </div>

              <div className="col-span-3 flex justify-end space-x-2">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-help" title="Top 10% Contributor">
                  <Star size={16} />
                </div>
                <div className="bg-slate-100 p-2 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors cursor-help" title="Policy Architect">
                  <Shield size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
          <h4 className="font-bold mb-2">Monthly Challenge</h4>
          <p className="text-xs text-indigo-100 mb-4 opacity-80">Be the top contributor in AI Governance to earn 500 bonus points.</p>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-xl text-xs backdrop-blur-md transition-all">
            Join Challenge
          </button>
        </div>
        
        <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-2">My Rank</h4>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl font-black text-indigo-600">#14</span>
            <span className="text-xs text-slate-400">Out of 120</span>
          </div>
          <div className="w-full bg-white h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">120 points until next rank</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl text-white">
          <h4 className="font-bold mb-4">Earn Points</h4>
          <ul className="text-xs space-y-2 opacity-80">
            <li className="flex items-center justify-between">
              <span>Submit Idea</span>
              <span className="font-bold text-green-400">+100</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Vote & Review</span>
              <span className="font-bold text-green-400">+10</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Collaborate</span>
              <span className="font-bold text-green-400">+50</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Shield = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default LeaderboardPage;
