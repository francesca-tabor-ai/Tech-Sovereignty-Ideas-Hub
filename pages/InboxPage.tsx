
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Send, 
  MoreVertical, 
  User as UserIcon, 
  Lightbulb, 
  Calendar, 
  X, 
  ChevronRight, 
  CheckCheck,
  Paperclip,
  Zap,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Inbox as InboxIcon
} from 'lucide-react';
import { Conversation, Message, User } from '../types';
import { MOCK_USERS, INITIAL_IDEAS, EVENTS } from '../constants';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    type: 'direct',
    title: 'Dr. Sarah Chen',
    lastMessage: 'I reviewed the latest audit proposal. Looks solid.',
    timestamp: Date.now() - 1000 * 60 * 30,
    unreadCount: 2,
    participants: ['u1', 'current'],
    avatar: 'https://picsum.photos/seed/sarah/40'
  },
  {
    id: 'c2',
    type: 'idea',
    title: 'Sovereign AI Stack Working Group',
    lastMessage: 'James Wilson: We need more clarity on the hardware spec.',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    unreadCount: 0,
    participants: ['u1', 'u2', 'u3', 'current'],
    relatedId: 'idea-006'
  },
  {
    id: 'c3',
    type: 'event',
    title: 'AI Infrastructure Summit Discussion',
    lastMessage: 'Marcus Thorne: The virtual hall link is now active.',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    unreadCount: 0,
    participants: ['u1', 'u2', 'u4', 'current'],
    relatedId: 'e1'
  },
  {
    id: 'c4',
    type: 'direct',
    title: 'James Wilson',
    lastMessage: 'Can we schedule a brief call regarding the EU protocols?',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    unreadCount: 0,
    participants: ['u2', 'current'],
    avatar: 'https://picsum.photos/seed/james/40'
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', senderId: 'u1', senderName: 'Dr. Sarah Chen', senderAvatar: 'https://picsum.photos/seed/sarah/40', text: 'Hello! I noticed your recent work on the data residency project.', timestamp: Date.now() - 1000 * 60 * 60 },
    { id: 'm2', senderId: 'current', senderName: 'You', senderAvatar: 'https://picsum.photos/seed/me/40', text: 'Hi Dr. Chen. Yes, we are aiming for full regional autonomy by Q3.', timestamp: Date.now() - 1000 * 60 * 45 },
    { id: 'm3', senderId: 'u1', senderName: 'Dr. Sarah Chen', senderAvatar: 'https://picsum.photos/seed/sarah/40', text: 'I reviewed the latest audit proposal. Looks solid.', timestamp: Date.now() - 1000 * 60 * 30 },
  ],
  'c2': [
    { id: 'm4', senderId: 'u2', senderName: 'James Wilson', senderAvatar: 'https://picsum.photos/seed/james/40', text: 'Team, the hardware specs for the Genesis Nodes are falling behind schedule.', timestamp: Date.now() - 1000 * 60 * 60 * 3 },
    { id: 'm5', senderId: 'u1', senderName: 'Dr. Sarah Chen', senderAvatar: 'https://picsum.photos/seed/sarah/40', text: 'I can allocate more resource from the lab to help with validation.', timestamp: Date.now() - 1000 * 60 * 60 * 2.5 },
    { id: 'm6', senderId: 'u2', senderName: 'James Wilson', senderAvatar: 'https://picsum.photos/seed/james/40', text: 'We need more clarity on the hardware spec.', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
  ]
};

const InboxPage: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  
  const activeConversationId = searchParams.get('id') || conversations[0]?.id;
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(() => 
    conversations.find(c => c.id === activeConversationId), 
  [activeConversationId, conversations]);

  const activeMessages = useMemo(() => 
    allMessages[activeConversationId] || [], 
  [activeConversationId, allMessages]);

  const sortedAndFilteredConversations = useMemo(() => 
    conversations
      .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.timestamp - a.timestamp),
  [searchQuery, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversationId) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'current',
      senderName: currentUser?.name || 'You',
      senderAvatar: currentUser?.avatar || 'https://picsum.photos/seed/me/40',
      text: messageText,
      timestamp: Date.now()
    };

    // Update messages
    setAllMessages(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    // Update conversation preview and timestamp
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, lastMessage: messageText, timestamp: Date.now(), unreadCount: 0 } 
        : conv
    ));

    setMessageText('');
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Attaching file:', file.name);
      // Logic for adding a message with an attachment would go here
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      {/* Sidebar: Conversation List */}
      <aside className="w-80 md:w-96 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inbox</h1>
            <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
              <InboxIcon size={18} className="fill-none" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search secure channels..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2 pb-8">
          {sortedAndFilteredConversations.map(conv => {
            const isActive = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => setSearchParams({ id: conv.id })}
                className={`w-full p-4 rounded-3xl transition-all flex items-start space-x-4 text-left group ${
                  isActive 
                    ? 'bg-white shadow-xl shadow-slate-200/50 border border-slate-100' 
                    : 'hover:bg-white/50'
                }`}
              >
                <div className="relative shrink-0">
                  {conv.type === 'direct' ? (
                    <img src={conv.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt="" />
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      conv.type === 'idea' ? 'bg-indigo-600' : 'bg-slate-900'
                    }`}>
                      {conv.type === 'idea' ? <Lightbulb size={20} /> : <Calendar size={20} />}
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-md animate-pulse">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-xs font-black truncate tracking-tight transition-colors ${
                      isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'
                    }`}>
                      {conv.title}
                    </h3>
                    <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0">
                      {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-[11px] line-clamp-1 leading-relaxed ${
                    conv.unreadCount > 0 ? 'font-black text-slate-800' : 'font-medium text-slate-400'
                  }`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white relative">
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
              <Search size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Secure Channel Ready</h2>
              <p className="text-slate-400 max-w-xs font-medium">Select a stakeholder or working group to begin encrypted transmission.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center space-x-5">
                <div className="relative">
                  {activeConversation.type === 'direct' ? (
                    <img src={activeConversation.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt="" />
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      activeConversation.type === 'idea' ? 'bg-indigo-600' : 'bg-slate-900'
                    }`}>
                      {activeConversation.type === 'idea' ? <Lightbulb size={20} /> : <Calendar size={20} />}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">{activeConversation.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      {activeConversation.type === 'direct' ? 'Stakeholder Proxy' : 'Working Group'}
                    </span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center space-x-1">
                      <Clock size={10} />
                      <span>Transmission Active</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all">
                  <ShieldCheck size={20} />
                </button>
                <button className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </header>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30 custom-scrollbar">
              <div className="flex justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                  Encryption Key: 0x82...F1A
                </span>
              </div>
              
              {activeMessages.map(msg => {
                const isMe = msg.senderId === 'current';
                return (
                  <div key={msg.id} className={`flex items-end space-x-4 ${isMe ? 'flex-row-reverse space-x-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    {!isMe && <img src={msg.senderAvatar} className="w-10 h-10 rounded-xl border border-white shadow-sm shrink-0" alt="" />}
                    <div className={`max-w-[70%] space-y-2 ${isMe ? 'items-end' : ''}`}>
                      <div className={`p-6 rounded-[2rem] shadow-sm relative ${
                        isMe 
                          ? 'bg-slate-950 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                      }`}>
                        <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                      </div>
                      <div className={`flex items-center space-x-2 px-2 ${isMe ? 'justify-end' : ''}`}>
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={12} className="text-indigo-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="bg-slate-50/50 border border-slate-200 rounded-[2rem] p-3 flex items-center space-x-4 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={handleAttachmentClick}
                  className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <Paperclip size={20} />
                </button>
                <input 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Communicate mission-critical insights..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 placeholder:text-slate-300"
                />
                <button 
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-slate-950 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                >
                  <Send size={18} className="rotate-[-12deg]" />
                </button>
              </form>
            </div>
          </>
        )}
      </main>

      {/* Info Panel: Context (Hidden on small screens) */}
      {activeConversation && (
        <aside className="w-80 border-l border-slate-100 bg-white hidden xl:flex flex-col p-10 space-y-10 animate-in slide-in-from-right-8 duration-700">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Stakeholder Context</h3>
            <div className="space-y-4">
              {activeConversation.type === 'direct' ? (
                <div className="text-center space-y-4">
                  <img src={activeConversation.avatar} className="w-24 h-24 rounded-full mx-auto border-4 border-slate-50 shadow-xl" alt="" />
                  <div>
                    <h4 className="text-lg font-black text-slate-900">{activeConversation.title}</h4>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Verified Regulator</p>
                  </div>
                  <button className="w-full py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all border border-slate-100">
                    View Dossier
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-6 rounded-[2rem] text-white shadow-xl ${
                    activeConversation.type === 'idea' ? 'bg-indigo-600' : 'bg-slate-900'
                  }`}>
                    <h4 className="font-black text-sm mb-2">{activeConversation.title}</h4>
                    <p className="text-[10px] text-white/70 leading-relaxed font-medium">
                      Multi-stakeholder deliberation for sovereign technical coordination.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Registry Asset</p>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-indigo-200 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded shadow-sm text-indigo-600 border border-slate-100">v1.0</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <p className="text-xs font-black text-slate-900 line-clamp-2">Sovereign AI Infrastructure Pack</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Guardrails</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                 <span className="text-[10px] font-bold text-emerald-900">Encrypted</span>
                 <CheckCheck size={14} className="text-emerald-600" />
               </div>
               <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                 <span className="text-[10px] font-bold text-indigo-900">Hub Recorded</span>
                 <ShieldCheck size={14} className="text-indigo-600" />
               </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default InboxPage;
