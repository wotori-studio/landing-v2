"use client";

import { useState } from "react";
import { authenticateAdmin } from "../app/actions/admin-auth";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authenticateAdmin(password);

      if (result.success) {
        // Full navigation so the browser applies Set-Cookie from the Server Action before the next request.
        // router.push() can race on Vercel: /admin/analytics may load without the cookie → middleware → login loop.
        window.location.assign("/admin/analytics");
        return;
      } else {
        setError(result.message || "Authentication failed. Please try again.");
        setPassword("");
      }
    } catch (err) {
      console.error("[Admin Login] Error:", err);
      setError("An error occurred. Please check the console or try again later.");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Access
        </h1>
        <p className="text-gray-600">Enter password to view analytics</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter admin password"
            autoFocus
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !password}
          className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}
