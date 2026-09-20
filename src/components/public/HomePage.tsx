import React from 'react';
import {
  ShieldCheck,
  Zap,
  Smartphone,
  TrendingUp,
  CreditCard,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  Lock,
  Star,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Award,
  DollarSign,
  ArrowUpRight,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenDeployModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden gradient-hero-radial text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Decorative background ambient rings */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-lime-300" />
                <span>Trusted by 2M+ customers nationwide</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Bank smarter with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-300 to-emerald-200">
                  Greendot
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Experience borderless, high-yield digital banking. Zero hidden maintenance fees, instant domestic transfers, premium Gold Visa debit cards, and 24/7 personalized support.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('open-account')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-display font-semibold text-slate-900 bg-white hover:bg-emerald-50 shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Open an Account</span>
                  <ArrowRight className="w-4 h-4 text-emerald-700" />
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-display font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Login to Online Banking</span>
                </button>
              </div>

              {/* Security feature row */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">256-bit Encrypted</div>
                    <div className="text-[11px] text-slate-400">Military-grade protection</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">FDIC Insured</div>
                    <div className="text-[11px] text-slate-400">Up to $250,000</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Award Winning</div>
                    <div className="text-[11px] text-slate-400">Best Fintech 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual: Floating Glass Balance Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md animate-float">
                {/* Main Glass Balance Card */}
                <div className="glass-dark rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 relative overflow-hidden backdrop-blur-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                        Online Checking &amp; Savings
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 bg-white/10 px-2 py-0.5 rounded-full font-mono">
                      Active Tier 1
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="text-xs text-slate-400 font-medium">Total Liquidity Balance</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1 tracking-tight">
                      $48,250.75
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-lime-300 font-medium mt-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+$1,420.50 (+3.2%) earned this month</span>
                    </div>
                  </div>

                  {/* Account breakdown */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Primary Checking</div>
                          <div className="text-[11px] text-slate-400 font-mono">••••9482</div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white">$12,450.00</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-lime-500/20 text-lime-300 flex items-center justify-center">
                          <PiggyBank className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">High-Yield Savings (4.85%)</div>
                          <div className="text-[11px] text-slate-400 font-mono">••••9483</div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white">$28,300.75</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">ESG Clean Energy Portfolios</div>
                          <div className="text-[11px] text-slate-400 font-mono">••••9484</div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white">$7,500.00</span>
                    </div>
                  </div>
                </div>

                {/* Floating "Transfer Sent" Badge below */}
                <div className="absolute -bottom-6 -left-4 sm:-left-8 glass rounded-2xl p-4 shadow-xl border border-white/60 flex items-center gap-3.5 text-slate-900 animate-fade-in">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Instant Transfer Sent</div>
                    <div className="text-[11px] text-slate-500">$1,200.00 &bull; To James Chen</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-emerald-50/60 border-y border-emerald-900/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-950">
                2M+
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Active Customers
              </div>
            </div>

            <div className="p-3 border-l border-emerald-200/60">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-950">
                $15B+
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Assets Managed
              </div>
            </div>

            <div className="p-3 border-l border-emerald-200/60">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-950">
                99.99%
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                System Uptime
              </div>
            </div>

            <div className="p-3 border-l border-emerald-200/60">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-950 flex items-center justify-center gap-1">
                <span>4.9/5</span>
                <Star className="w-5 h-5 text-amber-500 fill-amber-400 inline" />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Customer Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BANKING HIGHLIGHTS (4-card grid) */}
      <section className="py-20 bg-[#f8faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
              Core Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Engineered for seamless digital wealth
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to grow, safeguard, and move your money globally in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="glass rounded-2xl p-6 border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl gradient-primary text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Bank-Grade Security</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Biometric 2FA authentication, continuous fraud anomaly monitoring, and full FDIC deposit protection up to $250,000.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass rounded-2xl p-6 border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl gradient-primary text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Instant Transfers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Send money domestically and internationally with transparent low fees, verified recipient validation, and real-time alerts.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass rounded-2xl p-6 border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl gradient-primary text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Mobile First Design</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Access your finances anywhere. Instant card lock/freeze, contactless Apple Pay/Google Pay integration, and rapid bill payments.
              </p>
            </div>

            {/* Card 4 */}
            <div className="glass rounded-2xl p-6 border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl gradient-primary text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Smart Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Real-time categorized spending insights, automated round-up savings rules, and monthly compounding high APY yield growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SERVICES (3-card grid) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
                Product Ecosystem
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                Banking services tailored to your goals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('open-account')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Explore all accounts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="rounded-2xl border border-slate-200/80 p-8 hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">Personal Banking</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Everyday checking without monthly maintenance fees or overdraft traps. Includes a complimentary personalized Gold Visa Debit Card.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free Gold Visa debit card with contact chip</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mobile check deposit &amp; bill pay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Fee-free domestic ATM access nationwide</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('open-account')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 pt-2"
              >
                <span>Learn more &amp; apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 2 */}
            <div className="rounded-2xl border-2 border-emerald-500/80 p-8 shadow-lg shadow-emerald-500/5 bg-emerald-50/20 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Most Popular
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                  <PiggyBank className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">Savings &amp; Goals</h3>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5">4.85% Annual Percentage Yield</div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Grow your wealth 10x faster than national average bank accounts. Automated goal tracking and monthly interest compounding.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>High-yield 4.85% APY compounding monthly</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Smart automated savings rules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Zero balance penalties or withdrawal fees</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('open-account')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 pt-2"
              >
                <span>Open High-Yield Savings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 3 */}
            <div className="rounded-2xl border border-slate-200/80 p-8 hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">Wealth &amp; Investments</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Smart index portfolios, clean energy ESG investment funds, and retirement accounts managed with algorithmic rebalancing.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Fractional share trading on major equities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Traditional &amp; Roth IRA retirement plans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Curated ESG clean-tech portfolios</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('investments')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 pt-2"
              >
                <span>Explore Investment Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECURITY SECTION */}
      <section className="py-20 gradient-hero text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Glass Card */}
            <div className="lg:col-span-6">
              <div className="glass-dark rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">Multi-Layer Security Architecture</h3>
                    <p className="text-xs text-slate-400">Continuous enterprise protection protocols</p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">256-Bit Hardware Encryption</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        All financial ledger balances, card numbers, and transmissions are protected using AES-256 GCM encryption.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Two-Factor &amp; Transaction PIN Verification</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        High-value wire transfers enforce secondary 4-digit PIN authentication before leaving your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Real-Time Fraud Monitoring</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Machine learning safeguards monitor for suspicious geo-locations and automatically halt unauthorized outflows.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">FDIC Member Bank Protection</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Your deposits are backed by the full faith of the United States Government up to legal limits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Info & Stats */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Compromise Infrastructure</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                Your money is safe with us — day and night
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                At Greendot Bank, security isn't an afterthought — it's the foundation of everything we build. We deploy multi-layered defensive barriers, zero-trust session management, and continuous penetration audits.
              </p>

              {/* 4 Stat Tiles */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="glass-dark p-4 rounded-xl border border-white/10">
                  <div className="font-display text-2xl font-bold text-emerald-300">0</div>
                  <div className="text-xs text-slate-300 mt-0.5">Security Breaches Recorded</div>
                </div>

                <div className="glass-dark p-4 rounded-xl border border-white/10">
                  <div className="font-display text-2xl font-bold text-emerald-300">24/7/365</div>
                  <div className="text-xs text-slate-300 mt-0.5">Human &amp; AI Monitoring</div>
                </div>

                <div className="glass-dark p-4 rounded-xl border border-white/10">
                  <div className="font-display text-2xl font-bold text-emerald-300">$250,000</div>
                  <div className="text-xs text-slate-300 mt-0.5">FDIC Insurance Limit</div>
                </div>

                <div className="glass-dark p-4 rounded-xl border border-white/10">
                  <div className="font-display text-2xl font-bold text-emerald-300">100%</div>
                  <div className="text-xs text-slate-300 mt-0.5">2FA Required for High Tiers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (3-card grid) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
              Customer Stories
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Loved by entrepreneurs, engineers, and creators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">
                "Switching our company treasury to Greendot was the best financial decision we made. The high-yield savings yield alone pays for our SaaS subscriptions, and client transfers clear in seconds."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  SM
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Sarah Mitchell</div>
                  <div className="text-xs text-slate-500">Business Owner, Apex Cloud</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">
                "The engineering behind Greendot is impressive. Their online portal is blazing fast, transaction PIN authorization provides absolute peace of mind, and the mobile support team is world-class."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  JC
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">James Chen</div>
                  <div className="text-xs text-slate-500">Lead Software Architect</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">
                "The Gold Visa debit card is stunning and works everywhere without foreign transaction penalties. I manage freelance income effortlessly with clean instant alerts."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                  MR
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Maria Rodriguez</div>
                  <div className="text-xs text-slate-500">Independent Creative Director</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST NEWS (3 articles) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
              Press &amp; Updates
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Latest from the Greendot Newsroom
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                    Product Release
                  </span>
                  <span className="text-slate-500">September 12, 2026</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Greendot Launches New High-Yield Savings Account at 4.85% APY
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Expanding deposit access to millions with zero account minimums, automated interest compounding, and enhanced FDIC protection.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2">
                <span className="text-xs font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Article 2 */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-teal-100 text-teal-800 font-semibold px-2.5 py-0.5 rounded-full">
                    Wealth &amp; ESG
                  </span>
                  <span className="text-slate-500">August 28, 2026</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Greendot Expands Investment Platform with ESG Clean Portfolios
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Empowering retail investors to allocate capital into decarbonization, clean grid tech, and sustainable community development.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2">
                <span className="text-xs font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Article 3 */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
                    Cybersecurity
                  </span>
                  <span className="text-slate-500">August 15, 2026</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                  New Security Feature: Biometric Hardware Authentication Now Live
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Next-generation FIDO2 WebAuthn keys and FaceID biometric verification are now supported for all consumer accounts.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2">
                <span className="text-xs font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto gradient-hero rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ready to bank smarter with Greendot?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Join over 2 million customers enjoying higher interest rates, instant transfers, and modern digital banking security today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('open-account')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold text-slate-900 bg-white hover:bg-emerald-50 shadow-xl transition-all"
              >
                Get Started in 3 Minutes
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                Contact Our Advisors
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
