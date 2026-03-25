import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-300">
      <p className="text-lg">Not found</p>
      <Link href="/" className="text-cyan-400 hover:underline">
        Back to dev hub
      </Link>
    </div>
  );
}
