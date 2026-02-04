
import React from 'react';
import { 
  Shield, 
  Target, 
  Users, 
  Zap, 
  Globe, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 py-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
          <Info size={14} />
          <span>Our Mission</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
          Securing the Future of <br />
          <span className="text-indigo-600">Digital Autonomy.</span>
        </h1>
        <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
          The Tech Sovereignty Ideas Hub is a platform designed to coordinate the infrastructure, policy, and capital needed for technological independence.
        </p>
      </section>

      {/* Strategic Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Cpu size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Infrastructure</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Reducing dependency on external providers by building sovereign compute, data residency, and regional cloud alliances.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <Lock size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Governance</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Establishing frameworks that prioritize human accountability, explainable AI, and security over reactive regulation.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="bg-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-100">
            <Globe size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Influence</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Shaping the global discourse around technology as a system of integrated assets—capital, talent, and foresight.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10 space-y-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black mb-4">The Lifecycle</h2>
            <p className="text-slate-400">Our platform facilitates the journey from a raw concept to implemented policy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-indigo-400 font-black text-4xl opacity-50">01</div>
              <h4 className="font-bold text-lg">Propose</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Submit raw concepts and define sovereignty scores through collaborative drafting.</p>
            </div>
            <div className="space-y-4">
              <div className="text-indigo-400 font-black text-4xl opacity-50">02</div>
              <h4 className="font-bold text-lg">Refine</h4>
              <p className="text-xs text-slate-500 leading-relaxed">The community provides feedback. Stakeholders branch and version ideas to reach maturity.</p>
            </div>
            <div className="space-y-4">
              <div className="text-indigo-400 font-black text-4xl opacity-50">03</div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-lg">Simulate</h4>
                <span className="bg-rose-500 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Core</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Stress test proposals against geopolitical shocks like supply chain failures or energy crises.</p>
            </div>
            <div className="space-y-4">
              <div className="text-indigo-400 font-black text-4xl opacity-50">04</div>
              <h4 className="font-bold text-lg">Implement</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Top-tier ideas enter dedicated Workspaces for collaborative drafting and policy engagement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-indigo-200">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-black">Ready to shape the future?</h2>
          <p className="text-indigo-100 opacity-80">Join 40+ regulators, investors, and academics building a resilient tech stack.</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/explore" className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-50 transition-colors shadow-lg shadow-indigo-800/20">
            Browse Ideas Hub
          </Link>
          <Link to="/explore" className="bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-400 transition-colors flex items-center space-x-2">
            <span>Start Exploring</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Our Ecosystem</h3>
          <div className="flex flex-wrap justify-center gap-6 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield size={16} />
              <span className="text-sm font-bold">Regulators</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={16} />
              <span className="text-sm font-bold">Investors</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span className="text-sm font-bold">Academics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap size={16} />
              <span className="text-sm font-bold">Tech Leaders</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
