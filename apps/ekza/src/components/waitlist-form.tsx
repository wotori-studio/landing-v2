"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitWaitlist, type WaitlistFormState } from "../app/actions/waitlist";

const initialState: WaitlistFormState = {
  success: false,
  message: "",
};

export function WaitlistForm() {
  const [state, formAction] = useFormState(submitWaitlist, initialState);
  
  // Submit button component to access pending state
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full px-8 py-3 text-base font-medium bg-white text-black border border-white hover:bg-gray-100 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Submitting..." : "Join Waitlist"}
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="your@email.com"
        />
        {state?.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name (optional)
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Your name"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      {state?.message && (
        <div
          className={`p-3 rounded-md ${
            state.success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
