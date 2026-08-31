// src/pages/HowItWorks.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Satellite, CloudRain, Droplets, Mountain,
  BrainCircuit, Gauge, Bell, ShieldCheck, ArrowRight, CheckCircle2
} from 'lucide-react';
import { Layout } from '../components/Layout/Layout';

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'ENVIRONMENTAL DATA',
    subtitle: 'Telemetry Ingestion',
    desc: 'Continuous real-time ingestion from NASA POWER AG daily satellite feeds and deployed regional ground sensor telemetry across 12 station nodes.',
    icon: Satellite,
    tag: 'SATELLITE & SENSORS'
  },
  {
    step: '02',
    title: 'RAINFALL',
    subtitle: 'Precipitation Tracking',
    desc: 'Automated measurement of 24-hour cumulative rainfall and intensity thresholds against regional historical saturation baselines.',
    icon: CloudRain,
    tag: 'HYDROLOGY'
  },
  {
    step: '03',
    title: 'SOIL MOISTURE',
    subtitle: 'Saturation Profiling',
    desc: 'Dynamic estimation of pore-water pressure and moisture accumulation to gauge shear strength reduction across soil strata.',
    icon: Droplets,
    tag: 'GEOTECHNICAL'
  },
  {
    step: '04',
    title: 'TERRAIN CONDITIONS',
    subtitle: 'Topographic Slope Modeling',
    desc: 'Incorporating high-resolution slope steepness (°), elevation gradients, and geological fault line proximity for each specific zone.',
    icon: Mountain,
    tag: 'TOPOGRAPHY'
  },
  {
    step: '05',
    title: 'AI RISK ANALYSIS',
    subtitle: 'Physics-Informed Inference',
    desc: 'Integrated machine learning engine (XGBoost + empirical thresholding) evaluates multi-dimensional signals in parallel.',
    icon: BrainCircuit,
    tag: 'MACHINE LEARNING'
  },
  {
    step: '06',
    title: 'RISK SCORE',
    subtitle: 'Normalized Threat Index (0–100)',
    desc: 'Computes categorical severity (LOW, MODERATE, HIGH) and dynamic confidence ratings with explanatory assessment strings.',
    icon: Gauge,
    tag: 'ANALYTICS'
  },
  {
    step: '07',
    title: 'EARLY WARNING',
    subtitle: 'Automated Alert Dispatch',
    desc: 'Instant generation of early warning alert packages with geolocation, trigger telemetry, and mitigation advisories.',
    icon: Bell,
    tag: 'DISPATCH'
  },
  {
    step: '08',
    title: 'AUTHORITIES + CITIZENS',
    subtitle: 'Decisive Action & Verification',
    desc: 'Emergency coordinators receive triage data while local citizens contribute real-time photo ground-truth observations.',
    icon: ShieldCheck,
    tag: 'RESPONSE'
  }
];

const VALUE_PROPOSITIONS = [
  {
    title: 'Predict Earlier',
    desc: 'Identify precursor slip signals 4.8+ hours before catastrophic displacement occurs, allowing pre-emptive evacuations.'
  },
  {
    title: 'Respond Faster',
    desc: 'Automated alert routing directly to regional disaster management and highway safety teams without manual triage delays.'
  },
  {
    title: 'Protect Communities',
    desc: 'Safeguard vulnerable mountain villages, critical transit corridors (NH-29, NH-10), and emergency response routes.'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-12 max-w-5xl mx-auto py-4">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-teal-50 text-[#0F766E] border border-[#14B8A6]/20">
            SYSTEM ARCHITECTURE & METHODOLOGY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] tracking-tight">
            How MALAI VIZHI Detects Landslide Risk
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            A physics-informed, multi-layered early warning pipeline designed specifically for the unique terrain and monsoon dynamics of Northeast India.
          </p>
        </div>

        {/* Visual Pipeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              End-to-End Early Warning Pipeline
            </h2>
            <span className="text-xs text-slate-400 font-medium">8 Sequential Stages</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PIPELINE_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#071A2B] text-[#14B8A6] flex items-center justify-center flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {item.tag}
                      </span>
                      <span className="text-xs font-black text-slate-300">
                        {item.step}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#102A43] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#0F766E] mb-2">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why It Matters Section */}
        <div className="bg-gradient-to-br from-[#071A2B] to-[#0B3948] rounded-2xl p-8 text-white space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#14B8A6]">
              OPERATIONAL IMPACT
            </span>
            <h2 className="text-2xl font-bold">Why It Matters</h2>
            <p className="text-white/70 text-sm max-w-2xl leading-relaxed">
              In rugged mountain terrains, landslides can sever communication arteries and isolate communities in minutes. Proactive physics-guided intelligence saves lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {VALUE_PROPOSITIONS.map((v, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#14B8A6]">
                  <CheckCircle2 size={16} />
                  <h3 className="text-sm font-bold text-white">{v.title}</h3>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#071A2B] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
          >
            Go to Live Dashboard
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
};
