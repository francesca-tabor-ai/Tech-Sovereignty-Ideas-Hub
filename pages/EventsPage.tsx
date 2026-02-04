
import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight, 
  Zap, 
  Target, 
  ArrowRight, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface EventsPageProps {
  events: any[];
}

const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const eventTypes = useMemo(() => {
    const types = Array.from(new Set(events.map(e => e.type)));
    return ['All', ...types];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || event.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, selectedType]);

  // Mock Calendar Logic
  const daysInMonth = 31;
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <Calendar size={12} />
            <span>Timeline</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Events</h1>
          <p className="text-slate-500 max-w-xl">Upcoming board reviews, lab sessions, and diplomatic simulations.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/events/create')}
            className="flex items-center space-x-2 bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={16} />
            <span>Submit Event</span>
          </button>
          <button className="flex items-center justify-center p-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
            <Zap size={16} />
          </button>
        </div>
      </header>

      {/* Filter & Action Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Search events by title or rationale..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900 placeholder:text-slate-300 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Calendar size={20} />
              </button>
            </div>

            <div className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-12 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer min-w-[200px] shadow-sm hover:bg-slate-100 transition-colors"
              >
                {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-6">
          {filteredEvents.length > 0 ? filteredEvents.map(event => (
            <Link 
              to={`/events/${event.id}`}
              key={event.id} 
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-8 shadow-xl hover:shadow-2xl transition-all group flex flex-col md:flex-row items-center gap-10"
            >
              <div className="text-center w-full md:w-32 space-y-1">
                <div className="text-sm font-black text-indigo-600 uppercase tracking-widest">{event.date.split(' ')[0]}</div>
                <div className="text-4xl font-black text-slate-950 tracking-tight">{event.date.split(' ')[1]?.replace(',', '') || 'TBD'}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.date.split(' ')[2] || ''}</div>
              </div>

              <div className="h-20 w-px bg-slate-100 hidden md:block"></div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="text-[9px] font-black bg-slate-950 text-white px-3 py-1 rounded-full uppercase tracking-widest">{event.type}</span>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                    event.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-slate-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-slate-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-slate-400" />
                    <span>{event.attendees} Confirmed</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl group-hover:bg-indigo-600 transition-all active:scale-95 shrink-0">
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-bold">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-xl animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">October 2026</h2>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ArrowRight className="rotate-180 text-slate-400" size={20} /></button>
              <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ArrowRight className="text-slate-400" size={20} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-inner">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="bg-slate-50 p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                {day}
              </div>
            ))}
            {calendarDays.map(day => {
              const dayEvents = filteredEvents.filter(e => {
                 const eDay = parseInt(e.date.split(' ')[1]?.replace(',', ''));
                 return eDay === day;
              });

              return (
                <div key={day} className="bg-white min-h-[140px] p-4 group hover:bg-indigo-50/30 transition-colors">
                  <span className="text-sm font-black text-slate-400 group-hover:text-indigo-600 transition-colors">{day}</span>
                  <div className="mt-2 space-y-1">
                    {dayEvents.map(e => (
                      <Link 
                        to={`/events/${e.id}`}
                        key={e.id} 
                        className="block bg-indigo-600 text-white text-[9px] p-2 rounded-lg font-black uppercase tracking-tighter truncate hover:bg-indigo-700 shadow-sm"
                      >
                        {e.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
