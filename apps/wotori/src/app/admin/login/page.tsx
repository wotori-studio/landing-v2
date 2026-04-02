import type { Metadata } from "next";
import { redirect } from "next/navigation";

/** Old URL — everything lives under /admin now */
export const metadata: Metadata = {
  title: "Admin Login Redirect",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLoginRedirectPage() {
  redirect("/admin");
}
