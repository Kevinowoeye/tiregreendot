import React, { useState, useEffect } from 'react';
import {
  Download,
  Share,
  PlusSquare,
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { GreendotLogo } from './GreendotLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone mode
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // 2. Check if iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // 3. Listen for Chromium/Android install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Auto-show unobtrusive banner after 3 seconds if not dismissed
      const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setTimeout(() => setIsOpen(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show for iOS users after brief delay if not dismissed
    if (isIosDevice && !sessionStorage.getItem('pwa_prompt_dismissed')) {
      setTimeout(() => setIsOpen(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsOpen(false);
      }
    } else if (isIOS) {
      setShowIosGuide(true);
    } else {
      // Fallback guide
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isStandalone || (!isOpen && !showIosGuide)) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom App Banner for Mobile & Desktop */}
      {isOpen && !showIosGuide && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-bounce-in">
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner">
                <img
                  src="/pwa-192x192.png"
                  alt="Greendot App"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback to icon
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Greendot Bank App</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold">
                    v2.4
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">
                  Install for 1-tap secure mobile banking
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-2 rounded-xl gradient-primary text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari / Manual Installation Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 p-2 border border-emerald-500/30 flex items-center justify-center">
                <img src="/pwa-192x192.png" alt="Greendot App" className="w-full h-full object-contain rounded-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Install Greendot Bank</h3>
                <p className="text-xs text-slate-500">Add to your Home Screen for full app experience</p>
              </div>
            </div>

            <div className="space-y-3 my-5">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Tap the Share button</span> in your browser bar (at the bottom on iPhone Safari or top right on iPad).
                  <div className="mt-1 flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Share className="w-3.5 h-3.5" />
                    <span>Square icon with upward arrow</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Scroll down and tap &ldquo;Add to Home Screen&rdquo;</span>.
                  <div className="mt-1 flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <PlusSquare className="w-3.5 h-3.5" />
                    <span>Add to Home Screen</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold">Enjoy Native Features</span>: Instant biometric sign-in, push notifications, offline balance checks, and zero address bar obstruction!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-3 rounded-xl gradient-primary text-white text-xs font-bold shadow-md"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
