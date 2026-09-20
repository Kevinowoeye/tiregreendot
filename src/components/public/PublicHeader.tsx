import React, { useState } from 'react';
import { GreendotLogo } from '../ui/GreendotLogo';
import { Menu, X, ArrowRight, ShieldCheck, Lock, User } from 'lucide-react';
import { useBank } from '../../context/BankContext';

interface PublicHeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useBank();

  const navItems = [
    { label: 'Home', route: 'home' },
    { label: 'About Us', route: 'about' },
    { label: 'Loans', route: 'loans' },
    { label: 'Investments', route: 'investments' },
    { label: 'Careers', route: 'careers' },
    { label: 'FAQ', route: 'faq' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-emerald-950/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <GreendotLogo
          variant="dark"
          size="md"
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
        />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  isActive ? 'text-emerald-700 font-semibold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-200"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Go to {currentUser.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-colors"
            >
              Login
            </button>
          )}

          <button
            onClick={() => onNavigate('open-account')}
            className="gradient-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <span>Open an Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-Down Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-b border-emerald-950/10 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentRoute === item.route
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Sign In to Online Banking
            </button>
            <button
              onClick={() => {
                onNavigate('open-account');
                setMobileMenuOpen(false);
              }}
              className="w-full gradient-primary text-white py-2.5 text-center text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20"
            >
              Open an Account
            </button>
            <button
              onClick={() => {
                onNavigate('activate-account');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-xs font-medium text-emerald-700 hover:underline"
            >
              Have an activation code? Activate Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
