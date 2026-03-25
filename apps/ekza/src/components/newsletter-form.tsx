"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  subscribeToNewsletter,
  type NewsletterFormState,
} from "../app/actions/newsletter";

const initialState: NewsletterFormState = {
  success: false,
  message: "",
};

export function NewsletterForm() {
  const [state, formAction] = useFormState(subscribeToNewsletter, initialState);

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="whitespace-nowrap rounded-xl bg-ekza-primary px-8 py-3.5 text-sm font-bold text-ekza-on-primary shadow-lg shadow-ekza-primary/25 transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ekza-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gradient-to-r dark:from-[#00d1ff] dark:to-[#7701d0] dark:text-[#003543] dark:shadow-[0_0_24px_rgba(0,209,255,0.35)] dark:focus-visible:ring-cyan-400"
      >
        {pending ? (
          <span className="flex items-center gap-2">
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
          "Subscribe"
        )}
      </button>
    );
  }

  return (
    <form action={formAction} className="mx-auto w-full max-w-lg space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            id="email"
            name="email"
            required
            className="flex-1 rounded-xl border border-ekza-border/40 bg-ekza-elevated px-5 py-3.5 text-sm text-ekza-on placeholder:text-ekza-on-muted/70 shadow-sm transition focus:border-ekza-primary focus:outline-none focus:ring-2 focus:ring-ekza-primary/30 dark:border-white/15 dark:bg-black/40 dark:text-white dark:placeholder:text-white/40 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/30"
            placeholder="your@email.com"
            aria-label="Email address for subscription"
          />
          <SubmitButton />
        </div>
        {state?.errors?.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {state?.message && (
        <div
          className={`rounded-xl border p-4 ${
            state.success
              ? "border-emerald-300/50 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "border-red-300/50 bg-red-50 text-red-900 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-100"
          }`}
          role="alert"
        >
          <div className="flex items-start gap-2">
            {state.success ? (
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <p className="text-sm font-medium">{state.message}</p>
          </div>
        </div>
      )}
    </form>
  );
}
