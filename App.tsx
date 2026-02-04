
import React, { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Lightbulb, 
  BarChart3, 
  Users, 
  Building,
  Plus, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Trophy,
  Cpu,
  Shield,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  Zap,
  Menu,
  X,
  ChevronRight,
  LogIn,
  LogOut,
  UserPlus,
  Milestone,
  Globe,
  BrainCircuit,
  DollarSign,
  Info,
  Scale,
  Calendar,
  Mail,
  User as UserIcon,
  Eye,
  CheckCircle2,
  Lock,
  Trash2,
  Settings,
  TrendingUp,
  Fingerprint,
  ShieldAlert,
  Database,
  Cpu as CpuIcon,
  Key,
  ShieldEllipsis,
  Loader2
} from 'lucide-react';

import { Idea, User, Category, Notification } from './types';
import { INITIAL_IDEAS, MOCK_USERS, CATEGORIES, EVENTS as INITIAL_EVENTS, MOCK_NOTIFICATIONS } from './constants';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const IdeaDetailPage = lazy(() => import('./pages/IdeaDetailPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));
const SimulationPage = lazy(() => import('./pages/SimulationPage'));
const AIPolicyHelperPage = lazy(() => import('./pages/AIPolicyHelperPage'));
const CapitalNexusPage = lazy(() => import('./pages/CapitalNexusPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DiplomaticAgentsPage = lazy(() => import('./pages/DiplomaticAgentsPage'));
const MembersPage = lazy(() => import('./pages/MembersPage'));
const OrganisationsPage = lazy(() => import('./pages/OrganisationsPage'));
const OrganisationDetailPage = lazy(() => import('./pages/OrganisationDetailPage'));
const MemberProfilePage = lazy(() => import('./pages/MemberProfilePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const EventAttendeesPage = lazy(() => import('./pages/EventAttendeesPage'));
const EventDiscussionPage = lazy(() => import('./pages/EventDiscussionPage'));
const EventCreationPage = lazy(() => import('./pages/EventCreationPage'));
const InboxPage = lazy(() => import('./pages/InboxPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const SovereigntyProfilePage = lazy(() => import('./pages/SovereigntyProfilePage'));
const DiplomaticProfilePage = lazy(() => import('./pages/DiplomaticProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 rounded-xl transition-all duration-300 px-4 py-3 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-1' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} className={active ? 'animate-pulse' : ''} />
    <span className="text-base font-bold tracking-tight">{label}</span>
  </Link>
);

const LazyLoadingFallback = () => (
  <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full animate-pulse"></div>
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 relative z-10 animate-bounce">
        <Shield size={32} className="text-indigo-600" />
      </div>
    </div>
    <div className="flex flex-col items-center space-y-1">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Establishing Context</span>
      <div className="flex space-x-1.5">
        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

const AuthModal = ({ isOpen, onClose, onAuth, type, users }: { isOpen: boolean; onClose: () => void; onAuth: (user: User) => void, type: 'login' | 'signup', users: User[] }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState<User['role']>('Corporate');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'login') {
      const existingUser = users.find(u => 
        u.name.toLowerCase() === name.toLowerCase() && 
        u.password === password
      );
      if (existingUser) {
        onAuth(existingUser);
      } else {
        alert("Invalid identity or password. Access Denied.");
      }
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        name,
        password,
        role,
        organization: org,
        avatar: `https://picsum.photos/seed/${name}/40`,
        points: 0
      };
      onAuth(newUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{type === 'login' ? 'Sign In' : 'Join the Hub'}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Access</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity (Name/Email)</label>
            <input 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="e.g. Info@francescatabor.com"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Key (Password)</label>
            <input 
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="Brazil89*"
            />
          </div>

          {type === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization</label>
                <input 
                  required
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="e.g. Sovereign Tech Institute"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Role</label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900"
                >
                  <option value="Corporate">Corporate</option>
                  <option value="Regulator">Regulator</option>
                  <option value="Academic">Academic</option>
                  <option value="Investor">Investor</option>
                  <option value="Policymaker">Policymaker</option>
                </select>
              </div>
            </>
          )}
          <button className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
            {type === 'login' ? 'Validate & Enter' : 'Register Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

const NotificationsPanel = ({ isOpen, onClose, notifications, onMarkRead, onClear }: { 
  isOpen: boolean; 
  onClose: () => void; 
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClear: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-4 w-96 bg-white rounded-[2rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden z-50 animate-in slide-in-from-top-4 duration-300">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Alert Registry</h3>
        <button onClick={onClear} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Clear All</button>
      </div>
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <button
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`w-full p-6 text-left flex items-start space-x-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all group ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
            >
              <div className={`mt-1 p-2 rounded-xl shrink-0 ${
                n.type === 'vote' ? 'bg-indigo-100 text-indigo-600' :
                n.type === 'event' ? 'bg-amber-100 text-amber-600' :
                n.type === 'comment' ? 'bg-emerald-100 text-emerald-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                {n.type === 'vote' ? <TrendingUp size={14} /> : 
                 n.type === 'event' ? <Calendar size={14} /> :
                 n.type === 'comment' ? <MessageSquare size={14} /> :
                 <Shield size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                   <h4 className="text-xs font-black text-slate-900 tracking-tight">{n.title}</h4>
                   {!n.isRead && <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">{n.message}</p>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mt-2 block">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="p-12 text-center space-y-4">
             <div className="bg-slate-50 p-4 rounded-full w-12 h-12 mx-auto flex items-center justify-center text-slate-200">
                <Bell size={24} />
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No active alerts</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
         <button onClick={onClose} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Dismiss Intelligence Panel</button>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [authModal, setAuthModal] = useState<{ open: boolean, type: 'login' | 'signup' }>({ open: false, type: 'login' });
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVote = (ideaId: string, direction: 'up' | 'down') => {
    if (!currentUser) {
      setAuthModal({ open: true, type: 'login' });
      return;
    }
    setIdeas(prev => prev.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          votes: {
            ...idea.votes,
            [direction]: idea.votes[direction === 'up' ? 'up' : 'down'] + 1
          }
        };
      }
      return idea;
    }));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addIdea = (newIdea: Idea) => {
    setIdeas(prev => [newIdea, ...prev]);
  };

  const addEvent = (newEvent: any) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const updateIdea = (updatedIdea: Idea) => {
    setIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));
  };

  // Admin CRUD Handlers
  const handleDeleteIdea = (id: string) => setIdeas(prev => prev.filter(i => i.id !== id));
  const handleDeleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const handleDeleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  
  const handleUpdateEvent = (updated: any) => setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  const handleAddUser = (user: User) => setUsers(prev => [user, ...prev]);
  const handleUpdateUser = (updated: User) => setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));

  return (
    <div className="flex min-h-screen bg-[#fcfdfe]">
      <ScrollToTop />
      <AuthModal 
        isOpen={authModal.open} 
        onClose={() => setAuthModal(prev => ({ ...prev, open: false }))} 
        onAuth={setCurrentUser} 
        type={authModal.type} 
        users={users}
      />

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-24'
        } transition-all duration-500 ease-in-out bg-white border-r border-slate-100 fixed h-full z-50 lg:relative flex flex-col shadow-2xl shadow-slate-100`}
      >
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100 transition-transform duration-500 group-hover:rotate-12">
              <Shield size={24} />
            </div>
            {isSidebarOpen && (
              <h1 className="font-black text-3xl tracking-tighter text-slate-900 animate-in fade-in slide-in-from-left-4 duration-500 whitespace-nowrap">
                Ideas <span className="text-indigo-600">Hub</span>
              </h1>
            )}
          </Link>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <SidebarLink to="/" icon={Info} label="Our Mission" active={location.pathname === '/'} />
          <SidebarLink to="/explore" icon={Search} label="Ideas" active={location.pathname.startsWith('/explore')} />
          <SidebarLink to="/members/organisations" icon={Building} label="Organisations" active={location.pathname.startsWith('/members/organisations')} />
          <SidebarLink to="/members" icon={Users} label="Members" active={location.pathname === '/members'} />
          <SidebarLink to="/events" icon={Calendar} label="Events" active={location.pathname.startsWith('/events')} />
          <SidebarLink to="/roadmap" icon={Milestone} label="Roadmap" active={location.pathname === '/roadmap'} />
          
          {currentUser?.isAdmin && (
            <SidebarLink to="/admin" icon={ShieldEllipsis} label="Admin Hub" active={location.pathname === '/admin'} />
          )}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-4">
          <Link 
            to="/settings"
            className={`w-full flex items-center space-x-4 p-3 rounded-2xl transition-all ${
              location.pathname === '/settings' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
            } ${isSidebarOpen ? '' : 'justify-center'}`}
          >
             <SettingsIcon size={20} />
             {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Settings</span>}
          </Link>
          
          {currentUser && (
            <div className={`flex items-center space-x-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-all ${isSidebarOpen ? '' : 'justify-center'}`}>
              <div className="relative">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl border border-white shadow-sm" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                  <p className="text-sm font-black text-slate-900 truncate tracking-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate font-black uppercase tracking-widest">{currentUser.role}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-x-hidden relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 px-8 py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="mr-4 text-slate-400 hover:text-slate-900 transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="font-black text-lg tracking-tighter">Ideas Hub</h1>
          </div>
          <div className="hidden md:flex items-center relative flex-1 max-w-xl">
            <Search className="absolute left-4 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search registry, policies, versions..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
            />
          </div>
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Inbox */}
            <Link 
              to="/inbox"
              className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all relative group"
            >
              <Mail size={20} />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-white"></span>
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                className={`p-3 rounded-2xl transition-all relative group ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
                )}
              </button>
              <NotificationsPanel 
                isOpen={isNotificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onClear={handleClearNotifications}
              />
            </div>

            <div className="h-6 w-px bg-slate-100 mx-2 hidden sm:block"></div>

            {/* Auth / Profile Section */}
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                 <button 
                  onClick={() => setAuthModal({ open: true, type: 'login' })}
                  className="text-slate-600 font-black text-xs uppercase tracking-widest px-4 py-2 hover:text-indigo-600 transition-colors"
                 >
                   Log In
                 </button>
                 <button 
                  onClick={() => setAuthModal({ open: true, type: 'signup' })}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                 >
                   Sign Up
                 </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to={`/members/${currentUser.id}`}
                  className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 px-4 py-2 rounded-2xl transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <UserIcon size={16} />
                  </div>
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest hidden lg:block">Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all group"
                  title="Logout"
                >
                  <LogOut size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Log Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-8">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Suspense fallback={<LazyLoadingFallback />}>
              <Routes>
                <Route path="/" element={<AboutPage />} />
                <Route path="/explore" element={<ExplorePage ideas={ideas} onVote={handleVote} onAddIdea={addIdea} currentUser={currentUser} onRequireAuth={() => setAuthModal({ open: true, type: 'login' })} />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/members/organisations" element={<OrganisationsPage />} />
                <Route path="/members/organisations/:orgId" element={<OrganisationDetailPage />} />
                <Route path="/members/:userId" element={<MemberProfilePage ideas={ideas} />} />
                <Route path="/events" element={<EventsPage events={events} />} />
                <Route path="/events/create" element={<EventCreationPage onAddEvent={addEvent} currentUser={currentUser} onRequireAuth={() => setAuthModal({ open: true, type: 'login' })} />} />
                <Route path="/events/:eventId" element={<EventDetailPage events={events} />} />
                <Route path="/events/:eventId/attendees" element={<EventAttendeesPage />} />
                <Route path="/events/:eventId/discussion" element={<EventDiscussionPage />} />
                <Route path="/inbox" element={<InboxPage currentUser={currentUser} />} />
                <Route path="/draft" element={<AIPolicyHelperPage onAddIdea={addIdea} currentUser={currentUser} onRequireAuth={() => setAuthModal({ open: true, type: 'login' })} />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/workspace/:ideaId" element={<WorkspacePage ideas={ideas} onUpdateIdea={updateIdea} currentUser={currentUser} />} />
                <Route path="/idea/:id" element={<IdeaDetailPage ideas={ideas} onVote={handleVote} currentUser={currentUser} onRequireAuth={() => setAuthModal({ open: true, type: 'login' })} />} />
                <Route path="/idea/:id/profile" element={<SovereigntyProfilePage ideas={ideas} />} />
                <Route path="/idea/:id/diplomatic" element={<DiplomaticProfilePage ideas={ideas} />} />
                <Route path="/settings" element={<SettingsPage user={currentUser} />} />

                {/* Admin Dashboard */}
                <Route path="/admin" element={
                  currentUser?.isAdmin ? (
                    <AdminDashboardPage 
                      ideas={ideas} 
                      events={events} 
                      users={users} 
                      onDeleteIdea={handleDeleteIdea}
                      onUpdateIdea={updateIdea}
                      onDeleteEvent={handleDeleteEvent}
                      onUpdateEvent={handleUpdateEvent}
                      onDeleteUser={handleDeleteUser}
                      onUpdateUser={handleUpdateUser}
                      onAddUser={handleAddUser}
                      onAddIdea={addIdea}
                      onAddEvent={addEvent}
                    />
                  ) : (
                    <div className="p-20 text-center space-y-4">
                      <h2 className="text-2xl font-black">Restricted Protocol</h2>
                      <p className="text-slate-500">Access requires administrative signature.</p>
                    </div>
                  )
                } />
              </Routes>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
