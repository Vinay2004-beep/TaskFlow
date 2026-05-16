"use client";

import type React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type Toast = { id: string; title: string; description?: string };
const ToastContext = createContext<{ toast: (toast: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = (input: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).slice(2);

  setToasts((items) => [...items, { ...input, id }]);

  setTimeout(() => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, 3500);
};

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider>
        {children}
        {toasts.map((item) => (
          <ToastPrimitive.Root key={item.id} className={cn("rounded-lg border bg-card p-4 shadow-lg")} open>
            <ToastPrimitive.Title className="font-semibold">{item.title}</ToastPrimitive.Title>
            {item.description ? <ToastPrimitive.Description className="text-sm text-muted-foreground">{item.description}</ToastPrimitive.Description> : null}
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
