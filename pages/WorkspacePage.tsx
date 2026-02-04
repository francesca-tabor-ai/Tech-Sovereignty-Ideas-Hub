
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  CheckSquare, 
  Sparkles, 
  Save, 
  History, 
  ArrowLeft, 
  Plus, 
  MoreVertical,
  Zap,
  Loader2,
  Lock,
  Edit3
} from 'lucide-react';
import { Idea, Task, User } from '../types';
import { MOCK_USERS } from '../constants';

interface WorkspacePageProps {
  ideas: Idea[];
  onUpdateIdea: (idea: Idea) => void;
  currentUser: User | null;
}

const WorkspacePage: React.FC<WorkspacePageProps> = ({ ideas, onUpdateIdea, currentUser }) => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const idea = ideas.find(i => i.id === ideaId);

  const [draft, setDraft] = useState(idea?.description || '');
  const [tasks, setTasks] = useState<Task[]>(idea?.tasks || [
    { id: 't1', title: 'Legal feasibility review', status: 'In Progress', assignee: 'James Wilson' },
    { id: 't2', title: 'Technical architecture diagram', status: 'Todo' },
    { id: 't3', title: 'Stakeholder alignment survey', status: 'Done' }
  ]);
  const [activeTab, setActiveTab] = useState<'draft' | 'tasks' | 'chat'>('draft');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!idea) navigate('/');
  }, [idea, navigate]);

  if (!idea) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateIdea({ ...idea, description: draft, tasks: tasks });
      setIsSaving(false);
    }, 1000);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black bg-indigo-600 px-2 py-0.5 rounded uppercase tracking-tighter">Workspace</span>
              <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{idea.title}</h1>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">3 active members • Last edit 2 mins ago</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex -space-x-2 mr-4">
            {MOCK_USERS.slice(0, 3).map(u => (
              <img key={u.id} src={u.avatar} className="w-8 h-8 rounded-full border-2 border-slate-900" alt={u.name} title={u.name} />
            ))}
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>Sync Changes</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar (Icons) */}
        <div className="w-16 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-6 space-y-6">
          <button 
            onClick={() => setActiveTab('draft')}
            className={`p-3 rounded-2xl transition-all ${activeTab === 'draft' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <Edit3 size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`p-3 rounded-2xl transition-all ${activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <CheckSquare size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`p-3 rounded-2xl transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <MessageSquare size={20} />
          </button>
          <div className="flex-1"></div>
          <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl">
            <History size={20} />
          </button>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'draft' && (
            <div className="flex-1 flex flex-col p-8 bg-white overflow-y-auto">
              <div className="max-w-3xl mx-auto w-full space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-slate-800">Proposal Draft</h2>
                  <button className="flex items-center space-x-2 text-indigo-600 text-xs font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
                    <Sparkles size={14} />
                    <span>AI Assistant</span>
                  </button>
                </div>
                <div className="relative group">
                  <textarea 
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full min-h-[500px] text-lg text-slate-700 leading-relaxed font-serif border-none focus:ring-0 resize-none p-0 bg-transparent"
                    placeholder="Begin drafting the initiative..."
                  />
                  <div className="absolute top-0 -left-6 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Tasks</h2>
                    <p className="text-sm text-slate-500">Collaborative checklist.</p>
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <Plus size={14} />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['Todo', 'In Progress', 'Done'] as const).map(status => (
                    <div key={status} className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                          {tasks.filter(t => t.status === status).length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {tasks.filter(t => t.status === status).map(task => (
                          <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing">
                            <h4 className="text-sm font-bold text-slate-800 mb-3">{task.title}</h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {task.assignee ? (
                                  <img 
                                    src={`https://picsum.photos/seed/${task.assignee}/20`} 
                                    className="w-5 h-5 rounded-full" 
                                    title={task.assignee}
                                    alt=""
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 border-dashed"></div>
                                )}
                              </div>
                              <button onClick={() => {
                                const next: Task['status'] = status === 'Todo' ? 'In Progress' : status === 'In Progress' ? 'Done' : 'Todo';
                                updateTaskStatus(task.id, next);
                              }} className="text-slate-400 hover:text-indigo-600">
                                <Zap size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col bg-slate-100">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex justify-center my-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Session Started</span>
                </div>
                {/* Simulated messages */}
                <div className="flex items-start space-x-3">
                  <img src={MOCK_USERS[0].avatar} className="w-8 h-8 rounded-full" alt="" />
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                    <p className="text-xs font-bold text-slate-900 mb-1">{MOCK_USERS[0].name}</p>
                    <p className="text-sm text-slate-600">I've started refining the technical section.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                    <p className="text-sm font-medium">I'll focus on the data residency requirements.</p>
                  </div>
                  <img src={currentUser?.avatar || MOCK_USERS[1].avatar} className="w-8 h-8 rounded-full" alt="" />
                </div>
              </div>
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button className="absolute right-3 top-3 text-slate-400">
                      <Zap size={16} />
                    </button>
                  </div>
                  <button className="bg-slate-900 text-white p-3 rounded-2xl">
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contextual Sidebar */}
        <div className="w-80 border-l border-slate-200 bg-white hidden xl:flex flex-col p-6 space-y-8">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Validation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">Governance</span>
                </div>
                <span className="text-xs font-black text-emerald-600">92%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center space-x-2">
                  <Lock size={16} className="text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900">Security</span>
                </div>
                <span className="text-xs font-black text-indigo-600">74%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Members</h3>
            <div className="space-y-3">
              {MOCK_USERS.slice(0, 4).map(u => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />
                    <div className="text-xs font-bold text-slate-900">{u.name}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white mt-auto">
            <h4 className="text-xs font-black text-indigo-400 uppercase mb-2">Next Phase</h4>
            <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
              Once tasks are complete, the proposal can be submitted for Board Approval.
            </p>
            <button className="w-full bg-indigo-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default WorkspacePage;
