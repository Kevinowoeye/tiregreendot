import React, { useState } from 'react';
import {
  Banknote,
  Calculator,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import confetti from 'canvas-confetti';

export const CustomerLoans: React.FC = () => {
  const { customerLoans, applyLoan, currentUser } = useBank();
  const [loanType, setLoanType] = useState('Personal Loan');
  const [amount, setAmount] = useState(15000);
  const [termMonths, setTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(6.99);
  const [purpose, setPurpose] = useState('Home improvement and debt consolidation');
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);

  if (!currentUser) return null;

  const loanOptions = [
    { type: 'Home Mortgage', rate: 5.25, defaultTerm: 360 },
    { type: 'Auto Financing', rate: 4.5, defaultTerm: 60 },
    { type: 'Student Loan', rate: 3.99, defaultTerm: 120 },
    { type: 'Personal Loan', rate: 6.99, defaultTerm: 36 },
  ];

  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyLoan({
      loanType,
      amount: Number(amount),
      termMonths: Number(termMonths),
      interestRate,
      purpose,
    });
    if (res.success) {
      setFeedback({ text: 'Your loan application has been submitted for underwriting review.', ok: true });
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } else {
      setFeedback({ text: 'Unable to submit loan application.', ok: false });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Credit Lines &amp; Lending</h2>
        <p className="text-xs text-slate-500">
          Apply for pre-approved loans with locked-in rates and flexible repayment schedules.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold ${
            feedback.ok
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: Apply for Loan Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-display text-base font-bold text-slate-900">New Loan Application</h3>

          <div className="grid grid-cols-2 gap-2">
            {loanOptions.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => {
                  setLoanType(opt.type);
                  setInterestRate(opt.rate);
                  setTermMonths(opt.defaultTerm);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  loanType === opt.type
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs">{opt.type}</div>
                <div className="text-[11px] text-emerald-700 font-bold">{opt.rate}% APR</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Requested Capital</span>
                <span className="font-mono text-emerald-700 font-bold">{formatCurrency(amount)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full mt-1.5 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Repayment Term</span>
                <span className="font-mono text-emerald-700 font-bold">{termMonths} Months ({Math.round(termMonths / 12)} Yrs)</span>
              </div>
              <input
                type="range"
                min="6"
                max="360"
                step="6"
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full mt-1.5 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Loan Purpose / Remarks</label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full mt-1 p-3 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>

            {/* Estimated payment banner */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">
                  Estimated Monthly Payment
                </div>
                <div className="text-2xl font-bold font-display">
                  ${isNaN(monthlyPayment) ? '0.00' : monthlyPayment.toFixed(2)}/mo
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>Fixed APR: {interestRate}%</div>
                <div>Principal: {formatCurrency(amount)}</div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 gradient-primary text-white font-display font-bold text-xs rounded-xl shadow transition-all"
            >
              Submit Loan Application
            </button>
          </form>
        </div>

        {/* Right 5 cols: Active & Pending Loans */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900">Your Loan Portfolio</h3>

          {customerLoans.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              You have no active or pending loan records.
            </div>
          ) : (
            <div className="space-y-3">
              {customerLoans.map((l) => (
                <div key={l.id} className="p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900">{l.loanType}</div>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        l.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : l.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : l.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Principal Balance:</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(l.remainingBalance)}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Monthly Due:</span>
                    <span className="font-mono text-slate-900">{formatCurrency(l.monthlyPayment)}</span>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    Next Due: {formatDate(l.nextDueDate)} &bull; {l.termMonths} mo term
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
