"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitWaitlist, type WaitlistFormState } from "../app/actions/waitlist";

const initialState: WaitlistFormState = {
  success: false,
  message: "",
};

export function WaitlistForm() {
  const [state, formAction] = useFormState(submitWaitlist, initialState);
  
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full whitespace-nowrap rounded-xl bg-ekza-primary px-8 py-3.5 text-sm font-bold text-ekza-on-primary shadow-lg shadow-ekza-primary/25 transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ekza-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gradient-to-r dark:from-[#00d1ff] dark:to-[#7701d0] dark:text-[#003543] dark:shadow-[0_0_24px_rgba(0,209,255,0.35)] dark:focus-visible:ring-cyan-400"
      >
        {pending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Submitting…
          </span>
        ) : (
          "Join Waitlist"
        )}
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ekza-on dark:text-white/90">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-xl border border-ekza-border/40 bg-ekza-elevated px-4 py-3 text-sm text-ekza-on placeholder:text-ekza-on-muted/70 shadow-sm transition focus:border-ekza-primary focus:outline-none focus:ring-2 focus:ring-ekza-primary/30 dark:border-white/15 dark:bg-black/40 dark:text-white dark:placeholder:text-white/40 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/30"
          placeholder="your@email.com"
        />
        {state?.errors?.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ekza-on dark:text-white/90">
          Name <span className="text-ekza-on-muted dark:text-white/50">(optional)</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full rounded-xl border border-ekza-border/40 bg-ekza-elevated px-4 py-3 text-sm text-ekza-on placeholder:text-ekza-on-muted/70 shadow-sm transition focus:border-ekza-primary focus:outline-none focus:ring-2 focus:ring-ekza-primary/30 dark:border-white/15 dark:bg-black/40 dark:text-white dark:placeholder:text-white/40 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/30"
          placeholder="Your name"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      {state?.message && (
        <div
          className={`rounded-xl border p-4 ${
            state.success
              ? "border-emerald-300/50 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "border-red-300/50 bg-red-50 text-red-900 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-100"
          }`}
        >
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {state.success ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <p className="text-sm font-medium">{state.message}</p>
          </div>
        </div>
      )}

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
