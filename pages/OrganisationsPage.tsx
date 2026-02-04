
import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  ShieldCheck, 
  ArrowUpDown, 
  ChevronRight,
  Globe,
  Cpu,
  Shield,
  Cloud,
  Layers,
  Database,
  Satellite as SatelliteIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_ORGANISATIONS, ORGANISATION_TYPES, TECH_CATEGORIES } from '../constants';
import { Organisation, OrganisationType, TechCategory } from '../types';

type SortOption = 'name' | 'members' | 'type';

const OrganisationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<OrganisationType | 'All'>('All');
  const [selectedTech, setSelectedTech] = useState<TechCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const filteredOrganisations = useMemo(() => {
    return MOCK_ORGANISATIONS.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            org.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || org.type === selectedType;
      const matchesTech = selectedTech === 'All' || org.techCategories.includes(selectedTech as TechCategory);
      return matchesSearch && matchesType && matchesTech;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'members') return b.memberCount - a.memberCount;
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });
  }, [searchQuery, selectedType, selectedTech, sortBy]);

  const getTechIcon = (cat: TechCategory) => {
    switch (cat) {
      case 'Cloud': return <Cloud size={12} />;
      case 'AI/ML': return <Sparkles size={12} />;
      case 'Security': return <Shield size={12} />;
      case 'Chips': return <Cpu size={12} />;
      case 'Quantum': return <Database size={12} />;
      case 'Satellite': return <SatelliteIcon size={12} />;
      default: return <Layers size={12} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="pt-12 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          <Building size={12} />
          <span>Ecosystem</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Organisations</h1>
          <p className="text-slate-500 max-w-2xl">The institutional backbone of the Sovereign Ideas Hub. Connect with partners leading digital autonomy initiatives.</p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or mission statement..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900 placeholder:text-slate-300 transition-all shadow-inner"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer shadow-inner"
            >
              <option value="All">All Types</option>
              {ORGANISATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer shadow-inner"
            >
              <option value="name">Sort by Name</option>
              <option value="members">Sort by Scale</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-6 border-t border-slate-50">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-full mb-2">Filter by Technology Category</span>
          {['All', ...TECH_CATEGORIES].map((tech) => (
            <button 
              key={tech}
              onClick={() => setSelectedTech(tech as any)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border flex items-center space-x-2 ${
                selectedTech === tech 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {tech !== 'All' && getTechIcon(tech as TechCategory)}
              <span>{tech}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredOrganisations.length > 0 ? (
          filteredOrganisations.map(org => (
            <Link 
              to={`/members/organisations/${org.id}`}
              key={org.id} 
              className="bg-white rounded-[3rem] border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="relative">
                  <div className="absolute -inset-2 bg-indigo-500/10 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img 
                    src={org.avatar} 
                    className="w-16 h-16 rounded-[1.5rem] border-2 border-white shadow-md relative z-10" 
                    alt={org.name} 
                  />
                  {org.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white z-20 shadow-sm">
                      <ShieldCheck size={12} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Scale</span>
                  <span className="text-sm font-black text-slate-900">{org.memberCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{org.name}</h3>
                  <div className="flex items-center space-x-2 mt-1 text-indigo-600">
                    <span className="text-[9px] font-black uppercase tracking-widest">{org.type}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                  {org.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {org.techCategories.map(tech => (
                    <span key={tech} className="bg-slate-50 text-slate-600 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-slate-100 flex items-center space-x-1">
                      {getTechIcon(tech)}
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-400">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold uppercase">{org.location}</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                  <span>Explore</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="p-8 bg-slate-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-slate-200">
              <Building size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registry Search Complete</h3>
              <p className="text-slate-400 max-w-xs mx-auto font-medium">No organisations found matching your current institutional criteria.</p>
            </div>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedType('All'); setSelectedTech('All'); }}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              Reset Global Registry View
            </button>
          </div>
        )}
      </div>

      {/* Featured Coalition Widget */}
      <section className="bg-indigo-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full"></div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 backdrop-blur-md">
                <Globe size={12} className="text-indigo-300" />
                <span>Strategic Coalition</span>
              </div>
              <h2 className="text-4xl font-black tracking-tight leading-none">Regional AI Infrastructure Alliance</h2>
              <p className="text-indigo-100/70 text-lg font-medium leading-relaxed italic">"Combining resources from 12+ sovereign states to secure hardware independence and model safety protocols."</p>
              <button className="flex items-center space-x-3 bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                <span>Request Access to Private Data Vaults</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 mb-4 flex items-center justify-center font-black">#0{i}</div>
                    <h4 className="font-bold text-sm mb-1">Alliance Hub {i}</h4>
                    <p className="text-[10px] text-indigo-300 uppercase font-black">Node Status: Active</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default OrganisationsPage;
