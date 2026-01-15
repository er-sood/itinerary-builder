"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import AppHeader from "@/components/AppHeader";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const data = await res.json();
      setRole(data.role);
    }

    loadUser();
  }, []);

  if (!role) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <p className="text-gray-600">Loading dashboard…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-900">
      {/* Header */}
      <AppHeader />

      {/* Feature Cards */}
      <section className="flex-1 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-12 text-center">
            What would you like to do?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Create Itinerary"
              description="Build a new professional itinerary for a client"
              icon="📝"
              href="/itinerary/canvas"
            />

            <FeatureCard
              title="Browse Itineraries"
              description="Search and reuse existing itineraries"
              icon="🔍"
              href="/itineraries"
            />

            {role === "ADMIN" && (
              <FeatureCard
                title="Staff Performance"
                description="Track staff activity and productivity"
                icon="👥"
                href="/staff-performance"
              />
            )}

            {role === "ADMIN" && (
              <FeatureCard
                title="Manage Users"
                description="Create new users and delete existing users"
                icon="➕"
                href="/users"
              />
            )}

            <FeatureCard
              title="My Profile"
              description="View and update your personal information"
              icon="👤"
              href="/profile"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description, icon, href }) {
  const CardContent = (
    <div className="bg-white rounded-2xl p-8 text-center border shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer h-full">
      <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-2xl">
        {icon}
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
