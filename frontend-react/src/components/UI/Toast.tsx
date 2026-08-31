// src/components/UI/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: { bg: 'bg-green-50', border: 'border-[#16A34A]/30', text: 'text-[#16A34A]' },
  error: { bg: 'bg-red-50', border: 'border-[#DC2626]/30', text: 'text-[#DC2626]' },
  warning: { bg: 'bg-amber-50', border: 'border-[#F59E0B]/30', text: 'text-[#F59E0B]' },
  info: { bg: 'bg-teal-50', border: 'border-[#14B8A6]/30', text: 'text-[#0F766E]' },
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4500);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-72 max-w-sm ${colors.bg} ${colors.border}`}
      role="alert"
    >
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${colors.text}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${colors.text}`}>{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999]"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// Hook for managing toasts
import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}
