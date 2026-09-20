import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  showHomeButton?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[360px] w-full p-6 flex items-center justify-center bg-slate-900/60 rounded-3xl border border-slate-800 backdrop-blur-md text-white my-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-white">
                {this.props.fallbackTitle || 'Component Encountered an Issue'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {this.props.fallbackMessage ||
                  'A runtime exception was safely intercepted by the Greendot security barrier. Your session and bank data remain protected.'}
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-left overflow-x-auto max-h-28 text-[11px] font-mono text-red-300">
                <span className="font-bold text-red-400">Error: </span>
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
              >
                Reload Page
              </button>
              {this.props.showHomeButton !== false && (
                <button
                  onClick={this.handleGoHome}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Main Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
