"use client";

import React, { useEffect } from "react";
import { WaitlistForm } from "./waitlist-form";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ekza-bg/80 backdrop-blur-sm transition-opacity dark:bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-ekza-border/40 bg-ekza-card p-6 text-left align-middle shadow-2xl transition-all dark:border-white/10 dark:bg-zinc-900 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-ekza-on-muted transition hover:bg-ekza-muted hover:text-ekza-on dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <h3 className="font-headline text-2xl font-bold text-ekza-on dark:text-white">
            Join the Waitlist
          </h3>
          <p className="mt-2 text-sm text-ekza-on-muted dark:text-white/70">
            Be the first to know when we open new slots for early access and release our SDK.
          </p>
        </div>

        <WaitlistForm />
      </div>
    </div>
  );
}
