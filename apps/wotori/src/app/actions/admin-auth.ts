"use server";

import { cookies } from "next/headers";
import {
  getAdminPassword,
  verifySignedSessionToken,
} from "../../lib/admin-session";

/**
 * Verify admin session (Server Components / Server Actions)
 */
export async function verifyAdminSession(): Promise<boolean> {
  if (!getAdminPassword()) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    return false;
  }

  return verifySignedSessionToken(session.value);
}

/**
 * Logout admin
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
