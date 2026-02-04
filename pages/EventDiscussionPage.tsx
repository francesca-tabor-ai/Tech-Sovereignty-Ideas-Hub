
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EVENTS, MOCK_USERS } from '../constants';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  MoreHorizontal, 
  ThumbsUp, 
  Flag,
  Sparkles,
  Loader2
} from 'lucide-react';
import { summarizeDiscussion } from '../geminiService';

const EventDiscussionPage: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const event = useMemo(() => EVENTS.find(e => e.id === eventId), [eventId]);
  const [commentText, setCommentText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Mock comments for the event
  const [comments, setComments] = useState([
    {
      id: 'ec1',
      userId: 'u1',
      userName: 'Dr. Sarah Chen',
      organization: 'Stanford AI Policy Lab',
      text: "The preliminary requirements for the Genesis Nodes need to be audited by independent security firms before the Q1 summit.",
      timestamp: Date.now() - 3600000 * 5,
      likes: 12
    },
    {
      id: 'ec2',
      userId: 'u2',
      userName: 'James Wilson',
      organization: 'European Tech Agency',
      text: "Agreed. We also need to define the legal status of data residency within these federated hubs to avoid conflicting EU/US jurisdiction.",
      timestamp: Date.now() - 3600000 * 2,
      likes: 8
    }
  ]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = {
      id: `ec${Date.now()}`,
      userId: 'u_current', // Mock
      userName: 'You',
      organization: 'Sovereign Hub Member',
      text: commentText,
      timestamp: Date.now(),
      likes: 0
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const summary = await summarizeDiscussion(comments.map(c => c.text));
      setAiSummary(summary);
    } catch (e) {
      alert("AI Synthesis failed.");
    } finally {
      setIsSummarizing(false);
    }
  };

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
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      <header className="pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <MessageSquare size={12} />
            <span>Discussion Portal</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Session Dialogue</h1>
            <p className="text-slate-500 font-medium">Strategic deliberation for: <span className="text-indigo-600 font-bold">{event.title}</span></p>
          </div>
        </div>
        
        <button 
          onClick={handleSummarize}
          disabled={isSummarizing || comments.length === 0}
          className="bg-white border border-indigo-100 text-indigo-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-indigo-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          <span>AI Synthesis</span>
        </button>
      </header>

      {aiSummary && (
        <div className="bg-slate-950 text-white p-10 rounded-[3rem] animate-in zoom-in-95 duration-200 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] rounded-full"></div>
          <h4 className="font-black flex items-center space-x-2 mb-6 text-indigo-400 text-[10px] uppercase tracking-[0.2em]">
            <Sparkles size={16} />
            <span>Intelligence Wrap-up</span>
          </h4>
          <p className="text-lg leading-relaxed text-slate-200 font-medium italic">"{aiSummary}"</p>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
        <form onSubmit={handlePostComment} className="space-y-6">
          <textarea 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Contribute a strategic observation or question..."
            className="w-full bg-slate-50 border-none rounded-3xl px-8 py-6 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] resize-none"
          />
          <div className="flex justify-end">
            <button 
              type="submit"
              className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 flex items-center space-x-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              <span>Post Observation</span>
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start space-x-6 animate-in fade-in transition-all hover:border-indigo-100">
            <img src={`https://picsum.photos/seed/${comment.userId}/48`} className="w-12 h-12 rounded-2xl border border-white shadow-sm" alt="" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-black text-xs text-slate-950 uppercase tracking-widest">{comment.userName}</span>
                  <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter">{comment.organization}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{comment.text}</p>
              <div className="flex items-center space-x-6 mt-6">
                 <button className="flex items-center space-x-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                   <ThumbsUp size={14} />
                   <span>Endorse ({comment.likes})</span>
                 </button>
                 <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Reply</button>
                 <button className="flex items-center space-x-1 text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-rose-500 transition-colors ml-auto">
                   <Flag size={12} />
                   <span>Report</span>
                 </button>
                 <MoreHorizontal size={14} className="text-slate-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDiscussionPage;
