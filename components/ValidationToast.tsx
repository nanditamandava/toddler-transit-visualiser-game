'use client';

import React from 'react';
import { useGameState } from '../hooks/useGameState';

export function ValidationToast() {
  const { toasts, removeToast } = useGameState();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-live="assertive"
      aria-atomic="true"
    >
      {toasts.map(toast => {
        // Aesthetic assignments based on severity
        let styleClasses = 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/40';
        let iconColor = 'text-indigo-400';
        let progressColor = 'bg-indigo-500';

        if (toast.type === 'error') {
          styleClasses = 'bg-slate-900/95 border-amber-500/30 text-slate-100 glow-amber shadow-amber-950/20';
          iconColor = 'text-amber-400';
          progressColor = 'bg-amber-500';
        } else if (toast.type === 'success') {
          styleClasses = 'bg-slate-900/95 border-emerald-500/30 text-slate-100 glow-emerald shadow-emerald-950/20';
          iconColor = 'text-emerald-400';
          progressColor = 'bg-emerald-500';
        }

        return (
          <div
            key={toast.id}
            popover="manual"
            className={`
              toast-popover open pointer-events-auto flex flex-col w-full p-4 rounded-xl border glass-card shadow-2xl relative overflow-hidden
              ${styleClasses}
            `}
          >
            {/* Upper Content */}
            <div className="flex items-start gap-3">
              {/* SVG Icon */}
              <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
                {toast.type === 'error' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                ) : toast.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                )}
              </div>

              {/* Toast Message body */}
              <div className="flex-grow">
                <span className="font-mono text-[9px] uppercase tracking-wider block opacity-50 mb-0.5">
                  {toast.type === 'error' ? 'Constraint Infraction' : toast.type === 'success' ? 'Transition Safe' : 'System Notice'}
                </span>
                <p className="text-xs font-medium font-sans leading-relaxed text-slate-200">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors duration-150 p-0.5 rounded hover:bg-slate-800 cursor-pointer"
                aria-label="Dismiss Notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Micro Timer Progress Bar Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-slate-800">
              <div
                className={`h-full ${progressColor} animate-[shrink_4000ms_linear_forwards]`}
                style={{
                  animationName: 'shrink',
                  animationDuration: '4000ms',
                  animationTimingFunction: 'linear',
                  animationFillMode: 'forwards',
                }}
              />
            </div>

            {/* Local animation keyframes inside style block to avoid build complexity */}
            <style jsx global>{`
              @keyframes shrink {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}
