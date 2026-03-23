import { redirect } from "next/navigation";

/** Old URL — everything lives under /admin now */
export default function AdminLoginRedirectPage() {
  redirect("/admin");
}
