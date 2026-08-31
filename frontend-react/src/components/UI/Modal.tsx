// src/components/UI/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'sm' ? 'max-w-md' : size === 'md' ? 'max-w-lg' : 'max-w-2xl';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-[#071A2B]/60 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClass} max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 id="modal-title" className="text-base font-semibold text-[#102A43]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};
