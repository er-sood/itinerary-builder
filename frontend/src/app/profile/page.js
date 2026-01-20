"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      setUser(data);
    } catch (e) {
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <AuthGuard>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <AppHeader />

        <section className="flex-1 px-6 py-12">
          <div className="max-w-xl mx-auto">
            <h1 className="text-black font-semibold">My Profile</h1>

            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-black font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-black font-medium">{user.role}</p>
              </div>
            </div>

            {/* PERFORMANCE */}
            <h2 className="text-black font-semibold">
              My Performance
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total" value={user.stats.total} />
              <StatCard label="Finalized" value={user.stats.finalized} />
              <StatCard label="Draft" value={user.stats.draft} />
            </div>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="mt-10 text-red-600 underline"
            >
              Logout
            </button>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
