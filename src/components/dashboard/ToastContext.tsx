'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';

type ToastType = 'success' | 'neutral' | 'error';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastIcons: Record<ToastType, { icon: string; color: string }> = {
  success: { icon: 'ri-checkbox-circle-fill', color: 'text-[#22a121]' },
  neutral: { icon: 'ri-information-line', color: 'text-iris' },
  error: { icon: 'ri-close-circle-fill', color: 'text-brick' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, message }]);
      const timer = setTimeout(() => removeToast(id), 4000);
      timersRef.current.set(id, timer);
    },
    [removeToast],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none max-w-[400px]"
      >
        <style>{`
          @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(16px) scale(0.96); }
            to { opacity: 1; transform: translateX(0) scale(1); }
          }
          @keyframes toastSlideOut {
            from { opacity: 1; transform: translateX(0) scale(1); }
            to { opacity: 0; transform: translateX(16px) scale(0.96); }
          }
        `}</style>
        {toasts.map((t) => {
          return (
            <div
              key={t.id}
              className="bg-white rounded-[20px] px-5 py-3 pointer-events-auto border border-[#E8E6E1] shadow-[0_4px_20px_rgba(0,0,0,0.08)] [animation:toastSlideIn_0.3s_ease]"
            >
              <div className="flex items-center gap-3">
                {t.type === 'success' ? (
                  <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    <i className="ri-check-line text-sm text-white"></i>
                  </span>
                ) : t.type === 'error' ? (
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    <i className="ri-close-line text-sm text-white"></i>
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-[#6D28D9] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    <i className="ri-information-line text-sm text-white"></i>
                  </span>
                )}
                <p className="text-[14px] leading-snug flex-1 text-[#2B2B2B] font-medium pr-2">
                  {t.message}
                </p>
                <button
                  onClick={() => removeToast(t.id)}
                  className="w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors duration-150 text-[#9A9A9A] hover:text-[#2B2B2B]"
                  aria-label="Dismiss"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}