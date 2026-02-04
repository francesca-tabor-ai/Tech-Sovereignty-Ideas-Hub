
import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Lightbulb, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  X,
  Eye,
  Key,
  Database,
  Briefcase,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { User, Idea, Category } from '../types';
import { CATEGORIES } from '../constants';

interface AdminDashboardPageProps {
  ideas: Idea[];
  events: any[];
  users: User[];
  onDeleteIdea: (id: string) => void;
  onUpdateIdea: (idea: Idea) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateEvent: (event: any) => void;
  onDeleteUser: (id: string) => void;
  onUpdateUser: (user: User) => void;
  onAddUser: (user: User) => void;
  onAddIdea: (idea: Idea) => void;
  onAddEvent: (event: any) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  ideas, events, users,
  onDeleteIdea, onUpdateIdea,
  onDeleteEvent, onUpdateEvent,
  onDeleteUser, onUpdateUser,
  onAddUser, onAddIdea, onAddEvent
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'ideas' | 'events'>('ideas');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Entity Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.organization.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredIdeas = ideas.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.authorName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = (type: string, id: string) => {
    if (!window.confirm(`Permanently purge this ${type} from the global registry?`)) return;
    if (type === 'user') onDeleteUser(id);
    if (type === 'idea') onDeleteIdea(id);
    if (type === 'event') onDeleteEvent(id);
  };

  const openEdit = (entity: any) => {
    setEditingEntity(entity);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingEntity({ _type: activeTab });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const type = editingEntity._type || activeTab;
    const isNew = !editingEntity.id;

    if (type === 'users') {
      const u = isNew ? { ...editingEntity, id: `u${Date.now()}`, points: 0 } : editingEntity;
      isNew ? onAddUser(u) : onUpdateUser(u);
    } else if (type === 'ideas') {
      const i = isNew ? { 
        ...editingEntity, 
        id: `id${Date.now()}`, 
        timestamp: Date.now(), 
        version: 1, 
        votes: { up: 0, down: 0 }, 
        comments: [],
        impactScore: 50, feasibilityScore: 50, revenueScore: 50, sovereigntyScore: 50
      } : editingEntity;
      isNew ? onAddIdea(i) : onUpdateIdea(i);
    } else if (type === 'events') {
      const ev = isNew ? { ...editingEntity, id: `e${Date.now()}`, attendees: 0 } : editingEntity;
      isNew ? onAddEvent(ev) : onUpdateEvent(ev);
    }

    setIsModalOpen(false);
    setEditingEntity(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-12">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
            <Shield size={12} />
            <span>Administrative Access</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Root Hub Dashboard</h1>
          <p className="text-slate-500">Global registry orchestration and stakeholder management.</p>
        </div>
        <button 
          onClick={openCreate}
          className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Provision {activeTab.slice(0, -1)}</span>
        </button>
      </header>

      {/* Tabs & Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <nav className="flex space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {[
              { id: 'ideas', label: 'Proposals', icon: Lightbulb },
              { id: 'events', label: 'Convenings', icon: Calendar },
              { id: 'users', label: 'Stakeholders', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder={`Filter global ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Resource</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {activeTab === 'ideas' && filteredIdeas.map(idea => (
              <tr key={idea.id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Lightbulb size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{idea.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Authored by {idea.authorName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase">{idea.category}</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase">{idea.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => openEdit({ ...idea, _type: 'ideas' })} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete('idea', idea.id)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {activeTab === 'events' && filteredEvents.map(event => (
              <tr key={event.id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">{event.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{event.date} • {event.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase">{event.type}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => openEdit({ ...event, _type: 'events' })} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete('event', event.id)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {activeTab === 'users' && filteredUsers.map(user => (
              <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-xl border border-white shadow-sm shrink-0" alt="" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{user.organization}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black uppercase">{user.role}</span>
                    {user.isAdmin && <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-black uppercase">Admin</span>}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => openEdit({ ...user, _type: 'users' })} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete('user', user.id)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {((activeTab === 'ideas' && filteredIdeas.length === 0) || 
          (activeTab === 'events' && filteredEvents.length === 0) || 
          (activeTab === 'users' && filteredUsers.length === 0)) && (
          <div className="p-20 text-center space-y-4">
             <Database size={40} className="mx-auto text-slate-100" />
             <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No resources found in current query buffer.</p>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && editingEntity && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="bg-slate-900 p-2.5 rounded-xl text-white shadow-lg">
                    <Shield size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-black text-slate-950 tracking-tight">Registry Provisioning</h2>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Type: {editingEntity._type || activeTab}</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-950">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <form id="adminForm" onSubmit={handleSave} className="space-y-6">
                {/* Dynamic Fields based on activeTab */}
                {(editingEntity._type === 'users' || (!editingEntity._type && activeTab === 'users')) && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stakeholder Name / Identity</label>
                      <input required value={editingEntity.name || ''} onChange={e => setEditingEntity({...editingEntity, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</label>
                      <input required value={editingEntity.organization || ''} onChange={e => setEditingEntity({...editingEntity, organization: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Role</label>
                        <select value={editingEntity.role || 'Policymaker'} onChange={e => setEditingEntity({...editingEntity, role: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500">
                          <option>Corporate</option><option>Regulator</option><option>Academic</option><option>Investor</option><option>Policymaker</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Privileges</label>
                        <select value={editingEntity.isAdmin ? 'true' : 'false'} onChange={e => setEditingEntity({...editingEntity, isAdmin: e.target.value === 'true'})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500">
                          <option value="false">Standard Member</option><option value="true">Hub Administrator</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authentication Key (Password)</label>
                      <input type="password" value={editingEntity.password || ''} onChange={e => setEditingEntity({...editingEntity, password: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </>
                )}

                {(editingEntity._type === 'ideas' || (!editingEntity._type && activeTab === 'ideas')) && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proposal Title</label>
                      <input required value={editingEntity.title || ''} onChange={e => setEditingEntity({...editingEntity, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author Identity (Name)</label>
                      <input required value={editingEntity.authorName || ''} onChange={e => setEditingEntity({...editingEntity, authorName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Category</label>
                      <select value={editingEntity.category || CATEGORIES[0]} onChange={e => setEditingEntity({...editingEntity, category: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Lifecycle</label>
                      <select value={editingEntity.status || 'Proposed'} onChange={e => setEditingEntity({...editingEntity, status: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500">
                        <option>Proposed</option><option>Under Review</option><option>Approved</option><option>Active Working Group</option><option>Implemented</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description / Rationale</label>
                      <textarea rows={6} required value={editingEntity.description || ''} onChange={e => setEditingEntity({...editingEntity, description: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-medium text-slate-700 leading-relaxed focus:ring-2 focus:ring-indigo-500 resize-none" />
                    </div>
                  </>
                )}

                {(editingEntity._type === 'events' || (!editingEntity._type && activeTab === 'events')) && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Convening Title</label>
                      <input required value={editingEntity.title || ''} onChange={e => setEditingEntity({...editingEntity, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Type</label>
                        <input required value={editingEntity.type || ''} onChange={e => setEditingEntity({...editingEntity, type: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                        <select value={editingEntity.status || 'Planned'} onChange={e => setEditingEntity({...editingEntity, status: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500">
                          <option>Upcoming</option><option>Planned</option><option>Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Label</label>
                        <input required value={editingEntity.date || ''} onChange={e => setEditingEntity({...editingEntity, date: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                        <input required value={editingEntity.location || ''} onChange={e => setEditingEntity({...editingEntity, location: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objective Statement</label>
                      <textarea rows={4} required value={editingEntity.description || ''} onChange={e => setEditingEntity({...editingEntity, description: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-medium text-slate-700 leading-relaxed focus:ring-2 focus:ring-indigo-500 resize-none" />
                    </div>
                  </>
                )}
              </form>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white text-slate-400 border border-slate-200 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all">Cancel</button>
              <button form="adminForm" type="submit" className="flex-1 bg-slate-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">Commit Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Intensity Widget */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
           <div className="flex items-center space-x-3 text-indigo-400">
             <Fingerprint size={24} />
             <h3 className="text-[10px] font-black uppercase tracking-widest">Registry Integrity</h3>
           </div>
           <div>
             <div className="text-3xl font-black mb-1">100% Verified</div>
             <p className="text-xs text-slate-500">Every resource in the Hub is cryptographically notarized for provenance.</p>
           </div>
           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6">
           <div className="flex items-center space-x-3 text-indigo-600">
             <Database size={24} />
             <h3 className="text-[10px] font-black uppercase tracking-widest">Hub Scalability</h3>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Memory Buffer</span>
                <span className="text-slate-900 font-black tracking-tight">12.4 / 100 GB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[12%]"></div>
              </div>
           </div>
           <button className="w-full py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all border border-slate-100">Optimize Cluster</button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6">
           <div className="flex items-center space-x-3 text-rose-600">
             <AlertTriangle size={24} />
             <h3 className="text-[10px] font-black uppercase tracking-widest">Audit Directives</h3>
           </div>
           <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 space-y-2">
             <div className="text-[10px] font-black text-rose-900 uppercase">System Status</div>
             <p className="text-[11px] text-rose-700 leading-relaxed font-medium">All administrative operations are currently executing on secure, air-gapped compute protocols.</p>
           </div>
           <button className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg">Wipe Local Session</button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
