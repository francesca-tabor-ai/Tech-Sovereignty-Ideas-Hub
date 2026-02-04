
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Loader2, 
  Send, 
  Globe, 
  Zap, 
  Lock,
  Type,
  FileText,
  Plus,
  Trash2,
  ListTodo,
  Target
} from 'lucide-react';
import { User } from '../types';

interface EventCreationPageProps {
  onAddEvent: (event: any) => void;
  currentUser: User | null;
  onRequireAuth: () => void;
}

const EVENT_TYPES = [
  'Board Review',
  'Investor Lab',
  'Adversarial Review',
  'Public Briefing',
  'Technical Plenary',
  'Diplomatic Simulation'
];

const OBJECTIVE_ICONS = ['ShieldCheck', 'Info', 'Award', 'Globe', 'Zap'];

const EventCreationPage: React.FC<EventCreationPageProps> = ({ onAddEvent, currentUser, onRequireAuth }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: EVENT_TYPES[0],
    date: '',
    time: '',
    location: '',
    description: '',
    status: 'Planned'
  });

  const [agenda, setAgenda] = useState([{ time: '', label: '', meta: '' }]);
  const [objectives, setObjectives] = useState([{ title: '', desc: '', icon: OBJECTIVE_ICONS[0] }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newEvent = {
        ...formData,
        id: `e${Date.now()}`,
        attendees: 1,
        // Expected format: 'Oct 24, 2026'
        date: formData.date ? new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
        agenda: agenda.filter(item => item.label.trim() !== ''),
        objectives: objectives.filter(item => item.title.trim() !== '')
      };

      onAddEvent(newEvent);
      setIsSubmitting(false);
      navigate('/events');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAgendaItem = () => setAgenda([...agenda, { time: '', label: '', meta: '' }]);
  const removeAgendaItem = (index: number) => setAgenda(agenda.filter((_, i) => i !== index));
  const updateAgendaItem = (index: number, field: string, value: string) => {
    const newAgenda = [...agenda];
    (newAgenda[index] as any)[field] = value;
    setAgenda(newAgenda);
  };

  const addObjective = () => setObjectives([...objectives, { title: '', desc: '', icon: OBJECTIVE_ICONS[0] }]);
  const removeObjective = (index: number) => setObjectives(objectives.filter((_, i) => i !== index));
  const updateObjective = (index: number, field: string, value: string) => {
    const newObjectives = [...objectives];
    (newObjectives[index] as any)[field] = value;
    setObjectives(newObjectives);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="pt-12 space-y-4">
        <button 
          onClick={() => navigate('/events')}
          className="group flex items-center space-x-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest"
        >
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm group-hover:border-indigo-300 transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span>Back to Events</span>
        </button>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Propose Convening</h1>
          <p className="text-slate-500 font-medium">Define the technical agenda and objectives for a sovereign tech work session.</p>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-14">
          
          {/* Section 1: Core Identity */}
          <section className="space-y-8">
            <div className="flex items-center space-x-3 text-indigo-600">
              <Type size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Institutional Identity</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="lg:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. National Compute Reserve Board Review"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-lg font-black text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Category</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900 appearance-none cursor-pointer"
                >
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                <input 
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. London / Virtual / Geneva"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                <input 
                  required
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                <input 
                  required
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g. 14:00 - 16:00 UTC"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900"
                />
              </div>

              <div className="lg:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Summary (Italicized Quote)</label>
                <textarea 
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A concise vision statement for the session..."
                  className="w-full px-6 py-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700 leading-relaxed italic"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Agenda */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-indigo-600">
                <ListTodo size={20} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Session Agenda</h2>
              </div>
              <button 
                type="button" 
                onClick={addAgendaItem}
                className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Plus size={14} />
                <span>Add Time Slot</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {agenda.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <input 
                    placeholder="09:00"
                    value={item.time}
                    onChange={(e) => updateAgendaItem(idx, 'time', e.target.value)}
                    className="w-24 px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold text-slate-900"
                  />
                  <div className="flex-1 space-y-2">
                    <input 
                      placeholder="Topic Label (e.g. Opening Plenary)"
                      value={item.label}
                      onChange={(e) => updateAgendaItem(idx, 'label', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-xs font-black text-slate-900"
                    />
                    <input 
                      placeholder="Context/Metadata (e.g. Strategic vision for compute)"
                      value={item.meta}
                      onChange={(e) => updateAgendaItem(idx, 'meta', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-[10px] font-medium text-slate-500"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeAgendaItem(idx)}
                    className="p-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Objectives */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-indigo-600">
                <Target size={20} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Session Objectives</h2>
              </div>
              <button 
                type="button" 
                onClick={addObjective}
                className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Plus size={14} />
                <span>Add Objective</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {objectives.map((obj, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 relative group">
                  <div className="flex items-center gap-3">
                    <select 
                      value={obj.icon}
                      onChange={(e) => updateObjective(idx, 'icon', e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-black uppercase text-indigo-600 outline-none"
                    >
                      {OBJECTIVE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                    <input 
                      placeholder="Objective Title"
                      value={obj.title}
                      onChange={(e) => updateObjective(idx, 'title', e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-black text-slate-900 p-0"
                    />
                  </div>
                  <textarea 
                    placeholder="Describe the expected outcome..."
                    value={obj.desc}
                    onChange={(e) => updateObjective(idx, 'desc', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border-none focus:ring-0 text-[11px] text-slate-500 font-medium leading-relaxed resize-none p-0"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeObjective(idx)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3 text-indigo-600 bg-indigo-50 px-6 py-2 rounded-2xl border border-indigo-100">
               <Sparkles size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Stakeholder Validation Applied</span>
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-slate-950 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              <span>{isSubmitting ? 'Submitting to Registry...' : 'Publish Event'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-start space-x-6 shadow-2xl shadow-slate-200">
           <div className="p-4 bg-white/10 rounded-2xl">
             <Lock size={24} className="text-indigo-400" />
           </div>
           <div>
             <h4 className="font-black text-lg mb-2">Access Control</h4>
             <p className="text-xs text-slate-400 leading-relaxed">Convenings are reviewed by Hub moderators before listing in the public timeline to ensure strategic alignment.</p>
           </div>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex items-start space-x-6 shadow-2xl shadow-indigo-100">
           <div className="p-4 bg-white/10 rounded-2xl">
             <Zap size={24} className="text-yellow-300" />
           </div>
           <div>
             <h4 className="font-black text-lg mb-2">Influence Score</h4>
             <p className="text-xs text-indigo-100 leading-relaxed">Organizing successful working labs increases your organizational reputation index within the Hub.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreationPage;
