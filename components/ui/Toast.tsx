"use client";

import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

export type ToastVariant = "success" | "info" | "warning" | "error";

export type ToastProps = {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
};

const styles = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-300",
  },
  info: {
    icon: Info,
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    iconColor: "text-blue-300",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    iconColor: "text-yellow-300",
  },
  error: {
    icon: XCircle,
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    iconColor: "text-red-300",
  },
};

export default function Toast(props: ToastProps) {
  const s = styles[props.variant];
  const Icon = s.icon;

  return (
    <div className={`pointer-events-auto w-96 rounded-2xl border ${s.border} ${s.bg} shadow-2xl backdrop-blur p-4 animate-[toastIn_.25s_ease-out]`}>
      <div className="flex gap-3">
        <Icon className={`h-6 w-6 shrink-0 ${s.iconColor}`} />
        <div className="flex-1">
          <h3 className="font-black text-white">{props.title}</h3>
          {props.description && (
            <p className="mt-1 text-sm text-slate-300">{props.description}</p>
          )}
          {props.actionLabel && (
            <button
              onClick={props.onAction}
              className="mt-3 rounded-xl border border-slate-700 px-3 py-2 text-xs font-black text-white hover:border-blue-500"
            >
              {props.actionLabel}
            </button>
          )}
        </div>

        <button
          onClick={props.onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(24px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
