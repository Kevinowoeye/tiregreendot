import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowDownRight,
  ArrowUpRight,
  Percent,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { GreendotLogo } from '../ui/GreendotLogo';

export const CustomerStatements: React.FC = () => {
  const { currentUser, state } = useBank();
  const [selectedCycle, setSelectedCycle] = useState('2026-09');
  const [selectedAccount, setSelectedAccount] = useState<'checking' | 'savings'>('checking');

  if (!currentUser) return null;

  const cycles = [
    { id: '2026-09', label: 'September 2026 (Current Period)', dates: 'Sep 01, 2026 - Sep 30, 2026' },
    { id: '2026-08', label: 'August 2026', dates: 'Aug 01, 2026 - Aug 31, 2026' },
    { id: '2026-07', label: 'July 2026', dates: 'Jul 01, 2026 - Jul 31, 2026' },
    { id: '2026-06', label: 'June 2026', dates: 'Jun 01, 2026 - Jun 30, 2026' },
    { id: 'tax-2025', label: '2025 Form 1099-INT (Tax Summary)', dates: 'Jan 01, 2025 - Dec 31, 2025' },
  ];

  const transactions = state.transactions || [];
  const totalDeposits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const startingBalance = Math.max(1000, currentUser.balance - totalDeposits + totalWithdrawals);
  const interestEarned = selectedAccount === 'savings' ? 142.60 : 3.84;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Trigger print dialog as Save as PDF or provide download
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-16">
      {/* Top Header & Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Official e-Statements &amp; Tax Documents</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified monthly account statements with full transaction audit trails and official bank letterhead.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Cycle & Account Selector */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Statement Period
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Account
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value as 'checking' | 'savings')}
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="checking">Primary Checking (...0101) — ${currentUser.balance.toLocaleString()}</option>
            <option value="savings">High-Yield Savings (...0102) — ${(currentUser.savingsBalance || 0).toLocaleString()}</option>
          </select>
        </div>
      </div>

      {/* Official Printable Statement Sheet */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-300 p-8 sm:p-12 print:p-0 print:border-none print:shadow-none space-y-8">
        {/* Bank Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-emerald-800 pb-6 gap-6">
          <div>
            <GreendotLogo size="lg" />
            <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
              <div>Greendot Bank, Member FDIC</div>
              <div>114 West 7th Street, Suite 800</div>
              <div>Austin, TX 78701 &bull; Routing (ABA): 122041235</div>
              <div>Tel: 1 (800) 473-3636 &bull; support@greendot.com</div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider mb-1">
              Official Account Statement
            </span>
            <div className="text-sm font-bold text-slate-900">
              {cycles.find((c) => c.id === selectedCycle)?.label}
            </div>
            <div className="text-xs text-slate-500">
              Statement Dates: {cycles.find((c) => c.id === selectedCycle)?.dates}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Account No: {currentUser.customerId}-{selectedAccount === 'checking' ? '0101' : '0102'}
            </div>
          </div>
        </div>

        {/* Customer Details & Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Account Holder */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Account Holder Information
            </div>
            <div className="text-sm font-bold text-slate-900">{currentUser.fullName}</div>
            <div className="text-slate-600">{currentUser.address || '742 Evergreen Terrace'}</div>
            <div className="text-slate-600">{currentUser.city || 'New York, NY 10001'}, {currentUser.country || 'United States'}</div>
            <div className="text-slate-500 font-mono">Email: {currentUser.email}</div>
          </div>

          {/* Statement Balance Breakdown */}
          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 text-xs space-y-2">
            <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Account Balance Summary
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500">Starting Balance:</span>
                <div className="font-bold text-slate-900">${startingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <span className="text-emerald-700">Total Credits/Deposits:</span>
                <div className="font-bold text-emerald-800">+${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <span className="text-slate-500">Total Debits/Withdrawals:</span>
                <div className="font-bold text-slate-900">-${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <span className="text-emerald-700">Interest Earned:</span>
                <div className="font-bold text-emerald-800">+${interestEarned.toFixed(2)}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span>Ending Balance:</span>
              <span className="text-emerald-900">
                ${(selectedAccount === 'checking' ? currentUser.balance : currentUser.savingsBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Transactions Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Itemized Activity for This Period
            </h3>
            <span className="text-[11px] text-slate-400">
              Showing {transactions.length} cleared transactions
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description / Payee</th>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {new Date(t.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {t.description}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">
                        {t.reference || t.id}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold font-mono ${
                          t.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {t.type === 'credit' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          CLEARED
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No transactions recorded in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regulatory Disclosures Footer */}
        <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Important Customer Information &amp; Error Resolution Notice</span>
          </div>
          <p>
            In case of errors or questions about your electronic transactions, contact Greendot Bank Customer Service at 1 (800) 473-3636 or write to 114 West 7th St, Suite 800, Austin, TX 78701 as soon as possible. We must hear from you no later than 60 days after we sent the FIRST statement on which the problem or error appeared.
          </p>
          <p>
            Deposits are insured up to $250,000 per depositor by the Federal Deposit Insurance Corporation (FDIC). Equal Housing Lender.
          </p>
        </div>
      </div>
    </div>
  );
};
