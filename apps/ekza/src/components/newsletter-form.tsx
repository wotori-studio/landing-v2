"use client";

import { useFormState, useFormStatus } from "react-dom";
import { subscribeToNewsletter, type NewsletterFormState } from "../app/actions/newsletter";

// Initial form state
const initialState: NewsletterFormState = {
  success: false,
  message: "",
};

/**
 * Newsletter subscription form component
 * Uses Next.js Server Action to handle subscription
 */
export function NewsletterForm() {
  const [state, formAction] = useFormState(subscribeToNewsletter, initialState);
  
  // Submit button component to access pending state
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
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
            Submitting...
          </span>
        ) : (
          "Subscribe"
        )}
      </button>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-md mx-auto space-y-4">
      {/* Email input field */}
      <div className="space-y-2">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            id="email"
            name="email"
            required
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
            placeholder="your@email.com"
            aria-label="Email address for subscription"
          />
          <SubmitButton />
        </div>
        {/* Display email validation errors */}
        {state?.errors?.email && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Success or error messages */}
      {state?.message && (
        <div
          className={`p-4 rounded-lg ${
            state.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
          role="alert"
        >
          <div className="flex items-start gap-2">
            {state.success ? (
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
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
                className="w-5 h-5 mt-0.5 flex-shrink-0"
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
