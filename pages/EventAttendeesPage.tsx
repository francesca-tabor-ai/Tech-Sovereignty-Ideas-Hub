
import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EVENTS, MOCK_USERS } from '../constants';
import { ArrowLeft, Users, Building2, ChevronRight, UserCircle, Clock } from 'lucide-react';

const EventAttendeesPage: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const event = useMemo(() => EVENTS.find(e => e.id === eventId), [eventId]);

  const confirmedAttendees = useMemo(() => MOCK_USERS, []);
  const waitingList = useMemo(() => [
    { id: 'w1', name: 'Dr. Arthur Penhaligon', role: 'Policymaker', organization: 'Unified Governance Board', avatar: 'https://picsum.photos/seed/arthur/40', points: 450 },
    { id: 'w2', name: 'Suki Sato', role: 'Academic', organization: 'Tokyo Tech Policy Institute', avatar: 'https://picsum.photos/seed/suki/40', points: 310 },
  ], []);

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

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation */}
      <button 
        onClick={() => navigate(`/events/${event.id}`)}
        className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest pt-4"
      >
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span>Back to Event Details</span>
      </button>

      <header className="pt-12 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          <Users size={12} />
          <span>Personnel Manifest</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Attendee List</h1>
          <p className="text-slate-500 font-medium">{event.title}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Confirmed Attendees */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">Confirmed</span>
              <span>{confirmedAttendees.length} Confirmed</span>
            </h2>
          </div>
          <div className="space-y-4">
            {confirmedAttendees.map(user => (
              <Link 
                to={`/members/${user.id}`}
                key={user.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img src={user.avatar} className="w-14 h-14 rounded-full border-2 border-white shadow-md" alt={user.name} />
                  <div>
                    <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{user.name}</h3>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <Building2 size={12} />
                      <span>{user.organization}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="text-right hidden sm:block">
                     <div className="text-[10px] font-black text-slate-400 uppercase">Impact Score</div>
                     <div className="text-sm font-black text-slate-900">{user.points}</div>
                   </div>
                   <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Waiting List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">Waitlist</span>
              <span>{waitingList.length} Pending</span>
            </h2>
          </div>
          <div className="space-y-4">
            {waitingList.map(user => (
              <div 
                key={user.id}
                className="bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-6 flex items-center justify-between opacity-80"
              >
                <div className="flex items-center space-x-4">
                  <img src={user.avatar} className="w-14 h-14 rounded-full grayscale opacity-50" alt={user.name} />
                  <div>
                    <h3 className="font-black text-slate-400 tracking-tight">{user.name}</h3>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                      <Clock size={12} />
                      <span>Pending Verification</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-300 uppercase">Position: 0{waitingList.indexOf(user) + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventAttendeesPage;
