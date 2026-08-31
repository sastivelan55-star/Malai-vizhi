// src/pages/AdminLogin.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/UI/Logo';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin@malaivizhi.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prototype authentication simulation
    setTimeout(() => {
      setLoading(false);
      setAuthenticated(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8] flex flex-col justify-between">
      {/* Header Bar */}
      <div className="bg-[#071A2B] px-6 py-4 flex items-center justify-between border-b border-white/5">
        <Logo size="sm" variant="light" />
        <span className="text-xs text-white/50 font-medium">Prototype Access Gateway</span>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl p-8 space-y-6">
          {/* Brand & Badge */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#071A2B] text-[#14B8A6] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-black text-[#071A2B] tracking-wider uppercase">
                MALAI VIZHI
              </h1>
              <p className="text-xs font-bold tracking-widest uppercase text-[#0F766E]">
                AUTHORIZED ACCESS
              </p>
            </div>
          </div>

          {authenticated ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-2">
              <p className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                Session Authenticated
              </p>
              <p className="text-xs text-slate-600">
                Redirecting to Early Warning Live Dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Username / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="operator@malaivizhi.io"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter security key"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#071A2B] hover:bg-[#0B3948] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* Security Disclaimer Note */}
          <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
            <AlertCircle size={14} className="flex-shrink-0 text-slate-400 mt-0.5" />
            <p>
              <strong>Security Notice:</strong> Restricted access for authorized personnel. Prototype authentication environment.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="text-center py-4 text-xs text-slate-400">
        MALAI VIZHI Landslide Early Warning System · Prototype Build v2.4.0
      </div>
    </div>
  );
};
