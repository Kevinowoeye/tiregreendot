import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Info,
  Clock,
  Check,
  X,
  RotateCcw,
  Eye,
  FileText,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { PinDialog } from './PinDialog';
import { Transaction } from '../../types';

interface CustomerCheckDepositProps {
  onSuccessNavigate?: () => void;
}

export const CustomerCheckDeposit: React.FC<CustomerCheckDepositProps> = ({ onSuccessNavigate }) => {
  const { currentUser, submitCheckDeposit, customerTransactions } = useBank();
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  const [amount, setAmount] = useState<string>('');
  const [checkNumber, setCheckNumber] = useState<string>('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [endorsedChecked, setEndorsedChecked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCheckPreview, setSelectedCheckPreview] = useState<Transaction | null>(null);
  const [depositSuccess, setDepositSuccess] = useState<{
    reference: string;
    amount: number;
    account: string;
    checkNumber: string;
    estimatedTime: string;
  } | null>(null);

  // Hidden native file input refs
  const frontCameraInputRef = useRef<HTMLInputElement>(null);
  const frontUploadInputRef = useRef<HTMLInputElement>(null);
  const backCameraInputRef = useRef<HTMLInputElement>(null);
  const backUploadInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const userCheckDeposits = (customerTransactions || []).filter(
    (t) => t.category === 'mobile_deposit' || t.description?.toLowerCase().includes('check')
  );

  // Handle actual native camera capture or image upload
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (!result) return;

      // Rescale high-res camera captures on canvas to optimize storage & transmission
      const img = new Image();
      img.onload = () => {
        const maxDimension = 1600;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          if (side === 'front') setFrontImage(dataUrl);
          else setBackImage(dataUrl);
        } else {
          if (side === 'front') setFrontImage(result);
          else setBackImage(result);
        }
        setValidationError(null);
      };
      img.onerror = () => {
        if (side === 'front') setFrontImage(result);
        else setBackImage(result);
        setValidationError(null);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    // Reset file input so re-capturing the same photo triggers onChange
    e.target.value = '';
  };

  const handleSubmitDeposit = () => {
    setValidationError(null);
    const depositAmt = parseFloat(amount);
    if (isNaN(depositAmt) || depositAmt <= 0) {
      setValidationError('Please enter a valid check amount ($1 - $10,000).');
      return;
    }
    if (depositAmt > 10000) {
      setValidationError('Daily mobile deposit limit is $10,000.00. Please enter a lower amount or visit a branch.');
      return;
    }
    if (!checkNumber.trim()) {
      setValidationError('Please enter the check number from the check.');
      return;
    }
    if (!frontImage) {
      setValidationError('Please capture or upload a clear photo of the front of your check.');
      return;
    }
    if (!backImage) {
      setValidationError('Please capture or upload a clear photo of the back endorsement of your check.');
      return;
    }
    if (!endorsedChecked) {
      setValidationError('Please certify that you endorsed the back with "For Greendot Mobile Deposit Only".');
      return;
    }
    setShowPinModal(true);
  };

  const handlePinVerified = async () => {
    setShowPinModal(false);
    setIsProcessing(true);
    setValidationError(null);

    try {
      const depositAmt = parseFloat(amount);
      const result = await submitCheckDeposit({
        accountType,
        amount: depositAmt,
        checkNumber: checkNumber.trim(),
        frontImage: frontImage || undefined,
        backImage: backImage || undefined,
      });

      if (result.success) {
        setToastMessage('Deposit Submitted Successfully (Processing time: ~30 mins)');
        setDepositSuccess({
          reference: result.reference || `DEP-${Date.now()}`,
          amount: depositAmt,
          account: accountType === 'checking' ? 'Primary Checking (...01)' : 'High-Yield Savings (...02)',
          checkNumber: checkNumber.trim(),
          estimatedTime: '30 minutes',
        });
      } else {
        setValidationError(result.error || 'Failed to submit check deposit. Please try again.');
      }
    } catch (err: any) {
      console.error('Check deposit submission failed:', err);
      setValidationError('An unexpected error occurred while saving your deposit record.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-16">
      {/* Hidden Native File Inputs for Front Check */}
      <input
        ref={frontCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleImageSelected(e, 'front')}
      />
      <input
        ref={frontUploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageSelected(e, 'front')}
      />

      {/* Hidden Native File Inputs for Back Check */}
      <input
        ref={backCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleImageSelected(e, 'back')}
      />
      <input
        ref={backUploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageSelected(e, 'back')}
      />

      {/* Success Notification Banner / Toast */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-200" />
            <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg hover:bg-emerald-700/50 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Mobile Check Deposit</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Native Camera Scanner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deposit paper checks using your device&apos;s camera. Reviewed and credited in approximately 30 minutes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Daily Limit: $10,000.00</span>
        </div>
      </div>

      {depositSuccess ? (
        /* Success Screen */
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-200 text-center space-y-6 animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Deposit Submitted Successfully</h2>
            <p className="text-sm font-medium text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full inline-block border border-emerald-200">
              Processing time: ~30 mins &bull; Pending Underwriting Approval
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your check has been securely uploaded and submitted to underwriting for expedited clearance.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Deposit Amount:</span>
              <span className="font-extrabold text-slate-900 text-sm">${depositSuccess.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Account:</span>
              <span className="font-semibold text-slate-800">{depositSuccess.account}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Check Number:</span>
              <span className="font-mono font-bold text-slate-800">#{depositSuccess.checkNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Confirmation Reference:</span>
              <span className="font-mono font-bold text-emerald-700">{depositSuccess.reference}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase text-[10px] tracking-wide">
                Pending Underwriting Review (~30m)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Clearance:</span>
              <span className="font-bold text-emerald-700">~30 minutes</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setDepositSuccess(null);
                setFrontImage(null);
                setBackImage(null);
                setAmount('');
                setCheckNumber('');
                setEndorsedChecked(false);
                setToastMessage(null);
              }}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Deposit Another Check
            </button>
            <button
              onClick={onSuccessNavigate}
              className="px-6 py-3 rounded-xl gradient-primary text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
            >
              View in Transaction Ledger
            </button>
          </div>
        </div>
      ) : (
        /* Deposit Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Deposit Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* 1. Select Account & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deposit Into Account
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as 'checking' | 'savings')}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="checking">Primary Checking (...01) — ${currentUser.balance.toLocaleString()}</option>
                  <option value="savings">High-Yield Savings (...02) — ${(currentUser.savingsBalance || 0).toLocaleString()}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Check Amount ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="10000"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setValidationError(null);
                    }}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Check Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Check Number
              </label>
              <input
                type="text"
                value={checkNumber}
                onChange={(e) => {
                  setCheckNumber(e.target.value);
                  setValidationError(null);
                }}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 1048"
              />
            </div>

            {/* 2. Front of Check */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Front of Check</span>
                  {frontImage && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </label>
                <span className="text-[11px] text-slate-400">Position on dark, flat surface</span>
              </div>

              {frontImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 group">
                  <img src={frontImage} alt="Front of Check" className="w-full h-48 object-contain bg-slate-900" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => frontCameraInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Retake Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => frontUploadInputRef.current?.click()}
                      className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Other</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrontImage(null)}
                      className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/60 transition-colors">
                  <Camera className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">Capture Front of Check</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Capture with camera or upload a clear photo</p>
                  <div className="flex items-center justify-center gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={() => frontCameraInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo / Auto Scan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => frontUploadInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Back of Check */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>2. Back of Check (Endorsement)</span>
                  {backImage && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Endorse &ldquo;For Greendot Mobile Deposit Only&rdquo;
                </span>
              </div>

              {backImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 group">
                  <img src={backImage} alt="Back of Check" className="w-full h-48 object-contain bg-slate-900" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => backCameraInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Retake Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => backUploadInputRef.current?.click()}
                      className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Other</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBackImage(null)}
                      className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/60 transition-colors">
                  <Camera className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">Capture Back of Check</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Signature and mobile endorsement required</p>
                  <div className="flex items-center justify-center gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={() => backCameraInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo / Auto Scan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => backUploadInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Certification Checkbox */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="endorseCheck"
                checked={endorsedChecked}
                onChange={(e) => {
                  setEndorsedChecked(e.target.checked);
                  setValidationError(null);
                }}
                className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500 mt-0.5 cursor-pointer"
              />
              <label htmlFor="endorseCheck" className="text-xs text-emerald-950 font-medium cursor-pointer leading-relaxed">
                I certify that the check is payable to <strong>{currentUser.fullName}</strong>, is properly endorsed on the back with &ldquo;For Greendot Mobile Deposit Only&rdquo;, and has not been deposited elsewhere.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmitDeposit}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl gradient-primary text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Check &amp; Submitting to Underwriting...</span>
                </>
              ) : (
                <>
                  <span>Submit Check for Deposit {amount ? `($${parseFloat(amount || '0').toFixed(2)})` : ''}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Deposit Guidelines</span>
              </div>

              <ul className="text-xs text-slate-600 space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span><strong>Lighting:</strong> Place check on a dark, non-reflective background with uniform lighting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span><strong>Clarity:</strong> Ensure all 4 corners are visible and MICR numbers at the bottom are readable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span><strong>Hold Time:</strong> Retain the physical check in a safe place for 14 calendar days after submission.</span>
                </li>
              </ul>
            </div>

            {/* Expedited 30-Minute Processing Policy Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md space-y-3 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Expedited Clearance Policy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mobile check deposits undergo digital underwriting verification and are typically approved within <strong className="text-emerald-400 font-bold">~30 minutes</strong>. Upon underwriting approval, the full deposit amount is credited directly to your available balance.
              </p>
              <div className="text-[11px] text-emerald-300/90 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/40 font-mono space-y-1">
                <div>✓ Estimated Review: ~30 mins</div>
                <div>✓ Direct Balance Credit on Approval</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= RECENT MOBILE CHECK DEPOSITS ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Mobile Check Deposits</h2>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold font-mono">
              {userCheckDeposits.length}
            </span>
          </div>
          {onSuccessNavigate && (
            <button
              onClick={onSuccessNavigate}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {userCheckDeposits.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">
              No mobile check deposits submitted yet. Deposited checks and review statuses will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Reference / ID</th>
                  <th className="py-2.5 px-3">Check #</th>
                  <th className="py-2.5 px-3">Account</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Scan Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userCheckDeposits.map((tx) => {
                  const isPending =
                    tx.status === 'pending' ||
                    tx.status === 'pending_approval' ||
                    tx.checkStatus === 'pending' ||
                    tx.checkStatus === 'pending_approval';
                  const isCleared = tx.status === 'completed' || tx.checkStatus === 'cleared';
                  const isRejected = tx.status === 'rejected' || tx.checkStatus === 'rejected';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {tx.reference || tx.id}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700 font-medium">
                        {tx.checkNumber ? `#${tx.checkNumber}` : '—'}
                      </td>
                      <td className="py-3 px-3 capitalize text-slate-600 font-medium">
                        {tx.accountType || 'checking'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        {isCleared && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Cleared &amp; Credited</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full uppercase animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Underwriting Review (~30m)</span>
                          </span>
                        )}
                        {isRejected && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-full uppercase"
                            title={tx.note}
                          >
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                        +${Number(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {tx.frontImage ? (
                          <button
                            type="button"
                            onClick={() => setSelectedCheckPreview(tx)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                            title="View Check Images"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Scans</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">No scan</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Check Scans Preview Modal */}
      {selectedCheckPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Check #{selectedCheckPreview.checkNumber || selectedCheckPreview.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCheckPreview(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Amount</div>
                <div className="font-bold text-emerald-700 font-mono text-sm">
                  ${Number(selectedCheckPreview.amount).toFixed(2)}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Status</div>
                <div className="font-bold text-slate-900 uppercase text-[11px]">
                  {selectedCheckPreview.status === 'completed'
                    ? 'Cleared & Credited'
                    : selectedCheckPreview.status === 'pending_approval' || selectedCheckPreview.status === 'pending'
                    ? 'Underwriting Review'
                    : 'Rejected'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Front of Check
                </div>
                {selectedCheckPreview.frontImage ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-1 flex items-center justify-center max-h-48">
                    <img
                      src={selectedCheckPreview.frontImage}
                      alt="Front Check"
                      className="max-h-44 object-contain rounded"
                    />
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">No front image</div>
                )}
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Back Endorsement
                </div>
                {selectedCheckPreview.backImage ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-1 flex items-center justify-center max-h-48">
                    <img
                      src={selectedCheckPreview.backImage}
                      alt="Back Check"
                      className="max-h-44 object-contain rounded"
                    />
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">No back image</div>
                )}
              </div>
            </div>

            {selectedCheckPreview.note && (
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                <span className="font-semibold">Auditor Note:</span> {selectedCheckPreview.note}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCheckPreview(null)}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Verification Modal */}
      {showPinModal && (
        <PinDialog
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          onSuccess={handlePinVerified}
          title="Authorize Mobile Deposit"
          description={`Enter your 4-digit Transaction PIN to verify and submit your check deposit of $${parseFloat(amount || '0').toFixed(2)}.`}
          amount={parseFloat(amount) || 0}
          expectedPin={currentUser.transactionPinHash || '1234'}
        />
      )}
    </div>
  );
};
