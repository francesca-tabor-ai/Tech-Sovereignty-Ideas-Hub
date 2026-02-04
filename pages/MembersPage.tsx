
import React from 'react';
import { MOCK_USERS } from '../constants';
import { Users, Search, Mail, MapPin, Building2, ChevronRight, Filter, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MembersPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <Users size={12} />
            <span>Directory</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Members</h1>
          <p className="text-slate-500 max-w-xl">Connect with the regulators, investors, and academics driving technological sovereignty.</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_USERS.map(user => (
          <Link 
            to={`/members/${user.id}`}
            key={user.id} 
            className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group flex flex-col text-center"
          >
            <div className="relative mx-auto mb-6">
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <img 
                src={user.avatar} 
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg relative z-10" 
                alt={user.name} 
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full z-20 shadow-sm"></div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{user.name}</h3>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">{user.role}</p>
            
            <div className="flex flex-col items-center space-y-2 mb-8 flex-1">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                <Building2 size={14} />
                <span>{user.organization}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                <MapPin size={12} />
                <span>Verified Stakeholder</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Score</div>
                <div className="text-lg font-black text-slate-900">{user.points.toLocaleString()}</div>
              </div>
              <div className="w-full flex items-center justify-center space-x-2 bg-slate-950 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                <UserCircle size={14} />
                <span>View Profile</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Placeholder for more members */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-60">
             <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
               <Users size={32} className="text-slate-300" />
             </div>
             <div className="space-y-1">
               <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
               <div className="h-3 w-20 bg-slate-100 rounded animate-pulse mx-auto"></div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
