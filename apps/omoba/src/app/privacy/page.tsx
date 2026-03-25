import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — O-MOBA",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-omoba-void px-4 py-24 text-slate-300 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-omoba-accent hover:underline"
        >
          ← Back
        </Link>
        <h1 className="mt-8 font-display text-3xl font-bold text-white">
          Privacy policy
        </h1>
        <p className="mt-6 text-sm leading-relaxed">
          This page is a placeholder. Replace with your final privacy policy
          before public launch. O-MOBA is in early development; data practices
          will be documented here.
        </p>
      </div>
    </div>
  );
}
