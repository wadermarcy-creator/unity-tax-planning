"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import Toast, { type ToastVariant } from "./Toast";

type ToastInput = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

type ToastRecord = ToastInput & {
  id: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  success: (toast: ToastInput) => void;
  info: (toast: ToastInput) => void;
  warning: (toast: ToastInput) => void;
  error: (toast: ToastInput) => void;
  dismiss: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (variant: ToastVariant, toast: ToastInput) => {
      const id = createToastId();
      const nextToast: ToastRecord = {
        id,
        variant,
        ...toast,
      };

      setToasts((current) => [nextToast, ...current].slice(0, 5));

      window.setTimeout(() => {
        dismiss(id);
      }, toast.duration ?? 4500);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (toast) => addToast("success", toast),
      info: (toast) => addToast("info", toast),
      warning: (toast) => addToast("warning", toast),
      error: (toast) => addToast("error", toast),
      dismiss,
    }),
    [addToast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            onClose={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
