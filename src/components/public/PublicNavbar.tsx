import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Menu,
  X,
  User,
  ArrowRight,
  Terminal,
  ChevronDown,
} from 'lucide-react';
import { GreendotLogo } from '../ui/GreendotLogo';
import { useBank } from '../../context/BankContext';

interface PublicNavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenDeployModal: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenDeployModal,
}) => {
  const { currentUser, currentRole, logout } = useBank();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'loans', label: 'Loans & Credit' },
    { id: 'investments', label: 'High-Yield APY' },
    { id: 'careers', label: 'Careers' },
    { id: 'faq', label: 'Security & FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 box-border"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <GreendotLogo
              variant="dark"
              size="md"
              onClick={() => onNavigate('home')}
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`transition-colors hover:text-emerald-700 py-1 ${
                    currentPage === link.id
                      ? 'text-emerald-800 font-bold border-b-2 border-emerald-600'
                      : ''
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right actions: Login / Dashboard button / Open Account */}
          <div className="hidden sm:flex items-center gap-3">
            {currentRole === 'admin' ? (
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Operations</span>
              </button>
            ) : currentUser ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold shadow transition-all hover:scale-[1.02]"
              >
                <User className="w-4 h-4" />
                <span>Access Dashboard</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
                >
                  Online Banking Sign In
                </button>
                <button
                  onClick={() => onNavigate('open-account')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <span>Open Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 gradient-primary text-white text-xs font-bold rounded-xl text-center shadow"
              >
                Access Dashboard ({currentUser.fullName.split(' ')[0]})
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('open-account');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 gradient-primary text-white text-xs font-bold rounded-xl text-center shadow"
                >
                  Open Free Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
