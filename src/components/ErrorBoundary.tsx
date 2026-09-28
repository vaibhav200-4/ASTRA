import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ASTRA-PVT Tab Error Boundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="isro-card p-6 bg-white dark:bg-[#0A1A33] border-l-4 border-l-[#C62828] space-y-3 font-sans">
          <div className="flex items-center space-x-2 text-[#C62828] font-bold text-sm">
            <AlertTriangle size={20} />
            <span>{this.props.fallbackTitle || 'Module Runtime Notice'}</span>
          </div>

          <p className="text-xs text-[#5B6675] dark:text-slate-300 font-mono">
            {this.state.error?.message || 'A module encountered an unexpected runtime state. Rest of application is nominal.'}
          </p>

          <button 
            onClick={this.handleReset}
            className="btn-isro-outline text-xs"
          >
            <RefreshCw size={13} />
            <span>Retry Module</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
