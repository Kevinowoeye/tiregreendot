import React, { useState } from 'react';
import {
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Printer,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { GreendotLogo } from '../ui/GreendotLogo';

export const CustomerTransactions: React.FC = () => {
  const { customerTransactions, currentUser } = useBank();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = customerTransactions.filter((tx) => {
    const matchSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'all' || tx.type === typeFilter;
    const matchStatus = statusFilter === 'all' || tx.status === statusFilter;

    return matchSearch && matchType && matchStatus;
  });

  const handleDownloadCsv = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Amount', 'Fee', 'Description', 'Status', 'Reference'];
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      t.type,
      t.amount,
      t.fee,
      `"${t.description.replace(/"/g, '""')}"`,
      t.status,
      t.reference,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Greendot_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Account Statements &amp; Ledger</h2>
          <p className="text-xs text-slate-500">
            Search, filter, and inspect verified records of all transactions.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Download Statement (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by description, reference, or TX ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 text-xs border border-slate-200 rounded-xl font-medium outline-none bg-white text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="transfer">Transfers</option>
            <option value="bill_pay">Bill Payments</option>
            <option value="recharge">Mobile Recharge</option>
            <option value="interest">Yield / Interest</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-xs border border-slate-200 rounded-xl font-medium outline-none bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No transactions match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Transaction / Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((tx) => {
                  const isDebit =
                    tx.type === 'transfer' || tx.type === 'bill_pay' || tx.type === 'recharge' || tx.type === 'fee';

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isDebit ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {isDebit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{tx.description}</div>
                          <div className="text-[10px] uppercase text-slate-400">{tx.type.replace('_', ' ')}</div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">{tx.reference}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            tx.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isDebit ? 'text-slate-900' : 'text-emerald-700'
                          }`}
                        >
                          {isDebit ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                          title="View Official Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= OFFICIAL RECEIPT MODAL ================= */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <GreendotLogo variant="dark" size="sm" />
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Official Transaction Receipt
              </div>
              <div className="font-display text-3xl font-extrabold text-slate-900">
                {formatCurrency(selectedTx.amount)}
              </div>
              <div className="text-xs text-slate-500 font-mono">{selectedTx.description}</div>
            </div>

            {/* Receipt Details Table */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5 text-xs text-slate-600 border border-slate-100">
              <div className="flex justify-between">
                <span>Transaction Reference:</span>
                <span className="font-mono font-bold text-slate-900">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono text-slate-800">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Settlement Date &amp; Time:</span>
                <span className="text-slate-900 font-medium">{formatDate(selectedTx.date)}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Holder:</span>
                <span className="text-slate-900 font-medium">{currentUser?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Transfer Fee:</span>
                <span className="text-slate-900 font-medium">$0.00 (Waived)</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold uppercase text-emerald-700">{selectedTx.status}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="w-1/2 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-1/2 py-3 rounded-xl gradient-primary text-white text-xs font-bold shadow transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
