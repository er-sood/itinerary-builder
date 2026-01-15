"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { supabase } from "../../lib/supabaseClient";


export default function LoginPage() {
  const [username, setUsername] = useState(""); // will be email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

const { data, error } = await supabase.auth.signInWithPassword({
  email: username,
  password,
});

if (error) {
  setError(error.message || "Invalid login");
} else {
  // Sync user with DB
  const session = data.session;

  await fetch("/api/auth/sync-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken: session.access_token }),
  });

  router.replace("/dashboard");
}

  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="w-full max-w-md bg-white rounded-2xl px-8 py-10 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/oggy-logo.png"
            alt="Oggy Holidays"
            width={200}
            height={70}
            priority
          />
        </div>

        <p className="text-center text-gray-600 text-sm mb-8">
          Internal Itinerary Management System
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Username (Email)
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b4ea2]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b4ea2]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
