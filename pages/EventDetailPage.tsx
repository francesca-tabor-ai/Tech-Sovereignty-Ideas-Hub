
import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EVENTS, MOCK_USERS } from '../constants';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Info,
  Globe,
  Lock,
  MessageSquare,
  Sparkles,
  Award,
  ListTodo
} from 'lucide-react';

const IconMap: Record<string, any> = {
  ShieldCheck,
  Info,
  Award,
  Globe,
  Zap,
  Target: ShieldCheck // Fallback
};

const EventDetailPage: React.FC<{ events?: any[] }> = ({ events: propEvents }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const allEvents = propEvents || EVENTS;
  const event = useMemo(() => allEvents.find(e => e.id === eventId), [eventId, allEvents]);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Event Not Found</h2>
        <button 
          onClick={() => navigate('/events')}
          className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to Events</span>
        </button>
      </div>
    );
  }

  const sessionAttendees = MOCK_USERS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest pt-4"
      >
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span>Back to Events</span>
      </button>

      {/* Hero Profile Header */}
      <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-white/10 text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 backdrop-blur-md">
                {event.type}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 ${
                event.status === 'Upcoming' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400'
              }`}>
                {event.status}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              {event.title}
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed font-medium max-w-2xl italic">
              "{event.description}"
            </p>

            <div className="flex flex-wrap gap-10">
              <div className="flex items-center space-x-3">
                <Calendar className="text-indigo-400" size={20} />
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase">Date</div>
                  <div className="text-sm font-bold">{event.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-indigo-400" size={20} />
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase">Time</div>
                  <div className="text-sm font-bold">{event.time}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-indigo-400" size={20} />
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase">Location</div>
                  <div className="text-sm font-bold">{event.location}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 space-y-8">
             <div className="text-center space-y-2">
                <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest">Attendance Status</h3>
                <div className="text-3xl font-black">{event.attendees} / 50</div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${(event.attendees/50)*100}%` }}></div>
                </div>
             </div>

             <button className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3">
               <Zap size={16} />
               <span>Attend</span>
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Agenda & Insights */}
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
              <ListTodo className="text-indigo-600" size={24} />
              <span>Session Agenda</span>
            </h2>
            
            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {event.agenda && event.agenda.length > 0 ? (
                event.agenda.map((item: any, i: number) => (
                  <div key={i} className="relative pl-12 group">
                    <div className="absolute left-0 top-1.5 w-9 h-9 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm z-10 group-hover:border-indigo-500 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-600 transition-colors"></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{item.time}</div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.label}</h4>
                      <p className="text-sm text-slate-500 font-medium">{item.meta}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic pl-12">No agenda items defined for this session.</p>
              )}
            </div>
          </section>

          <section className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-10 space-y-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
              <Sparkles className="text-indigo-600" size={24} />
              <span>Session Objectives</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.objectives && event.objectives.length > 0 ? (
                event.objectives.map((obj: any, i: number) => {
                  const IconComp = IconMap[obj.icon] || Info;
                  return (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-4">
                      <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shrink-0">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">{obj.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{obj.desc}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 italic">No specific objectives outlined yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Participants & Related Content */}
        <div className="space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Key Participants</h3>
              <Users size={18} className="text-indigo-600" />
            </div>
            
            <div className="space-y-4">
              {sessionAttendees.map(member => (
                <Link 
                  to={`/members/${member.id}`}
                  key={member.id} 
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <img src={member.avatar} className="w-10 h-10 rounded-xl border border-white shadow-sm" alt="" />
                    <div>
                      <p className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{member.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold truncate max-w-[120px]">{member.organization}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </Link>
              ))}
              <div className="text-center pt-2">
                <Link 
                  to={`/events/${event.id}/attendees`}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                >
                  View All {event.attendees} Participants
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-slate-950 rounded-[2.5rem] p-10 text-white space-y-6">
            <div className="flex items-center space-x-3 text-indigo-400">
              <MessageSquare size={18} />
              <h3 className="text-xs font-black uppercase tracking-widest">Discussion</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic border-l-2 border-indigo-500/30 pl-4">
              "Collaborative discourse is essential for ensuring institutional coherence."
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <img src={MOCK_USERS[3].avatar} className="w-6 h-6 rounded-full" alt="" />
              <span className="text-[10px] font-bold text-slate-300">{MOCK_USERS[3].name}</span>
            </div>
            <Link 
              to={`/events/${event.id}/discussion`}
              className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all block text-center"
            >
              Join
            </Link>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Administrative Info</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400">Security Clearance</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Level 2</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400">Recording Status</span>
                <span className="text-rose-600">Off-the-Record</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400">Hub Verified</span>
                <div className="flex items-center space-x-1 text-emerald-600">
                  <ShieldCheck size={12} />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
