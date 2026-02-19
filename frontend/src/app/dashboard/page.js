"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const [pendingLeads, setPendingLeads] = useState(0);


  useEffect(() => {
    async function loadRole() {
      try {
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
          console.error("ME API FAILED", res.status);
          return;
        }

        const data = await res.json();
        console.log("DASHBOARD ROLE:", data.role);
        setRole(data.role);
        setPendingLeads(data.pendingLeadsCount || 0);

      } catch (err) {
        console.error("ROLE LOAD ERROR", err);
      }
    }

    loadRole();
  }, [router]);

  if (!role) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );
}


  const isAdmin = role?.toUpperCase() === "ADMIN";

  return (
    <AuthGuard>
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-900">
        <AppHeader />

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

              <FeatureCard
                title="Inventory"
                description="Manage hotels and homestays"
                icon="🏨"
                href="/inventory"
              />

                <FeatureCard
                title={isAdmin ? "Leads" : "My Leads"}
                description={
                  isAdmin
                    ? "Create, assign and track customer leads"
                    : "View and manage your assigned leads"
                }
                icon="📈"
                href="/leads"
                badge={pendingLeads}
              />

              {/* ✅ ADMIN ONLY */}
              {isAdmin && (
                <>
                  <FeatureCard
                    title="Staff Performance"
                    description="Track staff activity and productivity"
                    icon="👥"
                    href="/staff-performance"
                  />

                  <FeatureCard
                    title="Manage Users"
                    description="Create new users and delete existing users"
                    icon="➕"
                    href="/users"
                  />
                </>
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
    </AuthGuard>
  );
}

function FeatureCard({ title, description, icon, href, badge }) {
  const CardContent = (
    <div className="relative bg-white rounded-2xl p-8 text-center border shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer h-full">
{/* 🔔 BADGE GOES HERE */}
      {badge > 0 && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </div>
      )}
      <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-2xl">
        {icon}
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}
