import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, ShieldAlert, Droplets, Zap, Radio } from 'lucide-react';

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 animate-bounce" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400 shrink-0 animate-pulse" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-cyan-400 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-500/50 shadow-emerald-500/10';
      case 'warning': return 'border-amber-500/50 shadow-amber-500/10';
      case 'error': return 'border-red-500/50 shadow-red-500/20';
      case 'info':
      default: return 'border-cyan-500/50 shadow-cyan-500/10';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-slate-900/95 border backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-start justify-between gap-3 transition-all transform translate-y-0 animate-in slide-in-from-bottom-5 ${getBorderColor(
            toast.type
          )}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(toast.type)}
            <div className="space-y-0.5 font-mono">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                {toast.title}
              </div>
              <div className="text-[11px] text-slate-300">
                {toast.message}
              </div>
              <div className="text-[9px] text-slate-500 pt-0.5">
                {toast.timestamp || new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
