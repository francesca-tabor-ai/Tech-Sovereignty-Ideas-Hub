
import React, { useMemo, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  FileText, 
  Download, 
  X, 
  Loader2, 
  Sparkles, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Printer
} from 'lucide-react';
import { Idea } from '../types';
import { CATEGORIES } from '../constants';
import { generateStrategicReport, StrategicReport } from '../geminiService';

interface AnalyticsPageProps {
  ideas: Idea[];
}

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e'];

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ ideas }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<StrategicReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => ({
      name: cat.split(' ')[0],
      value: ideas.filter(i => i.category === cat).length
    })).filter(d => d.value > 0);
  }, [ideas]);

  const scoreTrends = useMemo(() => {
    return ideas
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(i => ({
        date: new Date(i.timestamp).toLocaleDateString(),
        score: i.sovereigntyScore,
        votes: i.votes.up - i.votes.down
      }));
  }, [ideas]);

  const averageSovereigntyScore = Math.round(ideas.reduce((acc, curr) => acc + curr.sovereigntyScore, 0) / ideas.length);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const generatedReport = await generateStrategicReport(ideas);
      setReport(generatedReport);
      setShowReportModal(true);
    } catch (error) {
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Impact Analytics</h1>
          <p className="text-slate-500">Real-time metrics on hub activity and sovereignty goals.</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-70"
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
          <span>{isGenerating ? 'Synthesizing...' : 'Download Detailed Report'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Submissions</p>
          <div className="text-3xl font-black text-slate-800">{ideas.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Avg Sovereignty Score</p>
          <div className="text-3xl font-black text-indigo-600">{averageSovereigntyScore}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active Collaborators</p>
          <div className="text-3xl font-black text-slate-800">42</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Policy Impact</p>
          <div className="text-3xl font-black text-green-500">8.2</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Proposals by Domain</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-xs font-semibold text-slate-600">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Strategic Value Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrends}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showReportModal && report && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-100 rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="bg-white px-8 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Strategic Intelligence Report</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Generated {new Date().toLocaleDateString()} • CONFIDENTIAL</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  <Printer size={14} />
                  <span>Print to PDF</span>
                </button>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 overflow-y-auto p-12 bg-white m-4 rounded-[2rem] shadow-inner font-serif">
              <div className="max-w-3xl mx-auto space-y-12">
                {/* Cover Page Logic */}
                <div className="text-center space-y-4 border-b border-slate-100 pb-12">
                  <Shield size={48} className="mx-auto text-indigo-600 mb-4" />
                  <h1 className="text-4xl font-black text-slate-900 font-sans tracking-tight">State of Sovereign Tech</h1>
                  <p className="text-xl text-slate-500 font-sans italic">Hub Activity & Strategic Trajectory Analysis</p>
                </div>

                {/* Executive Summary */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">I. Executive Summary</h3>
                  <p className="text-lg text-slate-800 leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left">
                    {report.executiveSummary}
                  </p>
                </section>

                {/* Key Pillars */}
                <section className="space-y-6">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">II. Strategic Pillars</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    {report.keyPillars.map((pillar, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="text-indigo-600 font-black text-lg mb-2">0{idx + 1}</div>
                        <h4 className="font-bold text-slate-900 mb-2">{pillar.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{pillar.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Top Performers */}
                <section className="space-y-6">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">III. High-Impact Candidates</h3>
                  <div className="space-y-4 font-sans">
                    {report.topPerformers.map((perf, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <TrendingUp size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900">{perf.title}</h4>
                          <p className="text-sm text-slate-600 mt-1 italic">"{perf.rationale}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Gap Analysis */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">IV. Critical Gap Analysis</h3>
                  <div className="flex items-start space-x-4 bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <AlertCircle className="text-rose-600 mt-1 shrink-0" size={20} />
                    <p className="text-sm text-rose-900 font-medium leading-relaxed font-sans">{report.gapAnalysis}</p>
                  </div>
                </section>

                {/* Recommendations */}
                <section className="space-y-6 pb-12">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">V. Board Recommendations</h3>
                  <ul className="space-y-4 font-sans">
                    {report.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Footer */}
                <div className="border-t border-slate-100 pt-8 text-center font-sans">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Sovereign Ideas Hub • Intelligence Division • Project Atlas v2.4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
