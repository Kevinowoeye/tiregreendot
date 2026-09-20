import React from 'react';
import { GreendotLogo } from '../ui/GreendotLogo';
import { ShieldCheck, Lock, Phone, Mail, Send, MapPin, ExternalLink } from 'lucide-react';
import { useBank } from '../../context/BankContext';

interface PublicFooterProps {
  onNavigate: (route: string) => void;
  onOpenDeployModal?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const { state } = useBank();
  const settings = state.appSettings;

  return (
    <footer className="bg-[#122615] text-slate-300 border-t border-emerald-900/40 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Tagline & Contact info */}
          <div className="lg:col-span-2 space-y-5">
            <GreendotLogo variant="light" size="md" onClick={() => onNavigate('home')} />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Greendot Bank is a modern, high-security financial institution offering high-yield savings, intuitive digital transfers, gold visa debit cards, and personalized lending.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`mailto:${settings.support_email}`} className="hover:text-white transition-colors">
                  {settings.support_email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings.support_phone} (Toll-Free 24/7)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Telegram Support: {settings.telegram_handle}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings.bank_address || '100 Financial Plaza, New York, NY 10005'}</span>
              </div>
            </div>
          </div>

          {/* Banking Products */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Banking
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Personal Checking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  High-Yield Savings (4.85%)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('loans')} className="hover:text-emerald-400 transition-colors">
                  Loans &amp; Mortgages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('investments')} className="hover:text-emerald-400 transition-colors">
                  ESG Wealth Portfolios
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('open-account')} className="text-emerald-400 font-semibold hover:underline">
                  Open an Account &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors">
                  About Us &amp; Leadership
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('careers')} className="hover:text-emerald-400 transition-colors">
                  Careers <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded">Hiring</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-emerald-400 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-emerald-400 transition-colors">
                  Online Banking Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Legal */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Security &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>FDIC Insured up to $250,000</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>256-Bit Bank Encryption</span>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Privacy Policy &bull; Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Equal Housing Lender</span>
              </li>
              <li className="pt-2">
                <div className="inline-block p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-[11px] text-emerald-300 font-mono">
                  SEC-CERT-2026-TLS
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Greendot Bank. All rights reserved. Member FDIC.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              All Systems Operational (99.99%)
            </span>
            <span className="text-slate-600">|</span>
            <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">
              Online Banking Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
